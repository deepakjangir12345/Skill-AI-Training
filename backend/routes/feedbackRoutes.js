const express = require("express");

const router = express.Router();

const {
  submitFeedback,
  getMyFeedback,
  getAllFeedback,
  updateFeedbackStatus,
  scheduleFeedbackSession,
} = require("../controllers/feedbackController");

const authMiddleware = require("../middleware/auth.Middleware");

// ==========================
// SUBMIT FEEDBACK
// ==========================

router.post("/", authMiddleware, submitFeedback);

// ==========================
// GET MY FEEDBACK
// ==========================

router.get("/my", authMiddleware, getMyFeedback);
// ==========================
// GET ALL FEEDBACK (ADMIN)
// ==========================

router.get("/admin/all", authMiddleware, getAllFeedback);
router.put("/:id/status", authMiddleware, updateFeedbackStatus);
// SCHEDULE DISCUSSION SESSION

router.put(
  "/:id/schedule-session",
  authMiddleware,
  scheduleFeedbackSession
);

module.exports = router;