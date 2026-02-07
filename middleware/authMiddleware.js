const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");

      // 🔴 USER DELETED OR NOT FOUND
      if (!user) {
        return res.status(401).json({
          message: "Account no longer exists. Please login again.",
          code: "USER_DELETED",
        });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        message: "Session expired or invalid token. Please login again.",
        code: "INVALID_TOKEN",
      });
    }
  } else {
    return res.status(401).json({
      message: "No token provided",
      code: "NO_TOKEN",
    });
  }
};

module.exports = protect;