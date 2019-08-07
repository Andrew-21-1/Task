//Existing files Imports
const db = require('../../config/DBconfig')

exports.createTaskApplies = async function(x, y) {
  const task_id = x
  const applicants_id = y

  //Inserting Meetings into Table
  const query = `INSERT INTO public.taskapplies(task_id, applicants_id) VALUES ($1, $2) RETURNING *;`
  const values = [task_id, applicants_id]

  //Query Excution
  const result = await db.query(query, values)

  return result.rows[0]
}

exports.checkTaskAppliesExists = async function(x, y) {
  const task_id = x
  const applicants_id = y

  //Query/Values
  const query = `SELECT * FROM taskapplies WHERE task_id=$1 AND applicants_id=$2`
  const values = [task_id, applicants_id]

  //Query Execution
  const result = await db.query(query, values)

  if (result.rows[0]) {
    return true
  } else {
    return false
  }
}

exports.freezeTaskApply = async function(x, y) {
  const task_id = x
  const applicants_id = y

  //Query/Values
  const query = `UPDATE taskapplies SET frozen='true' WHERE task_id=$1 AND applicants_id=$2`
  const values = [task_id, applicants_id]

  //Query Execution
  db.query(query, values)
}

exports.unfreezeTaskApply = async function(x, y) {
  const task_id = x
  const applicants_id = y

  //Query/Values
  const query = `UPDATE taskapplies SET frozen='false' WHERE task_id=$1 AND applicants_id=$2`
  const values = [task_id, applicants_id]

  //Query Execution
  db.query(query, values)
}

exports.checkTaskApplyFrozen = async function(x, y) {
  const task_id = x
  const applicants_id = y

  //Query/Values
  const query = `SELECT * FROM taskapplies WHERE task_id=$1 AND applicants_id=$2`
  const values = [task_id, applicants_id]

  //Query Execution
  const result = await db.query(query, values)

  //Check if found or not
  if (result.rows[0].frozen) {
    return true
  } else {
    return false
  }
}
