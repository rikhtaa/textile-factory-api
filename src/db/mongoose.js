const mongoose = require("mongoose");
const { env } = require("../config/env");
let connected = false;
async function connect() {
if (connected) return;
mongoose.set("strictQuery", true);
await mongoose.connect(env.MONGO_URI);
connected = true;
console.log("Mongo connected");
}
async function disconnect() {
if (!connected) return;
await mongoose.disconnect();
connected = false;
}
module.exports = { connect, disconnect };