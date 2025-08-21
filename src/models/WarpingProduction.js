const mongoose = require("mongoose");
const WarpingProductionSchema = new mongoose.Schema(
{
warperId: { type: mongoose.Schema.Types.ObjectId, ref: "Worker", required: true },
date: { type: Date, required: true },
totalMeters: { type: Number, required: true, min: 0 },
notes: String,
},
{ timestamps: true }
);
WarpingProductionSchema.index({ warperId: 1, date: 1 });
module.exports = mongoose.model("WarpingProduction", WarpingProductionSchema);