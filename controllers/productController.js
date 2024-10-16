const asyncWrapper = require("../middlewares/asyncWrapper");
const Product = require("../models/productModel");
const path = require("path");
const fs = require("fs");

const {
  sendErrorResponse,
  sendSuccessResponse,
} = require("../utilities/sendResponse");
const checkIfIdIsValid = require("../middlewares/checkIfIdIsValid");
const checkIfCategoryExists = require("../middlewares/checkIfCategoryExists");
const {
  uploadToCloudinary,
  removeFromCloudinary,
} = require("../utilities/cloudinaryCloud");

const addProduct = asyncWrapper(async (req, res) => {
  if (!checkIfIdIsValid(req.body.category)) {
    return sendErrorResponse(res, "Invalid category ID", 404, {
      category: {
        message: "Invalid category ID",
      },
    });
  }

  if (!(await checkIfCategoryExists(req.body.category))) {
    return sendErrorResponse(res, "Category not found", 404, {
      category: {
        message: "Category not found",
      },
    });
  }

  const newProduct = new Product({
    title: req.body.title,
    description: req.body.description,
    excerpt: req.body.excerpt,
    price: req.body.price,
    discount: req.body.discount,
    quantity: req.body.quantity,
    category: req.body.category,
    gallery: req.filenames,
  });
  await newProduct.save();
  sendSuccessResponse(res, "Product saved successfully", 201, newProduct);
});

const getProducts = asyncWrapper(async (req, res) => {
  const query = req.query;
  const limit = query.limit
    ? parseInt(query.limit, 10)
    : await Product.countDocuments(); // If limit is not provided, use total count
  const page = query.page || 1;
  const skip = (page - 1) * limit;
  let filter = {};

  if (req.query.categories) {
    const categories = req.query.categories.split(",");

    // Loop through each category and validate it
    for (const category of categories) {
      if (!checkIfIdIsValid(category)) {
        return sendErrorResponse(res, "Invalid category ID", 404, {
          category: {
            message: "Invalid category ID",
          },
        });
      }

      if (!(await checkIfCategoryExists(category))) {
        return sendErrorResponse(res, "Category not found", 404, {
          category: {
            message: "Category not found",
          },
        });
      }
    }

    // If all categories are valid, update the filter
    filter = { category: categories };
  }

  // Count the total number of products that match the filter
  const totalProducts = await Product.countDocuments(filter);

  const products = await Product.find(filter)
    .populate("category")
    .limit(limit)
    .skip(skip);

  sendSuccessResponse(res, "Products fetched successfully", 200, {
    count: totalProducts,
    products,
  });
});

const getNumberOfProducts = asyncWrapper(async (req, res) => {
  const totalProducts = await Product.countDocuments();
  sendSuccessResponse(res, "Number of products fetched successfully", 200, {
    count: totalProducts,
  });
});

const getFeaturedProducts = asyncWrapper(async (req, res) => {
  const query = req.query;
  const limit = query.limit || 30;
  const page = query.page || 1;
  const skip = (page - 1) * limit;
  const featuredProducts = await Product.find({ isFeatured: true })
    .populate("category")
    .limit(limit)
    .skip(skip);
  sendSuccessResponse(
    res,
    "Featured products fetched successfully",
    200,
    featuredProducts
  );
});

const getProduct = asyncWrapper(async (req, res) => {
  if (!checkIfIdIsValid(req.params.id)) {
    return sendErrorResponse(res, "Invalid product ID", 404, {
      product: {
        message: "Invalid product ID",
      },
    });
  }

  const product = await Product.findById(req.params.id).populate("category");
  if (!product) {
    return sendErrorResponse(res, "Product not found", 404, {
      product: {
        message: "Product not found",
      },
    });
  }
  sendSuccessResponse(res, "Product fetched successfully", 200, product);
});

const updateProduct = asyncWrapper(async (req, res) => {
  if (!checkIfIdIsValid(req.params.id)) {
    return sendErrorResponse(res, "Invalid product ID", 404, {
      product: {
        message: "Invalid product ID",
      },
    });
  }

  if (req.body.category) {
    if (!checkIfIdIsValid(req.body.category)) {
      return sendErrorResponse(res, "Invalid category ID", 404, {
        category: {
          message: "Invalid category ID",
        },
      });
    }

    if (!(await checkIfCategoryExists(req.body.category))) {
      return sendErrorResponse(res, "Category not found", 404, {
        category: {
          message: "Category not found",
        },
      });
    }
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    {
      $set: { ...req.body, gallery: req.filenames },
    },
    { new: true, runValidators: true }
  );
  if (!updatedProduct) {
    return sendErrorResponse(res, "Product not found", 404, {
      product: {
        message: "Product not found",
      },
    });
  }
  sendSuccessResponse(res, "Product updated successfully", 200, updatedProduct);
});

const productPhotosUpload = async (req, res, next) => {
  if (!checkIfIdIsValid(req.params.id)) {
    return sendErrorResponse(res, "Invalid product ID", 404, {
      product: {
        message: "Invalid product ID",
      },
    });
  }

  const product = await Product.findById(req.params.id);
  if (!product) {
    return sendErrorResponse(res, "Product not found", 404, {
      product: {
        message: "Product not found",
      },
    });
  }

  try {
    if (!req.files || req.files.length === 0) {
      return sendErrorResponse(
        res,
        "At least one image must be uploaded.",
        400,
        {
          file: {
            message: "At least one image must be uploaded.",
          },
        }
      );
    }
    if (req.files.length > 5) {
      return res.status(400).json({
        file: {
          message: "You can only upload up to 5 images.",
        },
      });
    }

    const results = await Promise.all(
      req.files.map(async (file) => {
        const result = await uploadToCloudinary(file.buffer);
        return result;
      })
    );
    product.gallery.map(async (photo) => {
      if (photo.public_id !== null) {
        await removeFromCloudinary(photo.public_id);
      }
    });

    const newGallery = [];
    results.map((result) => {
      newGallery.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
    });

    const updatedGallery = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          gallery: newGallery,
        },
      },
      { new: true }
    );

    sendSuccessResponse(
      res,
      "Product photos uploaded successfully",
      200,
      newGallery
    );
  } catch (error) {
    next(error);
  }
};

const deleteProduct = asyncWrapper(async (req, res) => {
  if (!checkIfIdIsValid(req.params.id)) {
    return sendErrorResponse(res, "Invalid product ID", 404, {
      product: {
        message: "Invalid product ID",
      },
    });
  }

  const product = await Product.findById(req.params.id);

  try {
    product.gallery.map(async (photo) => {
      if (photo.public_id !== null) {
        await removeFromCloudinary(photo.public_id);
      }
    });
  } catch (error) {
    next(error);
  }

  const deletedProduct = await Product.findByIdAndDelete(req.params.id);
  if (!deletedProduct) {
    return sendErrorResponse(res, "Product not found", 404, {
      product: {
        message: "Product not found",
      },
    });
  }
  sendSuccessResponse(res, "Product deleted successfully", 200);
});

module.exports = {
  addProduct,
  getProducts,
  getNumberOfProducts,
  getFeaturedProducts,
  getProduct,
  updateProduct,
  productPhotosUpload,
  deleteProduct,
};
