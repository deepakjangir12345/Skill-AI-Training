const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    videoUrl: {
      type: String,
      default: "",
    },

    pdfUrl: {
      type: String,
      default: "",
    },

    duration: {
      type: Number,
      default: 0, // minutes
    },

    isPreview: {
      type: Boolean,
      default: false,
    },

    order: {
      type: Number,
      required: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Lesson", lessonSchema);