const express = require("express");

const {
  addCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
  categoryPhotoUpload,
  getNumberOfCategories,
} = require("../controllers/categoryController");
const validateCategory = require("../middlewares/validateCategory");
const verifyToken = require("../middlewares/verifyToken");
const allowedTo = require("../middlewares/allowedTo");
const userRole = require("../utilities/userRoles");
const multerErrorHandler = require("../utilities/multerErrorHandler");
const { imageUpload } = require("../middlewares/imageUpload");

const router = express.Router();

router.post(
  "/",
  verifyToken,
  allowedTo(userRole.ADMIN),
  validateCategory,
  addCategory
);

router.get("/", getCategories);

router.get(
  "/number-of-categories",
  verifyToken,
  allowedTo(userRole.ADMIN),
  getNumberOfCategories
);

router.get("/:id", getCategory);

router.patch(
  "/:id",
  verifyToken,
  allowedTo(userRole.ADMIN),
  validateCategory,
  updateCategory
);

router.patch(
  "/category-photo-upload/:id",
  verifyToken,
  allowedTo(userRole.ADMIN),
  imageUpload.single("image"),
  categoryPhotoUpload
);

router.delete("/:id", verifyToken, allowedTo(userRole.ADMIN), deleteCategory);

router.use(multerErrorHandler);

module.exports = router;
