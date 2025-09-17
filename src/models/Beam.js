const mongoose = require("mongoose")

const BeamSchema = new mongoose.Schema(
  {
    beamNumber: { type: String, unique: true, required: true, index: true },
    totalMeters: { type: Number, required: true, min: 0 },
    producedMeters: { type: Number, default: 0, min: 0 },
    remainingMeters: { type: Number, required: true, min: 0 },
    isClosed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

BeamSchema.pre("validate", function (next) {
  if (this.isNew && this.remainingMeters == null) {
    this.remainingMeters = this.totalMeters;
  }
  next();
});

module.exports = mongoose.model("Beam", BeamSchema);
