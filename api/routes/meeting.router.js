const Meeting = require('../controllers/meeting.controller')
const express = require('express')
const router = express.Router()

const Meeting2 = {
  organizer_id: 2,
  starts: '2019-08-06 18:59:20',
  ends: '2019-08-06 20:59:20',
  tasks: [3, 4, 5, 6]
}

Meeting.createMeeting(Meeting2).then(res => {
  console.log(res)
})

// Meeting.checkEnd('2019-08-07 23:59:20').then(res => {
//   console.log(res)
// })

// Meeting.validateCreateMeeting(Meeting2).then(res => {
//   console.log(res)
// })

// Meeting.editMeeting(Meeting2).then(res => {
//   console.log(res)
// })

// Meeting.freezeMeeting(1).

// Meeting.unfreezeMeeting(1)

// Meeting.checkMeetingFrozen(1).then(res => {
//   console.log(res)
// })

module.exports = router
