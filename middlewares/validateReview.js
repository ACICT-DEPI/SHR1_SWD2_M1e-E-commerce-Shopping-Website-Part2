const Joi = require("joi");
const { sendErrorResponse } = require("../utilities/sendResponse");
const formatJoiErrors = require("../utilities/formatJoiErrors");

const validateReviewSchema = (data) => {
  const schema = Joi.object({
    rating: Joi.number().integer().min(1).max(5).required().messages({
      "number.base": "Rating must be a number.",
      "number.min": "Rating must be at least 1.",
      "number.max": "Rating cannot exceed 5.",
      "any.required": "Rating is required.",
    }),
    comment: Joi.string().min(3).required().messages({
      "string.base": "Comment must be a string.",
      "string.empty": "Comment cannot be empty.",
      "string.min": "Comment must be at least 3 characters long.",
      "any.required": "Comment is required.",
    }),
  });
  return schema.validate(data, { abortEarly: false }); // Capture all errors
};

const validateUpdateReviewSchema = (data) => {
  const schema = Joi.object({
    rating: Joi.number().integer().min(1).max(5).messages({
      "number.base": "Rating must be a number.",
      "number.min": "Rating must be at least 1.",
      "number.max": "Rating cannot exceed 5.",
    }),
    comment: Joi.string().min(3).messages({
      "string.base": "Comment must be a string.",
      "string.empty": "Comment cannot be empty.",
      "string.min": "Comment must be at least 3 characters long.",
    }),
  });
  return schema.validate(data, { abortEarly: false }); // Capture all errors
};

const validateReview = (req, res, next) => {
  const { error } = validateReviewSchema(req.body);
  if (error) {
    return sendErrorResponse(
      res,
      "Invalid Review",
      400,
      formatJoiErrors(error)
    );
  }
  next();
};

const validateUpdateReview = (req, res, next) => {
  const { error } = validateUpdateReviewSchema(req.body);
  if (error) {
    return sendErrorResponse(
      res,
      "Invalid Review",
      400,
      formatJoiErrors(error)
    );
  }
  next();
};
module.exports = { validateReview, validateUpdateReview };
