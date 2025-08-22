const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Worker = require("../src/models/Worker");
const Loom = require("../src/models/Loom");
const Quality = require("../src/models/Quality");
const ProductionRecord = require("../src/models/ProductionRecord");
let mongo;
module.exports.setup = async () => {
mongo = await MongoMemoryServer.create();
const uri = mongo.getUri();
await mongoose.connect(uri);
// Seed minimal
const [q1] = await Quality.insertMany([{ name: "Q1", pricePerMeter: 1.2 }]);
const [loom1] = await Loom.insertMany([{ loomNumber: "1", section: "A" }]);
const admin = await Worker.create({
name: "Admin T",
role: "admin",
email: "admin@test.com",
passwordHash: await bcrypt.hash("admin123", 10),
});
const op = await Worker.create({
name: "Op T",
role: "operator",
email: "op1@test.com",
passwordHash: await bcrypt.hash("op123456", 10),
});
// One production today
const todayIso = new Date().toISOString().slice(0, 10);
const date = new Date(`${todayIso}T00:00:00.000Z`);
await ProductionRecord.create({
operatorId: op._id,
loomId: loom1._id,
qualityId: q1._id,
date,
meterProduced: 100,
shift: "A",
});
return { admin, op, loom1, q1, todayIso };
};
module.exports.teardown = async () => {
await mongoose.disconnect();
if (mongo) await mongo.stop();
};
