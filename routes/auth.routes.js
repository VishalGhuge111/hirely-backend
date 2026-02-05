const express = require("express");
const {
  registerUser,
  loginUser,
  updateProfile,
  deleteProfile,
} = require("../controllers/auth.controller");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/profile", protect, updateProfile);
router.delete("/profile", protect, deleteProfile);

module.exports = router;
