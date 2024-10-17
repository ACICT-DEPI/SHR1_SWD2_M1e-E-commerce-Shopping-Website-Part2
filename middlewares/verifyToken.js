const jwt = require("jsonwebtoken");
const { sendErrorResponse } = require("../utilities/sendResponse");

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  // Check if the token exists in the cookies
  if (!token) {
    return sendErrorResponse(res, "Please sign in to continue", 401, {
      auth: {
        message: "Token is required",
      },
    });
  }

  try {
    // Verify the token using the secret key
    const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.currentUser = currentUser; // Attach user info to the request object
    next(); // Move to the next middleware or route handler
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return sendErrorResponse(
        res,
        "Your session has expired, please sign in again",
        401,
        {
          auth: {
            message: "Token expired",
          },
        }
      );
    } else {
      return sendErrorResponse(
        res,
        "Invalid token, please sign in again",
        401,
        {
          auth: {
            message: "Invalid token",
          },
        }
      );
    }
  }
};

module.exports = verifyToken;
