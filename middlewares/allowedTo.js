const { sendErrorResponse } = require("../utilities/sendResponse");

const allowedTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.currentUser.role)) {
      return sendErrorResponse(res, "Unauthorized for this role", 401, {
        token: {
          message: "Unauthorized for this role",
        },
      });
    }
    next();
  };
};

module.exports = allowedTo;
