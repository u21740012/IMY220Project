require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { dbName: "IMY220ProjectDB" });
    console.log("Connected to MongoDB:", mongoose.connection.db.databaseName);

    const adminEmail = "admin@relink.com";

    await User.deleteOne({ email: adminEmail });

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = new User({
      username: "Admin",
      email: adminEmail,
      password: hashedPassword,
      isAdmin: true,
      bio: "System administrator",
    });

    await admin.save();

    console.log("✅ Admin seeded successfully!");
    console.log("Login credentials:");
    console.log("Email: admin@relink.com");
    console.log("Password: admin123");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding admin:", err);
    process.exit(1);
  }
}

seedAdmin();
