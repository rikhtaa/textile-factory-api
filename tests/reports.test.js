const request = require("supertest");
const app = require("../src/app");
const { setup } = require("./setup");
let token, dateStr;
beforeAll(async () => {
await setup();
const res = await request(app)
.post("/api/auth/login")
.send({ email: "admin@test.com", password: "admin123" });
token = res.body.token;
dateStr = new Date().toISOString().slice(0, 10);
}, 30000);
test("daily looms report", async () => {
const res = await request(app)
.get(`/api/reports/daily-looms?date=${dateStr}`)
.set("Authorization", `Bearer ${token}`);
expect(res.status).toBe(200);
expect(res.body.rows).toBeDefined();
});

test("daily quality report", async () => {
const res = await request(app)
.get(`/api/reports/daily-quality?date=${dateStr}`)
.set("Authorization", `Bearer ${token}`);
expect(res.status).toBe(200);
expect(res.body.rows).toBeDefined();
});
