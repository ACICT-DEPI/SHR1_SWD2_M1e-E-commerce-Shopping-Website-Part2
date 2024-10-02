const User = require("../models/userModel");
const { sendErrorResponse } = require("../utilities/sendResponse");

const checkUniqueEmail = async (req, res, next) => {
  const { email } = req.body;
  const existingUser = await User.findOne({
    email: email,
  });
  if (existingUser) {
    return sendErrorResponse(res, "Email is already existing", 500, {
      message: "Email is already existing",
    });
  }
  next();
};

const checkUniqueEmailExceptThisUser = async (req, res, next) => {
  const { email } = req.body;
  const existingUser = await User.findOne({
    email: email,
    _id: { $ne: req.currentUser.id },
  });
  if (existingUser) {
    return sendErrorResponse(res, "Email is already existing", 500, {
      message: "Email is already existing",
    });
  }
  next();
};

module.exports = { checkUniqueEmail, checkUniqueEmailExceptThisUser };
