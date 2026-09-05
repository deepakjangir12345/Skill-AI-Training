const express = require("express");
const {
  getModulesByCourse,
  createModule,
  updateModule,
  deleteModule,
} = require("../controllers/moduleController");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

router.use(adminAuth);
router.get("/course/:courseId", getModulesByCourse);
router.post("/", createModule);
router.put("/:moduleId", updateModule);
router.delete("/:moduleId", deleteModule);

module.exports = router;