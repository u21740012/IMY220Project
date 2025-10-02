const express = require("express");
const Project = require("../models/Project");
const router = express.Router();
const Checkin = require("../models/Checkin");
const path = require("path");
const fsp = require("fs/promises");

async function rmDir(p) { try { await fsp.rm(p, { recursive: true, force: true }); } catch {} }

router.post("/", async (req, res) => {
  try {
    const body = req.body || {};
    const project = new Project({
      name: body.name,
      description: body.description || "",
      repo: body.repo || "",
      hashtags: Array.isArray(body.hashtags) ? body.hashtags : [],
      image: body.image || "",
      owner: body.owner,
      members: Array.isArray(body.members) ? body.members : [],
    });
    await project.save();
    const populated = await Project.findById(project._id).populate("owner", "username");
    res.json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.owner) filter.owner = req.query.owner;
    const limit = Math.min(parseInt(req.query.limit || "0", 10) || 0, 50);

    let query = Project.find(filter).populate("owner", "username").sort({ createdAt: -1 });
    if (limit) query = query.limit(limit);

    const projects = await query.exec();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/search", async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q) return res.json([]);
    const projects = await Project.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { hashtags: { $regex: q, $options: "i" } },
      ],
    })
      .select("_id name description")
      .limit(20);
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("owner", "username");
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updates = req.body || {};
    const updated = await Project.findByIdAndUpdate(req.params.id, updates, { new: true }).populate("owner", "username");
    if (!updated) return res.status(404).json({ error: "Project not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const proj = await Project.findById(req.params.id);
    if (!proj) return res.status(404).json({ error: "Project not found" });

    if (String(proj.owner) !== String(req.query.owner))
      return res.status(403).json({ error: "Only the owner can delete this project" });

    await Checkin.deleteMany({ project: proj._id });
    await Project.deleteOne({ _id: proj._id });

    const dir = path.join(__dirname, "..", "uploads", "projects", String(proj._id));
    await rmDir(dir);

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;