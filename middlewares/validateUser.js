const Joi = require("joi");
const { sendErrorResponse } = require("../utilities/sendResponse");
const formatJoiErrors = require("../utilities/formatJoiErrors");

const validateUserSchema = (data) => {
  const schema = Joi.object({
    firstName: Joi.string()
      .pattern(/^[a-zA-Z]+$/)
      .min(2)
      .max(50)
      .required()
      .messages({
        "string.empty": "First name cannot be empty", // Added this for empty string validation
        "string.pattern.base":
          "First name should contain only alphabetic characters",
        "string.min": "First name should be at least 2 characters long",
        "string.max": "First name should be at most 50 characters long",
        "any.required": "First name is required",
      }),
    lastName: Joi.string()
      .pattern(/^[a-zA-Z\s]+$/)
      .min(3)
      .max(50)
      .required()
      .messages({
        "string.empty": "Last name cannot be empty", // Added this for empty string validation
        "string.pattern.base":
          "Last name should contain only alphabetic characters and spaces",
        "string.min": "Last name should be at least 3 characters long",
        "string.max": "Last name should be at most 50 characters long",
        "any.required": "Last name is required",
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
    password: Joi.string()
      .pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/)
      .required()
      .messages({
        "string.empty": "Password cannot be empty", // Added this for empty string validation
        "string.pattern.base":
          "Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character (@, $, !, %, &, ?, #, &).",
        "any.required": "Password is required",
      }),
  });
  return schema.validate(data, { abortEarly: false }); // Capture all errors
};

const validateUpdateUserSchema = (data) => {
  const schema = Joi.object({
    firstName: Joi.string()
      .pattern(/^[a-zA-Z]+$/)
      .min(2)
      .max(50)
      .messages({
        "string.empty": "First name cannot be empty", // Added this for empty string validation
        "string.pattern.base":
          "First name should contain only alphabetic characters",
        "string.min": "First name should be at least 2 characters long",
        "string.max": "First name should be at most 50 characters long",
      }),
    lastName: Joi.string()
      .pattern(/^[a-zA-Z\s]+$/)
      .min(3)
      .max(50)
      .messages({
        "string.empty": "Last name cannot be empty", // Added this for empty string validation
        "string.pattern.base":
          "Last name should contain only alphabetic characters and spaces",
        "string.min": "Last name should be at least 3 characters long",
        "string.max": "Last name should be at most 50 characters long",
      }),
    email: Joi.string()
      .pattern(/^\S+@\S+\.\S+$/)
      .messages({
        "string.empty": "Email cannot be empty", // Added this for empty string validation
        "string.pattern.base":
          "Email must be a valid email address and match the format: example@domain.com",
      }),
    phone: Joi.string()
      .trim()
      .pattern(/^[0-9]{10,15}$/)
      .messages({
        "string.base": "Phone number must be a string",
        "string.empty": "Phone number is required",
        "string.pattern.base":
          "Phone number must be valid, It must be contains only numbers between 10 and 15",
      }),
  });
  return schema.validate(data, { abortEarly: false }); // Capture all errors
};

const validateUser = (req, res, next) => {
  const { error } = validateUserSchema(req.body);
  if (error) {
    return sendErrorResponse(res, "Invalid User", 400, formatJoiErrors(error));
  }
  next();
};

const validateUpdateUser = (req, res, next) => {
  const { error } = validateUpdateUserSchema(req.body);
  if (error) {
    return sendErrorResponse(res, "Invalid User", 400, formatJoiErrors(error));
  }
  next();
};
module.exports = { validateUser, validateUpdateUser };
