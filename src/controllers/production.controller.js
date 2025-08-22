const ProductionRecord = require("../models/ProductionRecord");
const Worker = require("../models/Worker");
const Loom = require("../models/Loom");
const Quality = require("../models/Quality");
const { toUtcDateOnly } = require("../utils/dates");
async function createProduction(req, res) {
const { operatorId, loomId, qualityId, date, shift, meterProduced, notes } =
req.body;
const [op, loom, qual] = await Promise.all([
Worker.findById(operatorId),
Loom.findById(loomId),
Quality.findById(qualityId),]);
if (!op || op.role !== "operator") return res.status(400).json({ message: "Invalid operatorId" });
if (!loom) return res.status(400).json({ message: "Invalid loomId" });
if (!qual) return res.status(400).json({ message: "Invalid qualityId" });
try {
const record = await ProductionRecord.create({
operatorId,
loomId,
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
module.exports = { createProduction };