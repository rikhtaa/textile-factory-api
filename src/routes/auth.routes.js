const { Router } = require("express");
const { body } = require("express-validator");
const { register } = require("../controllers/auth.controller");
const { requireAuth } = require("../middleware/auth");
const router = Router();
// Public register only if no admin exists is enforced in controller.
// Keep requireAuth to allow admin-only for privileged after bootstrap:
// You may temporarily remove requireAuth to bootstrap first admin.
router.post(
"/register",
requireAuth,
body("name").isString().isLength({ min: 2 }),
body("email").optional().isEmail(),
body("password").optional().isString().isLength({ min: 6 }),
body("role").optional().isIn(["admin", "manager", "operator", "warper"]),
(req, res, next) => {
const { validationResult } = require("express-validator");
const errors = validationResult(req);
if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
return register(req, res, next);
}
);

module.exports = router;
