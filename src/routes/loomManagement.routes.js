const  {Router} = require('express')
const { requireAuth } = require("../middleware/auth");
const {create, list, getLoom, deleteLoom, update} = require("../controllers/loomManagement.controller")
const router = Router()
router.post('/', requireAuth, create)
router.get('/', requireAuth, list)
router.get('/:id', requireAuth, getLoom)
router.delete('/:id', requireAuth, deleteLoom)
router.patch('/:id', requireAuth, update)

module.exports = router