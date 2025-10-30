const express = require("express");
const Team = require("../models/Team");
const User = require("../models/User");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, description, owner } = req.body;
    const team = new Team({ name, description, owner, members: [owner] });
    await team.save();
    res.json(team);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const teams = await Team.find({
      $or: [{ owner: req.params.userId }, { members: req.params.userId }],
    }).populate("members", "username email");
    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/:teamId/add", async (req, res) => {
  try {
    const { userId } = req.body;
    const team = await Team.findById(req.params.teamId);
    if (!team) return res.status(404).json({ error: "Team not found" });
    if (!team.members.includes(userId)) {
      team.members.push(userId);
      await team.save();
    }
    res.json(team);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/:teamId/remove", async (req, res) => {
  try {
    const { userId } = req.body;
    const team = await Team.findById(req.params.teamId);
    if (!team) return res.status(404).json({ error: "Team not found" });
    team.members = team.members.filter(
      (id) => String(id) !== String(userId)
    );
    await team.save();
    res.json(team);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
