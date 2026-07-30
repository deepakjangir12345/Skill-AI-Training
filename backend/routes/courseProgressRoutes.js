const express = require("express");
const router = express.Router();
const { getCourseProgress } = require("../controllers/courseProgressController");
const auth = require("../middleware/authMiddleware");

router.get("/:courseId", auth, getCourseProgress);

module.exports = router;

