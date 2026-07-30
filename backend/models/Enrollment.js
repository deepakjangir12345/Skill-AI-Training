const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    courseId: {
      type: String,
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Prevent duplicates for legacy enrollments (user/course)
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true, sparse: true });

// Prevent duplicates for static-course enrollments (userId/courseId)
enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model("Enrollment", enrollmentSchema);
