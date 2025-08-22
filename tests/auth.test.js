const request = require("supertest");
const app = require("../src/app");
const { setup, teardown } = require("./setup");
const jwt = require("jsonwebtoken");
let ctx;
beforeAll(async () => {
ctx = await setup();
});
afterAll(async () => {
await teardown();
});
test("login success", async () => {
const res = await request(app)
.post("/api/auth/login")
.send({ email: "admin@test.com", password: "admin123" });
expect(res.status).toBe(200);
expect(res.body.token).toBeDefined();
const decoded = jwt.decode(res.body.token);
expect(decoded.role).toBe("admin");
});
