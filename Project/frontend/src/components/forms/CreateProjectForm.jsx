import React, { useState } from "react";

export default function CreateProjectForm({ onSubmit, onCancel }) {
  const [name, setName] = useState("");
  const [repo, setRepo] = useState("");
  const [desc, setDesc] = useState("");
  const [tags, setTags] = useState("");

  const handle = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Project name required.");
    const hashtags = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    onSubmit?.({ name, repo, description: desc, hashtags });
  };

  return (
    <form onSubmit={handle} className="w-full max-w-lg p-6 bg-white border rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Create Project</h3>

      <label className="block text-sm font-medium mb-1">Name</label>
      <input className="w-full border rounded p-2 mb-3" value={name} onChange={(e) => setName(e.target.value)} />

      <label className="block text-sm font-medium mb-1">Repository</label>
      <input className="w-full border rounded p-2 mb-3" value={repo} onChange={(e) => setRepo(e.target.value)} />

      <label className="block text-sm font-medium mb-1">Description</label>
      <textarea className="w-full border rounded p-2 mb-4" rows="3" value={desc} onChange={(e) => setDesc(e.target.value)} />

      <label className="block text-sm font-medium mb-1">Hashtags (comma separated)</label>
      <input className="w-full border rounded p-2 mb-4" value={tags} onChange={(e) => setTags(e.target.value)} />

      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-3 py-2 border rounded">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 bg-brand-orange text-white rounded font-semibold">
          Create
        </button>
      </div>
    </form>
  );
}
