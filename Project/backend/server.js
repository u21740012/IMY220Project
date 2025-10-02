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

const path = require("path");
const express = require("express");
const app = express();

const DIST_DIR = __dirname;

app.use(express.json());
app.use(express.static(DIST_DIR));

const users = new Map(); 

function makeToken(email) {
  return Buffer.from(`${email}:${Date.now()}`).toString("base64");
}

app.post("/api/auth/signup", (req, res) => {
  const { username, email, password } = req.body || {};
  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Invalid email" });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ error: "Password too short" });
  }
  const id = String(Date.now());
  const user = { id, username: username || "User", email };
  users.set(email, user);
  const token = makeToken(email);
  return res.json({ message: "Signup success (stub)", user, token });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Invalid email" });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ error: "Password too short" });
  }
  if (!users.has(email)) {
    users.set(email, { id: String(Date.now()), username: "User", email });
  }
  const user = users.get(email);
  const token = makeToken(email);
  return res.json({ message: "Login success (stub)", user, token });
});

app.get("/api/auth/me", (req, res) => {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing token" });
  try {
    const decoded = Buffer.from(token, "base64").toString("utf8");
    const email = decoded.split(":")[0];
    const user = users.get(email) || { id: "0", username: "User", email };
    return res.json({ user });
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
});

app.get("/{*any}/", (req, res) => {
  res.sendFile(path.join(DIST_DIR, "index.html"));
});

const PORT = 1337;
app.listen(PORT, () => console.log(`Listening on localhost:${PORT}`));

