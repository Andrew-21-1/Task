const meetingController = require('../controllers/meeting.controller')
const express = require('express')
const router = express.Router()

router.post('/createMeeting/v1', meetingController.createMeeting)
router.post('/editMeeting/v1', meetingController.editMeeting)
router.post('/confirmMeeting/v1', meetingController.confirmMeeting)
router.post('/freezeMeeting/v1', meetingController.freezeMeeting)
router.post('/unfreezeMeeting/v1', meetingController.unfreezeMeeting)

router.post('/freezeMeetingAccepts/v1', meetingController.freezeMeetingAccepts)
router.post('/unfreezeMeetingAccepts/v1', meetingController.unfreezeMeetingAccepts)

module.exports = router
