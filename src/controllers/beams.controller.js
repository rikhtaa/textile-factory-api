const BeamProduction = require("../models/BeamProduction");
const { toUtcDateOnly } = require("../utils/dates");
async function beamsReport(req, res) {
const { dateFrom, dateTo, loomId } = req.query;
const from = toUtcDateOnly(dateFrom);
const to = toUtcDateOnly(dateTo);
const where = { date: { $gte: from, $lte: to } };
if (loomId) where.loomId = loomId;
const records = await BeamProduction.find(where).lean();
const total = records.reduce((acc, r) => acc + Number(r.totalMeters), 0);
res.json({
from: dateFrom,
to: dateTo,
loomId: loomId || null,
totalMeters: total,
count: records.length,
});
}
module.exports = { beamsReport };