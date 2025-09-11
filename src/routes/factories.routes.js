const  {Router} = require('express')
const { requireAuth } = require("../middleware/auth");
const { createFactory } = require('../controllers/factory.controller');
const { body } = require("express-validator");

const router = Router()

router.post( "/", requireAuth, body("name").isString().isLength({ min: 2 }), (req,res,next)=>{
 return createFactory(req, res, next)
})

module.exports = router