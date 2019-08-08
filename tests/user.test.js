const functions = require('./userAxios')
const db = require('../config/DBconfig')
const scripts = require('../scripts/tables.script')

let id
let id2
let taskId

beforeAll(async done => {
  db.connect()
  await db.query(scripts.dropTables)
  await db.query(scripts.createTables)
  done()
})

test('Sign Up User', async () => {
  const body = {
    body: {
      email: 'anhi1111@gmail.com',
      password: '12345678910',
      username: 'A31-1'
    }
  }
  const user = await functions.signUpUser(body)
  const user1 = await functions.loginUser({
    body: {
      username: body.body.username,
      password: body.body.password
    }
  })
  expect(user1.data.body.token).toBeDefined
  id = user.data.body.id
})

test('Suspend User', async () => {
  const body = {
    body: {
      id: id
    }
  }
  const user = await functions.suspendUser(body)
  expect(user.data.body.supended).toBeTruthy
})
test('Unsuspend User', async () => {
  const body = {
    body: {
      id: id
    }
  }
  const user = await functions.unsuspendUser(body)
  expect(user.data.body.supended).toBeFalsy
})

test('Create Task', async () => {
  const body = {
    body: {
      assigner_id: id,
      topic: 'Hii Create a DB Plzzzz',
      deadline: '2029-08-03 22:59:20'
    }
  }
  const task = await functions.createTask(body)
  const task1 = await functions.viewMyTasks({
    body: {
      id: id
    }
  })
  expect(task.data.body.id).toEqual(task1.data.body[0].id)
  taskId = task.data.body.id
})

test('Edit Task', async () => {
  jest.setTimeout(30000)
  const body = {
    body: {
      id: taskId,
      topic: 'DB Plzzzz',
      deadline: '2029-08-28 22:59:20'
    }
  }
  const task = await functions.editTask(body)
  const task1 = await functions.viewMyTasks({
    body: {
      id: id
    }
  })
  expect(task.data.body.topic).toEqual(task1.data.body[0].topic)
  expect(task.data.body.deadline).toEqual(task1.data.body[0].deadline)
})

test('Sign Up User2', async () => {
  const body = {
    body: {
      email: 'an211hi1231111@gmail.com',
      password: '12345678910',
      username: 'hi21-1'
    }
  }
  const user = await functions.signUpUser(body)
  const user1 = await functions.loginUser({
    body: {
      username: body.body.username,
      password: body.body.password
    }
  })
  expect(user1.data.body.token).toBeDefined
  id2 = user.data.body.id
})

test('Apply on created Task', async () => {
  const body = {
    body: {
      applicant_id: id2,
      task_id: taskId
    }
  }
  const task = await functions.applyTask(body)
  const task1 = await functions.acceptApplicant(body)
  const task2 = await functions.viewMyTasks({
    body: {
      id: id
    }
  })

  expect(task2.data.body.confirmed).toBeTruthy
})
