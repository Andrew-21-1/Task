const Joi = require('joi')

module.exports = {
  createValidation: req => {
    const createMeetingSchema = {
      start: Joi.date().required(),
      end: Joi.date().required()
    }
    return Joi.validate(req, createMeetingSchema)
  },
  updateValidation: req => {
    const updateMeetingSchema = {
      start: Joi.date(),
      end: Joi.date()
    }
    return Joi.validate(req, updateMeetingSchema)
  }
}
