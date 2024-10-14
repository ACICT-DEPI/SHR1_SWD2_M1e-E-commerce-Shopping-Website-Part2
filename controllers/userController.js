const asyncWrapper = require("../middlewares/asyncWrapper");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  sendPasswordResetEmail,
  sendMessageEmail,
} = require("../utilities/nodemailer");
const generateJWT = require("../utilities/generateJWT");
const {
  sendErrorResponse,
  sendSuccessResponse,
} = require("../utilities/sendResponse");
const {
  removeFromCloudinary,
  uploadToCloudinary,
} = require("../utilities/cloudinaryCloud");
const checkIfIdIsValid = require("../middlewares/checkIfIdIsValid");

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

const getProfileAdmin = asyncWrapper(async (req, res) => {
  const userProfileAdmin = await User.findById(req.currentUser.id, {
    _id: false,
    firstName: true,
    lastName: true,
    email: true,
    phone: true,
    avatar: true,
  });
  if (!userProfileAdmin) {
    sendErrorResponse(res, "Admin not found", 404, {
      admin: { message: "Admin not found" },
    });
  }
  sendSuccessResponse(
    res,
    "Admin profile retrieved successfully",
    200,
    userProfileAdmin
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

  user.password = hashedPassword;
  user.save();

  // Send success response
  sendSuccessResponse(res, "Password changed successfully", 200, {
    password: {
      message: "Password changed successfully",
    },
  });
});

const sendForgetPasswordLink = asyncWrapper(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return sendErrorResponse(res, "Please provide an email", 400, {
      email: {
        message: "Please provide an email",
      },
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return sendErrorResponse(res, "User not found", 404, {
      user: { message: "User not found" },
    });
  }

  const secret = process.env.JWT_SECRET_KEY + user.password;
  const resetToken = jwt.sign({ id: user._id, email: user.email }, secret, {
    expiresIn: "10m",
  });

  const resetLink = `http://localhost:3000/password/reset-password/${user._id}/${resetToken}`;

  sendPasswordResetEmail(user.email, resetLink);

  res.json({
    message: "The link sent successfully",
  });
});

const getResetPassword = asyncWrapper(async (req, res, next) => {
  if (!checkIfIdIsValid(req.params.userId)) {
    return sendErrorResponse(res, "Invalid user ID", 404, {
      user: {
        message: "Invalid user ID",
      },
    });
  }

  const user = await User.findById(req.params.userId);

  if (!user) {
    return sendErrorResponse(res, "User not found", 404, {
      user: { message: "User not found" },
    });
  }

  const secret = process.env.JWT_SECRET_KEY + user.password;
  try {
    jwt.verify(req.params.resetToken, secret);
    sendSuccessResponse(
      res,
      "Page of reset password loaded successfully",
      200,
      { email: user.email }
    );
  } catch (err) {
    return sendErrorResponse(res, "Token expired or invalid", 401, {
      token: {
        message: "Token expired or invalid",
      },
    });
  }
});

const resetThePassword = asyncWrapper(async (req, res, next) => {
  if (!checkIfIdIsValid(req.params.userId)) {
    return sendErrorResponse(res, "Invalid user ID", 404, {
      user: {
        message: "Invalid user ID",
      },
    });
  }

  const user = await User.findById(req.params.userId);

  if (!user) {
    return sendErrorResponse(res, "User not found", 404, {
      user: { message: "User not found" },
    });
  }

  const secret = process.env.JWT_SECRET_KEY + user.password;
  try {
    const { newPassword } = req.body;
    jwt.verify(req.params.resetToken, secret);

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    sendSuccessResponse(res, "Password reset successfully", 200, {
      password: {
        message: "Password reset successfully",
      },
    });
  } catch (err) {
    return sendErrorResponse(res, "Token expired or invalid", 401, {
      token: {
        message: "Token expired or invalid",
      },
    });
  }
});

const sendMessage = asyncWrapper(async (req, res) => {
  const { email, name, phone, message } = req.body;
  const newMessage = {
    email,
    name,
    phone,
    message,
  };

  try {
    // Send the email
    let info = await sendMessageEmail(newMessage);

    return sendSuccessResponse(res, "Message sent successfully!", 201, {
      message: info,
    });
  } catch (error) {
    return sendErrorResponse(res, "Failed to send message.", 400, error);
  }
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

  res.cookie("token", token, {
    httpOnly: true,
    secure: true, // Only use secure cookies in production
    sameSite: "None",
    maxAge: 24 * 60 * 60 * 1000, // 1 hour
  });

  // Send success response
  sendSuccessResponse(res, "Logged in successfully", 200, {
    message: "Logged in successfully",
  });
});

const logout = asyncWrapper(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    path: "/",
  });

  sendSuccessResponse(res, "Logged out successfully", 200, {
    message: "Logged out successfully",
  });
});

module.exports = {
  register,
  getProfile,
  getProfileAdmin,
  update,
  userPhotoUpload,
  changePassword,
  sendForgetPasswordLink,
  getResetPassword,
  resetThePassword,
  sendMessage,
  login,
  logout,
};
