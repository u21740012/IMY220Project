// backend/models/Project.js
const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
  path: { type: String, required: true },
  storedName: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  uploadedAt: { type: Date, default: Date.now },
  version: { type: Number, default: 1 },
  checkedOutBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null } 
});

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
  files: [FileSchema],
});

module.exports = mongoose.model("Project", ProjectSchema);


