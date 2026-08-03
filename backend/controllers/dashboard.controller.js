const Enrollment = require("../models/Enrollment");
const Certificate = require("../models/Certificate");
const Progress = require("../models/Progress");

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Total enrolled courses
    const totalCourses = await Enrollment.countDocuments({
      $or: [{ userId }, { user: userId }],
    });

    // Completed courses
    const completedCourses = await Progress.countDocuments({
      userId,
      completed: true,
    });

    // Certificates
    const certificates = await Certificate.countDocuments({
      userId,
    });

    // Progress %
    let progress = 0;

    if (totalCourses > 0) {
      progress = Math.round((completedCourses / totalCourses) * 100);
    }

    res.json({
      success: true,
      stats: {
        totalCourses,
        completedCourses,
        progress,
        certificates,
      },
    });
  } catch (error) {
    console.error("Dashboard Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard",
    });
  }
};