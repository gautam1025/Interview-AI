const mongoose = require("mongoose");

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not defined");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect("mongodb+srv://test:test123@cluster0.qqoy8ed.mongodb.net/?appName=Cluster0", {
      family: 4,                  // ← force IPv4
      serverSelectionTimeoutMS: 10000, // optional: fail fast for debugging
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
