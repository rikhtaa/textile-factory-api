const { Router } = require("express");
const workers = require("./workers.routes");
const auth = require("./auth.routes");
const looms = require("./looms.routes");

const router = Router();
router.use("/workers", workers);
router.use("/auth", auth);
router.use("/looms", looms);
module.exports = router;