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

// Utility: check access (owner, collaborator, or admin)
function canAccess(project, user) {
  const ownerId = String(project.owner._id || project.owner);
  const collabIds = (project.collaborators || []).map((c) => String(c._id || c));
  if (!user) return false;
  if (user.isAdmin) return true;
  return ownerId === String(user._id) || collabIds.includes(String(user._id));
}

// ───────────────────────────────
// Create new project
// ───────────────────────────────
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
    const populated = await Project.findById(project._id).populate("owner", "username");
    res.json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ───────────────────────────────
// Get projects list
// ───────────────────────────────
router.get("/", async (req, res) => {
  try {
    const filter = {};
    const userId = req.query.userId || req.query.owner;
    const limit = Math.min(parseInt(req.query.limit || "0", 10) || 0, 50);

    const requester = userId ? await User.findById(userId) : null;

    // Admins see all projects
    let query = Project.find(
      requester?.isAdmin
        ? {}
        : userId
        ? { $or: [{ owner: userId }, { collaborators: userId }] }
        : filter
    )
      .populate("owner", "username email")
      .sort({ createdAt: -1 });

    if (limit) query = query.limit(limit);

    const projects = await query.exec();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ───────────────────────────────
// Search projects
// ───────────────────────────────
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

// ───────────────────────────────
// Get project by ID (with access control)
// ───────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "username email isAdmin")
      .populate("collaborators", "username email");
    if (!project) return res.status(404).json({ error: "Project not found" });

    const userId = req.query.userId;
    const user = userId ? await User.findById(userId) : null;
    if (user && !canAccess(project, user))
      return res.status(403).json({ error: "Access denied" });

    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ───────────────────────────────
// Update project (owner, collaborator, or admin)
// ───────────────────────────────
router.put("/:id", async (req, res) => {
  try {
    const updates = req.body || {};
    const project = await Project.findById(req.params.id)
      .populate("owner", "username email isAdmin")
      .populate("collaborators", "username email");
    if (!project) return res.status(404).json({ error: "Project not found" });

    const userId = updates.userId || req.query.userId;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "Invalid user" });

    if (!canAccess(project, user))
      return res.status(403).json({ error: "Not authorized" });

    Object.assign(project, updates);
    await project.save();

    const updated = await Project.findById(project._id).populate("owner", "username email");
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ───────────────────────────────
// Delete project (owner or admin)
// ───────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    const proj = await Project.findById(req.params.id);
    if (!proj) return res.status(404).json({ error: "Project not found" });

    const userId = req.query.owner || req.query.userId;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "Invalid user" });

    if (!user.isAdmin && String(proj.owner) !== String(userId))
      return res.status(403).json({ error: "Only the owner or admin can delete this project" });

    await Checkin.deleteMany({ project: proj._id });
    await Project.deleteOne({ _id: proj._id });

    const dir = path.join(__dirname, "..", "uploads", "projects", String(proj._id));
    await rmDir(dir);

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ───────────────────────────────
// Add collaborator (must be a friend, or admin can force add)
// ───────────────────────────────
router.post("/:id/add-collaborator", async (req, res) => {
  try {
    const { userId, collaboratorId } = req.body;
    const project = await Project.findById(req.params.id).populate("owner");

    if (!project) return res.status(404).json({ error: "Project not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "Invalid user" });

    // Owner or admin only
    if (!user.isAdmin && String(project.owner._id) !== String(userId))
      return res.status(403).json({ error: "Only the owner or admin can add collaborators" });

    if (!user.isAdmin && !user.friends.includes(collaboratorId))
      return res.status(403).json({ error: "Must be friends first" });

    if (!project.collaborators.includes(collaboratorId)) {
      project.collaborators.push(collaboratorId);
      await project.save();
    }

    const populated = await Project.findById(project._id).populate("collaborators", "username email");
    res.json(populated.collaborators);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ───────────────────────────────
// Remove collaborator (owner or admin)
// ───────────────────────────────
router.post("/:id/remove-collaborator", async (req, res) => {
  try {
    const { userId, collaboratorId } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "Invalid user" });

    if (!user.isAdmin && String(project.owner) !== String(userId))
      return res.status(403).json({ error: "Only the owner or admin can remove collaborators" });

    project.collaborators = project.collaborators.filter(
      (id) => String(id) !== String(collaboratorId)
    );
    await project.save();

    const populated = await Project.findById(project._id).populate("collaborators", "username email");
    res.json(populated.collaborators);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
