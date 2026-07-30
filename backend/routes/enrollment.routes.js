const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.Middleware");
const Enrollment = require("../models/Enrollment");
const Payment = require("../models/Payment");

// Get My Enrollments
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all enrollments for the user with payment details
    const enrollments = await Enrollment.find({
      $or: [{ userId }, { user: userId }],
    })
      .populate('paymentId', 'amount status createdAt')
      .sort({ enrolledAt: -1 });

    // Format the response
    const formattedEnrollments = enrollments.map((enrollment) => ({
      courseId: enrollment.courseId || (enrollment.course ? enrollment.course.toString() : null),
      enrolledAt: enrollment.enrolledAt || enrollment.createdAt,
      payment: {
        amount: enrollment.paymentId?.amount,
        status: enrollment.paymentId?.status,
        paidAt: enrollment.paymentId?.createdAt,
      },
    }));

    res.json({
      success: true,
      enrollments: formattedEnrollments
    });

  } catch (error) {
    console.error("Get enrollments error:", error);
    res.status(500).json({ message: "Failed to fetch enrollments" });
  }
});

module.exports = router;
