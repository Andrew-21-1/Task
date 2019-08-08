const taskFunctions = require('../../helpers/funtions/task.function')
const appliesFunctions = require('../../helpers/funtions/taskApplies.function')
const submissionValidation = require('../../helpers/validations/task.validation')

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
  let newTask
  if (Task.deadline && Task.topic) {
    newTask = {
      topic: Task.topic,
      deadline: Task.deadline
    }
  } else {
    if (Task.deadline) {
      newTask = {
        deadline: Task.deadline
      }
    } else {
      if (Task.topic) {
        newTask = {
          topic: Task.topic
        }
      }
    }
  }
  const checkFrozen = await taskFunctions.checkTaskFrozen(id)

  if (checkFrozen) {
    res.json({
      header: {
        statusCode: '1010',
        requestId: 'A-123',
        timestamp: new Date()
      },
      msg: 'Table Row is Frozen'
    })
  }
  const deadline = await taskFunctions.checkDeadline(Task.deadline)

  const result = await taskFunctions.validateUpdateTask(newTask)
  if (result == true) {
    if (Task.deadline) {
      if (!deadline) {
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
    const editTask = await taskFunctions.editTask(Task)
    res.json({
      header: {
        statusCode: '0000',
        requestId: 'A-123',
        timestamp: new Date()
      },
      msg: 'Task Updated successfully',
      body: editTask
    })
  } else {
    res.json({
      header: {
        statusCode: '2014',
        requestId: 'A-123',
        timestamp: new Date()
      },
      msg: result.error,
      body: newTask
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
      msg: 'Row in table Task with id ' + id + ' is now Unfrozen',
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

exports.confirmTask = async (req, res) => {
  const id = req.body.body.id

  const checkTaskFrozen = await taskFunctions.checkTaskFrozen(id)
  if (!checkTaskFrozen) {
    const checkTaskConfirmed = await taskFunctions.checkConfirmed(id)
    if (!checkTaskConfirmed) {
      const confirmTask = await taskFunctions.confirmTask(id)
      res.json({
        header: {
          statusCode: '0000',
          requestId: 'A-123',
          timestamp: new Date()
        },
        msg: 'Task confirmed after submission',
        body: confirmTask
      })
    } else {
      res.json({
        header: {
          statusCode: '2022',
          requestId: 'A-123',
          timestamp: new Date()
        },
        msg: 'Task Already confirmed'
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

exports.viewMyTasks = async (req, res) => {
  const { limits, offset, id } = req.body.body

  const Tasks = await taskFunctions.viewMyTasks(limits, offset, id)

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

exports.applyTask = async (req, res) => {
  const { applicant_id, task_id } = req.body.body

  const checkApplyFrozen = await appliesFunctions.checkTaskApplyFrozen(task_id, applicant_id)
  const checkApplyExist = await appliesFunctions.checkTaskAppliesExists(task_id, applicant_id)

  if (!checkApplyFrozen) {
    if (!checkApplyExist) {
      const createTaskApp = await appliesFunctions.createTaskApplies(task_id, applicant_id)
      res.json({
        header: {
          statusCode: '0000',
          requestId: 'A-123',
          timestamp: new Date()
        },
        msg: 'Applicant has been accepted to Task',
        body: createTaskApp
      })
    } else {
      res.json({
        header: {
          statusCode: '2024',
          requestId: 'A-123',
          timestamp: new Date()
        },
        msg: 'You have Already Applied for this Task'
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
}

exports.submitTask = async (req, res) => {
  const id = req.body.body.id
  const submit = {
    submission: req.body.body.submission
  }

  const checkTaskFrozen = await taskFunctions.checkTaskFrozen(id)
  const checkAssigned = await taskFunctions.checkAssigned(id)
  const checkConfirmed = await taskFunctions.checkConfirmed(id)
  const checkPassedDeadline = await taskFunctions.checkDeadlinePassed(id)

  if (!checkTaskFrozen) {
    if (!checkPassedDeadline) {
      if (checkAssigned) {
        if (!checkConfirmed) {
          const isValidated = submissionValidation.submissionValidation(submit)
          if (isValidated.error)
            res.json({
              header: {
                statusCode: '2014',
                requestId: 'A-123',
                timestamp: new Date()
              },
              msg: isValidated.error.details[0].message,
              body: {
                submission: req.body.body.submission
              }
            })
          const Submission = await taskFunctions.submitTask(req.body.body)
          res.json({
            header: {
              statusCode: '0000',
              requestId: 'A-123',
              timestamp: new Date()
            },
            msg: 'Task Submitted successfully',
            body: Submission
          })
        } else {
          res.json({
            header: {
              statusCode: '2022',
              requestId: 'A-123',
              timestamp: new Date()
            },
            msg: 'Task Already Confirmed cannot change submission'
          })
        }
      } else {
        res.json({
          header: {
            statusCode: '2030',
            requestId: 'A-123',
            timestamp: new Date()
          },
          msg: 'This Task hasnt been assigned yet'
        })
      }
    } else {
      res.json({
        header: {
          statusCode: '2025',
          requestId: 'A-123',
          timestamp: new Date()
        },
        msg: 'Submission deadline has passed'
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

exports.freezeTaskApply = async (req, res) => {
  const { task_id, applicants_id } = req.body.body

  const checkFrozen = await appliesFunctions.checkTaskApplyFrozen(task_id, applicants_id)

  if (!checkFrozen) {
    const freeze = await appliesFunctions.freezeTaskApply(task_id, applicants_id)
    res.json({
      header: {
        statusCode: '0000',
        requestId: 'A-123',
        timestamp: new Date()
      },
      msg: 'Row in table TaskApplies is now Frozen',
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

exports.unfreezeTaskApply = async (req, res) => {
  const { task_id, applicants_id } = req.body.body

  const checkFrozen = await appliesFunctions.checkTaskApplyFrozen(task_id, applicants_id)

  if (checkFrozen) {
    const freeze = await appliesFunctions.unfreezeTaskApply(task_id, applicants_id)
    res.json({
      header: {
        statusCode: '0000',
        requestId: 'A-123',
        timestamp: new Date()
      },
      msg: 'Row in table TaskApplies is now Unfrozen',
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
