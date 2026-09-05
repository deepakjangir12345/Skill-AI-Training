const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.Middleware");
const upload = require("../middleware/upload");
const adminAuth = require("../middleware/adminAuth");

const {
  uploadProfileImage,
  uploadLessonResources,
  uploadCertificateAsset,
} = require("../controllers/upload.controller");

router.post(
  "/profile-image",
  authMiddleware,
  upload.single("image"),
  uploadProfileImage
);

router.post(
  "/certificate-asset",
  adminAuth,
  (req, res, next) => upload.certificateAssetUpload.single("image")(req, res, (error) => {
    if (error) return res.status(400).json({ success: false, message: error.message });
    return next();
  }),
  uploadCertificateAsset
);

router.post(
  "/lesson-resources",
  adminAuth,
  (req, res, next) => upload.lessonResourceUpload.fields([
    { name: "video", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ])(req, res, (error) => {
    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
    return next();
  }),
  uploadLessonResources
);

module.exports = router;