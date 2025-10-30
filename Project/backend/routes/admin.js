// backend/routes/admin.js
const express = require("express");
const User = require("../models/User");
const Project = require("../models/Project");
const Checkin = require("../models/Checkin");
const ProjectType = require("../models/ProjectType");
const authAdmin = require("../middleware/authAdmin");
const path = require("path");
const fsp = require("fs/promises");

const router = express.Router();

async function rmDir(p) {
  try { await fsp.rm(p, { recursive: true, force: true }); } catch {}
}

router.get("/users", authAdmin, async (req, res) => {
  const users = await User.find().select("_id username email isAdmin");
  res.json(users);
});

router.delete("/users/:id", authAdmin, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  await Project.deleteMany({ owner: user._id });
  await Checkin.deleteMany({ user: user._id });
  await user.deleteOne();

  res.json({ message: "User deleted successfully" });
});

router.get("/projects", authAdmin, async (req, res) => {
  const projects = await Project.find().populate("owner", "username email");
  res.json(projects);
});

router.delete("/projects/:id", authAdmin, async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ error: "Project not found" });

  await Checkin.deleteMany({ project: project._id });
  await Project.deleteOne({ _id: project._id });

  const dir = path.join(__dirname, "..", "uploads", "projects", String(project._id));
  await rmDir(dir);

  res.json({ message: "Project deleted successfully" });
});


router.get("/activity", authAdmin, async (req, res) => {
  const activities = await Checkin.find()
    .populate("user", "username")
    .populate("project", "name");
  res.json(activities);
});

router.delete("/activity/:id", authAdmin, async (req, res) => {
  await Checkin.findByIdAndDelete(req.params.id);
  res.json({ message: "Activity deleted" });
});

router.get("/project-types", async (req, res) => {
  const types = await ProjectType.find().sort({ name: 1 });
  res.json(types);
});

router.post("/project-types", authAdmin, async (req, res) => {
  const { name, description } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: "Name required" });

  const exists = await ProjectType.findOne({ name: new RegExp(`^${name}$`, "i") });
  if (exists) return res.status(400).json({ error: "Type already exists" });

  const newType = new ProjectType({ name, description });
  await newType.save();
  res.json(newType);
});

router.delete("/project-types/:id", authAdmin, async (req, res) => {
  await ProjectType.findByIdAndDelete(req.params.id);
  res.json({ message: "Project type deleted" });
});

module.exports = router;
