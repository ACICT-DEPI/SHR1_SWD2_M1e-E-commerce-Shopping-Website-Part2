const sendSuccessResponse = (
  res,
  message = "Operation successful",
  statusCode = 200,
  data
) => {
  res.status(statusCode).json({
    status: "success",
    message,
    data,
  });
};

const sendErrorResponse = (
  res,
  message = "An error occurred",
  statusCode = 500,
  errors = {}
) => {
  res.status(statusCode).json({
    status: "error",
    message,
    errors,
  });
};

module.exports = { sendSuccessResponse, sendErrorResponse };
