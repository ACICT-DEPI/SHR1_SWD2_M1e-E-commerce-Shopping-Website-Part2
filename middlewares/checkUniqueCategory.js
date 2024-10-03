const Category = require("../models/categoryModel");
const { sendErrorResponse } = require("../utilities/sendResponse");
const checkIfIdIsValid = require("./checkIfIdIsValid");

const checkUniqueCategory = async (req, res, next) => {
  const { title } = req.body;
  const existingCategory = await Category.findOne({
    title: title,
  });
  if (existingCategory) {
    return sendErrorResponse(res, "Category is already existing", 500, {
      message: "Category is already existing",
    });
  }
  next();
};

const checkUniqueCategoryExceptThisCategory = async (req, res, next) => {
  if (!checkIfIdIsValid(req.params.id)) {
    return sendErrorResponse(res, "Invalid category ID", 404, {
      message: "Invalid category ID",
    });
  }
  const { title } = req.body;
  const existingCategory = await Category.findOne({
    title: title,
    _id: { $ne: req.params.id },
  });
  if (existingCategory) {
    return sendErrorResponse(res, "Category is already existing", 500, {
      message: "Category is already existing",
    });
  }
  next();
};

module.exports = { checkUniqueCategory, checkUniqueCategoryExceptThisCategory };
