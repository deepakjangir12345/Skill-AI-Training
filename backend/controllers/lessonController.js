const Lesson = require("../models/Lesson");
const LessonProgress = require("../models/LessonProgress");

// CREATE LESSON
const createLesson = async (req, res) => {
  try {
    const {
      title,
      description,
      videoUrl,
      pdfUrl,
      duration,
      isPreview,
      order,
      course,
    } = req.body;

    if (!title || !course || !order) {
      return res.status(400).json({
        message: "Title, Course and Order are required",
      });
    }

    const lesson = await Lesson.create({
      title,
      description,
      videoUrl,
      pdfUrl,
      duration,
      isPreview,
      order,
      course,
    });

    res.status(201).json({
      success: true,
      lesson,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// GET LESSONS BY COURSE
const getLessonsByCourse = async (req, res) => {
  try {

    const lessons = await Lesson.find({
      course: req.params.courseId
    }).sort({ order: 1 });

    res.json({
      success: true,
      totalLessons: lessons.length,
      lessons,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message,
    });

  }
};

// COMPLETE LESSON

const completeLesson = async (req, res) => {
  try {
    res.json({
      success: true,
      message: "Lesson completed successfully (Test Mode)",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
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







