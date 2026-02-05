const Application = require("../models/Application");

// Apply to Job
exports.applyJob = async (req, res) => {
  try {
    const application = await Application.create({
      userId: req.user._id,
      jobId: req.params.jobId,
      resumeLink: req.body.resumeLink,
      coverNote: req.body.coverNote,
    });

    res.status(201).json(application);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Already applied to this job" });
    }
    res.status(500).json({ message: error.message });
  }
};

// User Applications
exports.getUserApplications = async (req, res) => {
  try {
    const apps = await Application.find({
      userId: req.user._id,
      jobId: { $ne: null }
    }).populate("jobId");

    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin Applications  ✅ FIXED
exports.getAllApplications = async (req, res) => {
  try {
    const apps = await Application.find({
      jobId: { $ne: null }
    })
      .populate("jobId")
      .populate("userId");

    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Status
exports.updateStatus = async (req, res) => {
  try {
    const app = await Application.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json(app);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};