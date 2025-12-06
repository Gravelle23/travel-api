const Joi = require("joi");

const destinationSchema = Joi.object({
  name: Joi.string().min(2).required(),
  country: Joi.string().min(2).required(),
  city: Joi.string().min(2).required(),
  description: Joi.string().allow("").optional(),
  rating: Joi.number().min(0).max(5).required(),
  averageCostUSD: Joi.number().min(0).required(),
  bestSeason: Joi.string()
    .valid("Spring", "Summer", "Fall", "Winter", "All year")
    .required(),
  isFamilyFriendly: Joi.boolean().required(),
});

module.exports = { destinationSchema };
