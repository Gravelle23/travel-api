const Joi = require("joi");

const bookingSchema = Joi.object({
  destinationId: Joi.string().required(), 
  travelerId: Joi.string().required(),    
  startDate: Joi.string().isoDate().required(),
  endDate: Joi.string().isoDate().required(),
  totalPriceUSD: Joi.number().min(0).required(),
  status: Joi.string()
    .valid("Pending", "Confirmed", "Cancelled")
    .required(),
  notes: Joi.string().allow("").optional()
});

module.exports = { bookingSchema };
