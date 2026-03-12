const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const InterviewSession = require("../models/InterviewSession");
const { generateQuestions, evaluateAnswers } = require("../services/aiService");

// Route to generate a new interview session
router.post("/create", protect, async (req, res) => {
  const { role, experienceLevel } = req.body;

  // 🔹 Get previous completed sessions
  const previousSessions = await InterviewSession
    .find({ user: req.user._id, totalScore: { $gt: 0 } })
    .sort({ createdAt: -1 })
    .limit(3);

  // 🔹 Default difficulty
  let difficulty = "easy";

  // 🔹 Calculate recent average score
  if (previousSessions.length > 0) {
    const avgScore =
      previousSessions.reduce((sum, s) => sum + s.totalScore, 0) /
      previousSessions.length;

    if (avgScore >= 7) difficulty = "hard";
    else if (avgScore >= 4) difficulty = "medium";
  }

  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Generate AI Questions
    const questions = await generateQuestions(role, experienceLevel, difficulty);

    const session = await InterviewSession.create({
      user: req.user._id,
      role,
      experienceLevel,
      difficulty,
      questions,
    });

    res.status(201).json(session);

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

router.post("/submit/:id", protect, async (req, res) => {
  const { answers } = req.body;

  try {
    const session = await InterviewSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Save answers
    session.answers = session.questions.map((q, index) => ({
      question: q,
      answer: answers[index] || ""
    }));

    // Call AI for evaluation
    const evaluation = await evaluateAnswers(
      session.role,
      session.experienceLevel,
      session.questions,
      answers
    );

    session.evaluation = evaluation;
    session.totalScore = evaluation.overallScore;

    await session.save();

    res.json({
      message: "Interview evaluated successfully",
      evaluation
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
});

router.get("/:id", protect, async (req, res) => {
  try {
    const session = await InterviewSession.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    
    // Security Fix: Prevent IDOR
    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to view this session" });
    }

    res.json(session);
  } catch (error) {
    // Catch CastError (invalid ObjectId format) and other unknown errors
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.get("/", protect, async (req, res) => {
  try {
    const sessions = await InterviewSession.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json(sessions);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch sessions",
      error: error.message,
    });
  }
});

module.exports = router;