const ProductionRecord = require("../models/ProductionRecord");
const Quality = require("../models/Quality");
const Worker = require("../models/Worker");
function getQualityPriceForDate(quality, _date) {
// MVP: always current price
return quality.pricePerMeter;
}
async function computePayRun(from, to) {
const [productions, qualities, operators] = await Promise.all([
ProductionRecord.find({ date: { $gte: from, $lte: to } }).lean(),
Quality.find().lean(),
Worker.find({ role: "operator" }).lean(),
]);
const qMap = new Map(qualities.map((q) => [q._id.toString(), q]));
const oMap = new Map(operators.map((o) => [o._id.toString(), o]));
const agg = new Map(); // operatorId -> Map(qualityId -> meters)
for (const p of productions) {
const opId = p.operatorId.toString();
const qId = p.qualityId.toString();
if (!agg.has(opId)) agg.set(opId, new Map());
const qm = agg.get(opId);
qm.set(qId, (qm.get(qId) || 0) + Number(p.meterProduced));
}
const results = [];
for (const [operatorId, qm] of agg.entries()) {
const operator = oMap.get(operatorId);
if (!operator) continue;
let gross = 0;
const breakdown = [];
for (const [qualityId, meters] of qm.entries()) {
const quality = qMap.get(qualityId);
if (!quality) continue;
const price = getQualityPriceForDate(quality, from);
const amount = meters * price;
gross += amount;
breakdown.push({
qualityId,
qualityName: quality.name,
meters,
pricePerMeter: price,
amount,
});
}
const adjustments = 0;
const deductions = 0;
const net = gross + adjustments - deductions;
results.push({
operatorId,
operatorName: operator.name,
breakdown,
gross,
adjustments,
deductions,
net,
});
}
return results;
}
module.exports = { computePayRun };
