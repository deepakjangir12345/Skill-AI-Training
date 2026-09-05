const LiveClass = require("../models/LiveClass");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

const updateLiveClassStatus = (liveClass) => {
  const now = new Date();

  const startTime = new Date(liveClass.scheduledAt);

  const endTime = new Date(
    startTime.getTime() + liveClass.duration * 60 * 1000
  );

  if (now < startTime) {
    return "upcoming";
  }

  if (now >= startTime && now < endTime) {
    return "live";
  }

  return "completed";
};

// ==========================
// CREATE LIVE CLASS
// ==========================

exports.createLiveClass = async (req, res) => {
  try {
    const {
      title,
      description,
      courseId,
      meetingLink,
      scheduledAt,
      duration,
    } = req.body;

    if (
      !title ||
      !courseId ||
      !meetingLink ||
      !scheduledAt ||
      !duration
    ) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const liveClass = await LiveClass.create({
      title,
      description,
      course: courseId,
      meetingLink,
      scheduledAt,
      duration,
    });

    return res.status(201).json({
      success: true,
      message: "Live class created successfully",
      liveClass,
    });
  } catch (error) {
    console.error("Create live class error:", error);

    return res.status(500).json({
      message: "Failed to create live class",
    });
  }
};

// ==========================
// GET LIVE CLASSES
// ==========================

exports.getLiveClasses = async (req, res) => {
  try {
    // Admin can see all live classes
    if (req.user.role === "admin") {
      const liveClasses = await LiveClass.find()
        .populate("course", "name")
        .sort({ scheduledAt: 1 });

        const updatedLiveClasses = await Promise.all(
  liveClasses.map(async (liveClass) => {
    const automaticStatus = updateLiveClassStatus(liveClass);

    if (liveClass.status !== automaticStatus) {
      liveClass.status = automaticStatus;
      await liveClass.save();
    }

    return liveClass;
  })
);

      return res.status(200).json({
        success: true,
        liveClasses: updatedLiveClasses,
      });
    }

    // Get student's enrollments
    const enrollments = await Enrollment.find({
      $or: [
        { user: req.user._id },
        { userId: req.user._id },
      ],
    });

    // Extract enrolled course IDs
    const courseIds = enrollments
      .map(
        (enrollment) =>
          enrollment.course || enrollment.courseId
      )
      .filter(Boolean);

    // Student can only see live classes
    // from enrolled courses
    const liveClasses = await LiveClass.find({
      course: { $in: courseIds },
    })
      .populate("course", "name")
      .sort({ scheduledAt: 1 });

      const updatedLiveClasses = await Promise.all(
  liveClasses.map(async (liveClass) => {
    const automaticStatus = updateLiveClassStatus(liveClass);

    if (liveClass.status !== automaticStatus) {
      liveClass.status = automaticStatus;
      await liveClass.save();
    }

    return liveClass;
  })
);

    return res.status(200).json({
      success: true,
      liveClasses: updatedLiveClasses,
    });
  } catch (error) {
    console.error("Get live classes error:", error);

    return res.status(500).json({
      message: "Failed to fetch live classes",
    });
  }
};

// ==========================
// GET LIVE CLASSES BY COURSE
// ==========================

exports.getLiveClassesByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Admin can access any course
    if (req.user.role === "admin") {
      const liveClasses = await LiveClass.find({
        course: courseId,
      })
        .populate("course", "name")
        .sort({ scheduledAt: 1 });

      return res.status(200).json({
        success: true,
        liveClasses,
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

    // Student is not enrolled
    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }

    // Student is enrolled, so return classes
    const liveClasses = await LiveClass.find({
      course: courseId,
    })
      .populate("course", "name")
      .sort({ scheduledAt: 1 });

    return res.status(200).json({
      success: true,
      liveClasses,
    });
  } catch (error) {
    console.error("Get course live classes error:", error);

    return res.status(500).json({
      message: "Failed to fetch course live classes",
    });
  }
};

// ==========================
// JOIN LIVE CLASS
// ==========================

exports.joinLiveClass = async (req, res) => {
  try {
    const { id } = req.params;

    // Find live class
    const liveClass = await LiveClass.findById(id);

    if (!liveClass) {
      return res.status(404).json({
        success: false,
        message: "Live class not found",
      });
    }

    // Admin can join any live class
    if (req.user.role === "admin") {
      return res.status(200).json({
        success: true,
        meetingLink: liveClass.meetingLink,
      });
    }

    // Check if student is enrolled in this course
    const enrollment = await Enrollment.findOne({
      $or: [
        {
          user: req.user._id,
          course: liveClass.course,
        },
        {
          userId: req.user._id,
          courseId: liveClass.course,
        },
      ],
    });

    // Student is not enrolled
    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }

    // Return meeting link only to enrolled student
    return res.status(200).json({
      success: true,
      meetingLink: liveClass.meetingLink,
    });
  } catch (error) {
    console.error("Join live class error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to join live class",
    });
  }
};

// ==========================
// UPDATE LIVE CLASS
// ==========================

exports.updateLiveClass = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      courseId,
      meetingLink,
      scheduledAt,
      duration,
      status,
    } = req.body;

    const liveClass = await LiveClass.findById(id);

    if (!liveClass) {
      return res.status(404).json({
        message: "Live class not found",
      });
    }

    if (title !== undefined) liveClass.title = title;

    if (description !== undefined)
      liveClass.description = description;

    if (courseId !== undefined)
      liveClass.course = courseId;

    if (meetingLink !== undefined)
      liveClass.meetingLink = meetingLink;

    if (scheduledAt !== undefined)
      liveClass.scheduledAt = scheduledAt;

    if (duration !== undefined)
      liveClass.duration = duration;

    if (status !== undefined)
      liveClass.status = status;

    await liveClass.save();

    return res.status(200).json({
      success: true,
      message: "Live class updated successfully",
      liveClass,
    });
  } catch (error) {
    console.error("Update live class error:", error);

    return res.status(500).json({
      message: "Failed to update live class",
    });
  }
};

// ==========================
// DELETE LIVE CLASS
// ==========================

exports.deleteLiveClass = async (req, res) => {
  try {
    const { id } = req.params;

    const liveClass =
      await LiveClass.findByIdAndDelete(id);

    if (!liveClass) {
      return res.status(404).json({
        message: "Live class not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Live class deleted successfully",
    });
  } catch (error) {
    console.error("Delete live class error:", error);

    return res.status(500).json({
      message: "Failed to delete live class",
    });
  }
};