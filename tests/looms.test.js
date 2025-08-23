const request = require("supertest");
const app = require("../src/app");
const { setup } = require("./setup");
let token;
beforeAll(async () => {
await setup(); 
const res = await request(app)
.post("/api/auth/login")
.send({ email: "admin@test.com", password: "admin123" });
token = res.body.token;
}, );
test("list looms requires auth", async () => {
const res = await request(app).get("/api/looms");
expect(res.status).toBe(401);
});
test("create loom as admin", async () => {
const res = await request(app)
.post("/api/looms")
.set("Authorization", `Bearer ${token}`)
.send({ loomNumber: "2", section: "B" });
expect(res.status).toBe(201);
expect(res.body.loomNumber).toBe("2");
});
