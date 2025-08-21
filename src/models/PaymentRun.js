const mongoose = require("mongoose");
const PayItemSchema = new mongoose.Schema(
{
operatorId: { type: mongoose.Schema.Types.ObjectId, ref: "Worker", required: true
},
qualityId: { type: mongoose.Schema.Types.ObjectId, ref: "Quality", required: true
},
meters: { type: Number, required: true },
pricePerMeter: { type: Number, required: true },
amount: { type: Number, required: true },
},
{ _id: false }
);
const PaymentRunSchema = new mongoose.Schema(
{
periodStart: { type: Date, required: true },
periodEnd: { type: Date, required: true },
items: { type: [PayItemSchema], default: [] },
adjustments: { type: Number, default: 0 },
deductions: { type: Number, default: 0 },
gross: { type: Number, required: true },
net: { type: Number, required: true },
},
{ timestamps: true }
);
PaymentRunSchema.index({ periodStart: 1, periodEnd: 1 });
module.exports = mongoose.model("PaymentRun", PaymentRunSchema);