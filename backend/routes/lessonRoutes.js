const express = require("express");
const router = express.Router();

const {
  createLesson,
  getLessonsByCourse,
  completeLesson
} = require("../controllers/lessonController");

const authMiddleware = require("../middleware/authMiddleware");

// create lesson
router.post("/", authMiddleware, createLesson);

// get lessons by course
router.get("/:courseId", authMiddleware, getLessonsByCourse);

// complete lesson
router.post("/complete", authMiddleware, completeLesson);

module.exports = router;










