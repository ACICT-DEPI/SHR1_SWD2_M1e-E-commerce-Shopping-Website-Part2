const jwt = require("jsonwebtoken");
const { sendErrorResponse } = require("../utilities/sendResponse");

const verifyToken = (req, res, next) => {
  const authHeader =
    req.headers["Authorization"] || req.headers["authorization"];
  if (!authHeader) {
    return sendErrorResponse(res, "Token is require", 401, {
      message: "Token is require",
    });
  }
  const token = authHeader.split(" ")[1];
  try {
    const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.currentUser = currentUser;
    next();
  } catch (err) {
    return sendErrorResponse(res, "Invalid token", 401, {
      message: "Invalid token",
    });
  }
};

module.exports = verifyToken;
