const { sendErrorResponse } = require("./sendResponse");

const multerErrorHandler = (err, req, res, next) => {
  if (err) {
    // If it's a Multer error, return the error response using sendErrorResponse
    if (err.message === "Invalid file") {
      return sendErrorResponse(
        res,
        "Invalid file type. Only JPEG, PNG, and JPG images are allowed.",
        400,
        {
          message:
            "Invalid file type. Only JPEG, PNG, and JPG images are allowed.",
        }
      );
    }

    if (err.code === "LIMIT_FILE_SIZE") {
      return sendErrorResponse(res, "File size should not exceed 2MB.", 400, {
        message: "File size should not exceed 2MB.",
      });
    }

    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return sendErrorResponse(
        res,
        "You can only upload up to 5 images.",
        400,
        {
          message: "You can only upload up to 5 images.",
        }
      );
    }

    if (err.message === "Can't upload file to cloudinary") {
      return sendErrorResponse(
        res,
        "Failed to upload file to cloudinary",
        400,
        {
          message: "Failed to upload file to cloudinary",
        }
      );
    }

    if (err.message === "Can't remove file from cloudinary") {
      return sendErrorResponse(res, "Failed to remove from cloudinary", 400, {
        message: "Failed to remove from cloudinary",
      });
    }

    // Handle other Multer errors (if any)
    return sendErrorResponse(res, "There is an error", 500, {
      message: "There is an error",
      error: err,
    });
  }
  next();
};

module.exports = multerErrorHandler;
