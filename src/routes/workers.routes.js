const { Router } = require("express");
const { body } = require("express-validator");
const { createWorker, updateWorker, listWorkers} =
require("../controllers/workers.controller");
const { requireAuth, requireRoles } = require("../middleware/auth");
const router = Router();

const validateWorker = [
body("name").optional().isString().isLength({ min: 2 }),
body("role").optional().isIn(["admin", "manager", "operator", "warper"]),
body("email").optional().isEmail(),
body("password").optional().isString().isLength({ min: 6 }),
body("status").optional().isIn(["active", "inactive"]),
(req, res, next) => {
const { validationResult } = require("express-validator");
const errors = validationResult(req);
if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
next();
},
];

router.post("/", requireAuth, requireRoles("admin", "manager"), validateWorker,
createWorker);
router.put("/:id", requireAuth, requireRoles("admin", "manager"), validateWorker,
updateWorker);
router.get("/", requireAuth, requireRoles("admin", "manager"), listWorkers);


module.exports = router;
