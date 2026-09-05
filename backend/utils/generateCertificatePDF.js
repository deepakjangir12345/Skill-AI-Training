const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");

module.exports = async function generateCertificatePDF({
  userName,
  courseTitle,
  certificateId,
  issuedAt,
  settings = {},
}) {
  const certDir = path.join(__dirname, "..", "certificates");

  if (!fs.existsSync(certDir)) {
    fs.mkdirSync(certDir, { recursive: true });
  }

  const filePath = path.join(certDir, `${certificateId}.pdf`);

  const doc = new PDFDocument({
    size: "A4",
    layout: "landscape",
    margin: 40,
  });

  const output = fs.createWriteStream(filePath);

  doc.pipe(output);

  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;

  // =========================
  // CERTIFICATE BORDER
  // =========================

  doc
    .lineWidth(6)
    .rect(20, 20, pageWidth - 40, pageHeight - 40)
    .stroke();

  doc
    .lineWidth(1)
    .rect(30, 30, pageWidth - 60, pageHeight - 60)
    .stroke();

  // =========================
  // LOGO
  // =========================

  if (settings.logoUrl) {
    try {
      const response = await fetch(settings.logoUrl);

      if (response.ok) {
        const buffer = Buffer.from(await response.arrayBuffer());

        doc.image(
          buffer,
          pageWidth / 2 - 40,
          50,
          {
            fit: [80, 60],
          }
        );
      }
    } catch (error) {
      console.warn(
        "Certificate logo could not be loaded:",
        error.message
      );
    }
  }

  // =========================
  // TITLE
  // =========================

  doc
    .fontSize(30)
    .text(
      settings.certificateTitle ||
        "Certificate of Completion",
      60,
      120,
      {
        width: pageWidth - 120,
        align: "center",
      }
    );

  // =========================
  // SUBTITLE
  // =========================

  doc
    .fontSize(16)
    .text(
      settings.subtitle ||
        "This is to certify that",
      60,
      185,
      {
        width: pageWidth - 120,
        align: "center",
      }
    );

  // =========================
  // STUDENT NAME
  // =========================

  doc
    .fontSize(28)
    .text(
      userName || "Student",
      60,
      230,
      {
        width: pageWidth - 120,
        align: "center",
        underline: true,
      }
    );

  // =========================
  // COMPLETION TEXT
  // =========================

  doc
    .fontSize(16)
    .text(
      "has successfully completed the course",
      60,
      290,
      {
        width: pageWidth - 120,
        align: "center",
      }
    );

  // =========================
  // COURSE NAME
  // =========================

  doc
    .fontSize(24)
    .text(
      courseTitle,
      60,
      330,
      {
        width: pageWidth - 120,
        align: "center",
        underline: true,
      }
    );

  // =========================
  // CERTIFICATE DETAILS
  // =========================

  doc
    .fontSize(11)
    .text(
      `Certificate ID: ${certificateId}`,
      60,
      410,
      {
        width: pageWidth - 120,
        align: "center",
      }
    );

  doc
    .fontSize(11)
    .text(
      `Issued on: ${new Date(
        issuedAt || Date.now()
      ).toLocaleDateString()}`,
      60,
      430,
      {
        width: pageWidth - 120,
        align: "center",
      }
    );

  // =========================
  // QR CODE
  // =========================

  try {
    const qrData = `http://localhost:5173/verify-certificate?certificateId=${encodeURIComponent(
      certificateId
    )}`;

    const qrBuffer = await QRCode.toBuffer(qrData, {
      width: 110,
      margin: 1,
    });

    doc.image(qrBuffer, 70, pageHeight - 170, {
      fit: [100, 100],
    });

    doc
      .fontSize(8)
      .text(
        "Scan to verify certificate",
        55,
        pageHeight - 60,
        {
          width: 130,
          align: "center",
        }
      );
  } catch (error) {
    console.warn(
      "QR code could not be generated:",
      error.message
    );
  }

  // =========================
  // SIGNATURE
  // =========================

  const signatureX = pageWidth - 250;
  const signatureY = pageHeight - 150;

  if (settings.signatureImageUrl) {
    try {
      const response = await fetch(
        settings.signatureImageUrl
      );

      if (response.ok) {
        const buffer = Buffer.from(
          await response.arrayBuffer()
        );

        doc.image(
          buffer,
          signatureX,
          signatureY,
          {
            fit: [150, 55],
          }
        );
      }
    } catch (error) {
      console.warn(
        "Certificate signature could not be loaded:",
        error.message
      );
    }
  }

  // =========================
  // SIGNATURE TEXT
  // =========================

  doc
    .moveTo(signatureX, pageHeight - 85)
    .lineTo(signatureX + 170, pageHeight - 85)
    .stroke();

  doc
    .fontSize(11)
    .text(
      settings.signatureName ||
        "Authorized Signature",
      signatureX,
      pageHeight - 75,
      {
        width: 170,
        align: "center",
      }
    );

  doc
    .fontSize(9)
    .text(
      settings.signatureDesignation ||
        "Course Director",
      signatureX,
      pageHeight - 58,
      {
        width: 170,
        align: "center",
      }
    );

  // =========================
  // ORGANIZATION NAME
  // =========================

  doc
    .fontSize(14)
    .text(
      settings.organizationName ||
        "Skill.AI Training",
      60,
      pageHeight - 100,
      {
        width: pageWidth - 120,
        align: "center",
      }
    );

  return new Promise((resolve, reject) => {
    output.on("finish", () => resolve(filePath));

    output.on("error", reject);

    doc.end();
  });
};