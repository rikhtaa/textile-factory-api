const ProductionRecord = require("../models/ProductionRecord");
const Loom = require("../models/Loom");
const Worker = require("../models/Worker");
const Quality = require("../models/Quality");
const { toUtcDateOnly, addDays } = require("../utils/dates");
async function dailyLoomReport(yyyyMmDd) {
const date = toUtcDateOnly(yyyyMmDd);
const [records, looms, workers] = await Promise.all([
ProductionRecord.find({ date }).lean(),
Loom.find().lean(),
Worker.find().lean(),
]);
const workerMap = new Map(workers.map((w) => [w._id.toString(), w.name]));
const byLoom = new Map();
for (const r of records) {
const lid = r.loomId.toString();
if (!byLoom.has(lid)) byLoom.set(lid, { total: 0, operators: new Set() });
const entry = byLoom.get(lid);
entry.total += Number(r.meterProduced);
entry.operators.add(r.operatorId.toString());
}
const rows = looms.map((loom) => {
const entry = byLoom.get(loom._id.toString());
if (!entry) {
return { loomNumber: loom.loomNumber, operatorName: null, meters: 0 };
}
const names = Array.from(entry.operators).map((id) =>
workerMap.get(id)).filter(Boolean);
const operatorName = names.length === 1 ? names[0] : "Multiple";
return { loomNumber: loom.loomNumber, operatorName, meters: entry.total };
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
const [records, qualities, worker] = await Promise.all([
ProductionRecord.find({ operatorId, date: { $gte: from, $lte: to } }).sort({ date:
    1 }).lean(),
Quality.find().lean(),
Worker.findById(operatorId).lean(),
]);
const qMap = new Map(qualities.map((q) => [q._id.toString(), q]));
const byDate = new Map(); // dateStr -> qualityId->meters
for (const r of records) {
const dateStr = r.date.toISOString().slice(0, 10);
if (!byDate.has(dateStr)) byDate.set(dateStr, new Map());
const qm = byDate.get(dateStr);
const qid = r.qualityId.toString();
qm.set(qid, (qm.get(qid) || 0) + Number(r.meterProduced));
}
const daily = Array.from(byDate.entries()).map(([dateStr, qm]) => {
const qualitiesArr = Array.from(qm.entries()).map(([qId, meters]) => {
const q = qMap.get(qId);
return {
qualityId: qId,
qualityName: q.name,
pricePerMeter: q.pricePerMeter,
meters,
amount: meters * q.pricePerMeter,
};
});
const total = qualitiesArr.reduce((acc, r) => acc + r.amount, 0);
return { date: dateStr, qualities: qualitiesArr, total };
});
const totalPayable = daily.reduce((acc, d) => acc + d.total, 0);
return {
operatorId,
operatorName: worker ? worker.name : null,
from: fromStr,
to: toStr,
daily,
totalPayable,
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
