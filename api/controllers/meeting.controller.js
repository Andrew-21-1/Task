const meetingFunctions = require('../../helpers/funtions/meeting.function')

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
      msg: 'Table Row is already Unfrozen'
    })
  }
}
