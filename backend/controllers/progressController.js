const Progress = require("../models/Progress");
const Lesson = require("../models/Lesson");

// ✅ Mark lesson as completed
exports.completeLesson = async (req, res) => {
  try {
    const { lessonId } = req.body;
    const userId = req.user.id;

    if (!lessonId) {
      return res.status(400).json({ message: "lessonId required" });
    }

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    let progress = await Progress.findOne({ user: userId });

    if (!progress) {
      progress = new Progress({
        user: userId,
        completedLessons: [lessonId],
      });
    } else {
      if (!progress.completedLessons.includes(lessonId)) {
        progress.completedLessons.push(lessonId);
      }
    }

    await progress.save();

    res.json({
      message: "Lesson marked as completed",
      completedLessons: progress.completedLessons,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Progress error" });
  }
};


