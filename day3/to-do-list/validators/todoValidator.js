const Joi = require('joi');

const todoSchema = Joi.object({
  title: Joi.string().required().messages({
    'string.empty': 'Title is required',
    'any.required': 'Title is required',
  }),
  description: Joi.string().optional(),
  completed: Joi.boolean().optional(),
  dueDate: Joi.date().iso().optional(),
});

module.exports = { todoSchema };