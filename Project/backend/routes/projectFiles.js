// backend/routes/projectFiles.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const fsp = require("fs/promises");
const Project = require("../models/Project");
const Checkin = require("../models/Checkin");
const User = require("../models/User");

const router = express.Router();

const baseDir = path.join(process.cwd(), "backend/uploads/projects");
if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir, { recursive: true });
console.log("📁 Upload base path:", baseDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const projectDir = path.join(baseDir, req.params.projectId);
      fs.mkdirSync(projectDir, { recursive: true });
      cb(null, projectDir);
    } catch (err) {
      console.error("Error creating upload directory:", err);
      cb(err, null);
    }
  },
  filename: (req, file, cb) => {
    const safeName = `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;
    cb(null, safeName);
  },
});
const upload = multer({ storage });

async function findUser(userId) {
  if (!userId) return null;
  return await User.findById(userId);
}

router.post("/:projectId/checkin", upload.single("file"), async (req, res) => {
  try {
    const { projectId } = req.params;
    const { userId } = req.body;
    const user = await findUser(userId);
    if (!user) return res.status(404).json({ error: "Invalid user" });

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ error: "Project not found" });

    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const original = req.file.originalname;
    const existing = project.files.find((f) => f.path === original);

    if (existing) {
      existing.version += 1;
      existing.storedName = req.file.filename;
      existing.uploadedBy = userId;
      existing.uploadedAt = new Date();
      existing.checkedOutBy = null;
      await Checkin.create({
        project: projectId,
        user: userId,
        message: `Checked in new version of ${original} (v${existing.version})`,
      });
    } else {
      project.files.push({
        path: original,
        storedName: req.file.filename,
        uploadedBy: userId,
        version: 1,
        uploadedAt: new Date(),
      });
      await Checkin.create({
        project: projectId,
        user: userId,
        message: `Uploaded new file: ${original}`,
      });
    }

    await project.save();
    res.json(project.files);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/:projectId/download/:storedName", async (req, res) => {
  try {
    const { projectId, storedName } = req.params;
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ error: "Project not found" });

    const fileRecord = project.files.find((f) => f.storedName === storedName);
    if (!fileRecord)
      return res.status(404).json({ error: "File metadata not found" });

    const filePath = path.join(baseDir, projectId, storedName);
    if (!fs.existsSync(filePath)) {
      console.error("Missing file on disk:", filePath);
      return res.status(404).json({ error: "File not found on server" });
    }

    const downloadName = fileRecord.path || storedName;
    res.download(filePath, downloadName);
  } catch (err) {
    console.error("Download error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/:projectId/files", async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId)
      .populate("files.uploadedBy", "username")
      .populate("files.checkedOutBy", "username");
    if (!project) return res.status(404).json({ error: "Project not found" });

    res.json(project.files);
  } catch (err) {
    console.error("File list error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/:projectId/checkout/:filename", async (req, res) => {
  try {
    const { projectId, filename } = req.params;
    const { userId } = req.body;

    const user = await findUser(userId);
    if (!user) return res.status(404).json({ error: "Invalid user" });

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ error: "Project not found" });

    const file = project.files.find((f) => f.path === filename);
    if (!file) return res.status(404).json({ error: "File not found" });

    if (file.checkedOutBy && String(file.checkedOutBy) !== String(userId))
      return res.status(403).json({ error: "File already checked out" });

    file.checkedOutBy = userId;
    await project.save();
    await Checkin.create({
      project: projectId,
      user: userId,
      message: `Checked out ${filename} for editing`,
    });

    res.json({ ok: true, message: "File checked out" });
  } catch (err) {
    console.error("Checkout error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:projectId/files/:filename", async (req, res) => {
  try {
    const { projectId, filename } = req.params;
    const { userId } = req.query;

    const project = await Project.findById(projectId).populate("owner", "isAdmin");
    if (!project) return res.status(404).json({ error: "Project not found" });

    const user = await findUser(userId);
    if (!user) return res.status(404).json({ error: "Invalid user" });

    const ownerId = String(project.owner._id || project.owner);
    const collabIds = (project.collaborators || []).map((c) => String(c));

    if (!user.isAdmin && ownerId !== String(user._id) && !collabIds.includes(String(user._id))) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const file = project.files.find((f) => f.path === filename);
    if (!file) return res.status(404).json({ error: "File not found" });

    const filePath = path.join(baseDir, projectId, file.storedName);
    await fsp.rm(filePath, { force: true });
    project.files = project.files.filter((f) => f.path !== filename);
    await project.save();

    await Checkin.create({
      project: projectId,
      user: userId,
      message: `Deleted file: ${filename}`,
    });

    res.json({ ok: true, message: "File deleted" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
