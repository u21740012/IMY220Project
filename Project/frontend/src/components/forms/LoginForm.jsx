import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveAuth } from "../../utils/auth";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.includes("@")) {
      alert("Email must be valid.");
      return;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }
    try {
      setBusy(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data?.error || "Login failed");
        setBusy(false);
        return;
      }

      // ✅ Save auth + redirect to profile by _id
      saveAuth({ user: data.user, token: data.token });
      navigate(`/profile/${data.user._id}`);
    } catch (err) {
      console.error(err);
      alert("Network error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg p-8 bg-white border rounded-lg shadow-md"
    >
      <h3 className="text-2xl font-bold mb-6 text-center">Login</h3>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="block w-full mb-4 p-3 border rounded text-base"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="block w-full mb-6 p-3 border rounded text-base"
        required
      />
      <button
        type="submit"
        disabled={busy}
        className="w-full py-3 bg-brand-orange text-white font-semibold rounded-md hover:bg-orange-600 transition disabled:opacity-70"
      >
        {busy ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
