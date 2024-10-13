const express = require("express");
const {
  register,
  login,
  logout,
  update,
  userPhotoUpload,
  getProfile,
  changePassword,
  sendForgetPasswordLink,
  getResetPassword,
  resetThePassword,
  getProfileAdmin,
} = require("../controllers/userController");
const verifyToken = require("../middlewares/verifyToken");
const {
  validateUser,
  validateUpdateUser,
} = require("../middlewares/validateUser");
const {
  validatePassword,
  validateNewPassword,
} = require("../middlewares/passwordValidation");
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
const allowedTo = require("../middlewares/allowedTo");
const userRole = require("../utilities/userRoles");

const router = express.Router();

router.post(
  "/register",
  validateUser,
  checkUniqueEmail,
  checkUniquePhone,
  register
);

router.get("/profile", verifyToken, getProfile);

router.get(
  "/profileAdmin",
  verifyToken,
  allowedTo(userRole.ADMIN),
  getProfileAdmin
);

router.patch(
  "/update",
  verifyToken,
  validateUpdateUser,
  checkUniqueEmailExceptThisUser,
  checkUniquePhoneExceptThisUser,
  update
);

router.patch(
  "/user-photo-upload",
  verifyToken,
  imageUpload.single("avatar"),
  userPhotoUpload
);

router.patch("/change-password", verifyToken, validatePassword, changePassword);

router.post("/password/forget-password", sendForgetPasswordLink);

router.get("/password/reset-password/:userId/:resetToken", getResetPassword);

router.post(
  "/password/reset-password/:userId/:resetToken",
  validateNewPassword,
  resetThePassword
);

router.post("/login", login);

router.post("/logout", logout);

router.use(multerErrorHandler);

module.exports = router;
