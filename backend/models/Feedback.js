const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
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

    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    teachingQuality: {
      type: Number,
      min: 1,
      max: 5,
    },

    understandingLevel: {
      type: Number,
      min: 1,
      max: 5,
    },

    problems: {
      type: String,
      default: "",
      trim: true,
    },

    suggestions: {
      type: String,
      default: "",
      trim: true,
    },

    needsSession: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["pending", "reviewed", "session-scheduled"],
      default: "pending",
    },

    sessionScheduledAt: {
  type: Date,
  default: null,
},

sessionMeetingLink: {
  type: String,
  default: "",
  trim: true,
},

sessionNote: {
  type: String,
  default: "",
  trim: true,
},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Feedback", feedbackSchema);