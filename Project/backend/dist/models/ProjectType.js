// backend/models/ProjectType.js
const mongoose = require("mongoose");

const ProjectTypeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ProjectType", ProjectTypeSchema);
