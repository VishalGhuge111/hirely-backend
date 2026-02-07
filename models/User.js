const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    mobile: {
      type: String,
      default: "",
    },

    linkedin: {
      type: String,
      default: "",
    },

    // ✅ EMAIL VERIFICATION (ONLY THIS)
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    emailOtp: {
      type: String,
    },

    emailOtpExpiry: {
      type: Date,
    },

    resetOtp: {
      type: String,
    },
    resetOtpExpiry: {
      type: Date,
    },


  },
  { timestamps: true }
);

// Hash password
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);