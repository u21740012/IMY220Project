import React, { useEffect, useState } from "react";
import { api, getAuth } from "../../utils/api";

export default function CollaboratorsList({ projectId, ownerId }) {
  const { user } = getAuth();
  const [friends, setFriends] = useState([]);
  const [collabs, setCollabs] = useState([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);

  const isOwner = String(ownerId) === String(user?._id);

  useEffect(() => {
    if (!projectId || !user?._id) return;
    (async () => {
      try {
        const me = await api.get(`/api/users/${user._id}`);
        setFriends(me.friends || []);

        const project = await api.get(`/api/projects/${projectId}?userId=${user._id}`);
        setCollabs(project.collaborators || []);
      } catch (err) {
        console.error("Error loading collaborators:", err);
      }
    })();
  }, [projectId, user?._id]);

  const addCollaborator = async () => {
    if (!selected) return;
    try {
      setLoading(true);
      const updated = await api.post(`/api/projects/${projectId}/add-collaborator`, {
        userId: user._id,
        collaboratorId: selected,
      });
      setCollabs(updated);
      setSelected("");
    } catch (err) {
      alert(err.message || "Failed to add collaborator");
    } finally {
      setLoading(false);
    }
  };

  const removeCollaborator = async (id) => {
    try {
      const updated = await api.post(`/api/projects/${projectId}/remove-collaborator`, {
        userId: user._id,
        collaboratorId: id,
      });
      setCollabs(updated);
    } catch (err) {
      alert(err.message || "Failed to remove collaborator");
    }
  };

  return (
    <section className="bg-white border rounded-md p-4">
      <h3 className="text-base font-semibold text-black mb-2">Collaborators</h3>

      {/* Current Collaborators */}
      <ul className="text-sm text-gray-800 space-y-1 mb-3">
        {collabs.length > 0 ? (
          collabs.map((c) => (
            <li key={c._id} className="flex justify-between items-center">
              <span>{c.username}</span>
              {isOwner && (
                <button
                  onClick={() => removeCollaborator(c._id)}
                  className="text-xs text-red-500 hover:underline"
                >
                  Remove
                </button>
              )}
            </li>
          ))
        ) : (
          <li className="text-gray-500">No collaborators yet.</li>
        )}
      </ul>

      {/* Add new collaborators */}
      {isOwner && (
        <div className="flex items-center gap-2">
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="border rounded px-2 py-1 text-sm flex-1"
          >
            <option value="">Select friend</option>
            {friends
              .filter((f) => !collabs.some((c) => c._id === f._id))
              .map((f) => (
                <option key={f._id} value={f._id}>
                  {f.username}
                </option>
              ))}
          </select>
          <button
            onClick={addCollaborator}
            disabled={!selected || loading}
            className="bg-brand-orange text-white text-sm px-3 py-1 rounded disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </div>
      )}
    </section>
  );
}
