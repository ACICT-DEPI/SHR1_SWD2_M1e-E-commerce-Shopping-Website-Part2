const { sendErrorResponse } = require("../utilities/sendResponse");

module.exports = (asyncFun) => {
  return (req, res, next) => {
    asyncFun(req, res, next).catch((err) => {
      sendErrorResponse(res, "There was an error", 500, err.errors);
    });
  };
};
