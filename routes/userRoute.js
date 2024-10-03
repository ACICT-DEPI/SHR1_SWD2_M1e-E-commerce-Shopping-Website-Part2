const express = require("express");
const {
  register,
  login,
  update,
  userPhotoUpload,
} = require("../controllers/userController");
const verifyToken = require("../middlewares/verifyToken");
const {
  validateUser,
  validateUpdateUser,
} = require("../middlewares/validateUser");
const {
  checkUniqueEmail,
  checkUniqueEmailExceptThisUser,
} = require("../middlewares/checkUniqueEmail");
const {
  checkUniquePhone,
  checkUniquePhoneExceptThisUser,
} = require("../middlewares/checkUniquePhone");
const multerErrorHandler = require("../utilities/multerErrorHandler");
const { imageUpload } = require("../middlewares/imageUpload");

const router = express.Router();

router.post(
  "/register",
  checkUniqueEmail,
  checkUniquePhone,
  validateUser,
  register
);

router.patch(
  "/update",
  verifyToken,
  checkUniqueEmailExceptThisUser,
  checkUniquePhoneExceptThisUser,
  validateUpdateUser,
  update
);

router.patch(
  "/user-photo-upload",
  verifyToken,
  imageUpload.single("avatar"),
  userPhotoUpload
);

router.post("/login", login);

router.use(multerErrorHandler);

module.exports = router;
