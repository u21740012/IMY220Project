import React, { useEffect, useState } from "react";
import { api } from "../../utils/api";

export default function TopRepositories({ className = "" }) {
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await api.get("/api/projects?limit=5");
        if (!alive) return;
        setRepos(data.map((p) => ({ name: p.name, desc: p.description || "Repository description" })));
      } catch {
        setRepos([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className={`rounded-md border bg-white shadow p-4 ${className}`}>
      <h2 className="text-base font-semibold text-black mb-2">Top Repositories</h2>
      <ul className="space-y-3">
        {repos.map((r) => (
          <li key={r.name} className="text-xs text-black">
            <div className="flex items-start gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-gray-400 mt-1" />
              <div>
                <p className="font-medium leading-tight">{r.name}</p>
                <p className="text-[11px] text-gray-600 leading-snug">{r.desc}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
