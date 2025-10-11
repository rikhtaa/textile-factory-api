const mongoose = require("mongoose");
const LoomManagementSchema = mongoose.Schema(
{
    loom:{type: mongoose.Schema.Types.ObjectId, ref: 'Loom', required: true},
    beam:{type: mongoose.Schema.Types.ObjectId, ref: 'Beam', required: true},
    quality:{type: mongoose.Schema.Types.ObjectId, ref: 'Quality', required: true},
    beamDate:{type: Date, required: true}
},
{ timestamps: true }
)
module.exports = mongoose.model('LoomManagement', LoomManagementSchema)