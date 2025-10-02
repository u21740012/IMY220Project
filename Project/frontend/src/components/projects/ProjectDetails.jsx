import React from "react";

export default function ProjectDetails({ project, onEdit }) {
  if (!project) return null;
  return (
    <section aria-labelledby="project-details-title" className="bg-white border rounded-md p-4">
      <div className="flex items-center justify-between mb-2">
        <h2 id="project-details-title" className="text-lg font-semibold text-black">
          {project.name}
        </h2>
        <button onClick={onEdit} className="px-3 py-1 border rounded text-sm">Edit</button>
      </div>
      <p className="text-sm text-gray-700">{project.description}</p>
      <p className="text-xs text-gray-500 mt-2">Repository: {project.repo || "org/repo"}</p>
    </section>
  );
}
