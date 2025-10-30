require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { dbName: "IMY220ProjectDB" });
    console.log("Connected to MongoDB");

    // users you want to fix
    const updates = [
      { email: "alice@example.com", newPassword: "password123" },
      { email: "bob@example.com", newPassword: "password123" },
    ];

    for (const u of updates) {
      const user = await User.findOne({ email: u.email });
      if (!user) {
        console.log(`⚠️  User not found: ${u.email}`);
        continue;
      }

      // hash and update
      const hashed = await bcrypt.hash(u.newPassword, 10);
      user.password = hashed;
      await user.save();

      console.log(`✅ Updated password for ${user.username} (${user.email})`);
    }

    console.log("All done!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
})();
