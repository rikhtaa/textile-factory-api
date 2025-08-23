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

module.exports = { createQuality, listQualities };