const jwt = require("jsonwebtoken");
const { sendErrorResponse } = require("../utilities/sendResponse");

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  // Check if the token exists in the cookies
  if (!token) {
    return sendErrorResponse(res, "Token is required", 401, {
      token: {
        message: "Token is required",
      },
    });
  }

  try {
    // Verify the token using your secret key
    const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.currentUser = currentUser; // Add user data to the request object
    next(); // Proceed to the next middleware
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return sendErrorResponse(res, "Invalid is expired", 401, {
        token: {
          message: "Invalid is expired",
        },
      });
    } else {
      return sendErrorResponse(res, "Invalid token", 401, {
        token: {
          message: "Invalid token",
        },
      });
    }
  }
};

module.exports = verifyToken;
