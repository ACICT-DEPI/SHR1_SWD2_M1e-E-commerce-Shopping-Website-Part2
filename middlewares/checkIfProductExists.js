const Product = require("../models/productModel");

const checkIfProductExists = async (id) => {
  const product = await Product.findById(id);
  if (product) {
    return true;
  }
  return false;
};

module.exports = checkIfProductExists;
