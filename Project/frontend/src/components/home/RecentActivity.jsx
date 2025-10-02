import React from "react";

export default function RecentActivity({ className = "" }) {
  const items = [
    { label: "Pushed/Branch", time: "3h ago" },
    { label: "Pulled/Branch", time: "4h ago" },
    { label: "Published/Branch", time: "4h ago" },
  ];
  return (
    <section className={`rounded-md border bg-white shadow p-4 ${className}`}>
      <h2 className="text-base font-semibold text-black mb-2">Recent Activity</h2>
      <ul className="divide-y divide-gray-200">
        {items.map((it, i) => (
          <li key={i} className="text-xs py-2 flex items-center justify-between">
            <span className="text-black">{it.label}</span>
            <span className="text-gray-500">{it.time}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}


