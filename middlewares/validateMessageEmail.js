const Joi = require("joi");
const { sendErrorResponse } = require("../utilities/sendResponse");
const formatJoiErrors = require("../utilities/formatJoiErrors");

const validateMessageSchema = (data) => {
  const schema = Joi.object({
    name: Joi.string()
      .pattern(/^[a-zA-Z\s]+$/)
      .min(3)
      .max(50)
      .required()
      .messages({
        "string.empty": "Name cannot be empty", // Added this for empty string validation
        "string.pattern.base":
          "Name should contain only alphabetic characters and spaces",
        "string.min": "Name should be at least 3 characters long",
        "string.max": "Name should be at most 50 characters long",
        "any.required": "Name is required",
      }),
    email: Joi.string()
      .pattern(/^\S+@\S+\.\S+$/)
      .required()
      .messages({
        "string.empty": "Email cannot be empty", // Added this for empty string validation
        "string.pattern.base":
          "Email must be a valid email address and match the format: example@domain.com",
        "any.required": "Email is required",
      }),
    phone: Joi.string()
      .trim()
      .pattern(/^[0-9]{10,15}$/)
      .required()
      .messages({
        "string.base": "Phone number must be a string",
        "string.empty": "Phone number is required",
        "string.pattern.base":
          "Phone number must be valid, It must be contains only numbers between 10 and 15",
        "any.required": "Phone number is required",
      }),
    message: Joi.string().min(3).required().messages({
      "string.empty": "Name cannot be empty", // Added this for empty string validation
      "string.min": "Name should be at least 3 characters long",
      "any.required": "Name is required",
    }),
  });
  return schema.validate(data, { abortEarly: false }); // Capture all errors
};

const validateMessage = (req, res, next) => {
  const { error } = validateMessageSchema(req.body);
  if (error) {
    return sendErrorResponse(
      res,
      "Invalid Message",
      400,
      formatJoiErrors(error)
    );
  }
  next();
};

module.exports = { validateMessage };
