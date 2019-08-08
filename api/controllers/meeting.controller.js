const meetingFunctions = require('../../helpers/funtions/meeting.function')
const taskFunctions = require('../../helpers/funtions/task.function')
const meetingAcceptsFunctions = require('../../helpers/funtions/meetingAccepts.function')

exports.createMeeting = async (req, res) => {
  const Meeting = req.body.body
  const { starts, ends, tasks } = req.body.body
  const newMeeting = {
    starts: starts,
    ends: ends
  }
  if (tasks != null) {
    if (Array(tasks).length == 0) {
      res.json({
        header: {
          statusCode: '3033',
          requestId: 'A-123',
          timestamp: new Date()
        },
        msg: 'Must Insert Task Ids Discussions in form [] that will be discussed in the Meeting'
      })
    }
  } else {
    res.json({
      header: {
        statusCode: '3033',
        requestId: 'A-123',
        timestamp: new Date()
      },
      msg: 'Must Insert Task Ids Discussions in form [] that will be discussed in the Meeting'
    })
  }

  for (let i = 0; tasks.length > i; i++) {
    const taskExists = await taskFunctions.checkTaskExists(tasks[i])
    if (!taskExists) {
      res.json({
        header: {
          statusCode: '2016',
          requestId: 'A-123',
          timestamp: new Date()
        },
        msg: 'Task with Id ' + tasks[i] + ' does not exist'
      })
    }
  }

  const startBeforeCurrent = await meetingFunctions.checkDate(starts)
  const endBeforeCurrent = await meetingFunctions.checkDate(ends)
  const compareStartEnd = await meetingFunctions.compareStartEnd(starts, ends)

  if (startBeforeCurrent) {
    if (endBeforeCurrent) {
      if (compareStartEnd) {
        const validateMeeting = await meetingFunctions.validateCreateMeeting(newMeeting)
        if (validateMeeting == true) {
          const createdMeeting = await meetingFunctions.createMeeting(Meeting)
          res.json({
            header: {
              statusCode: '0000',
              requestId: 'A-123',
              timestamp: new Date()
            },
            msg: 'Meeting Created successfully',
            body: createdMeeting
          })
        } else {
          res.json({
            header: {
              statusCode: '2014',
              requestId: 'A-123',
              timestamp: new Date()
            },
            msg: validateMeeting.error,
            body: {
              starts: validateMeeting.starts,
              ends: validateMeeting.ends
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
          msg: 'Meeting End Date is Behind Start Date',
          body: {
            ends: ends
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
        msg: 'Meeting End Date is Behind Current Date',
        body: {
          ends: ends
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
      msg: 'Meeting Start Date is Behind Current Date',
      body: {
        starts: starts
      }
    })
  }
}

exports.editMeeting = async (req, res) => {
  const Meeting = req.body.body
  const { id, starts, ends } = req.body.body

  let newMeeting
  if (Meeting.starts && Meeting.ends) {
    newMeeting = {
      starts: Meeting.starts,
      ends: Meeting.ends
    }
  } else {
    if (Meeting.starts) {
      newMeeting = {
        starts: Meeting.starts
      }
    } else {
      if (Meeting.ends) {
        newMeeting = {
          ends: Meeting.ends
        }
      }
    }
  }
  const checkFrozen = await meetingFunctions.checkMeetingFrozen(id)
  if (checkFrozen) {
    res.json({
      header: {
        statusCode: '1010',
        requestId: 'A-123',
        timestamp: new Date()
      },
      msg: 'Table Row is Frozen'
    })
    return
  }

  const result = await meetingFunctions.validateUpdateMeeting(newMeeting)
  if (result == true) {
    let startBeforeCurrent
    let endBeforeCurrent
    if (starts != null) {
      startBeforeCurrent = await meetingFunctions.checkDate(starts)
    }
    if (startBeforeCurrent == false) {
      res.json({
        header: {
          statusCode: '2012',
          requestId: 'A-123',
          timestamp: new Date()
        },
        msg: 'Meeting Start Date is Behind Current Date',
        body: {
          starts: starts
        }
      })
      return
    }
    if (ends != null) {
      endBeforeCurrent = await meetingFunctions.checkDate(ends)
    }
    if (endBeforeCurrent == false) {
      res.json({
        header: {
          statusCode: '2012',
          requestId: 'A-123',
          timestamp: new Date()
        },
        msg: 'Meeting End Date is Behind Current Date',
        body: {
          ends: ends
        }
      })
      return
    }
    const currentMeeting = meetingFunctions.getMeeting(Meeting.id)
    let compareStartEnd1
    let compareStartEnd2
    let compareStartEnd3
    if (Meeting.starts && Meeting.ends) {
      compareStartEnd1 = await meetingFunctions.compareStartEnd(starts, ends)
    } else {
      if (Meeting.starts) {
        compareStartEnd2 = await meetingFunctions.compareStartEnd(currentMeeting.ends, starts)
      } else {
        if (Meeting.ends) {
          compareStartEnd3 = await meetingFunctions.compareStartEnd(currentMeeting.starts, ends)
        }
      }
    }
    if (compareStartEnd1 == false) {
      res.json({
        header: {
          statusCode: '2012',
          requestId: 'A-123',
          timestamp: new Date()
        },
        msg: 'Newly inserted End Date is behind Newly Inserted Start Date',
        body: {
          starts: starts
        }
      })
      return
    }
    if (compareStartEnd2 == false) {
      res.json({
        header: {
          statusCode: '2012',
          requestId: 'A-123',
          timestamp: new Date()
        },
        msg: 'Current End Date is behind Newly inserted Start date',
        body: {
          starts: starts
        }
      })
      return
    }
    if (compareStartEnd3 == false) {
      res.json({
        header: {
          statusCode: '2012',
          requestId: 'A-123',
          timestamp: new Date()
        },
        msg: 'Newly inserted End Date is behind Current Start Date',
        body: {
          starts: starts
        }
      })
      return
    }
    const editMeeting = await meetingFunctions.editMeeting(Meeting)
    res.json({
      header: {
        statusCode: '0000',
        requestId: 'A-123',
        timestamp: new Date()
      },
      msg: 'Meeting Updated successfully',
      body: editMeeting
    })
    return
  } else {
    res.json({
      header: {
        statusCode: '2014',
        requestId: 'A-123',
        timestamp: new Date()
      },
      msg: result.error,
      body: newMeeting
    })
    return
  }
}

exports.confirmMeeting = async (req, res) => {
  const { task_id, meeting_id, invited_id } = req.body.body

  const checkFrozen = await meetingAcceptsFunctions.checkMeetingAcceptsFrozen(task_id, meeting_id, invited_id)
  const checkConfirmedAttend = await meetingAcceptsFunctions.checkConfirmedAttend(task_id, meeting_id, invited_id)

  if (!checkFrozen) {
    if (!checkConfirmedAttend) {
      const Confirm = await meetingAcceptsFunctions.confirmMeeting(task_id, meeting_id, invited_id)
      res.json({
        header: {
          statusCode: '0000',
          requestId: 'A-123',
          timestamp: new Date()
        },
        msg: 'Meeting Attendance Confirmed successfully',
        body: Confirm
      })
    } else {
      res.json({
        header: {
          statusCode: '1010',
          requestId: 'A-123',
          timestamp: new Date()
        },
        msg: 'Already Confirmed Attendance'
      })
    }
  } else {
    res.json({
      header: {
        statusCode: '1010',
        requestId: 'A-123',
        timestamp: new Date()
      },
      msg: 'Table Row is Frozen'
    })
  }
}

exports.freezeMeeting = async (req, res) => {
  const id = req.body.body.id

  const checkFrozen = await meetingFunctions.checkMeetingFrozen(id)

  if (!checkFrozen) {
    const freeze = await meetingFunctions.freezeMeeting(id)
    res.json({
      header: {
        statusCode: '0000',
        requestId: 'A-123',
        timestamp: new Date()
      },
      msg: 'Row in table Meeting with id ' + id + ' is now Frozen',
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

exports.unfreezeMeeting = async (req, res) => {
  const id = req.body.body.id

  const checkFrozen = await meetingFunctions.checkMeetingFrozen(id)

  if (checkFrozen) {
    const freeze = await meetingFunctions.unfreezeMeeting(id)
    res.json({
      header: {
        statusCode: '0000',
        requestId: 'A-123',
        timestamp: new Date()
      },
      msg: 'Row in table Meeting with id ' + id + ' is now Unfrozen',
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

exports.freezeMeetingAccepts = async (req, res) => {
  const { task_id, meeting_id, invited_id } = req.body.body

  const checkFrozen = await meetingAcceptsFunctions.checkMeetingAcceptsFrozen(task_id, meeting_id, invited_id)

  if (!checkFrozen) {
    const freeze = await meetingAcceptsFunctions.freezeMeetingAccepts(task_id, meeting_id, invited_id)
    res.json({
      header: {
        statusCode: '0000',
        requestId: 'A-123',
        timestamp: new Date()
      },
      msg: 'Row in table MeetingAccepts is now Frozen',
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

exports.unfreezeMeetingAccepts = async (req, res) => {
  const { task_id, meeting_id, invited_id } = req.body.body

  const checkFrozen = await meetingAcceptsFunctions.checkMeetingAcceptsExists(task_id, meeting_id, invited_id)

  if (!checkFrozen) {
    const freeze = await meetingAcceptsFunctions.unfreezeMeetingAccepts(task_id, meeting_id, invited_id)
    res.json({
      header: {
        statusCode: '0000',
        requestId: 'A-123',
        timestamp: new Date()
      },
      msg: 'Row in table MeetingAccepts is now Unfrozen',
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
