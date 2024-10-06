const mongoose = require("mongoose");

const userRole = require("../utilities/userRoles");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [2, "First name should be at least 2 characters long"],
      maxlength: [50, "First name should be at most 50 characters long"],
      match: [
        /^[a-zA-Z]+$/,
        "First name should contain only alphabetic characters",
      ],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: [3, "Last name should be at least 3 characters long"],
      maxlength: [50, "Last name should be at most 50 characters long"],
      match: [
        /^[a-zA-Z]+$/,
        "Last name should contain only alphabetic characters",
      ],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true, // Ensure that emails are unique
      match: [/^\S+@\S+\.\S+$/, "Email field must be a valid email address"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      unique: true,
      minlength: [10, "Phone number should be at least 10 characters long"],
      maxlength: [15, "Phone number should be at most 15 characters long"],
      match: [
        /^[0-9]{10,15}$/,
        "Phone number must be valid, It must be contains only numbers",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
    },
    role: {
      type: String,
      enum: {
        values: [userRole.ADMIN, userRole.CUSTOMER],
        message: "{VALUE} is not a valid role",
      },
      default: userRole.CUSTOMER, // Default role is customer if not specified in the document creation
    },
    isAccountVerified: {
      type: Boolean,
      default: false, // Account is not verified by default
    },
    avatar: {
      type: Object,
      default: {
        url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        public_id: null,
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields to the schema
    autoIndex: true,
  }
);

module.exports = mongoose.model("User", userSchema);
