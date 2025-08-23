const { Router } = require("express");
const { query } = require("express-validator");
const { getDailyLooms, getDailyQuality } = require("../controllers/reports.controller");
const { requireAuth } = require("../middleware/auth");
const router = Router();
function validate(req, res, next) {
const { validationResult } = require("express-validator");
const errors = validationResult(req);
if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
next();
}
 
router.get("/daily-looms", requireAuth, query("date").isISO8601(), validate,
getDailyLooms);
router.get("/daily-quality", requireAuth, query("date").isISO8601(), validate,
getDailyQuality);

module.exports = router;
