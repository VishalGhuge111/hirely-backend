const express = require("express");
const {
  registerUser,
  loginUser,
  updateProfile,
  deleteProfile,
  verifyEmailOtp,
  resendEmailOtp,
  forgotPassword,
  resetPassword,

} = require("../controllers/auth.controller");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-email", verifyEmailOtp);
router.post("/resend-otp", resendEmailOtp);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/login", loginUser);
router.put("/profile", protect, updateProfile);
router.delete("/profile", protect, deleteProfile);

module.exports = router;
