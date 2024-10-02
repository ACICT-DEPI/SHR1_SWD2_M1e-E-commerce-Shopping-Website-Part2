const Category = require("../models/categoryModel");

const checkIfCategoryExists = async (id) => {
  const category = await Category.findOne({ _id: id });
  if (category) {
    return true;
  }
  return false;
};

module.exports = checkIfCategoryExists;
