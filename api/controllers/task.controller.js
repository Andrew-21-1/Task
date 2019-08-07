const taskFunctions = require('../../helpers/funtions/task.function')
const appliesFunctions = require('../../helpers/funtions/taskApplies.function')

exports.createTask = async (req, res) => {
  const Task = req.body.body
  const newTask = {
    topic: Task.topic,
    deadline: Task.deadline
  }

  const deadline = await taskFunctions.checkDeadline(Task.deadline)

  if (deadline) {
    const result = await taskFunctions.validateCreateTask(newTask)
    if (result == true) {
      const createdTask = await taskFunctions.createTask(Task)
      res.json({
        header: {
          statusCode: '0000',
          requestId: 'A-123',
          timestamp: new Date()
        },
        msg: 'Task Created successfully',
        body: createdTask
      })
    } else {
      res.json({
        header: {
          statusCode: '2014',
          requestId: 'A-123',
          timestamp: new Date()
        },
        msg: result.error,
        body: {
          topic: result.topic,
          deadline: result.deadline
        }
      })
    }
  } else {
    res.json({
      header: {
        statusCode: '2012',
        requestId: 'A-123',
        timestamp: new Date()
      },
      msg: 'Deadline is Behind Current Date',
      body: {
        deadline: Task.deadline
      }
    })
  }
}

exports.editTask = async (req, res) => {
  const Task = req.body.body
  const newTask = {
    topic: Task.topic,
    deadline: Task.deadline
  }

  const deadline = await taskFunctions.checkDeadline(Task.deadline)

  if (deadline) {
    const result = await taskFunctions.validateUpdateTask(newTask)
    if (result == true) {
      const createdTask = await taskFunctions.editTask(Task)
      res.json({
        header: {
          statusCode: '0000',
          requestId: 'A-123',
          timestamp: new Date()
        },
        msg: 'Task Updated successfully',
        body: createdTask
      })
    } else {
      res.json({
        header: {
          statusCode: '2014',
          requestId: 'A-123',
          timestamp: new Date()
        },
        msg: result.error,
        body: {
          topic: result.topic,
          deadline: result.deadline
        }
      })
    }
  } else {
    res.json({
      header: {
        statusCode: '2012',
        requestId: 'A-123',
        timestamp: new Date()
      },
      msg: 'Deadline is Behind Current Date',
      body: {
        deadline: Task.deadline
      }
    })
  }
}

exports.freezeTask = async (req, res) => {
  const id = req.body.body.id

  const checkFrozen = await taskFunctions.checkTaskFrozen(id)

  if (!checkFrozen) {
    const freeze = await taskFunctions.freezeTask(id)
    res.json({
      header: {
        statusCode: '0000',
        requestId: 'A-123',
        timestamp: new Date()
      },
      msg: 'Row in table Task with id ' + id + ' is now Frozen',
      body: freeze
    })
  } else {
    res.json({
      header: {
        statusCode: '1010',
        requestId: 'A-123',
        timestamp: new Date()
      },
      msg: 'Table Row is already Frozen'
    })
  }
}

exports.unfreezeTask = async (req, res) => {
  const id = req.body.body.id

  const checkFrozen = await taskFunctions.checkTaskFrozen(id)

  if (checkFrozen) {
    const freeze = await taskFunctions.unfreezeTask(id)
    res.json({
      header: {
        statusCode: '0000',
        requestId: 'A-123',
        timestamp: new Date()
      },
      msg: 'Row in table Task with id ' + id + ' is now Frozen',
      body: freeze
    })
  } else {
    res.json({
      header: {
        statusCode: '1010',
        requestId: 'A-123',
        timestamp: new Date()
      },
      msg: 'Table Row is already Unfrozen'
    })
  }
}

exports.acceptApplicant = async (req, res) => {
  const { applicant_id, task_id } = req.body.body

  const checkTaskFrozen = await taskFunctions.checkTaskFrozen(task_id)
  const checkApplyFrozen = await appliesFunctions.checkTaskApplyFrozen(task_id, applicant_id)

  if (!checkTaskFrozen) {
    if (!checkApplyFrozen) {
      const checkApplyExist = await appliesFunctions.checkTaskAppliesExists(task_id, applicant_id)
      if (checkApplyExist) {
        const acceptApplicant = await taskFunctions.acceptApplicant(applicant_id, task_id)
        res.json({
          header: {
            statusCode: '0000',
            requestId: 'A-123',
            timestamp: new Date()
          },
          msg: 'Applicant has been accepted to Task',
          body: acceptApplicant
        })
      }
    } else {
      res.json({
        header: {
          statusCode: '1010',
          requestId: 'A-123',
          timestamp: new Date()
        },
        msg: 'Table TaskApplies Row is Frozen and unaccessable'
      })
    }
  } else {
    res.json({
      header: {
        statusCode: '1010',
        requestId: 'A-123',
        timestamp: new Date()
      },
      msg: 'Table Task Row is Frozen and unaccessable'
    })
  }
}

exports.viewTasks = async (req, res) => {
  const { limits, offset } = req.body.body

  const Tasks = await taskFunctions.viewAllTasks(limits, offset)

  res.json({
    header: {
      statusCode: '0000',
      requestId: 'A-123',
      timestamp: new Date()
    },
    msg: 'Tasks return with offset ' + offset + ' and limits ' + limits,
    body: Tasks
  })
}
