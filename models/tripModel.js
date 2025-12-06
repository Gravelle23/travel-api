const Joi = require("joi");

const tripSchema = Joi.object({
  destinationId: Joi.string().required(), // convert to ObjectId in controller
  startDate: Joi.string().isoDate().required(),
  endDate: Joi.string().isoDate().required(),
  travelerName: Joi.string().min(2).required(),
  travelerCount: Joi.number().integer().min(1).required(),
  totalCostUSD: Joi.number().min(0).required(),
  notes: Joi.string().allow("").optional(),
});

module.exports = { tripSchema };
