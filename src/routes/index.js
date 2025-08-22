const { Router } = require("express");
const workers = require("./workers.routes");
const auth = require("./auth.routes");
const production = require("./production.routes");

const router = Router();
router.use("/workers", workers);
router.use("/auth", auth);
router.use("/production", production);
module.exports = router;