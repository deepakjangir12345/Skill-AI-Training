const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const mongoose = require("mongoose");
const Certificate = require("../models/Certificate");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const Lesson = require("../models/Lesson");
const LessonProgress = require("../models/LessonProgress");
const Video = require("../models/Video");
const FacultyVideoProgress = require("../models/FacultyVideoProgress");
const User = require("../models/User");
const generateCertificatePDF = require("../utils/generateCertificatePDF");
const CertificateSettings = require("../models/CertificateSettings");

const isEnrolled = (userId, courseId) => Enrollment.findOne({
  $or: [
    { user: userId, course: courseId },
    { userId, courseId },
    { user: userId, courseId },
    { userId, course: courseId },
  ],
});

const getEligibility = async (userId, courseId) => {
  const course = await Course.findById(courseId).select("name");

  if (!course) return { course: null };

  const enrolled = await isEnrolled(userId, courseId);

  if (!enrolled) {
    return {
      course,
      enrolled: false,
    };
  }

  // ADMIN LESSONS
  const lessonIds = await Lesson.find({
    course: courseId,
  }).distinct("_id");

  const completedLessonIds = await LessonProgress.find({
    user: userId,
    lesson: { $in: lessonIds },
    completed: true,
  }).distinct("lesson");

  // FACULTY VIDEOS
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

  // COMBINED PROGRESS
  const totalLessons = lessonIds.length;
  const completedLessons = completedLessonIds.length;

  const totalFacultyVideos = facultyVideoIds.length;
  const completedFacultyVideos =
    completedFacultyVideoIds.length;

  const totalItems =
    totalLessons + totalFacultyVideos;

  const completedItems =
    completedLessons + completedFacultyVideos;

  const progress =
    totalItems === 0
      ? 0
      : Math.min(
          100,
          Math.round(
            (completedItems / totalItems) * 100
          )
        );

  return {
    course,
    enrolled: true,

    totalLessons,
    completedLessons,

    totalFacultyVideos,
    completedFacultyVideos,

    totalItems,
    completedItems,

    progress,

    eligible:
      totalItems > 0 &&
      completedItems >= totalItems,
  };
};

const newCertificateId = () => (
  `SKILLAI-${Date.now()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`
);

const defaultCertificateSettings = {
  certificateTitle: "Certificate of Completion",
  organizationName: "Skill.AI Training",
  subtitle: "This is to certify that",
  signatureName: "Authorized Signature",
  signatureDesignation: "Course Director",
  logoUrl: "",
  signatureImageUrl: "",
  templateName: "Classic",
};

exports.getCertificateSettings = async (req, res) => {
  try {
    const settings = await CertificateSettings.findOne({ settingKey: "global" }).lean();
    return res.json({ success: true, settings: settings || defaultCertificateSettings });
  } catch (error) {
    console.error("Get certificate settings error:", error);
    return res.status(500).json({ message: "Failed to fetch certificate settings" });
  }
};

exports.updateCertificateSettings = async (req, res) => {
  try {
    const allowedFields = Object.keys(defaultCertificateSettings);
    const updates = Object.fromEntries(
      allowedFields
        .filter((field) => req.body[field] !== undefined)
        .map((field) => [field, typeof req.body[field] === "string" ? req.body[field].trim() : req.body[field]])
    );
    const settings = await CertificateSettings.findOneAndUpdate(
      { settingKey: "global" },
      { $set: updates, $setOnInsert: { settingKey: "global" } },
      { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }
    );
    return res.json({ success: true, settings });
  } catch (error) {
    console.error("Update certificate settings error:", error);
    return res.status(500).json({ message: "Failed to save certificate settings" });
  }
};

exports.getCertificateStatus = async (req, res) => {
  try {
    const eligibility = await getEligibility(req.user._id, req.params.courseId);
    if (!eligibility.course) return res.status(404).json({ message: "Course not found" });
    if (!eligibility.enrolled) return res.status(403).json({ message: "You are not enrolled in this course" });

    const certificate = await Certificate.findOne({
      user: req.user._id,
      course: req.params.courseId,
    }).select("certificateId issuedAt");

    return res.json({
      success: true,
      eligible: eligibility.eligible,
      progress: eligibility.progress,
      totalLessons: eligibility.totalLessons,
      completedLessons: eligibility.completedLessons,
      certificate,
      course: eligibility.course,
    });
  } catch (error) {
    console.error("Certificate status error:", error);
    return res.status(500).json({ message: "Failed to check certificate status" });
  }
};

exports.generateCertificate = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.user._id;
    const eligibility = await getEligibility(userId, courseId);

    if (!eligibility.course) return res.status(404).json({ message: "Course not found" });
    if (!eligibility.enrolled) return res.status(403).json({ message: "You are not enrolled in this course" });
    if (!eligibility.eligible) {
      return res.status(403).json({
        message: "Complete all lessons before generating a certificate",
        progress: eligibility.progress,
      });
    }

    let certificate = await Certificate.findOne({ user: userId, course: courseId });
    if (!certificate) {
      try {
        certificate = await Certificate.create({
          user: userId,
          course: courseId,
          certificateId: newCertificateId(),
        });
      } catch (error) {
        if (error.code !== 11000) throw error;
        certificate = await Certificate.findOne({ user: userId, course: courseId });
      }
    }

    const settings = await CertificateSettings.findOne({ settingKey: "global" }).lean() || defaultCertificateSettings;
    await generateCertificatePDF({
      userName: req.user.name,
      courseTitle: eligibility.course.name,
      certificateId: certificate.certificateId,
      issuedAt: certificate.issuedAt,
      settings,
    });

    return res.json({ success: true, certificate, course: eligibility.course });
  } catch (error) {
    console.error("Certificate generation error:", error);
    return res.status(500).json({ message: "Failed to generate certificate" });
  }
};

// ==========================
// GET MY CERTIFICATES
// ==========================
exports.getMyCertificates = async (req, res) => {
  try {
    const userId = req.user.id;

    const certificates = await Certificate.find({ user: userId })
        .populate("course", "name");

    res.json(certificates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch certificates" });
  }
};

// ==========================
// DOWNLOAD CERTIFICATE (SECURE)
// ==========================
exports.downloadCertificate = async (req, res) => {
  try {
    const certId = req.params.id;
    const userId = req.user.id;

    const lookup = [{ certificateId: certId }];
    if (mongoose.isValidObjectId(certId)) lookup.push({ _id: certId });
    const certificate = await Certificate.findOne({ $or: lookup });

    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    // 🔐 ownership check
    if (certificate.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    const pdfPath = path.join(
      __dirname,
      "..",
      "certificates",
      `${certificate.certificateId}.pdf`
    );

    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({ message: "Certificate PDF not found" });
    }

    res.download(pdfPath);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Download failed" });
  }
};

exports.verifyCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ certificateId: req.params.certificateId })
      .populate("course", "name");

    if (!certificate) {
      return res.status(404).json({ valid: false, message: "Certificate not found" });
    }

    const user = await User.findById(certificate.user).select("name");
    return res.json({
      valid: true,
      certificate: {
        certificateId: certificate.certificateId,
        issueDate: certificate.issuedAt,
        courseName: certificate.course?.name,
        studentName: user?.name,
      },
    });
  } catch (error) {
    console.error("Certificate verification error:", error);
    return res.status(500).json({ valid: false, message: "Certificate verification failed" });
  }
};






