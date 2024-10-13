const User = require("../models/userModel");

const checkIfUserExists = async (id) => {
  const user = await User.findById(id);
  if (user) {
    return true;
  }
  return false;
};

module.exports = checkIfUserExists;
