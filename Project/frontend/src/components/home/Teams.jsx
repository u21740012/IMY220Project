import React, { useEffect, useState } from "react";
import { api } from "../../utils/api";

export default function Teams({ className = "" }) {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const users = await api.get("/api/users?limit=6");
        if (!alive) return;
        setTeams(users.map((u) => u.username || u.email));
      } catch {
        setTeams([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className={`rounded-md border bg-white shadow p-4 ${className}`}>
      <h2 className="text-base font-semibold text-black mb-2">Teams</h2>
      <ul className="space-y-3 text-xs">
        {teams.map((t) => (
          <li key={t} className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 bg-gray-400 rounded-sm" />
            <span className="text-black">{t}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
