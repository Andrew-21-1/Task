const taskController = require('../controllers/task.controller')
const express = require('express')
const router = express.Router()

router.post('/createTask/v1', taskController.createTask)
router.post('/editTask/v1', taskController.editTask)
router.post('/freezeTask/v1', taskController.freezeTask)
router.post('/unfreezeTask/v1', taskController.unfreezeTask)
router.post('/acceptApplicant/v1', taskController.acceptApplicant)
router.post('/viewTasks/v1', taskController.viewTasks)
router.post('/viewMyTasks/v1', taskController.viewMyTasks)
router.post('/confirmTask/v1', taskController.confirmTask)
router.post('/applyTask/v1', taskController.applyTask)
router.post('/submitTask/v1', taskController.submitTask)

router.post('/freezeTaskApply/v1', taskController.freezeTaskApply)
router.post('/unfreezeTaskApply/v1', taskController.unfreezeTaskApply)

module.exports = router
