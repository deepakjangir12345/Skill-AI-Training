const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.Middleware");

const {
  getProfile,
  updateProfile,
} = require("../controllers/profile.controller");

// GET Logged-in User Profile
router.get("/", authMiddleware, getProfile);

// UPDATE Logged-in User Profile
router.put("/", authMiddleware, updateProfile);

module.exports = router;