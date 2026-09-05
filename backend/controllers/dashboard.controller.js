const Enrollment = require("../models/Enrollment");
const Certificate = require("../models/Certificate");
const Lesson = require("../models/Lesson");
const LessonProgress = require("../models/LessonProgress");
const Video = require("../models/Video");
const FacultyVideoProgress = require("../models/FacultyVideoProgress");

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // =====================================================
    // TOTAL ENROLLED COURSES
    // =====================================================

    const enrollments = await Enrollment.find({
      $or: [
        { user: userId },
        { userId: userId },
      ],
    });

    // Get unique course IDs
    const courseIds = [
      ...new Set(
        enrollments
          .map((enrollment) =>
            enrollment.course || enrollment.courseId
          )
          .filter(Boolean)
          .map((id) => id.toString())
      ),
    ];

    const totalCourses = courseIds.length;

    // =====================================================
    // CHECK EACH COURSE'S REAL COMPLETION
    // =====================================================

    let completedCourses = 0;

    let totalLearningItems = 0;
    let completedLearningItems = 0;

    for (const courseId of courseIds) {

      // -----------------------------
      // ADMIN LESSONS
      // -----------------------------

      const lessonIds = await Lesson.find({
        course: courseId,
      }).distinct("_id");

      const completedLessonIds = await LessonProgress.find({
        user: userId,
        lesson: { $in: lessonIds },
        completed: true,
      }).distinct("lesson");

      // -----------------------------
      // FACULTY PUBLISHED VIDEOS
      // -----------------------------

      const facultyVideoIds = await Video.find({
        courseId: courseId,
        isPublished: true,
      }).distinct("_id");

      const completedFacultyVideoIds =
        await FacultyVideoProgress.find({
          user: userId,
          video: { $in: facultyVideoIds },
          completed: true,
        }).distinct("video");

      // -----------------------------
      // COMBINE EVERYTHING
      // -----------------------------

      const totalItems =
        lessonIds.length + facultyVideoIds.length;

      const completedItems =
        completedLessonIds.length +
        completedFacultyVideoIds.length;

      totalLearningItems += totalItems;
      completedLearningItems += Math.min(
        completedItems,
        totalItems
      );

      // Course is complete only when
      // every learning item is completed
      if (
        totalItems > 0 &&
        completedItems >= totalItems
      ) {
        completedCourses++;
      }
    }

    // =====================================================
    // OVERALL PROGRESS
    // =====================================================

    let progress = 0;

    if (totalLearningItems > 0) {
      progress = Math.min(
        100,
        Math.round(
          (completedLearningItems / totalLearningItems) * 100
        )
      );
    }

    // =====================================================
    // CERTIFICATES
    // =====================================================

    const certificates = await Certificate.countDocuments({
      user: userId,
    });

    // =====================================================
    // RESPONSE
    // =====================================================

    res.json({
      success: true,
      stats: {
        totalCourses,
        completedCourses,
        progress,
        certificates,
      },
    });

  } catch (error) {
    console.error("Dashboard Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard",
    });
  }
};