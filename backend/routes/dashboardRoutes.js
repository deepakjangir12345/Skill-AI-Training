const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const { getMyCourses } = require("../controllers/dashboardController");

router.get("/my-courses", auth, getMyCourses);

module.exports = router;

