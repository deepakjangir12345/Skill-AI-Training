const Enrollment = require("../models/Enrollment");
const Lesson = require("../models/Lesson");

const checkEnrollment = async (req, res, next) => {
  try {
    const lessonId = req.params.id;

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    const enrolled = await Enrollment.findOne({
      user: req.user.id,
      course: lesson.course,
    });

    if (!enrolled) {
      return res.status(403).json({ message: "You are not enrolled in this course" });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = checkEnrollment;
