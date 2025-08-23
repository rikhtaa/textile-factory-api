/* eslint-disable no-console */
require("dotenv").config();
const bcrypt = require("bcryptjs");
const { connect, disconnect } = require("./src/db/mongoose");
const Worker = require("./src/models/Worker");
const Loom = require("./src/models/Loom");
const Quality = require("./src/models/Quality");
const ProductionRecord = require("./src/models/ProductionRecord");
const BeamProduction = require("./src/models/BeamProduction");
const WarpingProduction = require("./src/models/WarpingProduction");
function utcDate(y, m, d) {
return new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0));
}
async function main() {
await connect();
// Clean minimal for idempotency
// Comment out deletes if you want additive
await Promise.all([
Worker.deleteMany({}),
Loom.deleteMany({}),
Quality.deleteMany({}),
ProductionRecord.deleteMany({}),
BeamProduction.deleteMany({}),
WarpingProduction.deleteMany({}),
])
// Qualities
const [q1, q2, q3] = await Quality.insertMany([
{ name: "Q1", pricePerMeter: 1.2, priceHistory: [] },
{ name: "Q2", pricePerMeter: 1.5, priceHistory: [] },
{ name: "Q3", pricePerMeter: 1.8, priceHistory: [] },
]);
// Looms
const looms = await Loom.insertMany(
Array.from({ length: 10 }).map((_, i) => ({
loomNumber: String(i + 1),
section: "A",
status: "active",
}))
);
// Users
const admin = await Worker.create({
name: "Admin",
role: "admin",
email: "admin@example.com",
passwordHash: await bcrypt.hash("admin123", 10),
});
const manager = await Worker.create({
name: "Manager",
role: "manager",
email: "manager@example.com",
passwordHash: await bcrypt.hash("manager123", 10),
});
const operators = await Worker.insertMany(
Array.from({ length: 5 }).map((_, i) => ({
name: `Operator ${i + 1}`,
role: "operator",
email: `op${i + 1}@example.com`,
passwordHash: i === 0 ? bcrypt.hashSync("op123456", 10) : undefined,
}))
);
const warper = await Worker.create({
name: "Warper 1",
role: "warper",
email: "warper1@example.com",
});
// Production 30 days back from today
const today = new Date();
const start = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(),
today.getUTCDate() - 29));
const qualities = [q1, q2, q3];
const rand = (n) => Math.floor(Math.random() * n);
const prodDocs = [];
for (let d = 0; d < 30; d++) {
const date = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(),
start.getUTCDate() + d));
for (const loom of looms) {
const op = operators[rand(operators.length)];
const q = qualities[rand(qualities.length)];
const meters = rand(200) + 50; // 50..249
prodDocs.push({
operatorId: op._id,
loomId: loom._id,
qualityId: q._id,
date,
meterProduced: meters,
shift: ["A", "B", "C"][rand(3)],
});
}
}
await ProductionRecord.insertMany(prodDocs);
// Beam production (subset)
const beamDocs = [];
for (let d = 0; d < 10; d++) {
const date = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(),
today.getUTCDate() - d));
for (const loom of looms.slice(0, 5)) {
beamDocs.push({
loomId: loom._id,
date,
totalMeters: rand(500) + 200,
beamNumber: `B-${loom.loomNumber}-${d}`,
});
}
}
await BeamProduction.insertMany(beamDocs);
// Warping production
const warpDocs = [];
for (let d = 0; d < 15; d++) {
const date = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(),
today.getUTCDate() - d));
warpDocs.push({
warperId: warper._id,
date,
totalMeters: rand(400) + 100,
});
}
await WarpingProduction.insertMany(warpDocs);
console.log("Seed complete.");
await disconnect();
}
main().catch((e) => {
console.error(e);
process.exit(1);
});