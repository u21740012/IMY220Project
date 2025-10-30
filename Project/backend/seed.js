// backend/seed.js
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Project = require("./models/Project");
const Checkin = require("./models/Checkin");

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB:", mongoose.connection.db.databaseName);

    await User.deleteMany({});
    await Project.deleteMany({});
    await Checkin.deleteMany({});

    const admin = new User({
      username: "Admin",
      email: "admin@relink.com",
      password: "admin123",
      isAdmin: true,
    });

    const user1 = new User({ username: "alice", email: "alice@example.com", password: "password123" });
    const user2 = new User({ username: "bob", email: "bob@example.com", password: "password123" });

    await admin.save();
    await user1.save();
    await user2.save();

    const project1 = new Project({
      name: "Project One",
      description: "First demo project",
      owner: user1._id,
    });
    const project2 = new Project({
      name: "Project Two",
      description: "Second demo project",
      owner: user2._id,
    });

    await project1.save();
    await project2.save();

    const checkin1 = new Checkin({ project: project1._id, user: user1._id, message: "Initial commit" });
    const checkin2 = new Checkin({ project: project1._id, user: user2._id, message: "Added new feature" });
    const checkin3 = new Checkin({ project: project2._id, user: user1._id, message: "Bug fix" });

    await checkin1.save();
    await checkin2.save();
    await checkin3.save();

    console.log("✅ Database seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding database:", err);
    process.exit(1);
  }
}

seed();
