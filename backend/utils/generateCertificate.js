const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

module.exports = function generateCertificate({
  userName,
  courseTitle,
  certificateId,
}) {
  const certificatesDir = path.join(__dirname, "../certificates");

  if (!fs.existsSync(certificatesDir)) {
    fs.mkdirSync(certificatesDir);
  }

  const filePath = path.join(
    certificatesDir,
    `certificate-${certificateId}.pdf`
  );

  const doc = new PDFDocument({ size: "A4", margin: 50 });
  doc.pipe(fs.createWriteStream(filePath));

  doc
    .fontSize(26)
    .text("Certificate of Completion", { align: "center" })
    .moveDown(2);

  doc.fontSize(18).text("This is to certify that", { align: "center" });
  doc.moveDown(1);

  doc
    .fontSize(22)
    .text(userName, { align: "center", underline: true })
    .moveDown(1);

  doc
    .fontSize(18)
    .text("has successfully completed the course", { align: "center" })
    .moveDown(1);

  doc
    .fontSize(20)
    .text(courseTitle, { align: "center", bold: true })
    .moveDown(3);

  doc.fontSize(12).text(`Certificate ID: ${certificateId}`, {
    align: "center",
  });

  doc.end();

  return filePath;
};

