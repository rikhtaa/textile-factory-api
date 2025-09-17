const { Router } = require("express");
const { query } = require("express-validator");
const { requireAuth } = require("../middleware/auth");
const { beamsReport } = require("../controllers/beams.controller");
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

router.get("/", requireAuth, async (_req, res) => {
  const list = await Beam.find().sort({ beamNumber: 1 })
  .select("beamNumber totalMeters producedMeters remainingMeters isClosed").lean();
  res.json(list);
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const { beamNumber, totalMeters } = req.body;
    const beam = await Beam.create({ beamNumber, totalMeters });
    res.status(201).json(beam);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Beam number already exists" });
    }
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;