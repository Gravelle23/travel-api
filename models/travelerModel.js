const Joi = require("joi");

const travelerSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(7).max(20).allow("").optional(),
  preferredLanguage: Joi.string().min(2).allow("").optional(),
  isVIP: Joi.boolean().required()
});

module.exports = { travelerSchema };
