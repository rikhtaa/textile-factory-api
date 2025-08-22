const { Router } = require("express");
const { body, query } = require("express-validator");
const { createProduction } =
require("../controllers/production.controller");
const { requireAuth } = require("../middleware/auth");
const router = Router();

const baseProdValidators = [
body("operatorId").isString().notEmpty(),
body("loomId").isString().notEmpty(),
body("qualityId").isString().notEmpty(),
body("date").isISO8601(),
body("shift").optional().isIn(["A", "B", "C"]),
body("meterProduced").isFloat({ min: 0 }),
body("notes").optional().isString(),
];

router.post(
"/",
requireAuth,
baseProdValidators,
(req, res, next) => {
const { validationResult } = require("express-validator");
const errors = validationResult(req);
if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
next();
},
createProduction
);
module.exports = router;