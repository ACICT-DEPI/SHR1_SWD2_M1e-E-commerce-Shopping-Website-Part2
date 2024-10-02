const path = require("path");
const multer = require("multer");

// Photo Storage
const photoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    if (file) {
      cb(null, Date.now() + "-" + file.originalname);
    } else {
      cb(null, false);
    }
  },
});

// Photo Upload Middleware
const photoUpload = multer({
  storage: photoStorage,
  limits: {
    fileSize: 1024 * 1024 * 2, // 2MB
  },
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file"), false);
    }
  },
});

module.exports = {
  photoUpload,
};
