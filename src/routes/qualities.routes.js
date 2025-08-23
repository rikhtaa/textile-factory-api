const { Router } = require("express");
const { body } = require("express-validator");
const { createQuality } =
require("../controllers/qualities.controller");
const { requireAuth, requireRoles } = require("../middleware/auth");
const router = Router();

const validateQuality = [
body("name").optional().isString().notEmpty(),
body("pricePerMeter").optional().isFloat({ min: 0 }),
(req, res, next) => {
const { validationResult } = require("express-validator");
const errors = validationResult(req);
if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
next();
},
];
router.post("/", requireAuth, requireRoles("admin", "manager"),
body("name").isString().notEmpty(), body("pricePerMeter").isFloat({ min: 0 }),
validateQuality, createQuality);

module.exports = router;