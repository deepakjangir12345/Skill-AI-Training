const mongoose = require("mongoose");

const lessonProgressSchema = new mongoose.Schema(
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
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
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

// one lesson only once per user
lessonProgressSchema.index(
  { user: 1, lesson: 1 },
  { unique: true }
);

module.exports = mongoose.model("LessonProgress", lessonProgressSchema);
