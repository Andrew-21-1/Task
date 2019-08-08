//Existing files Imports
const db = require('../../config/DBconfig')
const tokenKey = require('../../config/keys.js').secretOrKey
const userValidation = require('../validations/user.validation')

let cache = new Map()

//External packages Imports
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

//Create User Function(Insert Into Table)
exports.createUser = async function(x) {
  const User = x

  //Password Hashing
  const salt = bcrypt.genSaltSync(10)
  const cryptedPassword = bcrypt.hashSync(User.password, salt)
  User.password = cryptedPassword

  //Query/Values
  const query = `INSERT INTO public.users(email,username, password) VALUES ($1, $2, $3) RETURNING *`
  const values = [User.email, User.username, cryptedPassword]

  //Query Execution
  const result = await db.query(query, values)

  const createdUser = result.rows[0]
  return createdUser
}

exports.freezeUser = async function(x) {
  const id = x

  //Query/Values
  const query = `UPDATE users SET frozen='true' WHERE id=$1 RETURNING *`
  const values = [id]

  //Query Execution
  const result = await db.query(query, values)

  return result.rows[0]
}

exports.unfreezeUser = async function(x) {
  const id = x

  //Query/Values
  const query = `UPDATE users SET frozen='false' WHERE id=$1 RETURNING *`
  const values = [id]

  //Query Execution
  const result = await db.query(query, values)

  return result.rows[0]
}

exports.suspendUser = async function(x) {
  const id = x

  //Query/Values
  const query = `UPDATE users SET suspended='true' WHERE id=$1 RETURNING *`
  const values = [id]

  //Query Execution
  const result = await db.query(query, values)
  return result.rows[0]
}

exports.unsuspendUser = async function(x) {
  const id = x

  //Query/Values
  const query = `UPDATE users SET suspended='false' WHERE id=$1 RETURNING *`
  const values = [id]

  //Query Execution
  const result = await db.query(query, values)

  return result.rows[0]
}

exports.loginUser = async function(x) {
  //Needed constants in function
  let token = 'Bearer '
  const id = x
  let payload = {
    id: x
  }

  //Token Creation
  token = token + jwt.sign(payload, tokenKey, { expiresIn: '1h' })

  //caching token
  cache.set(id, token)

  //Return of generateted JWT Token
  return token
}

exports.checkEmail = async function(x) {
  const email = x

  //Query/Values
  const query = `SELECT * FROM users WHERE email=$1`
  const values = [email]

  //Query Execution
  const result = await db.query(query, values)

  //Check if found or not
  if (result.rows[0]) {
    return true
  } else {
    return false
  }
}

exports.checkUsername = async function(x) {
  const username = x

  //Query/Values
  const query = `SELECT * FROM users WHERE username=$1`
  const values = [username]

  //Query Execution
  const result = await db.query(query, values)

  //Check if found or not
  if (result.rows[0]) {
    return true
  } else {
    return false
  }
}

exports.checkUserFrozen = async function(x) {
  const id = x

  //Query/Values
  const query = `SELECT * FROM users WHERE id=$1`
  const values = [id]

  //Query Execution
  const result = await db.query(query, values)

  //Check if found or not
  if (result.rows[0] != null)
    if (result.rows[0].frozen) {
      return true
    } else {
      return false
    }
}

exports.checkUserSuspended = async function(x) {
  const id = x

  //Query/Values
  const query = `SELECT * FROM users WHERE id=$1`
  const values = [id]

  //Query Execution
  const result = await db.query(query, values)

  //Check if found or not
  if (result.rows[0] != null)
    if (result.rows[0].suspended) {
      return true
    } else {
      return false
    }
}

exports.checkLogin = async function(x, y) {
  let cryptedPassword
  const username = x
  const password = y

  //Query/Values
  const query = `SELECT * FROM users WHERE username=$1`
  const values = [username]

  //Query Execution
  const result = await db.query(query, values)

  if (result.rows[0] != null) {
    cryptedPassword = result.rows[0].password
    if (bcrypt.compareSync(password, cryptedPassword)) {
      return { userId: result.rows[0].id, error: '', flag: true }
    } else {
      return { errorid: 1, error: 'Incorrect Password', flag: false }
    }
  } else {
    return { errorid: 2, error: 'Incorrect Username', flag: false }
  }
}

exports.checkUserExists = async function(x) {
  const id = x

  //Query/Values
  const query = `SELECT * FROM users WHERE id=$1`
  const values = [id]

  //Query Execution
  const result = await db.query(query, values)

  if (result.rows[0]) {
    return true
  } else {
    return false
  }
}

exports.validateUser = async function(x) {
  const isValidated = userValidation.createValidation(x)
  if (isValidated.error) {
    return { error: isValidated.error.details[0].message, validated: false }
  } else {
    return true
  }
}

exports.checkLoggedIn = async function(x) {
  const id = x

  const loginFlag = cache.get(id)
  if (loginFlag != null) {
    return true
  } else {
    return false
  }
}
