const Enrollment = require("../models/Enrollment");

exports.getMyCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      user: req.user._id,
    }).populate("course");

    // ❗ null courses remove
    const courses = enrollments
      .filter(e => e.course)   // null hata do
      .map(e => e.course);

    res.status(200).json({
      message: "My courses",
      courses,
    });
  } catch (err) {
    console.error("DASHBOARD ERROR:", err);
    res.status(500).json({ message: "Dashboard error" });
  }
};



