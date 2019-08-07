//Existing files Imports
const db = require('../../config/DBconfig')

exports.createMeetingAccepts = async function(x, y, z) {
  const task_id = x
  const meeting_id = y
  const invited_id = z

  //Inserting Meetings into Table
  const query = `INSERT INTO public.meetingsaccepts(task_id, meeting_id,invited_id) VALUES ($1, $2,$3) RETURNING *;`
  const values = [task_id, meeting_id, invited_id]

  //Query Excution
  const result = await db.query(query, values)

  return result.rows[0]
}

exports.checkMeetingAcceptsExists = async function(x, y, z) {
  const task_id = x
  const meeting_id = y
  const invited_id = z

  //Query/Values
  const query = `SELECT * FROM taskapplies WHERE task_id=$1 AND meeting_id=$2 AND invited_id=$3`
  const values = [task_id, meeting_id, invited_id]

  //Query Execution
  const result = await db.query(query, values)

  if (result.rows[0]) {
    return true
  } else {
    return false
  }
}

exports.freezeMeetingAccepts = async function(x, y, z) {
  const task_id = x
  const meeting_id = y
  const invited_id = z

  //Query/Values
  const query = `UPDATE meetingsaccepts SET frozen='true' WHERE task_id=$1 AND meeting_id=$2 AND invited_id=$3`
  const values = [task_id, meeting_id, invited_id]

  //Query Execution
  db.query(query, values)
}

exports.unfreezeMeetingAccepts = async function(x, y) {
  const task_id = x
  const meeting_id = y
  const invited_id = z

  //Query/Values
  const query = `UPDATE meetingsaccepts SET frozen='false' WHERE task_id=$1 AND meeting_id=$2 AND invited_id=$3`
  const values = [task_id, meeting_id, invited_id]

  //Query Execution
  db.query(query, values)
}

exports.checkMeetingAcceptsFrozen = async function(x, y, z) {
  const task_id = x
  const meeting_id = y
  const invited_id = z

  //Query/Values
  const query = `SELECT * FROM taskapplies WHERE task_id=$1 AND meeting_id=$2 AND invited_id=$3`
  const values = [task_id, meeting_id, invited_id]

  //Query Execution
  const result = await db.query(query, values)

  //Check if found or not
  if (result.rows[0].frozen) {
    return true
  } else {
    return false
  }
}

exports.confirmMeeting = async function(x, y, z) {
  const task_id = x
  const meeting_id = y
  const invited_id = z

  //Query/Values
  const query = `UPDATE public.taskapplies SET confirmed=true WHERE task_id=$1 AND meeting_id=$2 AND invited_id=$3 RETURNING *`
  const values = [task_id, meeting_id, invited_id]

  //Query Execution
  const result = await db.query(query, values)

  return result.rows[0]
}

exports.checkConfirmedAttend = async function(x, y, z) {
  const task_id = x
  const meeting_id = y
  const invited_id = z

  //Query/Values
  const query = `SELECT * FROM taskapplies WHERE task_id=$1 AND meeting_id=$2 AND invited_id=$3`
  const values = [task_id, meeting_id, invited_id]

  //Query Execution
  const result = await db.query(query, values)

  //Check if found or not
  if (result.rows[0].confirmed) {
    return true
  } else {
    return false
  }
}
