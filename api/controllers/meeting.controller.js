//Existing files Imports
const db = require('../../config/DBconfig')
const meetingValidation = require('../../helpers/meeting.validation')

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
  const query = `SELECT TO_TIMESTAMP($1,'YYYY-MM-DD HH:MI:SS');`
  const values = [Meeting.start]
  const values2 = [Meeting.start]

  //Query Excution
  const result = await db.query(query, values)
  const result2 = await db.query(query, values2)

  //Inserting Meetings into Table
  const query1 = `INSERT INTO public.meetings(organizer_id, start, end) VALUES ($1, $2,$3) RETURNING *;`
  const values1 = [Meeting.organizer_id, result.rows[0].to_timestamp, result2.rows[0].to_timestamp]

  //Query Excution
  const result3 = await db.query(query1, values1)

  //Returning Created Meeting
  const createdMeeting = result3.rows[0]

  return createdMeeting
}

exports.editMeeting = async function(x) {
  const Meeting = x

  if (Meeting.start && Meeting.end) {
    //Query That transforms inputted time to timestamp readable in postgres
    const query = `SELECT TO_TIMESTAMP($1,'YYYY-MM-DD HH:MI:SS');`
    const values = [Meeting.start]
    const values2 = [Meeting.end]

    //Query Excution
    const result = await db.query(query, values)
    const result2 = await db.query(query, values2)

    //Query which updates a certain row
    const query1 = `UPDATE public.meetings SET start=$2,end=$3 WHERE id=$1 RETURNING *`
    const values1 = [Meeting.id, result.rows[0].to_timestamp, result2.rows[0].to_timestamp]

    //Query Excution
    const result1 = await db.query(query1, values1)

    //Returning Updated Meeting
    return result1.rows[0]
  } else {
    if (Meeting.start) {
      //Query That transforms inputted time to timestamp readable in postgres
      const query = `SELECT TO_TIMESTAMP($1,'YYYY-MM-DD HH:MI:SS');`
      const values = [Meeting.start]

      //Query Excution
      const result = await db.query(query, values)

      //Query which updates a certain row
      const query1 = `UPDATE public.meetings SET start=$2 WHERE id=$1 RETURNING *`
      const values1 = [Meeting.id, result.rows[0].to_timestamp]

      //Query Excution
      const result1 = await db.query(query1, values1)

      //Returning Updated Meeting
      return result1.rows[0]
    } else {
      if (Meeting.end) {
        //Query That transforms inputted time to timestamp readable in postgres
        const query = `SELECT TO_TIMESTAMP($1,'YYYY-MM-DD HH:MI:SS');`
        const values = [Meeting.end]

        //Query Excution
        const result = await db.query(query, values)

        //Query which updates a certain row
        const query1 = `UPDATE public.meetings SET end=$2 WHERE id=$1 RETURNING *`
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
  if (result.rows[0].frozen) {
    return true
  } else {
    return false
  }
}
