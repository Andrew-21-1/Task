const Task = require('../controllers/task.controller')
const express = require('express')
const router = express.Router()

// Task.checkDeadline(1)
// const Task2 = {
//   //  assigner_id: 1,
//   topic: 'Create a DBBBBB',
//   deadline: '2019-08-06 22:59:20'
// }

// Task.createTask(Task2).then(res => {
//   console.log(res)
// })

// const Task2 = {
//   id: 1,
//   topic: 'hi my name is andrew',
//   deadline: '2021-09-20 9:30:20'
// }

// Task.editTask(Task2).then(res => {
//   console.log(res)
// })

// Task.checkTaskExists(5).then(res => {
//   console.log(res)
// })

// Task.acceptApplicant(1, 1).then(res => {
//   console.log(res)
// })

// Task.confirmTask(1).then(res => {
//   console.log(res)
// })

// const Task2 = {
//   id: 1,
//   submission: 'This is my submission'
// }

// Task.submitTask(Task2).then(res => {
//   console.log(res)
// })

// Task.checkConfirmed(2).then(res => {
//   console.log(res)
// })

// Task.checkAssigned(1).then(res => {
//   console.log(res)
// })

// Task.checkDeadline('2019-08-07 1:30:20').then(res => {
//   console.log(res)
// })

// Task.validateCreateTask(Task2).then(res => {
//   console.log(res)
// })

module.exports = router
