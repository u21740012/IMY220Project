import React from "react";

export default function ProjectCard({
  name,
  description = "Project description",
  languagesLabel = "Programming Languages",
}) {
  return (
    <div className="rounded-md border border-gray-300 bg-gray-50 p-4">
      <div className="flex items-center gap-2 mb-1">
        <svg
          aria-hidden="true"
          className="w-5 h-5 text-gray-500"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M10 4h-5a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3h-7l-2-2Z" />
        </svg>
        <h3 className="text-sm font-semibold text-black">{name}</h3>
      </div>

      <p className="text-xs text-gray-600">{description}</p>

      <div className="mt-3 flex items-center gap-2">
        <span className="w-2.5 h-2.5 bg-gray-500 rotate-45 rounded-[2px]" />
        <span className="text-xs text-gray-600">{languagesLabel}</span>
      </div>
    </div>
  );
}
