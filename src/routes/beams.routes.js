const { Router } = require("express");
const { query } = require("express-validator");
const { requireAuth } = require("../middleware/auth");
const { beamsReport, createBeam, getAllBeam, updateBeam, deleteBeam } = require("../controllers/beams.controller");
const Beam = require("../models/Beam");
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

router.get("/", requireAuth, getAllBeam);

router.post("/", requireAuth, createBeam);

router.put("/:id", requireAuth, updateBeam)

router.delete("/:id", requireAuth,  deleteBeam)
module.exports = router;