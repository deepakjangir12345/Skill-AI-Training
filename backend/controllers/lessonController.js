const Lesson = require("../models/Lesson");
const LessonProgress = require("../models/LessonProgress");
const Enrollment = require("../models/Enrollment");
const Module = require("../models/Module");
const Video = require("../models/Video");
const FacultyVideoProgress = require("../models/FacultyVideoProgress");
const ensureCourseEnrollment = async (userId, courseId) => {
  return Enrollment.findOne({
    $or: [
      { user: userId, course: courseId },
      { userId, courseId },
      { user: userId, courseId },
      { userId, course: courseId },
    ],
  });
};

// CREATE LESSON
const createLesson = async (req, res) => {
  try {
    const {
      title,
      description,
      videoUrl,
      pdfUrl,
      duration,
      isPreview,
      order,
      course,
      module,
    } = req.body;

    if (!title || !course || !order) {
      return res.status(400).json({
        message: "Title, Course and Order are required",
      });
    }

    if (module) {
      const moduleRecord = await Module.findOne({ _id: module, course });
      if (!moduleRecord) {
        return res.status(400).json({ message: "Module does not belong to this course" });
      }
    }

    const lesson = await Lesson.create({
      title,
      description,
      videoUrl,
      pdfUrl,
      duration,
      isPreview,
      order,
      course,
      module: module || null,
    });

    res.status(201).json({
      success: true,
      lesson,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// GET LESSONS + PUBLISHED FACULTY VIDEOS BY COURSE
const getLessonsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Existing Admin lessons
    const lessons = await Lesson.find({
      course: courseId
    })
      .populate("module", "title description order")
      .lean();

    // Published Faculty videos
    const facultyVideos = await Video.find({
      courseId: courseId,
      isPublished: true
    })
      .populate("module", "title description order")
      .lean();

    // Convert faculty videos into learning items
    const facultyVideoItems = facultyVideos.map((video) => ({
      _id: video._id,
      title: video.title,
      description: video.description,
      videoUrl: video.videoUrl,
      duration: video.duration,
      order: video.order,
      module: video.module,
      type: "faculty-video",
      isPreview: false,
      isPublished: video.isPublished,
      createdAt: video.createdAt
    }));

    // Mark existing lessons
    const lessonItems = lessons.map((lesson) => ({
      ...lesson,
      type: "lesson"
    }));

    // Combine Admin lessons + Faculty videos
    const learningItems = [
      ...lessonItems,
      ...facultyVideoItems
    ];

    // Sort by module order first, then item order
    learningItems.sort((firstItem, secondItem) => {
      const firstModuleOrder =
        firstItem.module?.order ?? Number.MAX_SAFE_INTEGER;

      const secondModuleOrder =
        secondItem.module?.order ?? Number.MAX_SAFE_INTEGER;

      return (
        firstModuleOrder - secondModuleOrder ||
        (firstItem.order ?? 0) - (secondItem.order ?? 0) ||
        new Date(firstItem.createdAt) - new Date(secondItem.createdAt)
      );
    });

    return res.json({
      success: true,
      totalLessons: learningItems.length,
      lessons: learningItems
    });

  } catch (error) {
    console.error("Get lessons and faculty videos error:", error);

    return res.status(500).json({
      message: error.message
    });
  }
};

// UPDATE LESSON
const updateLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;

    const {
      title,
      description,
      videoUrl,
      pdfUrl,
      duration,
      isPreview,
      order,
      module,
    } = req.body;

    const lessonUpdates = {
      title,
      description,
      videoUrl,
      pdfUrl,
      duration,
      isPreview,
      order,
    };

    const existingLesson = await Lesson.findById(lessonId).select("course");
    if (!existingLesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    if (module) {
      const moduleRecord = await Module.findOne({ _id: module, course: existingLesson.course });
      if (!moduleRecord) {
        return res.status(400).json({ message: "Module does not belong to this course" });
      }
    }

    if (module !== undefined) {
      lessonUpdates.module = module || null;
    }

    const lesson = await Lesson.findByIdAndUpdate(
      lessonId,
      lessonUpdates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!lesson) {
      return res.status(404).json({
        message: "Lesson not found",
      });
    }

    res.json({
      success: true,
      message: "Lesson updated successfully",
      lesson,
    });
  } catch (error) {
    console.error("Update lesson error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE LESSON
const deleteLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;

    const lesson = await Lesson.findByIdAndDelete(lessonId);

    if (!lesson) {
      return res.status(404).json({
        message: "Lesson not found",
      });
    }

    res.json({
      success: true,
      message: "Lesson deleted successfully",
    });
  } catch (error) {
    console.error("Delete lesson error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// COMPLETE LESSON

const completeLesson = async (req, res) => {
  try {
    const { lessonId } = req.body;

    if (!lessonId) {
      return res.status(400).json({ message: "lessonId is required" });
    }

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    const enrolled = await ensureCourseEnrollment(req.user._id, lesson.course);
    if (!enrolled) {
      return res.status(403).json({ message: "You are not enrolled in this course" });
    }

    const progressRecord = await LessonProgress.findOneAndUpdate(
      { user: req.user._id, lesson: lesson._id },
      {
        $set: { completed: true, completedAt: new Date(), course: lesson.course },
        $setOnInsert: { user: req.user._id, lesson: lesson._id },
      },
      { new: true, upsert: true, runValidators: true }
    );

    const [totalLessons, completedLessons] = await Promise.all([
      Lesson.countDocuments({ course: lesson.course }),
      LessonProgress.countDocuments({
        user: req.user._id,
        course: lesson.course,
        completed: true,
      }),
    ]);

    return res.json({
      success: true,
      message: "Lesson completed successfully",
      completed: progressRecord.completed,
      lessonId: lesson._id,
      totalLessons,
      completedLessons,
      progress: totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    // Admin-created lessons
    const lessonIds = await Lesson.find({
      course: courseId,
    }).distinct("_id");

    const completedLessonIds = await LessonProgress.find({
      user: userId,
      lesson: { $in: lessonIds },
      completed: true,
    }).distinct("lesson");

    // Published Faculty Videos
    const facultyVideos = await Video.find({
      courseId: courseId,
      isPublished: true,
    }).select("_id");

    const facultyVideoIds = facultyVideos.map((video) => video._id);

    const completedFacultyVideoIds =
      await FacultyVideoProgress.find({
        user: userId,
        video: { $in: facultyVideoIds },
        completed: true,
      }).distinct("video");

    // Combined progress
    const totalLessons = lessonIds.length;
    const totalFacultyVideos = facultyVideoIds.length;

    const completedLessons = completedLessonIds.length;
    const completedFacultyVideos = completedFacultyVideoIds.length;

    const totalItems = totalLessons + totalFacultyVideos;
    const completedItems =
      completedLessons + completedFacultyVideos;

    const progress =
      totalItems === 0
        ? 0
        : Math.min(
            100,
            Math.round((completedItems / totalItems) * 100)
          );

    return res.json({
      success: true,

      totalLessons,
      completedLessons,

      totalFacultyVideos,
      completedFacultyVideos,

      totalItems,
      completedItems,

      progress,

      completedLessonIds,
      completedFacultyVideoIds,
    });

  } catch (error) {
    console.error("Get course progress error:", error);

    return res.status(500).json({
      message: "Failed to fetch course progress",
    });
  }
};


// ✅ VERY IMPORTANT EXPORT
module.exports = {
  createLesson,
  getLessonsByCourse,
  updateLesson,
  deleteLesson,
  completeLesson,
  getCourseProgress
};







