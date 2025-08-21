const { Router } = require("express");
const workers = require("./workers.routes");
const auth = require("./auth.routes");

const router = Router();
router.use("/workers", workers);
router.use("/auth", auth);
module.exports = router;