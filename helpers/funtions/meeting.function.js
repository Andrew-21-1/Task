//Existing files Imports
const db = require('../../config/DBconfig')
const meetingValidation = require('../validations/meeting.validation')

//External packages Imports

exports.checkEnd = async function(x) {
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

exports.createMeeting = async function(x) {
  const Meeting = x

  //Query That transforms inputted time to timestamp readable in postgres
  const query = `SELECT TO_TIMESTAMP($1,'YYYY-MM-DD HH24:MI:SS');`
  const values = [Meeting.starts]
  const values2 = [Meeting.ends]

  //Query Excution
  const result = await db.query(query, values)
  const result2 = await db.query(query, values2)

  //Inserting Meetings into Table
  const query1 = `INSERT INTO public.meetings(organizer_id, starts, ends) VALUES ($1, $2,$3) RETURNING *;`
  const values1 = [Meeting.organizer_id, result.rows[0].to_timestamp, result2.rows[0].to_timestamp]

  //Query Excution
  const result3 = await db.query(query1, values1)

  //Returning Created Meeting
  const createdMeeting = result3.rows[0]

  for (let i = 0; Meeting.tasks.length > i; i++) {
    let y = Meeting.tasks[i]

    //Inserting Meetings into Table
    const query4 = `SELECT * FROM tasks WHERE id=$1`
    const values4 = [y]

    //Query Excution
    const result4 = await db.query(query4, values4)
    console.log(result4)

    if (result4.rows[0].assignee_id) {
      //Inserting Meetings into Table
      const query5 = `INSERT INTO public.meetingsaccepts(task_id, meeting_id,invited_id) VALUES ($1, $2,$3) RETURNING * ;`
      const values5 = [y, result3.rows[0].id, result4.rows[0].assignee_id]

      //Query Excution
      await db.query(query5, values5)
    }
  }

  return createdMeeting
}

exports.editMeeting = async function(x) {
  const Meeting = x

  if (Meeting.starts && Meeting.ends) {
    //Query That transforms inputted time to timestamp readable in postgres
    const query = `SELECT TO_TIMESTAMP($1,'YYYY-MM-DD HH24:MI:SS');`
    const values = [Meeting.starts]
    const values2 = [Meeting.ends]

    //Query Excution
    const result = await db.query(query, values)
    const result2 = await db.query(query, values2)

    //Query which updates a certain row
    const query1 = `UPDATE public.meetings SET starts=$2,ends=$3 WHERE id=$1 RETURNING *`
    const values1 = [Meeting.id, result.rows[0].to_timestamp, result2.rows[0].to_timestamp]

    //Query Excution
    const result1 = await db.query(query1, values1)

    //Returning Updated Meeting
    return result1.rows[0]
  } else {
    if (Meeting.starts) {
      //Query That transforms inputted time to timestamp readable in postgres
      const query = `SELECT TO_TIMESTAMP($1,'YYYY-MM-DD HH24:MI:SS');`
      const values = [Meeting.starts]

      //Query Excution
      const result = await db.query(query, values)

      //Query which updates a certain row
      const query1 = `UPDATE public.meetings SET starts=$2 WHERE id=$1 RETURNING *`
      const values1 = [Meeting.id, result.rows[0].to_timestamp]

      //Query Excution
      const result1 = await db.query(query1, values1)

      //Returning Updated Meeting
      return result1.rows[0]
    } else {
      if (Meeting.ends) {
        //Query That transforms inputted time to timestamp readable in postgres
        const query = `SELECT TO_TIMESTAMP($1,'YYYY-MM-DD HH24:MI:SS');`
        const values = [Meeting.ends]

        //Query Excution
        const result = await db.query(query, values)

        //Query which updates a certain row
        const query1 = `UPDATE public.meetings SET ends=$2 WHERE id=$1 RETURNING *`
        const values1 = [Meeting.id, result.rows[0].to_timestamp]

        //Query Excution
        const result1 = await db.query(query1, values1)

        //Query Excution
        return result1.rows[0]
      }
    }
  }
}

exports.freezeMeeting = async function(x) {
  const id = x

  //Query/Values
  const query = `UPDATE meetings SET frozen='true' WHERE id=$1`
  const values = [id]

  //Query Execution
  db.query(query, values)
}

exports.unfreezeMeeting = async function(x) {
  const id = x

  //Query/Values
  const query = `UPDATE meetings SET frozen='false' WHERE id=$1`
  const values = [id]

  //Query Execution
  db.query(query, values)
}

exports.validateCreateMeeting = async function(x) {
  //Joi validation Import
  const isValidated = meetingValidation.createValidation(x)
  if (isValidated.error) {
    return { error: isValidated.error.details[0].message, validated: false }
  } else {
    return true
  }
}

exports.validateUpdateMeeting = async function(x) {
  //Joi validation Import
  const isValidated = meetingValidation.updateValidation(x)
  if (isValidated.error) {
    return { error: isValidated.error.details[0].message, validated: false }
  } else {
    return true
  }
}

exports.checkMeetingFrozen = async function(x) {
  const id = x

  //Query/Values
  const query = `SELECT * FROM meetings WHERE id=$1`
  const values = [id]

  //Query Execution
  const result = await db.query(query, values)

  //Check if found or not
  if (result.rows[0] != null) {
    if (result.rows[0].frozen) {
      return true
    } else {
      return false
    }
  } else return null
}
