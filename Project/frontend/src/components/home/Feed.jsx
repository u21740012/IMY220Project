// src/components/Feed.jsx
import React, { useState } from "react";
import ProjectPreview from "../common/ProjectPreview";

const localData = [
  { title: "TrendingRepo/ProjectName", description: "Repository description", likes: 12000 },
  { title: "TrendingRepo/ProjectName", description: "Repository description", likes: 6000 },
];
const globalData = [
  { title: "GlobalOrg/LibX", description: "Repository description", likes: 22000 },
  { title: "AnotherOrg/ServiceY", description: "Repository description", likes: 8800 },
];

export default function Feed({ className = "" }) {
  const [view, setView] = useState("local");
  const items = view === "local" ? localData : globalData;

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

      <ul className="flex-1 overflow-y-auto space-y-3 p-4 pt-3">
        {items.map((it, i) => (
          <li key={i}>
            <ProjectPreview
              title={it.title}
              description={it.description}
              likes={it.likes}
              showLikes={true}
              bullet={true}
              icon={null}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
