const express = require("express");

const router = express.Router();

const {
  createLiveClass,
  getLiveClasses,
  getLiveClassesByCourse,
  joinLiveClass,
  updateLiveClass,
  deleteLiveClass,
} = require("../controllers/liveClassController");

const authMiddleware = require("../middleware/auth.Middleware");

// GET ALL LIVE CLASSES
router.get("/", authMiddleware, getLiveClasses);

// GET LIVE CLASSES BY COURSE
router.get("/course/:courseId", authMiddleware, getLiveClassesByCourse);

// JOIN LIVE CLASS
router.get("/:id/join", authMiddleware, joinLiveClass);

// CREATE LIVE CLASS
router.post("/", authMiddleware, createLiveClass);

// UPDATE LIVE CLASS
router.put("/:id", authMiddleware, updateLiveClass);

// DELETE LIVE CLASS
router.delete("/:id", authMiddleware, deleteLiveClass);

module.exports = router;