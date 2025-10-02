import React from "react";

export default function ContributionsPanel({
  stats = [
    { value: 12, label: "Repositories" },
    { value: 82, label: "Issues Closed" },
    { value: 500, label: "Commits" },
    { value: 102, label: "Open PR" },
  ],
}) {
  return (
    <section>
      <h3 className="text-[14px] font-medium text-black mb-3">Contributions</h3>
      <div className="rounded-md border border-gray-300 bg-gray-50 p-4">
        <div className="grid grid-cols-2 gap-x-12 gap-y-4">
          {stats.map((s, i) => (
            <div key={i} className="flex items-baseline gap-2">
              <span className="text-base font-bold text-black">{s.value}</span>
              <span className="text-xs text-gray-600">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

