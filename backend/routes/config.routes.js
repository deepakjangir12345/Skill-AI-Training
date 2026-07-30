const express = require('express');
const router = express.Router();
const configController = require('../controllers/config.controller');

// Get configuration including WhatsApp details
router.get('/', configController.getConfig);

module.exports = router;
