const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  console.log("---- Auth Middleware Triggered ----");
  console.log("Authorization Header:", req.headers.authorization);

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      console.log("Token format valid (Bearer ...). Extracting token...");
      token = req.headers.authorization.split(" ")[1];
      console.log("Extracted Token:", token);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Token successfully decoded:", decoded);

      req.user = await User.findById(decoded.id).select("-password");
      console.log("User fetched from DB:", req.user ? req.user._id : "User Not Found");

      if (!req.user) {
        console.log("Auth Failed: Token is valid but user no longer exists in DB");
        return res.status(401).json({ message: "Not authorized, user not found" });
      }

      console.log("---- Auth Middleware Passed ----");
      next();
    } catch (error) {
      console.error("Auth Failed inside catch block:", error.name, error.message);
      return res.status(401).json({ message: "Not authorized, token failed", error: error.message });
    }
  }

  if (!token) {
    console.log("Auth Failed: No token provided in headers");
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = protect;