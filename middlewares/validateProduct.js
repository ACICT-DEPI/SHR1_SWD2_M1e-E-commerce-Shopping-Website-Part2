const Joi = require("joi");
const { sendErrorResponse } = require("../utilities/sendResponse");
const formatJoiErrors = require("../utilities/formatJoiErrors");

const validateProductSchema = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(1).max(255).required().messages({
      "string.base": "Title must be a string",
      "string.empty": "Title cannot be empty",
      "string.min": "Title must be at least 1 character long",
      "string.max": "Title must be at most 255 characters long",
      "any.required": "Title is a required field",
    }),

    description: Joi.string().min(3).required().messages({
      "string.base": "Description must be a string",
      "string.empty": "Description cannot be empty",
      "string.min": "Description must be at least 3 character long",
      "any.required": "Description is a required field",
    }),

    excerpt: Joi.string().min(3).required().messages({
      "string.base": "Excerpt must be a string",
      "string.empty": "Excerpt cannot be empty",
      "string.min": "Excerpt must be at least 3 character long",
      "any.required": "Excerpt is a required field",
    }),

    price: Joi.number().positive().required().messages({
      "number.base": "Price must be a number",
      "number.positive": "Price must be a positive number",
      "any.required": "Price is a required field",
    }),

    discount: Joi.number().min(0).max(100).optional().default(0).messages({
      "number.base": "Discount must be a number",
      "number.min": "Discount must be at least 0",
      "number.max": "Discount must be at most 100",
    }),

    quantity: Joi.number().integer().min(0).required().messages({
      "number.base": "Quantity must be a number",
      "number.integer": "Quantity must be an integer",
      "number.min": "Quantity must be at least 0",
      "any.required": "Quantity is a required field",
    }),

    category: Joi.string().required().messages({
      "string.empty": "Category cannot be empty",
      "any.required": "Category is required!",
    }),
  });
  return schema.validate(data, { abortEarly: false }); // Capture all errors
};

const validateUpdateProductSchema = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(1).max(255).messages({
      "string.base": "Title must be a string",
      "string.empty": "Title cannot be empty",
      "string.min": "Title must be at least 1 character long",
      "string.max": "Title must be at most 255 characters long",
    }),

    description: Joi.string().min(3).messages({
      "string.base": "Description must be a string",
      "string.empty": "Description cannot be empty",
      "string.min": "Description must be at least 3 character long",
    }),

    excerpt: Joi.string().min(3).messages({
      "string.base": "Excerpt must be a string",
      "string.empty": "Excerpt cannot be empty",
      "string.min": "Excerpt must be at least 3 character long",
    }),

    price: Joi.number().positive().messages({
      "number.base": "Price must be a number",
      "number.positive": "Price must be a positive number",
    }),

    discount: Joi.number().min(0).max(100).optional().default(0).messages({
      "number.base": "Discount must be a number",
      "number.min": "Discount must be at least 0",
      "number.max": "Discount must be at most 100",
    }),

    quantity: Joi.number().integer().min(0).messages({
      "number.base": "Quantity must be a number",
      "number.integer": "Quantity must be an integer",
      "number.min": "Quantity must be at least 0",
    }),

    category: Joi.string().messages({
      "string.empty": "Category cannot be empty",
    }),
  });
  return schema.validate(data, { abortEarly: false }); // Capture all errors
};

const validateProduct = (req, res, next) => {
  const { error } = validateProductSchema(req.body);
  if (error) {
    return sendErrorResponse(
      res,
      "Invalid Product",
      400,
      formatJoiErrors(error)
    );
  }
  next();
};

const validateUpdateProduct = (req, res, next) => {
  const { error } = validateUpdateProductSchema(req.body);
  if (error) {
    return sendErrorResponse(
      res,
      "Invalid Product",
      400,
      formatJoiErrors(error)
    );
  }
  // Check if gallery contains null and handle it
  if (req.body.gallery === null) {
    delete req.body.gallery; // Optionally remove it from req.body to prevent updating in the DB
  }
  next();
};
module.exports = { validateProduct, validateUpdateProduct };
