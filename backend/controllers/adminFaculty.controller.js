const User = require('../models/User');
const Course = require('../models/Course');
const bcrypt = require('bcryptjs');

// Create faculty user
exports.createFaculty = async (req, res) => {
  try {
    const { name, email, password, assignedCourses } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create faculty user
    const faculty = new User({
      name,
      email,
      password: hashedPassword,
      role: 'faculty'
    });

    await faculty.save();

    // Assign courses to faculty if provided
    if (assignedCourses && assignedCourses.length > 0) {
      await Course.updateMany(
        { _id: { $in: assignedCourses } },
        { instructorId: faculty._id }
      );
    }

    res.status(201).json({
      message: 'Faculty user created successfully',
      faculty: {
        id: faculty._id,
        name: faculty.name,
        email: faculty.email,
        role: faculty.role,
        assignedCourses: assignedCourses || []
      }
    });
  } catch (error) {
    console.error('Error creating faculty:', error);
    res.status(500).json({ message: 'Failed to create faculty user' });
  }
};

// Get all faculty users
exports.getAllFaculty = async (req, res) => {
  try {
    const faculty = await User.find({ role: 'faculty' })
      .select('-password')
      .sort({ createdAt: -1 });

    // Get course counts for each faculty
    const facultyWithCourseCount = await Promise.all(
      faculty.map(async (f) => {
        const courseCount = await Course.countDocuments({ instructorId: f._id });
        return {
          ...f.toObject(),
          courseCount
        };
      })
    );

    res.json(facultyWithCourseCount);
  } catch (error) {
    console.error('Error fetching faculty:', error);
    res.status(500).json({ message: 'Failed to fetch faculty' });
  }
};

// Assign course to faculty
exports.assignCourseToFaculty = async (req, res) => {
  try {
    const { facultyId, courseId } = req.body;

    // Check if faculty exists
    const faculty = await User.findOne({ _id: facultyId, role: 'faculty' });
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Assign course to faculty
    course.instructorId = facultyId;
    await course.save();

    res.json({
      message: 'Course assigned to faculty successfully',
      course: {
        id: course._id,
        name: course.name,
        instructorId: course.instructorId
      }
    });
  } catch (error) {
    console.error('Error assigning course:', error);
    res.status(500).json({ message: 'Failed to assign course' });
  }
};

// Remove faculty assignment from course
exports.removeFacultyFromCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    course.instructorId = null;
    await course.save();

    res.json({
      message: 'Faculty removed from course successfully',
      course: {
        id: course._id,
        name: course.name,
        instructorId: null
      }
    });
  } catch (error) {
    console.error('Error removing faculty:', error);
    res.status(500).json({ message: 'Failed to remove faculty' });
  }
};
