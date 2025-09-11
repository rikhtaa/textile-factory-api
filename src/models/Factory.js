const mongoose = require("mongoose")
const FactorySchema = new mongoose.Schema(
    {
     name: { type: String, unique: true, required: true },
    }
)
module.exports = mongoose.model("Factory", FactorySchema)