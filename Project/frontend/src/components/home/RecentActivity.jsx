import React, { useEffect, useState } from "react";
import { api } from "../../utils/api";

export default function RecentActivity({ className = "" }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await api.get("/api/checkins?limit=6");
        if (!alive) return;
        setItems(
          data.map((c) => ({
            label: `${c.user?.username || "User"} • ${c.message}`,
            time: new Date(c.createdAt).toLocaleTimeString(),
          }))
        );
      } catch {
        setItems([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

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
