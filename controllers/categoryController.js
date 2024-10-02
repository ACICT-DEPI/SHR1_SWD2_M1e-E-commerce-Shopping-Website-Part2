const asyncWrapper = require("../middlewares/asyncWrapper");
const Category = require("../models/categoryModel");
const path = require("path");
const fs = require("fs");
const {
  sendErrorResponse,
  sendSuccessResponse,
} = require("../utilities/sendResponse");
const {
  cloudinaryUploadFile,
  cloudinaryRemoveFile,
} = require("../utilities/cloudinary");
const checkIfIdIsValid = require("../middlewares/checkIfIdIsValid");

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
      message: "Invalid category ID",
    });
  }

  const category = await Category.findById(req.params.id);
  if (!category) {
    return sendErrorResponse(res, "Category not found", 404, {
      message: "Category not found",
    });
  }
  sendSuccessResponse(res, "Category fetched successfully", 200, category);
});

const updateCategory = asyncWrapper(async (req, res) => {
  if (!checkIfIdIsValid(req.params.id)) {
    return sendErrorResponse(res, "Invalid category ID", 404, {
      message: "Invalid category ID",
    });
  }

  const updatedCategory = await Category.findByIdAndUpdate(
    req.params.id,
    {
      $set: { ...req.body },
    },
    { new: true, runValidators: true }
  );
  if (!updatedCategory) {
    return sendErrorResponse(res, "Category not found", 404, {
      message: "Category not found",
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
      message: "Invalid category ID",
    });
  }

  const category = await Category.findById(req.params.id);
  if (!category) {
    return sendErrorResponse(res, "Category not found", 404, {
      message: "Category not found",
    });
  }

  try {
    // 1. Validation
    if (!req.file) {
      return sendErrorResponse(res, "No file uploaded", 400, {
        message: "No file uploaded",
      });
    }
    // 2. Get th path to the photo
    const photoPath = path.join(__dirname, `../uploads/${req.file.filename}`);

    // 3. Upload to cloudinary
    const result = await cloudinaryUploadFile(photoPath);

    // 4. Get the user from DB
    // Above

    // 5. Delete the old photo if it exists
    if (category.image.public_id !== null) {
      await cloudinaryRemoveFile(category.image.public_id);
    }

    // 6. Change the avatar field in the DB
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
      { new: true } // Returns the updated document
    );

    // 7. Respond with success message
    sendSuccessResponse(res, "Category photo uploaded successfully", 200, {
      url: result.secure_url,
      public_id: result.public_id,
    });

    // 8. Remove the photo from server
    fs.unlinkSync(photoPath);
  } catch (error) {
    next(error);
  }
};

const deleteCategory = asyncWrapper(async (req, res) => {
  if (!checkIfIdIsValid(req.params.id)) {
    return sendErrorResponse(res, "Invalid category ID", 404, {
      message: "Invalid category ID",
    });
  }

  const category = await Category.findById(req.params.id);

  try {
    if (category.image.public_id !== null) {
      await cloudinaryRemoveFile(category.image.public_id);
    }
  } catch (error) {
    next(error);
  }

  const deletedCategory = await Category.findByIdAndDelete(req.params.id);
  if (!deletedCategory) {
    return sendErrorResponse(res, "Category not found", 404, {
      message: "Category not found",
    });
  }
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
