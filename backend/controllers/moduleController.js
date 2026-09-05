const Course = require("../models/Course");
const Lesson = require("../models/Lesson");
const Module = require("../models/Module");

const getCourse = async (courseId) => Course.findById(courseId).select("_id");

exports.getModulesByCourse = async (req, res) => {
  try {
    const modules = await Module.find({ course: req.params.courseId }).sort({ order: 1, createdAt: 1 });
    return res.json({ success: true, modules });
  } catch (error) {
    console.error("Get modules error:", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.createModule = async (req, res) => {
  try {
    const { title, description, course, order } = req.body;

    if (!title || !course || order === undefined || order === "") {
      return res.status(400).json({ message: "Title, course and order are required" });
    }

    if (!await getCourse(course)) {
      return res.status(404).json({ message: "Course not found" });
    }

    const moduleRecord = await Module.create({
      title,
      description,
      course,
      order: Number(order),
    });

    return res.status(201).json({ success: true, module: moduleRecord });
  } catch (error) {
    console.error("Create module error:", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.updateModule = async (req, res) => {
  try {
    const { title, description, order } = req.body;
    const moduleRecord = await Module.findByIdAndUpdate(
      req.params.moduleId,
      { title, description, order: Number(order) },
      { new: true, runValidators: true }
    );

    if (!moduleRecord) {
      return res.status(404).json({ message: "Module not found" });
    }

    return res.json({ success: true, module: moduleRecord });
  } catch (error) {
    console.error("Update module error:", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteModule = async (req, res) => {
  try {
    const lessonCount = await Lesson.countDocuments({ module: req.params.moduleId });
    if (lessonCount > 0) {
      return res.status(409).json({
        message: "Move or delete this module's lessons before deleting the module",
      });
    }

    const moduleRecord = await Module.findByIdAndDelete(req.params.moduleId);
    if (!moduleRecord) {
      return res.status(404).json({ message: "Module not found" });
    }

    return res.json({ success: true, message: "Module deleted successfully" });
  } catch (error) {
    console.error("Delete module error:", error);
    return res.status(500).json({ message: error.message });
  }
};