import React, { useState } from "react";
import { api, getAuth } from "../../utils/api";

export default function FilesList({ files = [], projectId, onUploaded }) {
  const { user } = getAuth();
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [workingFile, setWorkingFile] = useState(null);


  const handleUpload = async () => {
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    form.append("userId", user?._id);

    try {
      setBusy(true);
      const uploaded = await api.post(
        `/api/project-files/${projectId}/checkin`,
        form,
        true
      );
      onUploaded(uploaded);
      setFile(null);
      setWorkingFile(null);
    } catch (err) {
      alert(err.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  const handleCheckout = async (filename) => {
    try {
      setBusy(true);
      await api.post(
        `/api/project-files/${projectId}/checkout/${encodeURIComponent(
          filename
        )}`,
        { userId: user._id }
      );
      alert(`Checked out "${filename}" for editing`);
      const refreshed = await api.get(`/api/project-files/${projectId}/files`);
      onUploaded(refreshed);
    } catch (err) {
      alert(err.message || "Checkout failed");
    } finally {
      setBusy(false);
    }
  };

  const handleDownload = async (storedName) => {
    const url = `/api/project-files/${projectId}/download/${encodeURIComponent(
      storedName
    )}`;
    window.open(url, "_blank");
  };

  const handleDelete = async (filename) => {
    if (!window.confirm(`Delete file "${filename}"?`)) return;
    try {
      setBusy(true);
      await api.delete(
        `/api/project-files/${projectId}/files/${encodeURIComponent(
          filename
        )}?userId=${encodeURIComponent(user._id)}`
      );
      const refreshed = await api.get(`/api/project-files/${projectId}/files`);
      onUploaded(refreshed);
    } catch (err) {
      alert(err.message || "Delete failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section
      aria-labelledby="files-title"
      className="bg-white border rounded-md p-4"
    >
      <h3
        id="files-title"
        className="text-base font-semibold text-black mb-2 flex items-center justify-between"
      >
        <span>Files</span>
        {busy && <span className="text-xs text-gray-400">Processing...</span>}
      </h3>

      <ul className="text-sm text-gray-800 space-y-2 mb-4">
        {files.map((f) => (
          <li
            key={f._id || f.storedName}
            className="flex items-center justify-between gap-3 border-b pb-1"
          >
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-gray-500 rotate-45 rounded-[2px]" />
              <div>
                <span className="font-medium">{f.path}</span>{" "}
                <span className="text-xs text-gray-500">
                  (v{f.version || 1})
                </span>
                {f.checkedOutBy && (
                  <span className="ml-1 text-xs text-red-500">
                    [Locked by {f.checkedOutBy.username || "user"}]
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleDownload(f.storedName)}
                className="text-xs text-blue-600 hover:underline"
              >
                Download
              </button>
              {!f.checkedOutBy && (
                <button
                  onClick={() => handleCheckout(f.path)}
                  className="text-xs text-yellow-600 hover:underline"
                >
                  Check-out
                </button>
              )}
              {f.checkedOutBy &&
                String(f.checkedOutBy?._id || f.checkedOutBy) ===
                  String(user._id) && (
                  <button
                    onClick={() => setWorkingFile(f.path)}
                    className="text-xs text-green-600 hover:underline"
                  >
                    Check-in new version
                  </button>
                )}
              {(user?.isAdmin ||
                String(f.uploadedBy?._id || f.uploadedBy) ===
                  String(user._id)) && (
                <button
                  onClick={() => handleDelete(f.path)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Delete
                </button>
              )}
            </div>
          </li>
        ))}
        {files.length === 0 && (
          <li className="text-gray-500">No files uploaded yet.</li>
        )}
      </ul>

      <div className="flex flex-col sm:flex-row gap-2 items-center">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="text-sm flex-1"
        />
        <button
          onClick={handleUpload}
          disabled={!file || busy}
          className="px-3 py-1 bg-brand-orange text-white rounded disabled:opacity-60"
        >
          {busy
            ? "Uploading..."
            : workingFile
            ? `Check-in "${workingFile}"`
            : "Upload"}
        </button>
      </div>
    </section>
  );
}
