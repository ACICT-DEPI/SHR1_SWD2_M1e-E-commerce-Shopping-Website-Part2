const express = require("express");
const {
  addProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
  productPhotosUpload,
  getNumberOfProducts,
  getFeaturedProducts,
} = require("../controllers/productController");
const {
  validateProduct,
  validateUpdateProduct,
} = require("../middlewares/validateProduct");
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
  validateProduct,
  addProduct
);

router.get("/", getProducts);

router.get(
  "/number-of-products",
  verifyToken,
  allowedTo(userRole.ADMIN),
  getNumberOfProducts
);

router.get(
  "/featured-products",
  verifyToken,
  allowedTo(userRole.ADMIN),
  getFeaturedProducts
);

router.get("/:id", getProduct);

router.patch(
  "/:id",
  verifyToken,
  allowedTo(userRole.ADMIN),
  validateUpdateProduct,
  updateProduct
);

router.patch(
  "/product-photos-upload/:id",
  verifyToken,
  allowedTo(userRole.ADMIN),
  imageUpload.array("gallery", 5),
  productPhotosUpload
);

router.delete("/:id", verifyToken, allowedTo(userRole.ADMIN), deleteProduct);

router.use(multerErrorHandler);

module.exports = router;
