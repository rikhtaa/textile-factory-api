const { Router } = require("express");
const { body } = require("express-validator");
const {createLoom, listLooms} =
require("../controllers/looms.controller");
const { requireAuth, requireRoles } = require("../middleware/auth");
const router = Router();

const validateLoom = [
body("loomNumber").isString().notEmpty(),
body("section").optional().isString(),
body("status").optional().isIn(["active", "inactive"]),
body("beamInfo").optional().isString(),
(req, res, next) => {
const { validationResult } = require("express-validator");
const errors = validationResult(req);
if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
next();
},
];

router.post("/", requireAuth, requireRoles("admin", "manager"), validateLoom,
createLoom);
router.get("/", requireAuth, listLooms);

module.exports = router;
