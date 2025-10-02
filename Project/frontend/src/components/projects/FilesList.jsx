import React, { useState } from "react";
import { api, getAuth } from "../../utils/api";

export default function FilesList({ files = [], projectId, onUploaded }) {
  const [file, setFile] = useState(null);
  const { user } = getAuth();
  const [busy, setBusy] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    form.append("userId", user?._id);

    try {
      setBusy(true);
      const uploaded = await api.post(`/api/project-files/${projectId}/upload`, form, true);
      onUploaded(uploaded);
      setFile(null);
    } catch (err) {
      alert(err.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section aria-labelledby="files-title" className="bg-white border rounded-md p-4">
      <h3 id="files-title" className="text-base font-semibold text-black mb-2">Files</h3>
      <ul className="text-sm text-gray-800 space-y-2 mb-4">
        {files.map((f) => (
          <li key={f._id} className="flex items-center gap-2">
            <span className="w-3 h-3 bg-gray-500 rotate-45 rounded-[2px]" />
            <a href={`/uploads/${f.storedName}`} target="_blank" rel="noreferrer">
              {f.path} (v{f.version || 1})
            </a>
          </li>
        ))}
        {files.length === 0 && <li className="text-gray-500">No files uploaded yet.</li>}
      </ul>

      <div className="flex gap-2">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="text-sm"
        />
        <button
          onClick={handleUpload}
          disabled={!file || busy}
          className="px-3 py-1 bg-brand-orange text-white rounded disabled:opacity-60"
        >
          {busy ? "Uploading..." : "Upload"}
        </button>
      </div>
    </section>
  );
}
