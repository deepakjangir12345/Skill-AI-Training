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