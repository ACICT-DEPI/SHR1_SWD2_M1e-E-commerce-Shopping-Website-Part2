const Review = require("../models/reviewModel");
const Product = require("../models/productModel");
const asyncWrapper = require("../middlewares/asyncWrapper");
const checkIfIdIsValid = require("../middlewares/checkIfIdIsValid");
const {
  sendErrorResponse,
  sendSuccessResponse,
} = require("../utilities/sendResponse");
const checkIfProductExists = require("../middlewares/checkIfProductExists");

// Add a new review for a product
const createReview = asyncWrapper(async (req, res) => {
  const { productId } = req.params;
  const userId = req.currentUser.id;
  const { rating, comment } = req.body;

  if (!checkIfIdIsValid(productId)) {
    return sendErrorResponse(res, "Invalid product ID", 404, {
      product: {
        message: "Invalid product ID",
      },
    });
  }
  // Check if the product exists
  const product = await Product.findById(productId);

  if (!product) {
    return sendErrorResponse(res, "Product not found", 404, {
      product: {
        message: "Product not found",
      },
    });
  }

  // Check if the user has already reviewed the product (optional logic)
  const existingReview = await Review.findOne({
    user: userId,
    product: productId,
  });
  if (existingReview) {
    return sendErrorResponse(
      res,
      "You have already reviewed this product",
      400,
      {
        review: {
          message: "You have already reviewed this product",
        },
      }
    );
  }

  const review = new Review({
    user: userId,
    product: productId,
    rating,
    comment,
  });

  // Save the review
  await review.save();

  // Update product's rating and review count
  const reviews = await Review.find({ product: productId });
  product.numReviews = reviews.length;
  product.rating =
    reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

  await product.save();

  sendSuccessResponse(res, "Review created successfully", 201, review);
});

// Get all reviews
const getAllReviews = asyncWrapper(async (req, res) => {
  const reviews = await Review.find().populate("user", "firstName lastName"); // Populating user info if necessary

  if (!reviews) {
    return sendErrorResponse(res, "No reviews found", 404, {
      reviews: {
        message: "No reviews found",
      },
    });
  }
  sendSuccessResponse(res, "Reviews fetched successfully", 200, reviews);
});

// Get all reviews for a product
const getProductReviews = asyncWrapper(async (req, res) => {
  const { productId } = req.params;
  if (!checkIfIdIsValid(productId)) {
    return sendErrorResponse(res, "Invalid product ID", 404, {
      product: {
        message: "Invalid product ID",
      },
    });
  }
  if (!(await checkIfProductExists(productId))) {
    return sendErrorResponse(res, "Product not found", 404, {
      product: {
        message: "Product not found",
      },
    });
  }
  const reviews = await Review.find({ product: productId }).populate(
    "user",
    "firstName lastName"
  ); // Populating user info if necessary

  if (!reviews) {
    return sendErrorResponse(res, "No reviews found", 404, {
      reviews: {
        message: "No reviews found",
      },
    });
  }
  sendSuccessResponse(res, "Reviews fetched successfully", 200, reviews);
});

const getReview = asyncWrapper(async (req, res) => {
  const { reviewId } = req.params;

  if (!checkIfIdIsValid(reviewId)) {
    return sendErrorResponse(res, "Invalid review ID", 404, {
      review: {
        message: "Invalid review ID",
      },
    });
  }
  const review = await Review.findById(reviewId).populate(
    "user",
    "firstName lastName"
  ); // Populating user info if necessary

  if (!review) {
    return sendErrorResponse(res, "Review not found", 404, {
      reviews: {
        message: "Review not found",
      },
    });
  }
  sendSuccessResponse(res, "Review fetched successfully", 200, review);
});

// Update a review (only admin or the review creator can update)
const updateReview = asyncWrapper(async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.currentUser.id;
  const role = req.currentUser.role;

  const { rating, comment } = req.body;

  if (!checkIfIdIsValid(reviewId)) {
    return sendErrorResponse(res, "Invalid review ID", 404, {
      review: {
        message: "Invalid review ID",
      },
    });
  }
  const review = await Review.findById(reviewId);

  if (!review) {
    return sendErrorResponse(res, "Review not found", 404, {
      review: {
        message: "Review not found",
      },
    });
  }

  // Only the review author or an admin can delete the review
  if (review.user.toString() !== userId.toString() && role !== "admin") {
    return sendErrorResponse(res, "Not authorized to update this review", 401, {
      review: {
        message: "Not authorized to update this review",
      },
    });
  }

  review.rating = rating || review.rating;
  review.comment = comment || review.comment;
  await review.save();

  // Update product rating and review count
  const product = await Product.findById(review.product);
  const reviews = await Review.find({ product: product._id });
  product.numReviews = reviews.length;
  product.rating =
    reviews.reduce((acc, item) => item.rating + acc, 0) / (reviews.length || 1);

  await product.save();

  sendSuccessResponse(res, "Review updated successfully", 200, review);
});

// Delete a review (only admin or the review creator can delete)
const deleteReview = asyncWrapper(async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.currentUser.id;
  const role = req.currentUser.role;

  if (!checkIfIdIsValid(reviewId)) {
    return sendErrorResponse(res, "Invalid review ID", 404, {
      review: {
        message: "Invalid review ID",
      },
    });
  }
  const review = await Review.findById(reviewId);

  if (!review) {
    return sendErrorResponse(res, "Review not found", 404, {
      review: {
        message: "Review not found",
      },
    });
  }

  // Only the review author or an admin can delete the review
  if (review.user.toString() !== userId.toString() && role !== "admin") {
    return sendErrorResponse(res, "Not authorized to delete this review", 401, {
      review: {
        message: "Not authorized to delete this review",
      },
    });
  }

  await review.deleteOne();

  // Update product rating and review count
  const product = await Product.findById(review.product);
  const reviews = await Review.find({ product: product._id });
  product.numReviews = reviews.length;
  product.rating =
    reviews.reduce((acc, item) => item.rating + acc, 0) / (reviews.length || 1);

  await product.save();

  sendSuccessResponse(res, "Review deleted successfully", 200, review);
});

module.exports = {
  createReview,
  getAllReviews,
  getProductReviews,
  getReview,
  updateReview,
  deleteReview,
};
