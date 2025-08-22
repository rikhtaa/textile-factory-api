const Loom = require("../models/Loom");

async function createLoom(req, res) {
const loom = await Loom.create(req.body);
res.status(201).json(loom);
}

module.exports = { createLoom };