const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const courseController = require("../controllers/course.Controller");

// GET all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json({ courses });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET single course by ID
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json({ course });
  } catch (err) {
    res.status(500).json({ message: "Invalid course ID" });
  }
});

// POST create course
router.post("/", courseController.createCourse);

// POST seed courses (for initial setup)
router.post("/seed", courseController.seedCourses);

// POST add new courses (for adding specific courses)
router.post("/add-new", courseController.addNewCourses);

// DELETE all courses (for admin use)
router.delete("/", async (req, res) => {
  try {
    const result = await Course.deleteMany({});
    res.json({ message: "All courses deleted", deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ message: "Error deleting courses", error: err.message });
  }
});

module.exports = router;












