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
module.exports = { createWorker, updateWorker, listWorkers};