import React from "react";

export default function Teams({ className = "" }) {
  const teams = ["Team1/Repo1", "Team2/Repo2", "Team3/Repo3"];
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
