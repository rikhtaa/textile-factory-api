const request = require("supertest");
const app = require("../src/app");
let token, dateStr;
beforeAll(async () => {
const res = await request(app)
.post("/api/auth/login")
.send({ email: "admin@test.com", password: "admin123" });
token = res.body.token;
dateStr = new Date().toISOString().slice(0, 10);
});
test("payrun compute", async () => {
const res = await request(app)
.get(`/api/reports/payrun?from=${dateStr}&to=${dateStr}`)
.set("Authorization", `Bearer ${token}`);
expect(res.status).toBe(200);
expect(res.body.results).toBeDefined();
});
