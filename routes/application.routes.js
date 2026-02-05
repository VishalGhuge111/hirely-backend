const express = require("express");
const {
  applyJob,
  getUserApplications,
  getAllApplications,
  updateStatus,
} = require("../controllers/application.controller");

const protect = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/:jobId", protect, applyJob);
router.get("/user", protect, getUserApplications);
router.get("/admin", protect, isAdmin, getAllApplications);
router.patch("/:id/status", protect, isAdmin, updateStatus);

module.exports = router;