const mongoose = require("mongoose");
const LoomSchema = new mongoose.Schema(
{
loomNumber: { type: String, required: true, unique: true },
section: String,
status: { type: String, enum: ["active", "inactive"], default: "active" },
beamInfo: String,
},
{ timestamps: true }
);
LoomSchema.index({ status: 1 });
module.exports = mongoose.model("Loom", LoomSchema);