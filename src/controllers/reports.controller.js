const { dailyLoomReport, dailyQualityReport, operatorPeriodReport, fifteenDayOperator
} = require("../services/reports.service");
const { toUtcDateOnly } = require("../utils/dates");
const { computePayRun } = require("../services/payrun.service");
const PaymentRun = require("../models/PaymentRun");
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
module.exports = {
getDailyLooms,
getDailyQuality
};

