import React, { useEffect, useState } from "react";
import ProjectPreview from "../common/ProjectPreview";
import { api, getAuth } from "../../utils/api";

export default function Feed({ className = "" }) {
  const [view, setView] = useState("local"); // "local" | "global"
  const [items, setItems] = useState([]);
  const { user } = getAuth();

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        if (view === "global") {
          const data = await api.get("/api/checkins?limit=20");
          if (!alive) return;
          setItems(
            data.map((c) => ({
              title: c.project?.name || "Project",
              description: c.message,
              likes: 0,
            }))
          );
        } else {
          if (!user?._id) {
            setItems([]);
            return;
          }
          const data = await api.get(`/api/checkins/user/${user._id}`);
          if (!alive) return;
          setItems(
            data.map((c) => ({
              title: c.project?.name || "Project",
              description: c.message,
              likes: 0,
            }))
          );
        }
      } catch {
        setItems([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, [view, user?._id]);

  return (
    <section className={`rounded-md border border-gray-300 bg-white flex flex-col ${className}`}>
      <div className="flex items-center justify-between mb-2 p-4 pb-0">
        <h2 className="text-base font-semibold text-black">
          Feed <span aria-hidden className="text-xs text-gray-500">↗</span>
        </h2>
        <div className="flex gap-1.5">
          <button
            onClick={() => setView("local")}
            className={`px-2 py-[2px] text-[10px] font-semibold rounded ${
              view === "local" ? "bg-brand-orange text-white" : "bg-white border border-gray-300 text-black"
            }`}
          >
            Local
          </button>
          <button
            onClick={() => setView("global")}
            className={`px-2 py-[2px] text-[10px] font-semibold rounded ${
              view === "global" ? "bg-brand-orange text-white" : "bg-white border border-gray-300 text-black"
            }`}
          >
            Global
          </button>
        </div>
      </div>
      <ul className="flex-1 overflow-y-auto space-y-3 p-4 pt-3">
        {items.map((it, i) => (
          <li key={i}>
            <ProjectPreview title={it.title} description={it.description} likes={it.likes} showLikes={false} bullet={true} icon={null} />
          </li>
        ))}
      </ul>
    </section>
  );
}

