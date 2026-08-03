const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
    },

    // User Role
    role: {
      type: String,
      enum: ["user", "faculty", "admin"],
      default: "user",
    },

    // Login Provider
    authProvider: {
      type: String,
      enum: ["email", "google"],
      default: "email",
    },

    // Forgot Password
    resetPasswordToken: String,
    resetPasswordExpires: Date,

    // -------- New Profile Fields --------

    phone: {
      type: String,
      default: "",
    },

    college: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    profileImage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);