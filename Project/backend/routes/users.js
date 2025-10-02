const express = require("express");
const path = require("path");
const fsp = require("fs/promises");
const User = require("../models/User");
const Project = require("../models/Project");
const Checkin = require("../models/Checkin");

const router = express.Router();

async function removeDirIfExists(dir) {
  try { await fsp.rm(dir, { recursive: true, force: true }); } catch {}
}

router.get("/", async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    const limit = Math.min(parseInt(req.query.limit || "0", 10) || 0, 50);

    const filter = q
      ? {
          $or: [
            { username: { $regex: q, $options: "i" } },
            { email: { $regex: q, $options: "i" } },
            { bio: { $regex: q, $options: "i" } },
          ],
        }
      : {};

    let query = User.find(filter).select(
      "_id username email bio website location avatar createdAt updatedAt"
    );
    if (limit) query = query.limit(limit);

    res.json(await query.exec());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/search", async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q) return res.json([]);
    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { bio: { $regex: q, $options: "i" } },
      ],
    }).select("_id username email");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "_id username email bio website location avatar createdAt updatedAt"
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const payload = {
      username: req.body.username,
      bio: req.body.bio,
      website: req.body.website,
      location: req.body.location,
      avatar: req.body.avatar, 
    };
    const updated = await User.findByIdAndUpdate(req.params.id, payload, {
      new: true,
    }).select("_id username email bio website location avatar createdAt updatedAt");
    if (!updated) return res.status(404).json({ error: "User not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id/relation", async (req, res) => {
  try {
    const me = await User.findById(req.query.me).select("_id friends friendRequests");
    const otherId = String(req.params.id);
    if (!me) return res.json({ status: "none" });
    if (String(me._id) === otherId) return res.json({ status: "self" });
    if (me.friends.some((x) => String(x) === otherId)) return res.json({ status: "friends" });
    if (me.friendRequests.incoming.some((x) => String(x) === otherId))
      return res.json({ status: "incoming" });
    if (me.friendRequests.outgoing.some((x) => String(x) === otherId))
      return res.json({ status: "outgoing" });
    res.json({ status: "none" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id/friends", async (req, res) => {
  try {
    const u = await User.findById(req.params.id)
      .select("friends friendRequests")
      .populate("friends", "_id username avatar")
      .populate("friendRequests.incoming", "_id username avatar")
      .populate("friendRequests.outgoing", "_id username avatar");

    if (!u) return res.status(404).json({ error: "User not found" });

    res.json({
      friends: u.friends,
      incoming: u.friendRequests.incoming,
      outgoing: u.friendRequests.outgoing,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/:id/friends/request", async (req, res) => {
  try {
    const from = await User.findById(req.query.from).select("_id friends friendRequests");
    const to = await User.findById(req.params.id).select("_id friends friendRequests");
    if (!from || !to) return res.status(404).json({ error: "User not found" });
    if (String(from._id) === String(to._id)) return res.status(400).json({ error: "Cannot friend yourself" });

    const alreadyFriends = from.friends.some((x) => String(x) === String(to._id));
    if (alreadyFriends) return res.json({ ok: true, status: "friends" });

    const theyRequested = from.friendRequests.incoming.some((x) => String(x) === String(to._id));
    if (theyRequested) {
      from.friendRequests.incoming = from.friendRequests.incoming.filter((x) => String(x) !== String(to._id));
      to.friendRequests.outgoing = to.friendRequests.outgoing.filter((x) => String(x) !== String(from._id));
      from.friends.push(to._id);
      to.friends.push(from._id);
      await from.save();
      await to.save();
      return res.json({ ok: true, status: "friends" });
    }

    if (!from.friendRequests.outgoing.some((x) => String(x) === String(to._id))) {
      from.friendRequests.outgoing.push(to._id);
      await from.save();
    }
    if (!to.friendRequests.incoming.some((x) => String(x) === String(from._id))) {
      to.friendRequests.incoming.push(from._id);
      await to.save();
    }
    res.json({ ok: true, status: "outgoing" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/:id/friends/accept", async (req, res) => {
  try {
    const me = await User.findById(req.query.me).select("_id friends friendRequests");
    const from = await User.findById(req.query.from).select("_id friends friendRequests");
    if (!me || !from) return res.status(404).json({ error: "User not found" });

    me.friendRequests.incoming = me.friendRequests.incoming.filter((x) => String(x) !== String(from._id));
    from.friendRequests.outgoing = from.friendRequests.outgoing.filter((x) => String(x) !== String(me._id));
    if (!me.friends.some((x) => String(x) === String(from._id))) me.friends.push(from._id);
    if (!from.friends.some((x) => String(x) === String(me._id))) from.friends.push(me._id);
    await me.save();
    await from.save();
    res.json({ ok: true, status: "friends" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/:id/friends/reject", async (req, res) => {
  try {
    const me = await User.findById(req.query.me).select("friendRequests");
    const from = await User.findById(req.query.from).select("friendRequests");
    if (!me || !from) return res.status(404).json({ error: "User not found" });

    me.friendRequests.incoming = me.friendRequests.incoming.filter((x) => String(x) !== String(req.query.from));
    from.friendRequests.outgoing = from.friendRequests.outgoing.filter((x) => String(x) !== String(req.query.me));
    await me.save();
    await from.save();
    res.json({ ok: true, status: "none" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id/friends/:friendId", async (req, res) => {
  try {
    const a = await User.findById(req.params.id).select("friends friendRequests");
    const b = await User.findById(req.params.friendId).select("friends friendRequests");
    if (!a || !b) return res.status(404).json({ error: "User not found" });

    a.friends = a.friends.filter((x) => String(x) !== String(b._id));
    b.friends = b.friends.filter((x) => String(x) !== String(a._id));
    a.friendRequests.incoming = a.friendRequests.incoming.filter((x) => String(x) !== String(b._id));
    a.friendRequests.outgoing = a.friendRequests.outgoing.filter((x) => String(x) !== String(b._id));
    b.friendRequests.incoming = b.friendRequests.incoming.filter((x) => String(x) !== String(a._id));
    b.friendRequests.outgoing = b.friendRequests.outgoing.filter((x) => String(x) !== String(a._id));
    await a.save();
    await b.save();

    res.json({ ok: true, status: "none" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  const userId = req.params.id;
  const uploadsRoot = path.join(__dirname, "..", "uploads", "projects");
  try {
    const ownedProjects = await Project.find({ owner: userId }).select("_id");
    const ownedIds = ownedProjects.map((p) => p._id);
    const delOwnedCheckins = await Checkin.deleteMany({ project: { $in: ownedIds } });
    const delProjects = await Project.deleteMany({ _id: { $in: ownedIds } });
    for (const p of ownedProjects) {
      await removeDirIfExists(path.join(uploadsRoot, String(p._id)));
    }
    await Project.updateMany({ members: userId }, { $pull: { members: userId } });
    const delUserCheckinsElsewhere = await Checkin.deleteMany({ user: userId });

    await User.updateMany(
      { friends: userId },
      { $pull: { friends: userId, "friendRequests.incoming": userId, "friendRequests.outgoing": userId } }
    );

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) return res.status(404).json({ error: "User not found" });

    res.json({
      message: "User and related data deleted",
      removed: {
        projects: delProjects.deletedCount || 0,
        projectCheckins: delOwnedCheckins.deletedCount || 0,
        userCheckinsElsewhere: delUserCheckinsElsewhere.deletedCount || 0,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
