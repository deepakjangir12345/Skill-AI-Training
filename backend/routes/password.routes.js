const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.Middleware");

const {
  changePassword,
} = require("../controllers/password.controller");

// Change Password
router.put(
  "/change",
  authMiddleware,
  changePassword
);

module.exports = router;