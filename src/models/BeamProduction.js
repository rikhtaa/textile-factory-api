const mongoose = require("mongoose");
const BeamProductionSchema = new mongoose.Schema(
{
loomId: { type: mongoose.Schema.Types.ObjectId, ref: "Loom", required: true },
date: { type: Date, required: true },
totalMeters: { type: Number, required: true, min: 0 },
beamNumber: String,
},
{ timestamps: true }
);
BeamProductionSchema.index({ loomId: 1 });
BeamProductionSchema.index({ date: 1 });
module.exports = mongoose.model("BeamProduction", BeamProductionSchema);