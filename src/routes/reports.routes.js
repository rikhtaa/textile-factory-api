const { Router } = require("express");
const { query, validationResult } = require("express-validator");
const { getDailyLooms, getDailyQuality, getOperatorPeriod, getPayRun, get15DayOperator, getBeamUsage } = require("../controllers/reports.controller");
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
router.get(
"/operator-period",
requireAuth,
query("operatorId").isString(),
query("from").isISO8601(),
query("to").isISO8601(),
validate,
getOperatorPeriod
);
router.get(
"/payrun",
requireAuth,
query("from").isISO8601(),
query("to").isISO8601(),
query("commit").optional().isIn(["true", "false"]),
validate,
getPayRun
);
router.get(
"/15day-operator",
requireAuth,
query("startDate").isISO8601(),
query("operatorId").isString(),
validate,
get15DayOperator
);
router.get(
  "/beam-usage",
  requireAuth,
  [
    query("start").isISO8601().withMessage("Start date must be valid ISO8601"),
    query("end").optional().isISO8601().withMessage("End date must be valid ISO8601"),
    query("beamId").optional().isMongoId().withMessage("Beam ID must be valid"),
    query("loomId").optional().isMongoId().withMessage("Loom ID must be valid")
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  getBeamUsage 
);


module.exports = router;
