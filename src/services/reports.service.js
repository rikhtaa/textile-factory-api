const ProductionRecord = require("../models/ProductionRecord");
const Loom = require("../models/Loom");
const Worker = require("../models/Worker");
const LoomManagement = require("../models/LoomManagement")
const Quality = require("../models/Quality");
const { toUtcDateOnly, addDays } = require("../utils/dates");
function startOfDayUTC(dateStr) {
  const d = new Date(dateStr);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

function endOfDayUTC(dateStr) {
  const d = new Date(dateStr);
  d.setUTCHours(23, 59, 59, 999);
  return d;
}

async function dailyLoomReport(yyyyMmDd) {
  const start = startOfDayUTC(yyyyMmDd);
  const end = endOfDayUTC(yyyyMmDd);

  const [records, looms, workers] = await Promise.all([
    ProductionRecord.find({
      date: { $gte: start, $lte: end }
    }).lean(),
    Loom.find().lean(),
    Worker.find().lean(),
  ]);

  const workerMap = new Map(workers.map(w => [w._id.toString(), w.name]));
  const byLoom = new Map();

  for (const r of records) {
    if (!r.loomId || !r.operatorId) continue;
    const lid = r.loomId.toString();
    if (!byLoom.has(lid)) byLoom.set(lid, { total: 0, operators: new Set(), qualities: new Set() });
    const entry = byLoom.get(lid);
    entry.total += Number(r.meterProduced);
    entry.operators.add(r.operatorId.toString());
    if (r.qualityId) entry.qualities.add(r.qualityId.toString());
  }

  const rows = looms.map(loom => {
    const entry = byLoom.get(loom._id.toString());
    if (!entry) return { loomNumber: loom.loomNumber, operatorName: null, meters: 0, qualities: [] };
    const names = Array.from(entry.operators).map(id => workerMap.get(id)).filter(Boolean);
    const operatorName = names.length === 1 ? names[0] : "Multiple";
    const qualities = Array.from(entry.qualities);
    return { loomNumber: loom.loomNumber, operatorName, meters: entry.total, qualities };
  });

  const dayTotal = rows.reduce((acc, r) => acc + r.meters, 0);

  return { date: yyyyMmDd, rows, dayTotal };
}

async function dailyQualityReport(yyyyMmDd) {
const date = toUtcDateOnly(yyyyMmDd);
const [records, qualities] = await Promise.all([
ProductionRecord.find({ date }).lean(),
Quality.find().lean(),
]);
const qMap = new Map(qualities.map((q) => [q._id.toString(), q.name]));
const agg = new Map(); // qualityId -> { looms:Set, meters:Number }
for (const r of records) {
const qid = r.qualityId.toString();
if (!agg.has(qid)) agg.set(qid, { looms: new Set(), meters: 0 });
const a = agg.get(qid);
a.looms.add(r.loomId.toString());
a.meters += Number(r.meterProduced);
}
const rows = Array.from(agg.entries()).map(([qualityId, data]) => ({
qualityId,
qualityName: qMap.get(qualityId),
numberOfLoomsProducingThatQuality: data.looms.size,
totalMetersProduced: data.meters,
}));
return { date: yyyyMmDd, rows };
}
async function operatorPeriodReport(operatorId, fromStr, toStr) {
  const from = toUtcDateOnly(fromStr);
  const to = toUtcDateOnly(toStr);

  const [records, qualities, worker, looms, loomManagements] = await Promise.all([
    ProductionRecord.find({ operatorId, date: { $gte: from, $lte: to } })
      .sort({ date: 1 })
      .lean(),
    Quality.find().lean(),
    Worker.findById(operatorId).lean(),
    Loom.find().lean(),
    LoomManagement.find().lean(),
  ]);

  const qMap = new Map(qualities.map(q => [q._id.toString(), q]));
  const loomMap = new Map(looms.map(l => [l._id.toString(), l.loomNumber]));
  const lmMap = new Map(loomManagements.map(lm => [lm._id.toString(), lm]));

  const byDate = new Map();
  const loomSet = new Set();
  const shiftSet = new Set();

  for (const r of records) {
    const dateStr = r.date.toISOString().slice(0, 10);
    if (!byDate.has(dateStr)) byDate.set(dateStr, []);

    let loomName = "Unknown Loom";
    if (r.loomId && loomMap.has(r.loomId.toString())) {
      loomName = loomMap.get(r.loomId.toString());
    } else if (r.loomManagementId && lmMap.has(r.loomManagementId.toString())) {
      const lm = lmMap.get(r.loomManagementId.toString());
      const loom = loomMap.get(lm.loom?.toString());
      if (loom) loomName = loom;
    }

    const quality = qMap.get(r.qualityId?.toString());
    const pricePerMeter = quality?.pricePerMeter || 0;
    const meters = Number(r.meterProduced) || 0;
    const amount = meters * pricePerMeter;

    if (loomName && loomName !== "Unknown Loom") loomSet.add(loomName);
    if (r.shift) shiftSet.add(r.shift);

    byDate.get(dateStr).push({
      qualityId: r.qualityId,
      qualityName: quality?.name || "Unknown",
      pricePerMeter,
      meters,
      amount,
      loomId: r.loomId,
      loomName,
      shift: r.shift || "Unknown",
    });
  }

  const daily = Array.from(byDate.entries()).map(([date, productions]) => ({
    date,
    productions,
    total: productions.reduce((acc, p) => acc + (p.amount || 0), 0),
  }));

  const totalPayable = daily.reduce((acc, d) => acc + (d.total || 0), 0);

  return {
    operatorId,
    operatorName: worker?.name || null,
    from: fromStr,
    to: toStr,
    daily,
    totalPayable,
    looms: Array.from(loomSet),
    shifts: Array.from(shiftSet),
  };
}
async function fifteenDayOperator(operatorId, start) {
const from = toUtcDateOnly(start);
const to = addDays(from, 14);
return operatorPeriodReport(
operatorId,
from.toISOString().slice(0, 10),
to.toISOString().slice(0, 10)
);
}
module.exports = {
dailyLoomReport,
dailyQualityReport,
operatorPeriodReport,
fifteenDayOperator,
};
