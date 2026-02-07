const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");

/* ================= REGISTER (SEND OTP) ================= */
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let user = await User.findOne({ email });

    // 🔁 IF USER EXISTS BUT NOT VERIFIED → RESEND OTP
    if (user && !user.isEmailVerified) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      user.emailOtp = otp;
      user.emailOtpExpiry = Date.now() + 10 * 60 * 1000;
      await user.save();

      await sendEmail({
        to: email,
        otp,
        type: "VERIFY_EMAIL",
      });

      return res.status(200).json({
        message: "OTP resent. Please verify your email.",
        email,
      });
    }

    // ❌ VERIFIED USER EXISTS
    if (user && user.isEmailVerified) {
      return res.status(400).json({
        message: "An account with this email already exists",
      });
    }

    // ✅ CREATE NEW UNVERIFIED USER
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await User.create({
      name,
      email,
      password,
      emailOtp: otp,
      emailOtpExpiry: Date.now() + 10 * 60 * 1000,
      isEmailVerified: false,
    });

    await sendEmail({
      to: email,
      otp,
      type: "VERIFY_EMAIL",
    });

    res.status(201).json({
      message: "OTP sent to your email. Please verify to continue.",
      email,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "Registration failed" });
  }
};

/* ================= VERIFY EMAIL OTP ================= */
exports.verifyEmailOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Account not found" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }
if (!user.emailOtp || !user.emailOtpExpiry) {
  return res.status(400).json({ message: "OTP not found. Please resend." });
}
    if (
      user.emailOtp !== otp ||
      user.emailOtpExpiry < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isEmailVerified = true;
    user.emailOtp = undefined;
    user.emailOtpExpiry = undefined;
    await user.save();

    res.json({
      message: "Email verified successfully. You can now login.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "OTP verification failed" });
  }
};

/* ================= RESEND EMAIL OTP ================= */
exports.resendEmailOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "No account found with this email",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        message: "Email already verified",
      });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.emailOtp = otp;
    user.emailOtpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendEmail({
      to: email,
      otp,
      type: "VERIFY_EMAIL",
    });

    res.json({
      message: "A new OTP has been sent to your email",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to resend OTP",
    });
  }
};
/* ================= RESET PASSWORD ================= */
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Account not found" });
    }

    if (
      user.emailOtp !== otp ||
      user.emailOtpExpiry < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // ✅ set new password (bcrypt runs via pre-save hook)
    user.password = password;

    // clear OTP
    user.emailOtp = undefined;
    user.emailOtpExpiry = undefined;

    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    res.status(500).json({ message: "Failed to reset password" });
  }
};
/* ================= FORGOT PASSWORD ================= */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user || !user.isEmailVerified) {
      return res.status(404).json({
        message: "No verified account found with this email",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.emailOtp = otp;
    user.emailOtpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendEmail({
      to: email,
      otp,
      type: "RESET_PASSWORD",
    });

    res.json({
      message: "OTP sent to email",
      email,
    });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};
/* ================= LOGIN ================= */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "No account found with this email",
      });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in",
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    res.json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        mobile: user.mobile,
        linkedin: user.linkedin,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during login" });
  }
};

/* ================= UPDATE PROFILE ================= */
exports.updateProfile = async (req, res) => {
  try {
    const { name, mobile, linkedin } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, mobile, linkedin },
      { new: true }
    );

    res.json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        mobile: user.mobile,
        linkedin: user.linkedin,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

/* ================= DELETE PROFILE ================= */
exports.deleteProfile = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ message: "Profile deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete profile" });
  }
};