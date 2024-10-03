const asyncWrapper = require("../middlewares/asyncWrapper");
const checkIfIdIsValid = require("../middlewares/checkIfIdIsValid");
const User = require("../models/userModel");
const {
  sendSuccessResponse,
  sendErrorResponse,
} = require("../utilities/sendResponse");

const getAllUsers = asyncWrapper(async (req, res) => {
  const query = req.query;
  const limit = parseInt(query.limit) || 30;
  const page = parseInt(query.page) || 1;
  const skip = (page - 1) * limit;

  const totalUsers = await User.countDocuments();

  const allUsers = await User.find({}, { __v: false, password: false })
    .limit(limit)
    .skip(skip);
  sendSuccessResponse(res, "All users fetched successfully", 200, {
    count: totalUsers,
    allUsers,
  });
});

const getUser = asyncWrapper(async (req, res) => {
  if (!checkIfIdIsValid(req.params.id)) {
    return sendErrorResponse(res, "Invalid user ID", 404, {
      user: {
        message: "Invalid user ID",
      },
    });
  }

  const user = await User.findById(req.params.id, {
    __v: false,
    password: false,
  });
  if (!user) {
    return sendErrorResponse(res, "User not found", 404, {
      user: {
        message: "User not found",
      },
    });
  }
  sendSuccessResponse(res, "User fetched successfully", 200, user);
});

module.exports = {
  getAllUsers,
  getUser,
};
