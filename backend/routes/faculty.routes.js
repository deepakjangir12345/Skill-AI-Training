const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/faculty.controller');
const { facultyOnly } = require('../middleware/roleAuth');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Configure multer for video uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/videos/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'video-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept video files only
  if (file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only video files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
});

// Apply faculty auth middleware to all routes
router.use(facultyOnly);

// Get faculty's assigned courses
router.get('/my-courses', facultyController.getMyCourses);

// Get videos for a specific course
router.get('/course/:courseId/videos', facultyController.getCourseVideos);

// Upload video to a course
router.post('/course/:courseId/upload-video', upload.single('video'), facultyController.uploadVideo);

// Update video details
router.put('/video/:videoId', facultyController.updateVideo);

// Delete video
router.delete('/video/:videoId', facultyController.deleteVideo);

module.exports = router;
