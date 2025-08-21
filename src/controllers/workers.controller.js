const Worker = require("../models/Worker");
const bcrypt = require("bcryptjs");

async function createWorker(req, res) {
const { password, ...rest } = req.body;
const passwordHash = password ? await bcrypt.hash(password, 10) : undefined;
const worker = await Worker.create({ ...rest, passwordHash });
res.status(201).json(worker);
}
module.exports = { createWorker};