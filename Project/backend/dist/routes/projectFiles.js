const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Project = require("../models/Project");
const Checkin = require("../models/Checkin");

const router = express.Router();

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

router.post("/:projectId/upload", upload.single("file"), async (req, res) => {
  try {
    const { projectId } = req.params;
    const { userId } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ error: "Project not found" });

    const existing = project.files.find((f) => f.path === req.file.originalname);
    if (existing) {
      existing.version += 1;
      existing.storedName = req.file.filename;
      existing.uploadedAt = new Date();
      existing.uploadedBy = userId;
      await Checkin.create({
        project: projectId,
        user: userId,
        message: `Modified file: ${existing.path} (v${existing.version})`
      });
    } else {
      project.files.push({
        path: req.file.originalname,
        storedName: req.file.filename,
        uploadedBy: userId,
      });
      await Checkin.create({
        project: projectId,
        user: userId,
        message: `Uploaded new file: ${req.file.originalname}`
      });
    }

    await project.save();
    res.json(project.files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:projectId/files", async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId).populate("files.uploadedBy", "username");
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project.files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
