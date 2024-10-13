const express = require("express");
const {
  addCarousel,
  getCarousels,
  getCarousel,
  updateCarousel,
  carouselPhotoUpload,
  deleteCarousel,
} = require("../controllers/carouselController");
const verifyToken = require("../middlewares/verifyToken");
const allowedTo = require("../middlewares/allowedTo");
const userRole = require("../utilities/userRoles");
const {
  validateCarousel,
  validateUpdateCarousel,
} = require("../middlewares/validateCarousel");
const { imageUpload } = require("../middlewares/imageUpload");
const multerErrorHandler = require("../utilities/multerErrorHandler");

const router = express.Router();

router.post(
  "/",
  verifyToken,
  allowedTo(userRole.ADMIN),
  validateCarousel,
  addCarousel
);

router.get("/", getCarousels);

router.get("/:id", getCarousel);

router.patch(
  "/:id",
  verifyToken,
  allowedTo(userRole.ADMIN),
  validateUpdateCarousel,
  updateCarousel
);

router.patch(
  "/carousel-photo-upload/:id",
  verifyToken,
  allowedTo(userRole.ADMIN),
  imageUpload.single("image"),
  carouselPhotoUpload
);

router.delete("/:id", verifyToken, allowedTo(userRole.ADMIN), deleteCarousel);

router.use(multerErrorHandler);

module.exports = router;
