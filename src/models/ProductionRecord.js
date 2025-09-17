const mongoose = require("mongoose");
const ProductionRecordSchema = new mongoose.Schema(
{
beamId: { type: mongoose.Schema.Types.ObjectId, ref: "Beam", required: true },
operatorId: { type: mongoose.Schema.Types.ObjectId, ref: "Worker", required: true
},
loomId: { type: mongoose.Schema.Types.ObjectId, ref: "Loom", required: true },
factoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Factory", required: true }, 
qualityId: { type: mongoose.Schema.Types.ObjectId, ref: "Quality", required: true
},
date: { type: Date, required: true }, // UTC midnight
shift: { type: String, enum: ["A", "B", "C"] },
meterProduced: { type: Number, required: true, min: 0 },
notes: String,
},
{ timestamps: true }
);
ProductionRecordSchema.index(
{ beamId: 1, operatorId: 1, loomId: 1, qualityId: 1, date: 1 },
{ unique: true }
);
ProductionRecordSchema.index({ date: 1 });
ProductionRecordSchema.index({ operatorId: 1 });
ProductionRecordSchema.index({ loomId: 1 });
ProductionRecordSchema.index({ qualityId: 1 });
module.exports = mongoose.model("ProductionRecord", ProductionRecordSchema);