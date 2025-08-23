const { Router } = require("express");
const { query } = require("express-validator");
const { requireAuth } = require("../middleware/auth");
const router = Router();

module.exports = router;