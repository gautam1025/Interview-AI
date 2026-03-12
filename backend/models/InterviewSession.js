const mongoose = require("mongoose");

const interviewSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // added for query performance
    },
    role: {
      type: String,
      required: true,
    },
    experienceLevel: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      required: true,
    },
    questions: [String],
    answers: [
      {
        question: String,
        answer: String,
      }
    ],
    totalScore: {
      type: Number,
      default: 0,
    },
    evaluation: {
      technicalScore: Number,
      clarityScore: Number,
      confidenceScore: Number,
      structureScore: Number,
      overallScore: Number,
      strengths: [String],
      weaknesses: [String],
      improvementPlan: [String],
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("InterviewSession", interviewSessionSchema);