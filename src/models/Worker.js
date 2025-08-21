const mongoose = require("mongoose");
const WorkerSchema = new mongoose.Schema(
{
name: { type: String, required: true },
role: {
type: String,
enum: ["admin", "manager", "operator", "warper"],
required: true,
},
phone: String,
email: { type: String, unique: true, sparse: true },
passwordHash: String,
hireDate: { type: Date, default: Date.now },
status: { type: String, enum: ["active", "inactive"], default: "active" },
},
{ timestamps: true }
);
WorkerSchema.index({ role: 1 });
WorkerSchema.index({ status: 1 });
module.exports = mongoose.model("Worker", WorkerSchema);