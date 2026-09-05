const Feedback = require("../models/Feedback");
const Enrollment = require("../models/Enrollment");

// ==========================
// SUBMIT FEEDBACK
// ==========================

exports.submitFeedback = async (req, res) => {
  try {
    const {
      courseId,
      facultyId,
      rating,
      teachingQuality,
      understandingLevel,
      problems,
      suggestions,
      needsSession,
    } = req.body;

    // Basic validation
    if (!courseId || !rating) {
      return res.status(400).json({
        success: false,
        message: "Course and rating are required",
      });
    }

    // Check if student is enrolled in this course
    const enrollment = await Enrollment.findOne({
      $or: [
        {
          user: req.user._id,
          course: courseId,
        },
        {
          userId: req.user._id,
          courseId: courseId,
        },
      ],
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }

    // Create feedback
    const feedback = await Feedback.create({
      user: req.user._id,
      course: courseId,
      faculty: facultyId || null,
      rating,
      teachingQuality,
      understandingLevel,
      problems,
      suggestions,
      needsSession,
    });

    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      feedback,
    });
  } catch (error) {
    console.error("Submit feedback error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit feedback",
    });
  }
};

// ==========================
// GET MY FEEDBACK
// ==========================

exports.getMyFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({
      user: req.user._id,
    })
      .populate("course", "name")
      .populate("faculty", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      feedbacks,
    });
  } catch (error) {
    console.error("Get feedback error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch feedback",
    });
  }
};

// ==========================
// GET ALL FEEDBACK (ADMIN)
// ==========================

exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("user", "name email")
      .populate("course", "name")
      .populate("faculty", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      feedbacks,
    });
  } catch (error) {
    console.error("Get all feedback error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch feedback",
    });
  }
};

// ==========================
// UPDATE FEEDBACK STATUS
// ==========================

exports.updateFeedbackStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "reviewed",
      "session-scheduled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid feedback status",
      });
    }

    const feedback = await Feedback.findById(id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    feedback.status = status;

    await feedback.save();

    return res.status(200).json({
      success: true,
      message: "Feedback status updated successfully",
      feedback,
    });
  } catch (error) {
    console.error("Update feedback status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update feedback status",
    });
  }
};

// ==========================
// SCHEDULE FEEDBACK SESSION
// ==========================

exports.scheduleFeedbackSession = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      sessionScheduledAt,
      sessionMeetingLink,
      sessionNote,
    } = req.body;

    // Required validation
    if (!sessionScheduledAt || !sessionMeetingLink) {
      return res.status(400).json({
        success: false,
        message: "Session date, time and meeting link are required",
      });
    }

    const feedback = await Feedback.findById(id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    // Save session details
    feedback.sessionScheduledAt = sessionScheduledAt;
    feedback.sessionMeetingLink = sessionMeetingLink;
    feedback.sessionNote = sessionNote || "";

    // Update feedback status
    feedback.status = "session-scheduled";

    await feedback.save();

    return res.status(200).json({
      success: true,
      message: "Discussion session scheduled successfully",
      feedback,
    });
  } catch (error) {
    console.error("Schedule feedback session error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to schedule discussion session",
    });
  }
};