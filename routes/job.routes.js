const express = require("express");
const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
} = require("../controllers/job.controller");

const protect = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/", protect, isAdmin, createJob);
router.get("/", getJobs);
router.get("/:id", getJobById);
router.put("/:id", protect, isAdmin, updateJob);
router.delete("/:id", protect, isAdmin, deleteJob);

module.exports = router;