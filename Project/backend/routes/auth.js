const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcryptjs");

function makeToken(email) {
  return Buffer.from(`${email}:${Date.now()}`).toString("base64");
}

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Invalid email" });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: "Password too short" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already in use" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashed });
    await user.save();

    const token = makeToken(email);
    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "Wrong password" });

    const token = makeToken(email);
    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/me", async (req, res) => {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const decoded = Buffer.from(token, "base64").toString("utf8");
    const email = decoded.split(":")[0];
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
});

module.exports = router;
