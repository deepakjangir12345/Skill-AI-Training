const mongoose = require("mongoose");

const liveClassSchema = new mongoose.Schema(
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

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    meetingLink: {
      type: String,
      required: true,
      trim: true,
    },

    scheduledAt: {
      type: Date,
      required: true,
    },

    duration: {
      type: Number,
      required: true,
      min: 1,
    },

    // Normal class or student feedback session
    sessionType: {
      type: String,
      enum: ["regular", "feedback"],
      default: "regular",
    },

    status: {
      type: String,
      enum: ["upcoming", "live", "completed"],
      default: "upcoming",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("LiveClass", liveClassSchema);