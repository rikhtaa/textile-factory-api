const jwt = require("jsonwebtoken");
const { env } = require("../config/env");

function requireAuth(req, res, next) {
const header = req.headers.authorization || "";
if (!header.startsWith("Bearer ")) {
return res.status(401).json({ message: "Unauthorized" });
}
try {
const token = header.split(" ")[1];
const payload = jwt.verify(token, env.JWT_SECRET);
req.user = payload; // { sub, role, name }
next();
} catch (e) {
return res.status(401).json({ message: "Invalid token" });
}
}

function requireRoles(...roles) {
return (req, res, next) => {
if (!req.user || !roles.includes(req.user.role)) {
return res.status(403).json({ message: "Forbidden" });
}
next();
};
}
module.exports = { requireAuth, requireRoles };