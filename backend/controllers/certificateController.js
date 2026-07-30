const path = require("path");
const fs = require("fs");
const Certificate = require("../models/Certificate");

// ==========================
// GET MY CERTIFICATES
// ==========================
exports.getMyCertificates = async (req, res) => {
  try {
    const userId = req.user.id;

    const certificates = await Certificate.find({ user: userId })
      .populate("course", "title");

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

    const certificate = await Certificate.findById(certId);

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
      `${certificate._id}.pdf`
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






