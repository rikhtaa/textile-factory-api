const Quality = require("../models/Quality");

async function createQuality(req, res) {
const { name, pricePerMeter } = req.body;
const q = await Quality.create({ name, pricePerMeter, priceHistory: [] });
res.status(201).json(q);
}
async function listQualities(_req, res) {
const list = await Quality.find();
res.json(list);
}
async function updateQuality(req, res) {
const { name, pricePerMeter } = req.body;
const existing = await Quality.findById(req.params.id);
if (!existing) return res.status(404).json({ message: "Not found" });
if (typeof pricePerMeter === "number") {
existing.priceHistory.push({
pricePerMeter: pricePerMeter,
effectiveFrom: new Date(),
});
existing.pricePerMeter = pricePerMeter;
}
if (name) existing.name = name;
await existing.save();
res.json(existing);
}
async function deleteQuality(req, res) {
await Quality.findByIdAndDelete(req.params.id);
res.status(204).send();
}

module.exports = { createQuality, listQualities, updateQuality, deleteQuality };