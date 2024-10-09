const Joi = require("joi");
const { sendErrorResponse } = require("../utilities/sendResponse");
const formatJoiErrors = require("../utilities/formatJoiErrors");

const validateOrderSchema = (data) => {
  const schema = Joi.object({
    orderItems: Joi.any(),
    shippingAddress1: Joi.string().required().messages({
      "string.base": "Shipping address 1 must be a string.",
      "any.required": "Shipping address 1 is required.",
    }),

    shippingAddress2: Joi.string().optional().allow(null, "").messages({
      "string.base": "Shipping address 2 must be a string.",
    }),

    city: Joi.string().required().messages({
      "string.base": "City must be a string.",
      "any.required": "City is required.",
    }),

    zip: Joi.string().optional().messages({
      "string.base": "ZIP code must be a string.",
    }),

    country: Joi.string().required().messages({
      "string.base": "Country must be a string.",
      "any.required": "Country is required.",
    }),

    phone: Joi.string()
      .min(10)
      .max(15)
      .pattern(/^[0-9]{10,15}$/)
      .required()
      .messages({
        "string.base": "Phone number must be a string.",
        "string.min": "Phone number must be at least 10 digits.",
        "string.max": "Phone number must be no more than 15 digits.",
        "string.pattern.base": "Phone number must contain only digits.",
        "any.required": "Phone number is required.",
      }),

    status: Joi.string()
      .valid("Pending", "Shipped", "Completed", "Cancelled")
      .default("Pending")
      .messages({
        "any.only":
          "Status must be one of ['Pending', 'Shipped', 'Completed', 'Cancelled'].",
        "any.required": "Status is required.",
      }),
  });
  return schema.validate(data, { abortEarly: false }); // Capture all errors
};

const validateUpdateOrderSchema = (data) => {
  const schema = Joi.object({
    status: Joi.string()
      .valid("Pending", "Shipped", "Completed", "Cancelled")
      .default("Pending")
      .messages({
        "any.only":
          "Status must be one of ['Pending', 'Shipped', 'Completed', 'Cancelled'].",
        "any.required": "Status is required.",
      }),
  });
  return schema.validate(data, { abortEarly: false }); // Capture all errors
};

const validateOrder = (req, res, next) => {
  const { error } = validateOrderSchema(req.body);
  if (error) {
    return sendErrorResponse(res, "Invalid Order", 400, formatJoiErrors(error));
  }
  next();
};

const validateUpdateOrder = (req, res, next) => {
  const { error } = validateUpdateOrderSchema(req.body);
  if (error) {
    return sendErrorResponse(res, "Invalid Order", 400, formatJoiErrors(error));
  }
  next();
};
module.exports = { validateOrder, validateUpdateOrder };
