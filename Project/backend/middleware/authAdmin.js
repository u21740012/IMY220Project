// backend/middleware/authAdmin.js
const User = require("../models/User");

async function authAdmin(req, res, next) {
  try {
    const userId = req.query.userId || req.body.userId;
    if (!userId) return res.status(403).json({ error: "User ID missing" });

    const user = await User.findById(userId);
    if (!user || !user.isAdmin)
      return res.status(403).json({ error: "Admin access required" });

    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = authAdmin;
