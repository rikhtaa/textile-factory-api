const { dailyLoomReport, dailyQualityReport, operatorPeriodReport, fifteenDayOperator
} = require("../services/reports.service");
const { toUtcDateOnly } = require("../utils/dates");
const { computePayRun } = require("../services/payrun.service");
const PaymentRun = require("../models/PaymentRun");
const ProductionRecord = require("../models/ProductionRecord");
async function getDailyLooms(req, res) {
const { date } = req.query;
const report = await dailyLoomReport(date);
res.json(report);
}
async function getDailyQuality(req, res) {
const { date } = req.query;
const report = await dailyQualityReport(date);
res.json(report);
}
async function getOperatorPeriod(req, res) {
const { operatorId, from, to } = req.query;
const report = await operatorPeriodReport(operatorId, from, to);
res.json(report);
}
async function getPayRun(req, res) {
const { from, to, commit } = req.query;
const f = toUtcDateOnly(from);
const t = toUtcDateOnly(to);
const results = await computePayRun(f, t);
if (commit === "true") {
const items = results.flatMap((r) =>
r.breakdown.map((b) => ({
operatorId: r.operatorId,
qualityId: b.qualityId,
meters: b.meters,
pricePerMeter: b.pricePerMeter,
amount: b.amount,
}))
);
const gross = results.reduce((acc, r) => acc + r.gross, 0);
const run = await PaymentRun.create({
periodStart: f,
periodEnd: t,
items,
adjustments: 0,
deductions: 0,
gross,
net: gross,
createdBy: req.user.sub
});
return res.json({ runId: run._id, name: req.user.name, results });
}
res.json({ results });
}
async function get15DayOperator(req, res) {
const { startDate, operatorId } = req.query;
const report = await fifteenDayOperator(operatorId, startDate);
res.json(report);
}
async function getBeamUsage(req, res) {
  const { start, end, beamId, loomId } = req.query;
  if (!start) return res.status(400).json({ message: "start is required (YYYY-MM-DD)" });

  const match = {
    date: { $gte: toUtcDateOnly(start) },
    beamId: { $ne: null } // Beam records only
  };
  
  if (end) match.date.$lte = toUtcDateOnly(end);
  if (beamId) match.beamId = new mongoose.Types.ObjectId(beamId);
  if (loomId) match.loomId = new mongoose.Types.ObjectId(loomId);

  try {
    const rows = await ProductionRecord.aggregate([
      { $match: match },
      { 
        $lookup: {
          from: "beams",
          localField: "beamId",
          foreignField: "_id",
          as: "beam"
        }
      },
      { $unwind: "$beam" },
      { 
        $lookup: {
          from: "looms", 
          localField: "loomId",
          foreignField: "_id",
          as: "loom"
        }
      },
      { $unwind: "$loom" },
      {
        $group: {
          _id: "$beamId",
          beamNumber: { $first: "$beam.beamNumber" },
          beamMeter: { $first: "$beam.totalMeters" },
          totalProduced: { $sum: "$meterProduced" },
          records: { $push: "$$ROOT" }
        }
      },
      {
        $project: {
          beamNumber: 1,
          beamMeter: 1,
          totalProduced: 1,
          remainingBeamMeter: { $subtract: ["$beamMeter", "$totalProduced"] },
          records: 1
        }
      }
    ]);

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
module.exports = {
getDailyLooms,
getDailyQuality,
getOperatorPeriod,
getPayRun,
get15DayOperator,
getBeamUsage
};

