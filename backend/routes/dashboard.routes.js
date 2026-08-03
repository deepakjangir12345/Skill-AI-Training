const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.Middleware");
const {
  getDashboardStats,
} = require("../controllers/dashboard.controller");

// GET Dashboard Stats
router.get("/stats", authMiddleware, getDashboardStats);

module.exports = router;