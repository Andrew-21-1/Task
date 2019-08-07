//importing packages
const pg = require('pg')
const express = require('express')
const cors = require('cors')
const passport = require('passport')

//importing files
const client = require('./config/DBconfig')
const tables = require('./scripts/tables.script')
const loggerMiddleware = require('./api/middleware/logger')

//intiating express app
const app = express()

// import route handlers
const users = require('./api/routes/user.router')
const meetings = require('./api/routes/meeting.router')
const tasks = require('./api/routes/task.router')

// init middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use(loggerMiddleware)
app.use(passport.initialize())

//Query that drops all tables
// client.query(tables.dropTables)

//Query that creates all tables
// client.query(tables.createTables)

client
  .connect()
  .then(() => {
    console.log('Connected to postgres 💪 .')
  })
  .catch(err => {
    console.error('Unable to connect to postgres 😳 .', err)
  })

// Direct to Route Handlers
app.use('/api/v1/users', users)
app.use('/api/v1/meetings', meetings)
app.use('/api/v1/tasks', tasks)

const port = 5000
app.listen(port, () => console.log(`Server up and running on ${port} 👍 .`))
