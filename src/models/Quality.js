const mongoose = require("mongoose");
const PriceEntrySchema = new mongoose.Schema(
{
pricePerMeter: { type: Number, required: true },
effectiveFrom: { type: Date, required: true },
},
{ _id: false }
);
const QualitySchema = new mongoose.Schema(
{
name: { type: String, unique: true, required: true },
pricePerMeter: { type: Number, required: true },
priceHistory: { type: [PriceEntrySchema], default: [] },
},
{ timestamps: true }
);
module.exports = mongoose.model("Quality", QualitySchema);