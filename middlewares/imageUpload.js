const multer = require("multer");

const imageStorage = multer.memoryStorage();

// Image Upload Middleware with memoryStorage
const imageUpload = multer({
  storage: imageStorage, // Use memoryStorage to store files in memory
  limits: {
    fileSize: 1024 * 1024 * 2, // 2MB
  },
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file"), false);
    }
  },
});

module.exports = {
  imageUpload,
};
