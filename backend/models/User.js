const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true
  },
  password: String,
  role: {
    type: String,
    enum: ['user', 'faculty', 'admin'],
    default: 'user'
  },
  authProvider: {
    type: String,
    enum: ['email', 'google'],
    default: 'email'
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

module.exports = mongoose.model("User", userSchema);






