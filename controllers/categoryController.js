const asyncWrapper = require("../middlewares/asyncWrapper");
const Category = require("../models/categoryModel");
const {
  sendErrorResponse,
  sendSuccessResponse,
} = require("../utilities/sendResponse");

const checkIfIdIsValid = require("../middlewares/checkIfIdIsValid");
const {
  uploadToCloudinary,
  removeFromCloudinary,
} = require("../utilities/cloudinaryCloud");

const addCategory = asyncWrapper(async (req, res) => {
  const newCategory = new Category({
    title: req.body.title,
    description: req.body.description,
  });
  await newCategory.save();
  sendSuccessResponse(res, "Category saved successfully", 201, newCategory);
});

const getCategories = asyncWrapper(async (req, res) => {
  const query = req.query;
  const limit = query.limit || 30;
  const page = query.page || 1;
  const skip = (page - 1) * limit;

  const totalCategories = await Category.countDocuments();

  const categories = await Category.find({}, { __v: false })
    .limit(limit)
    .skip(skip);
  sendSuccessResponse(res, "Categories fetched successfully", 200, {
    count: totalCategories,
    categories,
  });
});

const getNumberOfCategories = asyncWrapper(async (req, res) => {
  const totalCategories = await Category.countDocuments();
  sendSuccessResponse(res, "Number of categories fetched successfully", 200, {
    count: totalCategories,
  });
});

const getCategory = asyncWrapper(async (req, res) => {
  if (!checkIfIdIsValid(req.params.id)) {
    return sendErrorResponse(res, "Invalid category ID", 404, {
      category: {
        message: "Invalid category ID",
      },
    });
  }

  const category = await Category.findById(req.params.id);
  if (!category) {
    return sendErrorResponse(res, "Category not found", 404, {
      category: {
        message: "Category not found",
      },
    });
  }
  sendSuccessResponse(res, "Category fetched successfully", 200, category);
});

const updateCategory = asyncWrapper(async (req, res) => {
  const updatedCategory = await Category.findByIdAndUpdate(
    req.params.id,
    {
      $set: { ...req.body },
    },
    { new: true, runValidators: true }
  );
  if (!updatedCategory) {
    return sendErrorResponse(res, "Category not found", 404, {
      category: {
        message: "Category not found",
      },
    });
  }
  sendSuccessResponse(
    res,
    "Category updated successfully",
    200,
    updatedCategory
  );
});

const categoryPhotoUpload = async (req, res, next) => {
  if (!checkIfIdIsValid(req.params.id)) {
    return sendErrorResponse(res, "Invalid category ID", 404, {
      category: {
        message: "Invalid category ID",
      },
    });
  }

  const category = await Category.findById(req.params.id);
  if (!category) {
    return sendErrorResponse(res, "Category not found", 404, {
      category: {
        message: "Category not found",
      },
    });
  }

  try {
    if (!req.file) {
      return sendErrorResponse(res, "No file uploaded", 400, {
        file: {
          message: "No file uploaded",
        },
      });
    }

    const result = await uploadToCloudinary(req.file.buffer);

    if (category.image.public_id !== null) {
      await removeFromCloudinary(category.image.public_id);
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          image: {
            url: result.secure_url,
            public_id: result.public_id,
          },
        },
      },
      { new: true }
    );

    sendSuccessResponse(res, "Category photo uploaded successfully", 200, {
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = asyncWrapper(async (req, res) => {
  if (!checkIfIdIsValid(req.params.id)) {
    return sendErrorResponse(res, "Invalid category ID", 404, {
      category: {
        message: "Invalid category ID",
      },
    });
  }

  const category = await Category.findById(req.params.id);

  if (!category) {
    return sendErrorResponse(res, "Category not found", 404, {
      category: {
        message: "Category not found",
      },
    });
  }

  try {
    if (category.image.public_id !== null) {
      await removeFromCloudinary(category.image.public_id);
    }
  } catch (error) {
    next(error);
  }

  const deletedCategory = await Category.findByIdAndDelete(req.params.id);
  sendSuccessResponse(
    res,
    "Category deleted successfully",
    200,
    deletedCategory
  );
});

module.exports = {
  addCategory,
  getCategories,
  getNumberOfCategories,
  getCategory,
  updateCategory,
  categoryPhotoUpload,
  deleteCategory,
};
