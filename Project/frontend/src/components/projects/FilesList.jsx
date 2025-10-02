import React from "react";

export default function FilesList({ files = [] }) {
  return (
    <section aria-labelledby="files-title" className="bg-white border rounded-md p-4">
      <h3 id="files-title" className="text-base font-semibold text-black mb-2">Files</h3>
      <ul className="text-sm text-gray-800 space-y-2">
        {files.map((f) => (
          <li key={f.path} className="flex items-center gap-2">
            <span className="w-3 h-3 bg-gray-500 rotate-45 rounded-[2px]" />
            <span>{f.path}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
