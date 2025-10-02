import React from "react";
import ProjectPreview from "../common/ProjectPreview";

export default function ProjectsList({ projects = [] }) {
  return (
    <section aria-labelledby="repos-title" className="bg-white border rounded-md p-4">
      <h3 id="repos-title" className="text-base font-semibold text-black mb-3">Repositories</h3>
      <ul className="space-y-3">
        {projects.map((p) => (
          <li key={p.name}>
            <ProjectPreview title={p.name} description={p.description} showLikes={false} />
          </li>
        ))}
      </ul>
    </section>
  );
}
