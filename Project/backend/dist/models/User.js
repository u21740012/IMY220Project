// backend/models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    bio: { type: String, default: "" },
    website: { type: String, default: "" },
    location: { type: String, default: "" },
    avatar: { type: String, default: "" },

    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    friendRequests: {
      incoming: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      outgoing: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },

    // 🆕 Admin privilege flag
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  next();
});

UserSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model("User", UserSchema);
