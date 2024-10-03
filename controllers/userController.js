const asyncWrapper = require("../middlewares/asyncWrapper");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const generateJWT = require("../utilities/generateJWT");
const {
  sendErrorResponse,
  sendSuccessResponse,
} = require("../utilities/sendResponse");
const {
  removeFromCloudinary,
  uploadToCloudinary,
} = require("../utilities/cloudinaryCloud");

const register = asyncWrapper(async (req, res) => {
  const { firstName, lastName, email, phone, password } = req.body;
  const newUser = new User({
    firstName,
    lastName,
    email,
    phone,
    password,
  });
  await newUser.save();
  sendSuccessResponse(res, "Successfully registered", 200, newUser);
});

const update = asyncWrapper(async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.currentUser.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedUser) {
    return sendErrorResponse(res, "User not found", 404, {
      user: {
        message: "User not found",
      },
    });
  }
  sendSuccessResponse(res, "User updated successfully", 200, updatedUser);
});

const userPhotoUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      return sendErrorResponse(res, "No file uploaded", 400, {
        file: {
          message: "No file uploaded",
        },
      });
    }

    const result = await uploadToCloudinary(req.file.buffer);

    const user = await User.findById(req.currentUser.id);

    if (user.avatar.public_id !== null) {
      await removeFromCloudinary(user.avatar.public_id);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.currentUser.id,
      {
        $set: {
          avatar: {
            url: result.secure_url,
            public_id: result.public_id,
          },
        },
      },
      { new: true }
    );

    sendSuccessResponse(res, "User photo uploaded successfully", 200, {
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    next(error);
  }
};

const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return sendErrorResponse(res, "Please provide email and password", 400, {
      message: "Please provide email and password",
    });
  }
  const user = await User.findOne({ email: email }).select("+password");
  if (!user) {
    return sendErrorResponse(res, "Invalid email", 401, {
      message: "Invalid email",
    });
  }
  // Check if password is correct
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return sendErrorResponse(res, "Invalid credentials", 401, {
      message: "Invalid credentials",
    });
  }
  // Generate token
  const token = await generateJWT({
    id: user._id,
    email: user.email,
    role: user.role,
  });
  // If credentials are correct, respond with success
  sendSuccessResponse(res, "Token generated", 200, { token });
});

module.exports = {
  register,
  update,
  userPhotoUpload,
  login,
};
