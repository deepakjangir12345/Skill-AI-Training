const express = require("express");
const router = express.Router();

const {
  getMyCertificates,
  downloadCertificate,
  getCertificateStatus,
  generateCertificate,
  verifyCertificate,
} = require("../controllers/certificateController");

const authMiddleware = require("../middleware/auth.Middleware");

// GET MY CERTIFICATES
router.get("/my", authMiddleware, getMyCertificates);

router.get("/verify/:certificateId", verifyCertificate);

router.get("/download/:id", authMiddleware, downloadCertificate);

router.get("/:courseId", authMiddleware, getCertificateStatus);
router.post("/:courseId/generate", authMiddleware, generateCertificate);

module.exports = router;







