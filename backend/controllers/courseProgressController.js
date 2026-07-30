const CourseProgress = require("../models/Progress");
const Lesson = require("../models/Lesson");
const Certificate = require("../models/Certificate");

exports.getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const totalLessons = await Lesson.countDocuments({ course: courseId });

    const completedLessons = await CourseProgress.countDocuments({
      user: userId,
      course: courseId,
      completed: true,
    });

    const progress =
      totalLessons === 0
        ? 0
        : Math.round((completedLessons / totalLessons) * 100);

    // 🔥 AUTO CERTIFICATE ISSUE WHEN 100%
    if (progress === 100) {
      const alreadyIssued = await Certificate.findOne({
        user: userId,
        course: courseId,
      });

      if (!alreadyIssued) {
        await Certificate.create({
          user: userId,
          course: courseId,
        });
      }
    }

    res.json({
      courseId,
      totalLessons,
      completedLessons,
      progress,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch course progress" });
  }
};

