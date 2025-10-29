// backend/routes/admin.js
const express = require("express");
const User = require("../models/User");
const Project = require("../models/Project");
const Checkin = require("../models/Checkin");
const authAdmin = require("../middleware/authAdmin");

const router = express.Router();

// Manage users
router.get("/users", authAdmin, async (req, res) => {
  const users = await User.find().select("_id username email isAdmin");
  res.json(users);
});

// Delete a user
router.delete("/users/:id", authAdmin, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

// Manage projects
router.get("/projects", authAdmin, async (req, res) => {
  const projects = await Project.find().populate("owner", "username");
  res.json(projects);
});

router.delete("/projects/:id", authAdmin, async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

// Manage checkins/activity
router.get("/activity", authAdmin, async (req, res) => {
  const list = await Checkin.find().populate("user", "username").populate("project", "name");
  res.json(list);
});

module.exports = router;
