import React from "react";
import { getAuth, api } from "../../utils/api";
import ProjectPreview from "../common/ProjectPreview";

export default function ProjectsList({ projects = [], onDeleted }) {
  const { user } = getAuth();

  const canDelete = (p) => user?._id && String(p.owner) === String(user._id);

  const handleDelete = async (p) => {
    if (!canDelete(p)) return;
    if (!window.confirm(`Delete project "${p.name}"?`)) return;
    try {
      await api.delete(`/api/projects/${p._id}?owner=${user._id}`);
      onDeleted?.(p._id);
    } catch (err) {
      alert(err.message || "Delete failed");
    }
  };

  return (
    <section aria-labelledby="repos-title" className="bg-white border rounded-md p-4">
      <h3 id="repos-title" className="text-base font-semibold text-black mb-3">Repositories</h3>
      <ul className="space-y-3">
        {projects.map((p) => (
          <li key={p._id}>
            <div className="relative group border rounded-md p-4 bg-white">
              <ProjectPreview title={p.name} description={p.description} showLikes={false} icon="folder" />
              {canDelete(p) && (
                <button
                  title="Delete"
                  onClick={() => handleDelete(p)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity
                             p-2 rounded-full border bg-white hover:bg-red-50"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
                    <path d="M9 3h6l1 2h4v2H3V5h4l1-2Zm1 7h2v8h-2v-8Zm4 0h2v8h-2v-8ZM5 7h14l-1 13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 7Z"/>
                  </svg>
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
