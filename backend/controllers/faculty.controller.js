const Course = require('../models/Course');
const Video = require('../models/Video');
const Module = require('../models/Module');
const fs = require('fs');
const path = require('path');
const FacultyVideoProgress = require('../models/FacultyVideoProgress');
const Enrollment = require('../models/Enrollment');

// Get faculty's assigned courses
exports.getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructorId: req.user._id })
      .select('name description price createdAt')
      .sort({ createdAt: -1 });
    
    res.json(courses);
  } catch (error) {
    console.error('Error fetching faculty courses:', error);
    res.status(500).json({ message: 'Failed to fetch courses' });
  }
};

// Get modules for faculty's assigned course
exports.getCourseModules = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Check if course exists and faculty is assigned
    const course = await Course.findOne({
      _id: courseId,
      instructorId: req.user._id
    });

    if (!course) {
      return res.status(404).json({
        message: 'Course not found or access denied'
      });
    }

    const modules = await Module.find({
      course: courseId
    }).sort({
      order: 1,
      createdAt: 1
    });

    res.json({
      success: true,
      modules
    });

  } catch (error) {
    console.error('Error fetching faculty course modules:', error);

    res.status(500).json({
      message: 'Failed to fetch course modules'
    });
  }
};

// Upload video to a course
exports.uploadVideo = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, module } = req.body;

    // Check if course exists and faculty is assigned
    const course = await Course.findOne({ 
      _id: courseId, 
      instructorId: req.user._id 
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found or access denied' });
    }

    if (module) {
  const moduleRecord = await Module.findOne({
    _id: module,
    course: courseId
  });

  if (!moduleRecord) {
    return res.status(400).json({
      message: 'Invalid module for this course'
    });
  }
}

    if (!req.file) {
      return res.status(400).json({ message: 'No video file uploaded' });
    }

    // Create video record
    const video = new Video({
      title,
      description: description || '',
      videoUrl: `/uploads/videos/${req.file.filename}`,
      videoPath: req.file.path,
      duration: 0, // Will be updated later with video processing
      size: req.file.size,
      courseId,
      module: module || null,
      uploadedBy: req.user._id,
      order: 0 // Will be updated later
    });

    await video.save();

    res.status(201).json({
      message: 'Video uploaded successfully',
      video: {
        id: video._id,
        title: video.title,
        description: video.description,
        videoUrl: video.videoUrl,
        size: video.size,
        createdAt: video.createdAt
      }
    });
  } catch (error) {
    console.error('Error uploading video:', error);
    
    // Clean up uploaded file if error occurs
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ message: 'Failed to upload video' });
  }
};

// Get videos for a course
exports.getCourseVideos = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Check if course exists and faculty is assigned
    const course = await Course.findOne({ 
      _id: courseId, 
      instructorId: req.user._id 
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found or access denied' });
    }

    const videos = await Video.find({ courseId })
      .select('title description videoUrl duration size order isPublished createdAt')
      .sort({ order: 1, createdAt: 1 });

    res.json(videos);
  } catch (error) {
    console.error('Error fetching course videos:', error);
    res.status(500).json({ message: 'Failed to fetch videos' });
  }
};

// Update video details
exports.updateVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { title, description, order, isPublished } = req.body;

    const video = await Video.findOne({ 
      _id: videoId,
      uploadedBy: req.user._id 
    }).populate('courseId');

    if (!video) {
      return res.status(404).json({ message: 'Video not found or access denied' });
    }

    // Update video fields
    if (title !== undefined) video.title = title;
    if (description !== undefined) video.description = description;
    if (order !== undefined) video.order = order;
    if (isPublished !== undefined) video.isPublished = isPublished;

    await video.save();

    res.json({
      message: 'Video updated successfully',
      video: {
        id: video._id,
        title: video.title,
        description: video.description,
        order: video.order,
        isPublished: video.isPublished,
        updatedAt: video.updatedAt
      }
    });
  } catch (error) {
    console.error('Error updating video:', error);
    res.status(500).json({ message: 'Failed to update video' });
  }
};

// Delete video
exports.deleteVideo = async (req, res) => {
  try {
    const { videoId } = req.params;

    const video = await Video.findOne({ 
      _id: videoId,
      uploadedBy: req.user._id 
    });

    if (!video) {
      return res.status(404).json({ message: 'Video not found or access denied' });
    }

    // Delete video file from filesystem
    if (fs.existsSync(video.videoPath)) {
      fs.unlinkSync(video.videoPath);
    }

    await Video.findByIdAndDelete(videoId);

    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({ message: 'Failed to delete video' });
  }
};

// Mark faculty video as completed by student
exports.completeFacultyVideo = async (req, res) => {
  try {
    const { videoId } = req.params;

    // Find published faculty video
    const video = await Video.findOne({
      _id: videoId,
      isPublished: true
    });

    if (!video) {
      return res.status(404).json({
        message: 'Video not found or not published'
      });
    }

    // Check student enrollment
    const enrolled = await Enrollment.findOne({
      $or: [
        {
          user: req.user._id,
          course: video.courseId
        },
        {
          userId: req.user._id,
          courseId: video.courseId
        },
        {
          user: req.user._id,
          courseId: video.courseId
        },
        {
          userId: req.user._id,
          course: video.courseId
        }
      ]
    });

    if (!enrolled) {
      return res.status(403).json({
        message: 'You are not enrolled in this course'
      });
    }

    // Create/update progress
    const progress = await FacultyVideoProgress.findOneAndUpdate(
      {
        user: req.user._id,
        video: video._id
      },
      {
        $set: {
          completed: true,
          completedAt: new Date(),
          course: video.courseId
        },
        $setOnInsert: {
          user: req.user._id,
          video: video._id
        }
      },
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    );

    return res.json({
      success: true,
      message: 'Faculty video completed successfully',
      completed: progress.completed,
      videoId: video._id
    });

  } catch (error) {
    console.error('Complete faculty video error:', error);

    return res.status(500).json({
      message: 'Failed to complete faculty video'
    });
  }
};
