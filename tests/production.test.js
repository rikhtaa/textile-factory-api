const request = require("supertest");
const app = require("../src/app");
const Worker = require("../src/models/Worker");
const Loom = require("../src/models/Loom");
const Quality = require("../src/models/Quality");
const { setup } = require("./setup");
let token, opId, loomId, qualityId, dateStr;
beforeAll(async () => {
await setup();
const res = await request(app)
.post("/api/auth/login")
.send({ email: "admin@test.com", password: "admin123" });
token = res.body.token;
const op = await Worker.findOne({ role: "operator" });
const loom = await Loom.findOne({ loomNumber: "1" });
const quality = await Quality.findOne({ name: "Q1" });
opId = op._id.toString();
loomId = loom._id.toString();
qualityId = quality._id.toString();
dateStr = new Date().toISOString().slice(0, 10);
});
test("create production", async () => {
const res = await request(app)
.post("/api/production")
.set("Authorization", `Bearer ${token}`)
.send({ operatorId: opId, loomId, qualityId, date: dateStr, meterProduced: 50,
shift: "A" });
// May be 201 or 409 if duplicate (seed created one for same day)
expect([201, 409]).toContain(res.status);
});
test("list production by date", async () => {
const res = await request(app)
.get(`/api/production?date=${dateStr}`)
.set("Authorization", `Bearer ${token}`);
expect(res.status).toBe(200);
expect(Array.isArray(res.body)).toBe(true);
});
