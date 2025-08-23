const { Router } = require("express");
const { query } = require("express-validator");
const { requireAuth } = require("../middleware/auth");
const { beamsReport } = require("../controllers/beams.controller");
const router = Router();

router.get(
"/report",
requireAuth,
query("dateFrom").isISO8601(),
query("dateTo").isISO8601(),
query("loomId").optional().isString(),
(req, res, next) => {
const { validationResult } = require("express-validator");
const errors = validationResult(req);
if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
next();
},
beamsReport
);

module.exports = router;