const { Router } = require("express");
const workers = require("./workers.routes");
const router = Router();
router.use("/workers", workers);
module.exports = router;