const Job = require("../models/Job");
const Application = require("../models/Application");

// Create Job (Admin)
exports.createJob = async (req, res) => {
  try {
    const job = await Job.create({
      title: req.body.title,
      company: req.body.company,
      location: req.body.location,
      type: req.body.type,
      description: req.body.description,
      requirements: req.body.requirements,
      createdBy: req.user._id
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Jobs (FIXED)
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Job
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Job (Admin)
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Job (Admin) ✅ FIXED
exports.deleteJob = async (req, res) => {
  try {

    // delete all applications related to this job
    await Application.deleteMany({
      jobId: req.params.id
    });

    // delete job
    await Job.findByIdAndDelete(req.params.id);

    res.json({ message: "Job deleted" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};