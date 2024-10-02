const mongoose = require("mongoose");

const checkIfIdIsValid = (id) => {
  if (mongoose.isValidObjectId(id)) {
    return true;
  }
  return false;
};

module.exports = checkIfIdIsValid;
