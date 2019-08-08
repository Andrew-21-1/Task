const axios = require('axios')

const functions = {
  signUpUser: async body => {
    const user = await axios.post('http://localhost:5000/api/users/signUp/v1/', body)
    return user
  },
  loginUser: async body => {
    const user = await axios.post('http://localhost:5000/api/users/signIn/v1/', body)
    return user
  },
  suspendUser: async body => {
    const user = await axios.post('http://localhost:5000/api/users/suspendUser/v1/', body)
    return user
  },
  unsuspendUser: async body => {
    const user = await axios.post('http://localhost:5000/api/users/unsuspendUser/v1/', body)
    return user
  },
  freezeUser: async body => {
    const user = await axios.post('http://localhost:5000/api/users/freezeUser/v1/', body)
    return user
  },
  unfreezeUser: async body => {
    const user = await axios.post('http://localhost:5000/api/users/unfreezeUser/v1/', body)
    return user
  },
  createTask: async body => {
    const task = await axios.post('http://localhost:5000/api/tasks/createTask/v1/', body)
    return task
  },
  editTask: async body => {
    const task = await axios.post('http://localhost:5000/api/tasks/editTask/v1/', body)
    return task
  },
  viewMyTasks: async body => {
    const task = await axios.post('http://localhost:5000/api/tasks/viewMyTasks/v1/', body)
    return task
  },
  applyTask: async body => {
    const task = await axios.post('http://localhost:5000/api/tasks/applyTask/v1/', body)
    return task
  },
  acceptApplicant: async body => {
    const task = await axios.post('http://localhost:5000/api/tasks/acceptApplicant/v1/', body)
    return task
  }
}

module.exports = functions
