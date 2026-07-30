const express = require("express");
const router = express.Router();
const { completeLesson } = require("../controllers/progressController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/complete", protect, completeLesson);

module.exports = router;

