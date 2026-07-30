const User = require("../models/User");
const Course = require("../models/Course");
const Lesson = require("../models/Lesson");

// ======================
// ADMIN DASHBOARD STATS
// ======================
exports.getDashboard = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const courses = await Course.countDocuments();
    const lessons = await Lesson.countDocuments();

    res.json({
      users,
      courses,
      lessons
    });
  } catch (err) {
    res.status(500).json({ message: "Dashboard fetch failed" });
  }
};

// ======================
// GET ALL USERS
// ======================
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// ======================
// UPDATE USER ROLE
// ======================
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
    await user.save();

    res.json({ message: "User role updated" });
  } catch (err) {
    res.status(500).json({ message: "Role update failed" });
  }
};

// ======================
// DELETE USER
// ======================
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};

