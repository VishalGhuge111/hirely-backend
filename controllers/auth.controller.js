const User = require("../models/User");
const generateToken = require("../utils/generateToken");

/* ============================
   REGISTER
============================ */
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const role =
      email === process.env.ADMIN_EMAIL ? "admin" : "user";

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    res.status(201).json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


/* ============================
   LOGIN
============================ */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


/* ============================
   UPDATE PROFILE
   (Name + Mobile + LinkedIn)
============================ */
exports.updateProfile = async (req, res) => {
  try {
    const { name, mobile, linkedin } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name !== undefined) user.name = name;
    if (mobile !== undefined) user.mobile = mobile;
    if (linkedin !== undefined) user.linkedin = linkedin;

    await user.save();

    // Return FULL updated user
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      linkedin: user.linkedin,
      role: user.role
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


/* ============================
   DELETE PROFILE
============================ */
exports.deleteProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};