const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const createUpload = ({ folder, allowedFormats, fileFilter, fileSize }) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder,
      allowed_formats: allowedFormats,
      resource_type: "auto",
    },
  });

  return multer({
    storage,
    fileFilter,
    limits: { fileSize },
  });
};

const upload = createUpload({
  folder: "skill-ai-training/profile-images",
  allowedFormats: ["jpg", "jpeg", "png", "webp"],
  fileSize: 5 * 1024 * 1024,
});

const lessonResourceUpload = createUpload({
  folder: "skill-ai-training/lesson-resources",
  allowedFormats: ["mp4", "mov", "webm", "avi", "mkv", "pdf"],
  fileSize: 500 * 1024 * 1024,
  fileFilter: (req, file, callback) => {
    const allowedMimeTypes = [
      "video/mp4",
      "video/quicktime",
      "video/webm",
      "video/x-msvideo",
      "video/x-matroska",
      "application/pdf",
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      return callback(null, true);
    }

    return callback(new Error("Only MP4, MOV, WEBM, AVI, MKV videos and PDF files are allowed"));
  },
});

const certificateAssetUpload = createUpload({
  folder: "skill-ai-training/certificate-assets",
  allowedFormats: ["jpg", "jpeg", "png", "webp"],
  fileSize: 10 * 1024 * 1024,
  fileFilter: (req, file, callback) => {
    if (["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
      return callback(null, true);
    }
    return callback(new Error("Only JPG, PNG and WEBP image files are allowed"));
  },
});

module.exports = upload;
module.exports.lessonResourceUpload = lessonResourceUpload;
module.exports.certificateAssetUpload = certificateAssetUpload;