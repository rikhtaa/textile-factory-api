const { Router } = require("express");
const workers = require("./workers.routes");
const auth = require("./auth.routes");
const looms = require("./looms.routes");
const production = require("./production.routes");
const reports = require("./reports.routes")
const qualities = require("./qualities.routes");

const router = Router();
router.use("/workers", workers);
router.use("/auth", auth);
router.use("/looms", looms);
router.use("/production", production);
router.use("/reports", reports);
router.use("/qualities", qualities);


module.exports = router;
