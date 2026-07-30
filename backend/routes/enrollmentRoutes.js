const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const { enrollCourse } = require("../controllers/enrollmentController");

router.post("/enroll", auth, enrollCourse);

module.exports = router;
