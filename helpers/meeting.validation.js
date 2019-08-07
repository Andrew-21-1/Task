const Joi = require('joi')

module.exports = {
  createValidation: req => {
    const createMeetingSchema = {
      starts: Joi.date().required(),
      ends: Joi.date().required()
    }
    return Joi.validate(req, createMeetingSchema)
  },
  updateValidation: req => {
    const updateMeetingSchema = {
      starts: Joi.date(),
      ends: Joi.date()
    }
    return Joi.validate(req, updateMeetingSchema)
  }
}
