const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.Middleware");
const upload = require("../middleware/upload");

const {
  uploadProfileImage,
} = require("../controllers/upload.controller");

router.post(
  "/profile-image",
  authMiddleware,
  upload.single("image"),
  uploadProfileImage
);

module.exports = router;