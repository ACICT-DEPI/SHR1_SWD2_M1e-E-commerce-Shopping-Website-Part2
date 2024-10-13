const Joi = require("joi");
const { sendErrorResponse } = require("../utilities/sendResponse");
const formatJoiErrors = require("../utilities/formatJoiErrors");

const validateCarouselSchema = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(1).max(255).required().messages({
      "string.base": "Title must be a string",
      "string.empty": "Title cannot be empty",
      "string.min": "Title must be at least 1 character long",
      "string.max": "Title must be at most 255 characters long",
      "any.required": "Title is a required field",
    }),

    description: Joi.string().min(1).max(255).required().messages({
      "string.base": "description must be a string",
      "string.empty": "description cannot be empty",
      "string.min": "description must be at least 1 character long",
      "string.max": "description must be at most 255 characters long",
      "any.required": "description is a required field",
    }),

    category: Joi.string().required().messages({
      "string.empty": "Category cannot be empty",
      "any.required": "Category is required!",
    }),

    buttonText: Joi.string().min(1).max(255).required().messages({
      "string.base": "buttonText must be a string",
      "string.empty": "buttonText cannot be empty",
      "string.min": "buttonText must be at least 1 character long",
      "string.max": "buttonText must be at most 255 characters long",
      "any.required": "buttonText is a required field",
    }),
  });

  return schema.validate(data, { abortEarly: false }); // Capture all errors
};

const validateUpdateCarouselSchema = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(1).max(255).messages({
      "string.base": "Title must be a string",
      "string.empty": "Title cannot be empty",
      "string.min": "Title must be at least 1 character long",
      "string.max": "Title must be at most 255 characters long",
    }),

    description: Joi.string().min(1).max(255).messages({
      "string.base": "description must be a string",
      "string.empty": "description cannot be empty",
      "string.min": "description must be at least 1 character long",
      "string.max": "description must be at most 255 characters long",
    }),

    category: Joi.string().messages({
      "string.empty": "Category cannot be empty",
    }),

    buttonText: Joi.string().min(1).max(255).messages({
      "string.base": "buttonText must be a string",
      "string.empty": "buttonText cannot be empty",
      "string.min": "buttonText must be at least 1 character long",
      "string.max": "buttonText must be at most 255 characters long",
    }),
  });

  return schema.validate(data, { abortEarly: false }); // Capture all errors
};

const validateCarousel = (req, res, next) => {
  const { error } = validateCarouselSchema(req.body);
  if (error) {
    return sendErrorResponse(
      res,
      "Invalid carousel",
      400,
      formatJoiErrors(error)
    );
  }
  next();
};

const validateUpdateCarousel = (req, res, next) => {
  const { error } = validateUpdateCarouselSchema(req.body);
  if (error) {
    return sendErrorResponse(
      res,
      "Invalid carousel",
      400,
      formatJoiErrors(error)
    );
  }
  next();
};
module.exports = { validateCarousel, validateUpdateCarousel };
