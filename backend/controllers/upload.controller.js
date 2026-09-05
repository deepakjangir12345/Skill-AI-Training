const User = require("../models/User");

// Upload Profile Image
exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded.",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        profileImage: req.file.path,
      },
      {
        new: true,
      }
    ).select("-password");

    res.json({
      success: true,
      message: "Profile photo uploaded successfully.",
      user: updatedUser,
    });

  } catch (error) {
    console.error("Upload Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to upload image.",
    });
  }
};

exports.uploadLessonResources = async (req, res) => {
  try {
    const video = req.files?.video?.[0];
    const pdf = req.files?.pdf?.[0];

    if (!video && !pdf) {
      return res.status(400).json({
        success: false,
        message: "Select a video or PDF file to upload.",
      });
    }

    return res.json({
      success: true,
      videoUrl: video?.secure_url || video?.path || null,
      pdfUrl: pdf?.secure_url || pdf?.path || null,
    });
  } catch (error) {
    console.error("Lesson resource upload error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to upload lesson resources.",
    });
  }
};

exports.uploadCertificateAsset = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No image uploaded." });
  }
  return res.json({ success: true, url: req.file.secure_url || req.file.path });
};