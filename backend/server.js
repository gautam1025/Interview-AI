const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const protect = require("./middleware/authMiddleware");
const interviewRoutes = require("./routes/InterviewRoutes");

const dns = require("dns")
dns.setServers(["8.8.8.8", "1.1.1.1"])
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/interview", interviewRoutes);

// Connect to MongoDB
connectDB();

// Test Route
app.get("/", (req, res) => {
  res.send("Interview Assessment Platform API is running...");
});

// Protected Route
app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "Protected route accessed successfully",
    user: req.user,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});