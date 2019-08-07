const Joi = require('joi')

module.exports = {
  createValidation: req => {
    const createUserSchema = {
      username: Joi.string()
        .min(3)
        .required(),
      email: Joi.string()
        .regex(/[a-z0-9\.\_\-]+\@[a-z]/)
        .required(),

      password: Joi.string()
        .min(8)
        .required()
    }
    return Joi.validate(req, createUserSchema)
  }
}
