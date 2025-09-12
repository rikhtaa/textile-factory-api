const ProductionRecord = require("../models/ProductionRecord");
const Worker = require("../models/Worker");
const Loom = require("../models/Loom");
const Quality = require("../models/Quality");
const Factory = require("../models/Factory")
const { toUtcDateOnly } = require("../utils/dates");
async function createProduction(req, res) {
const { operatorId, loomId, qualityId, factoryId, date, shift, meterProduced, notes } =
req.body;
const [op, loom, qual, fact] = await Promise.all([
Worker.findById(operatorId),
Loom.findById(loomId),
Quality.findById(qualityId),
Factory.findById(factoryId)
]);
if (!op || op.role !== "operator") return res.status(400).json({ message: "Invalid operatorId" });
if (!loom) return res.status(400).json({ message: "Invalid loomId" });
if (!qual) return res.status(400).json({ message: "Invalid qualityId" });
if (!fact) return res.status(400).json({ message: "Invalid factory" });
try {
const record = await ProductionRecord.create({
operatorId,
loomId,
factoryId,
qualityId,
date: toUtcDateOnly(date),
shift,
meterProduced,
notes,
});
res.status(201).json(record);
} catch (e) {
if (e.code === 11000) {
return res.status(409).json({ message: "Duplicate record" });
}
throw e;
}
}
async function bulkImport(req, res) {
const { upsert = true, records } = req.body;
if (!Array.isArray(records) || records.length === 0) {
return res.status(400).json({ message: "records required" });
}
if (!upsert) {
const docs = records.map((r) => ({
...r,
date: toUtcDateOnly(r.date),
}));
try {
const created = await ProductionRecord.insertMany(docs, { ordered: false });
return res.status(201).json(created);
} catch (e) {
return res.status(400).json({ message: "Bulk insert error", error: e.message });
}
} else {
const results = [];
for (const r of records) {
const key = {
operatorId: r.operatorId,
loomId: r.loomId,
qualityId: r.qualityId,
date: toUtcDateOnly(r.date),
};const existing = await ProductionRecord.findOne(key);
if (!existing) {
const created = await ProductionRecord.create({ ...key, shift: r.shift,
meterProduced: r.meterProduced, notes: r.notes });
results.push(created);
} else {
existing.meterProduced = Number(existing.meterProduced) +
Number(r.meterProduced);
if (r.notes) existing.notes = r.notes;
await existing.save();
results.push(existing);
}
}
return res.status(201).json(results);
}
}
async function listProduction(req, res) {
const { date, loomId, operatorId, factoryId } = req.query;
const where = {};
if (date) where.date = toUtcDateOnly(date);
if (loomId) where.loomId = loomId;
if (operatorId) where.operatorId = operatorId;
 if (factoryId) where.factoryId = factoryId;
const records = await ProductionRecord.find(where).sort({ date: 1 }).lean();
res.json(records);
}
module.exports = { createProduction, bulkImport, listProduction };