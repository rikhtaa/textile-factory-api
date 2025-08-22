const Loom = require("../models/Loom");

async function createLoom(req, res) {
const loom = await Loom.create(req.body);
res.status(201).json(loom);
}
async function listLooms(_req, res) {
const data = await Loom.find();
res.json(data);
}
module.exports = { createLoom, listLooms };