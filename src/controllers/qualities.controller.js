const Quality = require("../models/Quality");

async function createQuality(req, res) {
const { name, pricePerMeter } = req.body;
const q = await Quality.create({ name, pricePerMeter, priceHistory: [] });
res.status(201).json(q);
}

module.exports = { createQuality };