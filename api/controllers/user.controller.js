const userFunctions = require('../../helpers/funtions/user.function')

exports.signup = async (req, res) => {
  const { email, username } = req.body.body

  const emailCheck = await userFunctions.checkEmail(email)
  const usernameCheck = await userFunctions.checkUsername(username)
  if (!emailCheck) {
    if (!usernameCheck) {
      const result = await userFunctions.validateUser(req.body.body)
      if (result == true) {
        const createdUser = await userFunctions.createUser(req.body.body)
        const newUser = {
          email: createdUser.email,
          username: createdUser.username,
          suspended: createdUser.suspended,
          frozen: createdUser.frozen
        }
        res.json({
          header: {
            statusCode: '0000',
            requestId: 'A-123',
            timestamp: new Date()
          },
          msg: 'Account Created successfully',
          body: newUser
        })
      } else {
        res.json({
          header: {
            statusCode: '1005',
            requestId: 'A-123',
            timestamp: new Date()
          },
          msg: result.error,
          body: {
            username: username,
            email: email
          }
        })
      }
    } else {
      res.json({
        header: {
          statusCode: '1004',
          requestId: 'A-123',
          timestamp: new Date()
        },
        msg: 'Username Already in Use try a Diffrent Username',
        body: {
          username: username
        }
      })
    }
  } else {
    res.json({
      header: {
        statusCode: '1001',
        requestId: 'A-123',
        timestamp: new Date()
      },
      msg: 'Email Already in Use try a Diffrent Email',
      body: {
        email: email
      }
    })
  }
}

exports.signin = async (req, res) => {
  const { username, password } = req.body.body

  const checkLogin = await userFunctions.checkLogin(username, password)
  if (checkLogin.flag == true) {
    if (await userFunctions.checkUserFrozen(checkLogin.userId)) {
      res.json({
        header: {
          statusCode: '1010',
          requestId: 'A-123',
          timestamp: new Date()
        },
        msg: 'Table Row is Frozen and unaccessable'
      })
    }
    const checkLoggedin = await userFunctions.checkLoggedIn(checkLogin.userId)
    if (checkLoggedin) {
      res.json({
        header: {
          statusCode: '1032',
          requestId: 'A-123',
          timestamp: new Date()
        },
        msg: 'Already Logged In'
      })
    }
    if (await userFunctions.checkUserSuspended(checkLogin.userId)) {
      res.json({
        header: {
          statusCode: '1002',
          requestId: 'A-123',
          timestamp: new Date()
        },
        msg: 'Your Account is currently Suspended'
      })
    }
    const token = await userFunctions.loginUser(checkLogin.userId)
    res.json({
      header: {
        statusCode: '0000',
        requestId: 'A-123',
        timestamp: new Date()
      },
      msg: 'Sucessful Login',
      body: {
        token: token
      }
    })
  } else {
    if ((checkLogin.errorid = 1)) {
      res.json({
        header: {
          statusCode: '1008',
          requestId: 'A-123',
          timestamp: new Date()
        },
        msg: checkLogin.error
      })
    } else {
      res.json({
        header: {
          statusCode: '1009',
          requestId: 'A-123',
          timestamp: new Date()
        },
        msg: checkLogin.error
      })
    }
  }
}

exports.suspendUser = async (req, res) => {
  const id = req.body.body.id

  const checkFrozen = await userFunctions.checkUserFrozen(id)
  const checkSuspended = await userFunctions.checkUserSuspended(id)

  if (!checkFrozen) {
    if (!checkSuspended) {
      const suspend = await userFunctions.suspendUser(id)
      const updatedSuspend = {
        email: suspend.email,
        username: suspend.username,
        suspended: suspend.suspended,
        frozen: suspend.frozen
      }
      res.json({
        header: {
          statusCode: '0000',
          requestId: 'A-123',
          timestamp: new Date()
        },
        msg: suspend.username + ' Suspended',
        body: updatedSuspend
      })
    } else {
      res.json({
        header: {
          statusCode: '1002',
          requestId: 'A-123',
          timestamp: new Date()
        },
        msg: 'Account is currently Suspended'
      })
    }
  } else {
    res.json({
      header: {
        statusCode: '1010',
        requestId: 'A-123',
        timestamp: new Date()
      },
      msg: 'Table Row is Frozen and unaccessable'
    })
  }
}

exports.unsuspendUser = async (req, res) => {
  const id = req.body.body.id

  const checkFrozen = await userFunctions.checkUserFrozen(id)
  const checkSuspended = await userFunctions.checkUserSuspended(id)

  if (!checkFrozen) {
    if (checkSuspended) {
      const suspend = await userFunctions.unsuspendUser(id)
      const updatedSuspend = {
        email: suspend.email,
        username: suspend.username,
        suspended: suspend.suspended,
        frozen: suspend.frozen
      }
      res.json({
        header: {
          statusCode: '0000',
          requestId: 'A-123',
          timestamp: new Date()
        },
        msg: suspend.username + ' Unsuspended',
        body: updatedSuspend
      })
    } else {
      res.json({
        header: {
          statusCode: '1003',
          requestId: 'A-123',
          timestamp: new Date()
        },
        msg: 'Your Account is currently Unsuspended'
      })
    }
  } else {
    res.json({
      header: {
        statusCode: '1010',
        requestId: 'A-123',
        timestamp: new Date()
      },
      msg: 'Table Row is Frozen and unaccessable'
    })
  }
}

exports.freezeUser = async (req, res) => {
  const id = req.body.body.id

  const checkFrozen = await userFunctions.checkUserFrozen(id)

  if (!checkFrozen) {
    const freeze = await userFunctions.freezeUser(id)
    const updatedFreeze = {
      email: freeze.email,
      username: freeze.username,
      suspended: freeze.suspended,
      frozen: freeze.frozen
    }
    res.json({
      header: {
        statusCode: '0000',
        requestId: 'A-123',
        timestamp: new Date()
      },
      msg: 'Row in table User with id ' + freeze.id + ' is now Frozen',
      body: updatedFreeze
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

exports.unfreezeUser = async (req, res) => {
  const id = req.body.body.id

  const checkFrozen = await userFunctions.checkUserFrozen(id)

  if (checkFrozen) {
    const freeze = await userFunctions.unfreezeUser(id)
    const updatedFreeze = {
      email: freeze.email,
      username: freeze.username,
      suspended: freeze.suspended,
      frozen: freeze.frozen
    }
    res.json({
      header: {
        statusCode: '0000',
        requestId: 'A-123',
        timestamp: new Date()
      },
      msg: 'Row in table User with id ' + freeze.id + ' is now Unfrozen',
      body: updatedFreeze
    })
  } else {
    res.json({
      header: {
        statusCode: '1011',
        requestId: 'A-123',
        timestamp: new Date()
      },
      msg: 'Table Row is already Unfrozen'
    })
  }
}
