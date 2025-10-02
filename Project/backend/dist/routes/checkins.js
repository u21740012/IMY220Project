const express = require("express");
const Checkin = require("../models/Checkin");
const router = express.Router();

/**
 * POST /api/checkins
 * body: { project, user, message }
 */
router.post("/", async (req, res) => {
  try {
    const checkin = new Checkin(req.body);
    await checkin.save();
    const populated = await Checkin.findById(checkin._id)
      .populate("user", "username")
      .populate("project", "name");
    res.json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/checkins
 * Optional: ?limit=20
 * Returns global activity (latest first)
 */
router.get("/", async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || "20", 10) || 20, 50);
    const items = await Checkin.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("user", "username")
      .populate("project", "name");
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/checkins/project/:projectId
 */
router.get("/project/:projectId", async (req, res) => {
  try {
    const items = await Checkin.find({ project: req.params.projectId })
      .sort({ createdAt: -1 })
      .populate("user", "username");
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/checkins/user/:userId
 */
router.get("/user/:userId", async (req, res) => {
  try {
    const items = await Checkin.find({ user: req.params.userId })
      .sort({ createdAt: -1 })
      .populate("project", "name");
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
