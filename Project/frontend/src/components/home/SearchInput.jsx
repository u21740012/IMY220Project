// src/components/home/SearchInput.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../utils/api";

export default function SearchInput({ className = "" }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const ref = useRef(null);

  const debouncedQ = useDebounce(q, 250);

  useEffect(() => {
    if (!debouncedQ.trim()) {
      setResults([]);
      return;
    }
    let alive = true;
    (async () => {
      try {
        const [users, projects] = await Promise.all([
          api.get(`/api/users/search?q=${encodeURIComponent(debouncedQ)}`),
          api.get(`/api/projects/search?q=${encodeURIComponent(debouncedQ)}`),
        ]);
        if (!alive) return;
        const merged = [
          ...users.map((u) => ({ kind: "user", _id: u._id, label: u.username || u.email })),
          ...projects.map((p) => ({ kind: "project", _id: p._id, label: p.name })),
        ].slice(0, 10);
        setResults(merged);
        setOpen(true);
      } catch {
        setResults([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, [debouncedQ]);

  useEffect(() => {
    const onDoc = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const onSelect = (item) => {
    setOpen(false);
    setQ("");
    if (item.kind === "user") navigate(`/profile/${item._id}`);
    if (item.kind === "project") navigate(`/projects/${item._id}`);
  };

  return (
    <div className={`relative ${className}`} ref={ref}>
      <input
        type="text"
        placeholder="Search users or projects…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => results.length && setOpen(true)}
        className={`border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-orange px-3 py-2 w-full`}
      />
      {open && results.length > 0 && (
        <ul className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-md border bg-white shadow">
          {results.map((r) => (
            <li
              key={`${r.kind}-${r._id}`}
              onClick={() => onSelect(r)}
              className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
            >
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-gray-400" />
              <span className="text-gray-800">
                {r.kind === "user" ? "User:" : "Project:"} <b>{r.label}</b>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function useDebounce(value, delay) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}
