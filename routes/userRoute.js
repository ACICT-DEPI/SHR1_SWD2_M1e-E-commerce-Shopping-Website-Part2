const express = require("express");
const {
  register,
  login,
  logout,
  update,
  userPhotoUpload,
  getProfile,
  changePassword,
} = require("../controllers/userController");
const verifyToken = require("../middlewares/verifyToken");
const {
  validateUser,
  validateUpdateUser,
} = require("../middlewares/validateUser");
const { validatePassword } = require("../middlewares/passwordValidation");
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
  validateUser,
  checkUniqueEmail,
  checkUniquePhone,
  register
);

router.get("/profile", verifyToken, getProfile);

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

router.post("/login", login);

router.post("/logout", logout);

router.use(multerErrorHandler);

module.exports = router;
