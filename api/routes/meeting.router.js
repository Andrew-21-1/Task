const meetingController = require('../controllers/meeting.controller')
const express = require('express')
const router = express.Router()

router.post('/freezeMeeting/v1', meetingController.freezeMeeting)
router.post('/unfreezeMeeting/v1', meetingController.unfreezeMeeting)

module.exports = router
