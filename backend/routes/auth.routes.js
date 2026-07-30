const express = require("express");
const router = express.Router();

const {
  register,
  login,
  verifyToken,
  googleAuth,
  googleCallback,
  forgotPassword,
  resetPassword
} = require("../controllers/auth.controller");

router.post("/register", register);
router.post("/login", login);
router.get("/verify", verifyToken);

// Google OAuth routes
router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);

// Password reset routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;



