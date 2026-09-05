const mongoose = require("mongoose");

const facultyVideoProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },

    completed: {
      type: Boolean,
      default: false,
    },

    completedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// One faculty video can be completed only once by one student
facultyVideoProgressSchema.index(
  { user: 1, video: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "FacultyVideoProgress",
  facultyVideoProgressSchema
);