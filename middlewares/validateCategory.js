const Joi = require("joi");
const { sendErrorResponse } = require("../utilities/sendResponse");
const formatJoiErrors = require("../utilities/formatJoiErrors");

const validateCategorySchema = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(1).max(255).required().messages({
      "string.base": "Title must be a string",
      "string.empty": "Title cannot be empty",
      "string.min": "Title must be at least 1 character long",
      "string.max": "Title must be at most 255 characters long",
      "any.required": "Title is a required field",
    }),

    description: Joi.string().allow(null, "").optional().messages({
      "string.base": "Description must be a string",
    }),
  });

  return schema.validate(data, { abortEarly: false }); // Capture all errors
};

const validateCategory = (req, res, next) => {
  const { error } = validateCategorySchema(req.body);
  if (error) {
    return sendErrorResponse(
      res,
      "Invalid category",
      400,
      formatJoiErrors(error)
    );
  }
  next();
};
module.exports = validateCategory;
