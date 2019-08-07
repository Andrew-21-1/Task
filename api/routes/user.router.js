const User = require('../controllers/user.controller')
const express = require('express')
const router = express.Router()

// const User1 = {
//   email: 'andrew.aswwwhr11111af@ymail.com',
//   username: 'andrewww1111ashraf',
//   password: '125378waas'
// }

// User.createUser(User1).then(res => {
//   console.log(res)
// })
// User.freezeUser(1)
// User.unfreezeUser(1)

// User.suspendUser(1)
// User.unsuspendUser(1)

// User.loginUser('AndrewAshraf1', 'AndrewAshraf').then(res => {
//   console.log(res)
// })
// User.checkEmail('andrew.ashraf@live.com').then(res => {
//   console.log(res)
// })

// User.checkUserFrozen(1).then(res => {
//   console.log(res)
// })

// User.checkUserSuspended(1).then(res => {
//   console.log(res)
// })

// User.validateUser(User1).then(res => {
//   console.log(res)
// })

module.exports = router
