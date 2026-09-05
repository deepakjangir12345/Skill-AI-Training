const express = require("express");
const router = express.Router();
const facultyController = require("../controllers/faculty.controller");

const {
  createLesson,
  getLessonsByCourse,
  updateLesson,
  deleteLesson,
  completeLesson,
  getCourseProgress
} = require("../controllers/lessonController");

const authMiddleware = require("../middleware/auth.Middleware");

// create lesson
router.post("/", createLesson);

// get lessons by course
router.get("/:courseId", authMiddleware, getLessonsByCourse);

// update lesson
router.put("/:lessonId", updateLesson);

// delete lesson
router.delete("/:lessonId", deleteLesson);

// complete lesson
router.post("/complete", authMiddleware, completeLesson);
router.post(
  "/faculty-video/:videoId/complete",
  authMiddleware,
  facultyController.completeFacultyVideo
);

// get the authenticated student's progress for a course
router.get("/progress/:courseId", authMiddleware, getCourseProgress);

module.exports = router;










