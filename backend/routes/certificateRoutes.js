const express = require("express");
const router = express.Router();

const {
  getMyCertificates,
  downloadCertificate
} = require("../controllers/certificateController");

const authMiddleware = require("../middleware/authMiddleware");

// GET MY CERTIFICATES
router.get("/my", authMiddleware, getMyCertificates);

// DOWNLOAD CERTIFICATE (SECURE)
router.get("/download/:id", authMiddleware, downloadCertificate);

module.exports = router;







