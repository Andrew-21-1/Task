const userController = require('../controllers/user.controller')
const express = require('express')
const router = express.Router()

router.post('/signUp/v1', userController.signup)
router.post('/signIn/v1', userController.signin)
router.post('/suspendUser/v1', userController.suspendUser)
router.post('/unsuspendUser/v1', userController.unsuspendUser)
router.post('/freezeUser/v1', userController.freezeUser)
router.post('/unfreezeUser/v1', userController.unfreezeUser)

module.exports = router
