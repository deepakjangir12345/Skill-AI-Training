const Lesson = require("../models/Lesson");
const LessonProgress = require("../models/LessonProgress");

// CREATE LESSON
const createLesson = async (req, res) => {
  try {
    const lesson = await Lesson.create(req.body);
    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET LESSONS BY COURSE
const getLessonsByCourse = async (req, res) => {
  try {
    const lessons = await Lesson.find({ course: req.params.courseId });
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// COMPLETE LESSON
const completeLesson = async (req, res) => {
  try {
    const { lessonId } = req.body;

    const progress = await LessonProgress.findOneAndUpdate(
      {
        user: req.user._id,
        lesson: lessonId,
      },
      {
        completed: true,
        completedAt: new Date(),
      },
      {
        upsert: true,
        new: true,
      }
    );

    res.json({
      success: true,
      message: "Lesson completed successfully",
      progress,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ VERY IMPORTANT EXPORT
module.exports = {
  createLesson,
  getLessonsByCourse,
  completeLesson
};







