const User = require("../models/userModel");
const { sendErrorResponse } = require("../utilities/sendResponse");

const checkUniquePhone = async (req, res, next) => {
  const { phone } = req.body;
  const existingUser = await User.findOne({
    phone: phone,
  });
  if (existingUser) {
    return sendErrorResponse(res, "Phone is already existing", 500, {
      phone: {
        message: "Phone is already existing",
      },
    });
  }
  next();
};

const checkUniquePhoneExceptThisUser = async (req, res, next) => {
  const { phone } = req.body;
  const existingUser = await User.findOne({
    phone: phone,
    _id: { $ne: req.currentUser.id },
  });
  if (existingUser) {
    return sendErrorResponse(res, "Phone is already existing", 500, {
      phone: {
        message: "Phone is already existing",
      },
    });
  }
  next();
};

module.exports = { checkUniquePhone, checkUniquePhoneExceptThisUser };
