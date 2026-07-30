const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const adminFacultyController = require('../controllers/adminFaculty.controller');
const adminAuth = require('../middleware/adminAuth');

// Apply admin auth middleware to all routes
router.use(adminAuth);

// Dashboard stats
router.get('/dashboard/stats', adminController.getDashboardStats);

// Courses
router.get('/courses', adminController.getAllCourses);

// Users
router.get('/users', adminController.getAllUsers);

// Enrollments
router.get('/enrollments', adminController.getAllEnrollments);

// Payments
router.get('/payments', adminController.getAllPayments);

// Faculty Management
router.post('/faculty/create', adminFacultyController.createFaculty);
router.get('/faculty', adminFacultyController.getAllFaculty);
router.post('/faculty/assign-course', adminFacultyController.assignCourseToFaculty);
router.delete('/faculty/remove-from-course/:courseId', adminFacultyController.removeFacultyFromCourse);

module.exports = router;
