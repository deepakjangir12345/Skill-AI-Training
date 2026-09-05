const mongoose = require('mongoose');
const Course = require('../models/Course');
const User = require('../models/User');
const Enrollment = require('../models/Enrollment');
const Payment = require('../models/Payment');

// Get admin dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const stats = {
      totalUsers: await User.countDocuments(),
      totalCourses: await Course.countDocuments(),
      totalEnrollments: await Enrollment.countDocuments(),
      totalPayments: await Payment.countDocuments(),
      totalRevenue: await Payment.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]).then(result => result[0]?.total || 0)
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard stats' });
  }
};

// Get all courses (admin view)
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Failed to fetch courses' });
  }
};

// Get all users (admin view)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// Get all enrollments (admin view)
exports.getAllEnrollments = async (req, res) => {
  try {
    let enrollmentQuery = Enrollment.find().sort({ createdAt: -1 });

    if (Enrollment.schema.path('userId')) {
      enrollmentQuery = enrollmentQuery.populate('userId', 'name email');
    }
    if (Enrollment.schema.path('user')) {
      enrollmentQuery = enrollmentQuery.populate('user', 'name email');
    }
    if (Enrollment.schema.path('course')) {
      enrollmentQuery = enrollmentQuery.populate('course', 'name price');
    }

    const enrollments = await enrollmentQuery;
    const courseIds = enrollments
      .map(enrollment => enrollment.courseId)
      .filter(courseId => courseId && mongoose.isValidObjectId(courseId));

    const courses = await Course.find({ _id: { $in: courseIds } })
      .select('name price');
    const courseMap = new Map(
      courses.map(course => [course._id.toString(), course])
    );

    const formattedEnrollments = enrollments.map(enrollment => {
      const enrollmentData = enrollment.toObject();
      const populatedCourse = enrollmentData.course;
      const storedCourseId = enrollmentData.courseId;
      const fallbackCourse = storedCourseId
        ? courseMap.get(storedCourseId.toString()) || null
        : null;

      return {
        ...enrollmentData,
        courseId: storedCourseId
          ? fallbackCourse
          : populatedCourse || null
      };
    });

    res.json(formattedEnrollments);
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    res.status(500).json({ message: 'Failed to fetch enrollments' });
  }
};

// Get all payments (admin view)
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    const courseIds = payments
      .map(payment => payment.courseId)
      .filter(courseId => courseId && mongoose.isValidObjectId(courseId));

    const courses = await Course.find({ _id: { $in: courseIds } })
      .select('name price');
    const courseMap = new Map(
      courses.map(course => [course._id.toString(), course])
    );

    const formattedPayments = payments.map(payment => {
      const paymentData = payment.toObject();
      const courseId = paymentData.courseId;

      return {
        ...paymentData,
        courseId: courseId
          ? courseMap.get(courseId.toString()) || null
          : null
      };
    });

    res.json(formattedPayments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ message: 'Failed to fetch payments' });
  }
};

// ======================
// UPDATE USER ROLE
// ======================

exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    // Only valid roles allowed
    if (!['user', 'faculty', 'admin'].includes(role)) {
      return res.status(400).json({
        message: 'Invalid role'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    user.role = role;

    await user.save();

    res.json({
      message: 'User role updated successfully',
      user
    });

  } catch (error) {
    console.error('Error updating user role:', error);

    res.status(500).json({
      message: 'Role update failed'
    });
  }
};
