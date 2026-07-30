const express = require('express');
const router = express.Router();
const supportController = require('../controllers/support.controller');
const authMiddleware = require('../middleware/auth.Middleware');

// Submit support query (public)
router.post('/query', supportController.submitSupportQuery);

// Admin only: Get all support queries
router.get('/queries', authMiddleware, supportController.getAllSupportQueries);

// Admin only: Update query status
router.put('/queries/:id', authMiddleware, supportController.updateQueryStatus);

module.exports = router;
