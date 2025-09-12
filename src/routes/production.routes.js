const { Router } = require("express");
const { body, query } = require("express-validator");
const { createProduction, bulkImport, listProduction } =
require("../controllers/production.controller");
const { requireAuth } = require("../middleware/auth");
const router = Router();

const baseProdValidators = [
body("operatorId").isString().notEmpty(),
body("loomId").isString().notEmpty(),
body("qualityId").isString().notEmpty(),
body("factoryId").isString().notEmpty(),
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
router.post(
"/bulk",
requireAuth,
body("upsert").optional().isBoolean(),
body("records").isArray({ min: 1 }),
body("records.*.operatorId").isString().notEmpty(),
body("records.*.loomId").isString().notEmpty(),
body("records.*.qualityId").isString().notEmpty(),
body("records.*.date").isISO8601(),
body("records.*.shift").optional().isIn(["A", "B", "C"]),
body("records.*.meterProduced").isFloat({ min: 0 }),
body("records.*.notes").optional().isString(),
(req, res, next) => {
const { validationResult } = require("express-validator");
const errors = validationResult(req);
if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
next();
},
bulkImport
);
router.get(
"/",
requireAuth,
query("date").optional().isISO8601(),
query("loomId").optional().isString(),
query("operatorId").optional().isString(),
(req, res, next) => {
const { validationResult } = require("express-validator");
const errors = validationResult(req);
if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
next();
},
listProduction
);
module.exports = router;