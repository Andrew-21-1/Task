const Joi = require('joi')

module.exports = {
  createValidation: req => {
    const createTaskSchema = {
      topic: Joi.string()
        .min(5)
        .required(),
      deadline: Joi.date().required()
    }
    return Joi.validate(req, createTaskSchema)
  },
  updateValidation: req => {
    const updateTaskSchema = {
      topic: Joi.string().min(5),
      deadline: Joi.date()
    }
    return Joi.validate(req, updateTaskSchema)
  }
}
