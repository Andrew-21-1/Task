//Existing files Imports
const db = require('../../config/DBconfig')
const taskValidation = require('../validations/task.validation')

//External packages Imports

exports.checkDeadline = async function(x) {
  let GivenDate = x

  //Getting todays current date/time
  let CurrentDate = new Date()
  GivenDate = new Date(GivenDate)

  //Comparing inputted time with current date/time
  if (GivenDate > CurrentDate) {
    return true
  } else {
    return false
  }
}

exports.checkDeadlinePassed = async function(x) {
  let id = x

  const query = `SELECT deadline FROM tasks WHERE id=$1`
  const values = [id]

  const result = await db.query(query, values)

  //Getting todays current date/time
  let CurrentDate = new Date()
  GivenDate = new Date(result.rows[0].deadline)

  //Comparing inputted time with current date/time
  if (GivenDate < CurrentDate) {
    return true
  } else {
    return false
  }
}

exports.createTask = async function(x) {
  const Task = x

  //Query That transforms inputted time to timestamp readable in postgres
  const query = `SELECT TO_TIMESTAMP($1,'YYYY-MM-DD HH24:MI:SS');`
  const values = [Task.deadline]

  //Query Excution
  const result = await db.query(query, values)

  //Inserting Task into Table
  const query1 = `INSERT INTO public.tasks(assigner_id, topic, deadline) VALUES ($1, $2,$3) RETURNING *;`
  const values1 = [Task.assigner_id, Task.topic, result.rows[0].to_timestamp]

  //Query Excution
  const result1 = await db.query(query1, values1)

  //Returning Created Task
  const createdTask = result1.rows[0]

  return createdTask
}

exports.editTask = async function(x) {
  const Task = x

  if (Task.topic && Task.deadline) {
    //Query That transforms inputted time to timestamp readable in postgres
    const query = `SELECT TO_TIMESTAMP($1,'YYYY-MM-DD HH24:MI:SS');`
    const values = [Task.deadline]

    //Query Excution
    const result = await db.query(query, values)

    //Query which updates a certain row
    const query1 = `UPDATE public.tasks SET topic=$2,deadline=$3 WHERE id=$1 RETURNING *`
    const values1 = [Task.id, Task.topic, result.rows[0].to_timestamp]

    //Query Excution
    const result1 = await db.query(query1, values1)

    //Returning Updated Task
    return result1.rows[0]
  } else {
    if (Task.topic) {
      //Query which updates a certain row
      const query = `UPDATE public.tasks SET topic=$2 WHERE id=$1 RETURNING *`
      const values = [Task.id, Task.topic]

      //Query Excution
      const result = await db.query(query, values)

      //Returning Updated Task
      return result.rows[0]
    } else {
      if (Task.deadline) {
        //Query That transforms inputted time to timestamp readable in postgres
        const query = `SELECT TO_TIMESTAMP($1,'YYYY-MM-DD HH24:MI:SS');`
        const values = [Task.deadline]

        //Query Excution
        const result = await db.query(query, values)

        //Query which updates a certain row
        const query1 = `UPDATE public.tasks SET deadline=$2 WHERE id=$1 RETURNING *`
        const values1 = [Task.id, result.rows[0].to_timestamp]

        //Query Excution
        const result1 = await db.query(query1, values1)

        //Query Excution
        return result1.rows[0]
      }
    }
  }
}

exports.checkTaskExists = async function(x) {
  const id = x

  //Query/Values
  const query = `SELECT * FROM tasks WHERE id=$1`
  const values = [id]

  //Query Execution
  const result = await db.query(query, values)

  if (result.rows[0]) {
    return true
  } else {
    return false
  }
}

exports.freezeTask = async function(x) {
  const id = x

  //Query/Values
  const query = `UPDATE tasks SET frozen='true' WHERE id=$1 RETURNING *`
  const values = [id]

  //Query Execution
  const result = await db.query(query, values)

  return result.rows[0]
}

exports.unfreezeTask = async function(x) {
  const id = x

  //Query/Values
  const query = `UPDATE tasks SET frozen='false' WHERE id=$1 RETURNING *`
  const values = [id]

  //Query Execution
  const result = await db.query(query, values)

  return result.rows[0]
}

exports.acceptApplicant = async function(x, y) {
  const applicants_id = x
  const task_id = y

  //Query/Values
  const query = `UPDATE public.tasks SET assignee_id=$1,assigned=true WHERE id=$2 RETURNING *`
  const values = [applicants_id, task_id]

  //Query Execution
  const result = await db.query(query, values)

  return result.rows[0]
}

exports.confirmTask = async function(x) {
  const id = x

  //Query/Values
  const query = `UPDATE public.tasks SET confirmed=true WHERE id=$1 RETURNING *`
  const values = [id]

  //Query Execution
  const result = await db.query(query, values)

  return result.rows[0]
}

exports.submitTask = async function(x) {
  const Submission = x

  //Query/Values
  const query = `UPDATE public.tasks SET submission=$2 WHERE id=$1 RETURNING *`
  const values = [Submission.id, Submission.submission]

  //Query Execution
  const result = await db.query(query, values)

  return result.rows
}

exports.viewApplicants = async function(x) {
  const id = x

  //Query/Values
  const query = `SELECT * FROM taskApplies WHERE task_id=$1 RETURNING *`
  const values = [id]

  //Query Execution
  const result = await db.query(query, values)

  return result.rows
}

exports.checkConfirmed = async function(x) {
  const id = x

  //Query/Values
  const query = `SELECT submission FROM tasks WHERE id=$1`
  const values = [id]

  //Query Execution
  const result = await db.query(query, values)

  //Check if found or not
  if (result.rows[0].submission) {
    return true
  } else {
    return false
  }
}

exports.checkAssigned = async function(x) {
  const id = x

  //Query/Values
  const query = `SELECT assigned FROM tasks WHERE id=$1`
  const values = [id]

  //Query Execution
  const result = await db.query(query, values)

  //Check if found or not
  if (result.rows[0].assigned) {
    return true
  } else {
    return false
  }
}

exports.checkTaskFrozen = async function(x) {
  const id = x

  //Query/Values
  const query = `SELECT * FROM tasks WHERE id=$1`
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

exports.checkSubmit = async function(x) {
  const id = x

  //Query/Values
  const query = `SELECT submission FROM tasks WHERE id=$1`
  const values = [id]

  //Query Execution
  const result = await db.query(query, values)

  //Check if found or not
  if (result.rows[0].submission) {
    return true
  } else {
    return false
  }
}

exports.validateCreateTask = async function(x) {
  //Joi validation Import
  const isValidated = taskValidation.createValidation(x)
  if (isValidated.error) {
    return { error: isValidated.error.details[0].message, validated: false }
  } else {
    return true
  }
}

exports.validateUpdateTask = async function(x) {
  //Joi validation Import
  const isValidated = taskValidation.updateValidation(x)
  if (isValidated.error) {
    return { error: isValidated.error.details[0].message, validated: false }
  } else {
    return true
  }
}

exports.viewAllTasks = async function(x, y) {
  const limit = x
  const offset = y

  //Query Execution
  const query = `SELECT * FROM tasks LIMIT $1 OFFSET $2`
  const values = [limit, offset]

  //Query Execution
  const result = await db.query(query, values)

  return result.rows
}

exports.viewMyTasks = async function(x, y, z) {
  const limit = x
  const offset = y
  const id = z

  //Query Execution
  const query = `SELECT * FROM tasks WHERE assigner_id=$3 LIMIT $1 OFFSET $2`
  const values = [limit, offset, id]

  //Query Execution
  const result = await db.query(query, values)

  return result.rows
}
