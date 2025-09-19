const Beam = require("../models/Beam");
const BeamProduction = require("../models/BeamProduction");
const { toUtcDateOnly } = require("../utils/dates");
async function beamsReport(req, res) {
const { dateFrom, dateTo, loomId } = req.query;
const from = toUtcDateOnly(dateFrom);
const to = toUtcDateOnly(dateTo);

const where = { date: { $gte: from, $lte: to } };
if (loomId) where.loomId = loomId;
const records = await BeamProduction.find(where).lean();
const total = records.reduce((acc, r) => acc + Number(r.totalMeters), 0);
res.json({
from: dateFrom,
to: dateTo,
loomId: loomId || null,
totalMeters: total,
count: records.length,
});
}
async function createBeam(req, res){
    try {
        const { beamNumber, totalMeters, isClosed  } = req.body;
        const beam = await Beam.create({ beamNumber, totalMeters, isClosed  });
        res.status(201).json(beam);
    }catch (error) {
        if (error.code === 11000) {
          return res.status(400).json({ message: "Beam number already exists" });
        }
        res.status(500).json({ message: error.message });
    }
}
async function getAllBeam(req,res){
    const list = await Beam.find().sort({ beamNumber: 1 })
     .select("beamNumber totalMeters producedMeters remainingMeters isClosed").lean();
     res.json(list);
}
async function updateBeam(req, res) {
    try {
        const updates = req.body;
        const beam = await Beam.findByIdAndUpdate(
            req.params.id,
            updates,  
            { new: true, runValidators: true } 
        );
        
        if (!beam) {
            return res.status(404).json({ message: "Beam not found" });
        }
        
        res.status(200).json({ message: "Beam has been updated", beam });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function deleteBeam(req, res){
    try {
        const deletedBeam = await Beam.findByIdAndDelete(req.params.id);
        if (!deletedBeam) {
            return res.status(404).json({ message: "Beam not found" });
        }
        
        res.status(200).json({ message: "Beam has been deleted", deletedBeam });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
module.exports = { beamsReport, createBeam, getAllBeam, updateBeam, deleteBeam };