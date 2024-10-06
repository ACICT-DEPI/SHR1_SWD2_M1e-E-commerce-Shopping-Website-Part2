const Joi = require("joi");
const { sendErrorResponse } = require("../utilities/sendResponse");
const formatJoiErrors = require("../utilities/formatJoiErrors");

const validatePasswordSchema = (data) => {
  const schema = Joi.object({
    currentPassword: Joi.string().required().messages({
      "string.empty": "Current password cannot be empty",
      "any.required": "Current password is required",
    }),
    newPassword: Joi.string()
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

const validatePassword = (req, res, next) => {
  const { error } = validatePasswordSchema(req.body);
  if (error) {
    return sendErrorResponse(
      res,
      "Invalid Password",
      400,
      formatJoiErrors(error)
    );
  }
  next();
};

module.exports = { validatePassword };
