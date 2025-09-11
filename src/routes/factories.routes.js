const  {Router} = require('express')
const { requireAuth } = require("../middleware/auth");
const { createFactory, getFactory, deleteFactory, updateFactory } = require('../controllers/factory.controller');
const { body } = require("express-validator");

const router = Router()

router.post( "/", requireAuth, body("name").isString().isLength({ min: 2 }), createFactory)
router.get("/", requireAuth, getFactory)
router.delete("/:id", requireAuth, deleteFactory)
router.put("/:id", requireAuth, body("name").isString().isLength({ min: 2 }), updateFactory)
module.exports = router