//backend/server.js
require("dotenv").config({
  path: require("path").join(__dirname, "../.env")
});
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/projects", require("./routes/projects"));
app.use("/api/checkins", require("./routes/checkins"));
app.use("/api/upload", require("./routes/upload"));
app.use("/api/project-files", require("./routes/projectFiles"));
app.use("/api/admin", require("./routes/admin"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const DIST_DIR = path.join(__dirname);
app.use(express.static(DIST_DIR));
app.get("/{*any}/", (req, res) => {
  res.sendFile(path.join(DIST_DIR, "index.html"));
});
const PORT = process.env.PORT || 1337;
mongoose.connect(process.env.MONGO_URI, {
  dbName: "IMY220ProjectDB"
}).then(() => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(` Server running on http://localhost:${PORT}`));
}).catch(err => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});