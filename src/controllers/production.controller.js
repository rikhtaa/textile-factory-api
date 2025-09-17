const ProductionRecord = require("../models/ProductionRecord");
const Worker = require("../models/Worker");
const Loom = require("../models/Loom");
const Quality = require("../models/Quality");
const Beam = require("../models/Beam");
const Factory = require("../models/Factory")
const mongoose = require("mongoose");

const { toUtcDateOnly } = require("../utils/dates");
async function createProduction(req, res) {
  const { beamId, operatorId, loomId, qualityId, factoryId, date, shift, meterProduced, notes } = req.body;
  
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const [beam, operator, loom, quality, factory] = await Promise.all([
      beamId ? Beam.findById(beamId).session(session) : Promise.resolve(null),
      Worker.findById(operatorId).session(session),
      Loom.findById(loomId).session(session),
      Quality.findById(qualityId).session(session),
      Factory.findById(factoryId).session(session)
    ]);

    if (beamId && !beam) throw new Error("Invalid BeamId", { status: 400 });
    if (!operator || operator.role !== "operator") throw new Error("Invalid operatorId", { status: 400 });
    if (!loom) throw new Error("Invalid loomId", { status: 400 });
    if (!quality) throw new Error("Invalid qualityId", { status: 400 });
    if (!factory) throw new Error("Invalid factoryId", { status: 400 });

    if (beamId) {
      if (beam.isClosed) throw new Error("Beam is already closed", { status: 400 });
      if (beam.remainingMeters < meterProduced) {
        throw new Error(`Only ${beam.remainingMeters} meters remaining on this beam`, { status: 400 });
      }

      beam.producedMeters += meterProduced;
      beam.remainingMeters -= meterProduced;
      
      if (beam.remainingMeters <= 0) {
        beam.isClosed = true;
      }
      
      await beam.save({ session });
    }

    const record = await ProductionRecord.create([{
      operatorId, loomId, qualityId, factoryId,
      date: toUtcDateOnly(date),
      shift, meterProduced, notes,
      ...(beamId && { beamId })
    }], { session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      message: "Production record created successfully",
      data: record[0]
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    if (error.code === 11000) {
      return res.status(409).json({ 
        success: false, 
        message: "Duplicate production record" 
      });
    }
    
    const status = error.status || 500;
    return res.status(status).json({ 
      success: false, 
      message: error.message 
    });
  }
}
async function bulkImport(req, res) {
const { upsert = true, records } = req.body;
if (!Array.isArray(records) || records.length === 0) {
return res.status(400).json({ message: "records required" });
}
if (!upsert) {
const docs = records.map((r) => ({
...r,
date: toUtcDateOnly(r.date),
}));
try {
const created = await ProductionRecord.insertMany(docs, { ordered: false });
return res.status(201).json(created);
} catch (e) {
return res.status(400).json({ message: "Bulk insert error", error: e.message });
}
} else {
const results = [];
for (const r of records) {
const key = {
operatorId: r.operatorId,
loomId: r.loomId,
qualityId: r.qualityId,
date: toUtcDateOnly(r.date),
};const existing = await ProductionRecord.findOne(key);
if (!existing) {
const created = await ProductionRecord.create({ ...key, shift: r.shift,
meterProduced: r.meterProduced, notes: r.notes });
results.push(created);
} else {
existing.meterProduced = Number(existing.meterProduced) +
Number(r.meterProduced);
if (r.notes) existing.notes = r.notes;
await existing.save();
results.push(existing);
}
}
return res.status(201).json(results);
}
}
async function listProduction(req, res) {
const { date, loomId, operatorId, factoryId } = req.query;
const where = {};
if (date) where.date = toUtcDateOnly(date);
if (loomId) where.loomId = loomId;
if (operatorId) where.operatorId = operatorId;
 if (factoryId) where.factoryId = factoryId;
const records = await ProductionRecord.find(where).sort({ date: 1 }).lean();
res.json(records);
}
module.exports = { createProduction, bulkImport, listProduction };