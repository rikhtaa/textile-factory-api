const Worker = require("../models/Worker");
const bcrypt = require("bcryptjs");

async function createWorker(req, res) {
const { password, ...rest } = req.body;
const passwordHash = password ? await bcrypt.hash(password, 10) : undefined;
const worker = await Worker.create({ ...rest, passwordHash });
res.status(201).json(worker);
}
async function updateWorker(req, res) {
const { password, ...rest } = req.body;
const passwordHash = password ? await bcrypt.hash(password, 10) : undefined;
const worker = await Worker.findByIdAndUpdate(
req.params.id,
{ ...rest, ...(passwordHash ? { passwordHash } : {}) },
{ new: true }
);
if (!worker) return res.status(404).json({ message: "Not found" });
res.json(worker);
}
async function listWorkers(_req, res) {
const workers = await Worker.find();
res.json(workers);
}
async function getWorker(req, res) {
const worker = await Worker.findById(req.params.id);
if (!worker) return res.status(404).json({ message: "Not found" });
res.json(worker);
}
async function deleteWorker(req, res) {
await Worker.findByIdAndDelete(req.params.id);
res.status(204).send();
}
module.exports = { createWorker, updateWorker, listWorkers, getWorker, deleteWorker};