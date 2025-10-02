import React from "react";

export default function RepositoriesPanel({ repos = [] }) {
  return (
    <section>
      <h3 className="text-[14px] font-medium text-black mb-3">Repositories</h3>
      <div className="rounded-md border border-gray-300 bg-gray-50 p-4">
        <ul className="space-y-3 text-sm text-gray-800">
          {repos.map((fullName, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-1 w-2.5 h-2.5 bg-gray-400 rounded-full shrink-0" />
              <span className="font-medium">{fullName}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
