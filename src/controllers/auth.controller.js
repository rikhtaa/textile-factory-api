const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Worker = require("../models/Worker");
const { env } = require("../config/env");
function signJwt(worker) {
return jwt.sign(
{ sub: worker._id.toString(), role: worker.role, name: worker.name },
env.JWT_SECRET,
{ expiresIn: env.JWT_EXPIRES_IN }
);
}
async function register(req, res) {
const { name, email, phone, password, role } = req.body;
const hasAdmin = await Worker.exists({ role: "admin" });
let finalRole = role || "operator";
if (hasAdmin && ["admin", "manager"].includes(finalRole)){
if (!req.user || req.user.role !== "admin") {
return res.status(403).json({ message: "Only admin can create admin/manager" });
}
}
if (email) {
const existing = await Worker.findOne({ email });
if (existing) return res.status(409).json({ message: "Email taken" });
}
const passwordHash = password ? await bcrypt.hash(password, 10) : undefined;
const worker = await Worker.create({
name,
email,
phone,
role: finalRole,
passwordHash,
});
const token = signJwt(worker)
res.status(201).json({
token,
user: { id: worker._id, name: worker.name, role: worker.role, email: worker.email
},
});
}
async function login(req, res) {
const { email, password } = req.body;
const worker = await Worker.findOne({ email });
if (!worker?.passwordHash) {
return res.status(401).json({ message: "Invalid credentials" });
}
const valid = await bcrypt.compare(password, worker.passwordHash);
if (!valid) return res.status(401).json({ message: "Invalid credentials" });
const token = signJwt(worker);
res.json({
token,
user: { id: worker._id, name: worker.name, role: worker.role, email: worker.email
},
});
}
module.exports = { register, login }