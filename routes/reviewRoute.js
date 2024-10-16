const express = require("express");
const {
  createReview,
  getProductReviews,
  deleteReview,
  getReview,
  getAllReviews,
  updateReview,
} = require("../controllers/reviewController");
const verifyToken = require("../middlewares/verifyToken");
const allowedTo = require("../middlewares/allowedTo");
const userRole = require("../utilities/userRoles");
const {
  validateReview,
  validateUpdateReview,
} = require("../middlewares/validateReview");

const router = express.Router();

// Route to create a review (protected route)
router.post("/product/:productId", verifyToken, validateReview, createReview);

// Route to get a review
router.get("/:reviewId", verifyToken, allowedTo(userRole.ADMIN), getReview);

// Route to get all reviews for a product
router.get("/product/:productId", getProductReviews);

// Route to get all reviews
router.get("/", verifyToken, allowedTo(userRole.ADMIN), getAllReviews);

// Route to update a review (protected, user must be owner or admin)
router.patch("/:reviewId", verifyToken, validateUpdateReview, updateReview);

// Route to delete a review (protected, user must be owner or admin)
router.delete("/:reviewId", verifyToken, deleteReview);

module.exports = router;
