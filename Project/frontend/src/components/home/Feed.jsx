import React, { useEffect, useState } from "react";
import ProjectPreview from "../common/ProjectPreview";
import { api, getAuth } from "../../utils/api";

export default function Feed({ className = "" }) {
  const [view, setView] = useState("local");
  const [items, setItems] = useState([]);
  const { user } = getAuth();

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        let data = [];
        if (view === "global") {
          data = await api.get("/api/checkins?limit=20");
        } else if (user?._id) {
          data = await api.get(`/api/checkins/user/${user._id}`);
        }
        if (!alive) return;
        setItems(
          (data || []).map((c) => ({
            title: c.project?.name || "Project",
            description: c.message,
            likes: 0,
          }))
        );
      } catch {
        setItems([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, [view, user?._id]);

  return (
    <section
      className={`rounded-md border border-gray-300 bg-white overflow-hidden ${className}`}
      style={{
        height: "320px",
        maxHeight: "320px",
        minHeight: "320px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.5rem 1rem",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <h2 className="text-base font-semibold text-black m-0">
          Feed <span aria-hidden className="text-xs text-gray-500">↗</span>
        </h2>
        <div style={{ display: "flex", gap: "0.4rem" }}>
          <button
            onClick={() => setView("local")}
            className={`px-2 py-[2px] text-[10px] font-semibold rounded ${
              view === "local"
                ? "bg-brand-orange text-white"
                : "bg-white border border-gray-300 text-black"
            }`}
          >
            Local
          </button>
          <button
            onClick={() => setView("global")}
            className={`px-2 py-[2px] text-[10px] font-semibold rounded ${
              view === "global"
                ? "bg-brand-orange text-white"
                : "bg-white border border-gray-300 text-black"
            }`}
          >
            Global
          </button>
        </div>
      </div>

      {/* Scrollable list */}
      <ul
        style={{
          height: "calc(100% - 45px)",
          overflowY: "auto",
          padding: "0.75rem 1rem 1rem 1rem",
          margin: 0,
          listStyle: "none",
        }}
        className="space-y-3 sleek-scroll"
      >
        {items.map((it, i) => (
          <li key={i}>
            <ProjectPreview
              title={it.title}
              description={it.description}
              likes={it.likes}
              showLikes={false}
              bullet={true}
              icon={null}
            />
          </li>
        ))}
      </ul>

      {/* Sleek scrollbar styling */}
      <style>{`
        .sleek-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .sleek-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .sleek-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(150, 150, 150, 0.3);
          border-radius: 9999px;
        }
        .sleek-scroll::-webkit-scrollbar-thumb:hover {
          background-color: rgba(100, 100, 100, 0.5);
        }
        /* Firefox */
        .sleek-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(150,150,150,0.3) transparent;
        }
      `}</style>
    </section>
  );
}
