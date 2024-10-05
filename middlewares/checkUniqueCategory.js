const Category = require("../models/categoryModel");
const { sendErrorResponse } = require("../utilities/sendResponse");

const checkUniqueCategory = async (req, res, next) => {
  const { title } = req.body;
  const existingCategory = await Category.findOne({
    title: title,
  });
  if (existingCategory) {
    return sendErrorResponse(res, "Category is already existing", 500, {
      category: {
        message: "Category is already existing",
      },
    });
  }
  next();
};

const checkUniqueCategoryExceptThisCategory = async (req, res, next) => {
  const { title } = req.body;
  const existingCategory = await Category.findOne({
    title: title,
    _id: { $ne: req.params.id },
  });
  if (existingCategory) {
    return sendErrorResponse(res, "Category is already existing", 500, {
      category: {
        message: "Category is already existing",
      },
    });
  }
  next();
};

module.exports = { checkUniqueCategory, checkUniqueCategoryExceptThisCategory };
