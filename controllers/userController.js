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
  hashedPassword = await bcrypt.hash(password, 10); // Hash password with bcrypt
  const newUser = new User({
    firstName,
    lastName,
    email,
    phone,
    password: hashedPassword,
  });
  await newUser.save();
  sendSuccessResponse(res, "Successfully registered", 200, newUser);
});

const getProfile = asyncWrapper(async (req, res) => {
  const userProfile = await User.findById(req.currentUser.id, {
    _id: false,
    firstName: true,
    lastName: true,
    email: true,
    phone: true,
    avatar: true,
  });
  if (!userProfile) {
    sendErrorResponse(res, "User not found", 404, {
      user: { message: "User not found" },
    });
  }
  sendSuccessResponse(
    res,
    "User profile retrieved successfully",
    200,
    userProfile
  );
});

const update = asyncWrapper(async (req, res) => {
  const user = await User.findById(req.currentUser.id);
  if (!user) {
    sendErrorResponse(res, "User not found", 404, {
      user: { message: "User not found" },
    });
  }
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

const changePassword = asyncWrapper(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  // Find the user by their ID (from req.currentUser)
  const user = await User.findById(req.currentUser.id).select("+password");

  if (!user) {
    return sendErrorResponse(res, "User not found", 404, {
      user: { message: "User not found" },
    });
  }

  // Check if the current password matches
  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    return sendErrorResponse(res, "Current password is incorrect", 400, {
      currentPassword: {
        message: "Current password is incorrect",
      },
    });
  }

  hashedPassword = await bcrypt.hash(newPassword, 10); // Hash password with bcrypt

  const updatePassword = awaitUser.findByIdAndUpdate(
    req.currentUser.id,
    {
      $set: {
        password: hashedPassword,
      },
    },
    { new: true }
  );

  if (!updatePassword) {
    return sendErrorResponse(res, "Password not changed", 404, {
      user: { message: "Password not changed" },
    });
  }

  // Send success response
  sendSuccessResponse(res, "Password changed successfully", 200, {
    password: {
      message: "Password changed successfully",
    },
  });
});

const userPhotoUpload = async (req, res, next) => {
  const user = await User.findById(req.currentUser.id);
  if (!user) {
    sendErrorResponse(res, "User not found", 404, {
      user: { message: "User not found" },
    });
  }

  try {
    if (!req.file) {
      return sendErrorResponse(res, "No file uploaded", 400, {
        file: {
          message: "No file uploaded",
        },
      });
    }

    const result = await uploadToCloudinary(req.file.buffer);

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

  // Set token as an HTTP-only cookie with expiration (e.g., 1 hour)
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    maxAge: 60 * 60 * 1000, // 1 hour
    path: "/",
  });

  // Send success response
  sendSuccessResponse(res, "Logged in successfully", 200, {
    message: "Logged in successfully",
  });
});

const logout = asyncWrapper(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    path: "/",
  });

  sendSuccessResponse(res, "Logged out successfully", 200, {
    message: "Logged out successfully",
  });
});

module.exports = {
  register,
  getProfile,
  update,
  userPhotoUpload,
  changePassword,
  login,
  logout,
};
