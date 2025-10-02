"use strict";

/*const path = require("path");
const express = require("express");
const app = express();

const DIST_DIR = __dirname;

app.use(express.static(DIST_DIR));

app.get("/{*any}/", (req, res) => {
  res.sendFile(path.join(DIST_DIR, "index.html"));
});

const PORT = 1337;
app.listen(PORT, () => console.log(`Listening on localhost:${PORT}`));*/

var path = require("path");
var express = require("express");
var app = express();
var DIST_DIR = __dirname;
app.use(express.json());
app.use(express["static"](DIST_DIR));
var users = new Map();
function makeToken(email) {
  return Buffer.from("".concat(email, ":").concat(Date.now())).toString("base64");
}
app.post("/api/auth/signup", function (req, res) {
  var _ref = req.body || {},
    username = _ref.username,
    email = _ref.email,
    password = _ref.password;
  if (!email || !email.includes("@")) {
    return res.status(400).json({
      error: "Invalid email"
    });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({
      error: "Password too short"
    });
  }
  var id = String(Date.now());
  var user = {
    id: id,
    username: username || "User",
    email: email
  };
  users.set(email, user);
  var token = makeToken(email);
  return res.json({
    message: "Signup success (stub)",
    user: user,
    token: token
  });
});
app.post("/api/auth/login", function (req, res) {
  var _ref2 = req.body || {},
    email = _ref2.email,
    password = _ref2.password;
  if (!email || !email.includes("@")) {
    return res.status(400).json({
      error: "Invalid email"
    });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({
      error: "Password too short"
    });
  }
  if (!users.has(email)) {
    users.set(email, {
      id: String(Date.now()),
      username: "User",
      email: email
    });
  }
  var user = users.get(email);
  var token = makeToken(email);
  return res.json({
    message: "Login success (stub)",
    user: user,
    token: token
  });
});
app.get("/api/auth/me", function (req, res) {
  var auth = req.headers.authorization || "";
  var token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return res.status(401).json({
    error: "Missing token"
  });
  try {
    var decoded = Buffer.from(token, "base64").toString("utf8");
    var email = decoded.split(":")[0];
    var user = users.get(email) || {
      id: "0",
      username: "User",
      email: email
    };
    return res.json({
      user: user
    });
  } catch (_unused) {
    return res.status(401).json({
      error: "Invalid token"
    });
  }
});
app.get("/{*any}/", function (req, res) {
  res.sendFile(path.join(DIST_DIR, "index.html"));
});
var PORT = 1337;
app.listen(PORT, function () {
  return console.log("Listening on localhost:".concat(PORT));
});