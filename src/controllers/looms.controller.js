const Loom = require("../models/Loom");

async function createLoom(req, res) {
const loom = await Loom.create(req.body);
res.status(201).json(loom);
}
async function listLooms(req, res) {
const {factoryId} = req.query
const where ={}
if(factoryId) where.factoryId = factoryId
const looms = await Loom.find(where);
res.json(looms);
}
async function getLoom(req, res) {
const loom = await Loom.findById(req.params.id);
if (!loom) return res.status(404).json({ message: "Not found" });
res.json(loom);
}
async function updateLoom(req, res) {
const loom = await Loom.findByIdAndUpdate(req.params.id, req.body, { new: true });
if (!loom) return res.status(404).json({ message: "Not found" });
res.json(loom);
}
async function deleteLoom(req, res) {
await Loom.findByIdAndDelete(req.params.id);
res.status(204).send();
}
module.exports = { createLoom, listLooms, getLoom, updateLoom, deleteLoom};