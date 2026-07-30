const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

module.exports = function generateCertificatePDF({ userName, courseTitle, certificateId }) {
  const certDir = path.join(__dirname, "..", "certificates");
  if (!fs.existsSync(certDir)) fs.mkdirSync(certDir);

  const filePath = path.join(certDir, `${certificateId}.pdf`);
  const doc = new PDFDocument({ size: "A4", margin: 50 });

  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(26).text("Certificate of Completion", { align: "center" });
  doc.moveDown(2);

  doc.fontSize(16).text("This is to certify that", { align: "center" });
  doc.moveDown(1);

  doc.fontSize(22).text(userName, { align: "center", underline: true });
  doc.moveDown(1);

  doc.fontSize(16).text("has successfully completed the course", { align: "center" });
  doc.moveDown(1);

  doc.fontSize(20).text(courseTitle, { align: "center", underline: true });
  doc.moveDown(3);

  doc.fontSize(12).text(`Certificate ID: ${certificateId}`, { align: "center" });

  doc.end();

  return filePath;
};
