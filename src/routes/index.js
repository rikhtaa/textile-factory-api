const { Router } = require("express");
const workers = require("./workers.routes");
const auth = require("./auth.routes");
<<<<<<< HEAD
const looms = require("./looms.routes");
=======
const production = require("./production.routes");
>>>>>>> cdcf3ff39f366321da7b6e0ce5d21966f09442ad

const router = Router();
router.use("/workers", workers);
router.use("/auth", auth);
<<<<<<< HEAD
router.use("/looms", looms);
=======
router.use("/production", production);
>>>>>>> cdcf3ff39f366321da7b6e0ce5d21966f09442ad
module.exports = router;