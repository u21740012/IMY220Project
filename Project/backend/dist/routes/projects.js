const express = require("express");
const Project = require("../models/Project");
const User = require("../models/User");
const router = express.Router();
const Checkin = require("../models/Checkin");
const path = require("path");
const fsp = require("fs/promises");

async function rmDir(p) {
  try {
    await fsp.rm(p, { recursive: true, force: true });
  } catch {}
}

// Utility: check access (owner or collaborator)
function canAccess(project, userId) {
  const ownerId = String(project.owner._id || project.owner);
  const collabIds = (project.collaborators || []).map((c) =>
    String(c._id || c)
  );
  return ownerId === String(userId) || collabIds.includes(String(userId));
}

// Create new project
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
      collaborators: [], 
    });
    await project.save();
    const populated = await Project.findById(project._id).populate(
      "owner",
      "username"
    );
    res.json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get projects list
router.get("/", async (req, res) => {
  try {
    const filter = {};
    const userId = req.query.userId || req.query.owner;
    const limit = Math.min(parseInt(req.query.limit || "0", 10) || 0, 50);

    let query = Project.find(
      userId
        ? {
            $or: [
              { owner: userId },
              { collaborators: userId }, 
            ],
          }
        : filter
    )
      .populate("owner", "username")
      .sort({ createdAt: -1 });

    if (limit) query = query.limit(limit);

    const projects = await query.exec();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search projects
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

// Get project by ID (with access control)
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "username")
      .populate("collaborators", "username email");
    if (!project) return res.status(404).json({ error: "Project not found" });

    const userId = req.query.userId;
    if (userId && !canAccess(project, userId))
      return res.status(403).json({ error: "Access denied" });

    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update project (owner or collaborator)
router.put("/:id", async (req, res) => {
  try {
    const updates = req.body || {};
    const project = await Project.findById(req.params.id)
      .populate("owner", "username")
      .populate("collaborators", "username");
    if (!project) return res.status(404).json({ error: "Project not found" });

    const userId = updates.userId || req.query.userId;
    if (userId && !canAccess(project, userId))
      return res.status(403).json({ error: "Not authorized" });

    Object.assign(project, updates);
    await project.save();

    const updated = await Project.findById(project._id).populate(
      "owner",
      "username"
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete project (owner only)
router.delete("/:id", async (req, res) => {
  try {
    const proj = await Project.findById(req.params.id);
    if (!proj) return res.status(404).json({ error: "Project not found" });

    if (String(proj.owner) !== String(req.query.owner))
      return res
        .status(403)
        .json({ error: "Only the owner can delete this project" });

    await Checkin.deleteMany({ project: proj._id });
    await Project.deleteOne({ _id: proj._id });

    const dir = path.join(
      __dirname,
      "..",
      "uploads",
      "projects",
      String(proj._id)
    );
    await rmDir(dir);

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add collaborator (must be a friend)
router.post("/:id/add-collaborator", async (req, res) => {
  try {
    const { userId, collaboratorId } = req.body;
    const project = await Project.findById(req.params.id).populate("owner");

    if (!project) return res.status(404).json({ error: "Project not found" });
    if (String(project.owner._id) !== String(userId))
      return res
        .status(403)
        .json({ error: "Only the owner can add collaborators" });

    const user = await User.findById(userId);
    if (!user || !user.friends.includes(collaboratorId))
      return res.status(403).json({ error: "Must be friends first" });

    if (!project.collaborators.includes(collaboratorId)) {
      project.collaborators.push(collaboratorId);
      await project.save();
    }

    const populated = await Project.findById(project._id).populate(
      "collaborators",
      "username email"
    );
    res.json(populated.collaborators);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove collaborator
router.post("/:id/remove-collaborator", async (req, res) => {
  try {
    const { userId, collaboratorId } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });

    if (String(project.owner) !== String(userId))
      return res
        .status(403)
        .json({ error: "Only the owner can remove collaborators" });

    project.collaborators = project.collaborators.filter(
      (id) => String(id) !== String(collaboratorId)
    );
    await project.save();

    const populated = await Project.findById(project._id).populate(
      "collaborators",
      "username"
    );
    res.json(populated.collaborators);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
