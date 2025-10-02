// frontend/src/components/forms/EditProfileForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, clearAuth } from "../../utils/api";

export default function EditProfileForm({ profile, onSubmit, onCancel, userId, canDelete = true }) {
  const [name, setName] = useState(profile?.name || "User");
  const [bio, setBio] = useState(profile?.bio || "");
  const [website, setWebsite] = useState(profile?.website || "");
  const [location, setLocation] = useState(profile?.location || "");
  const [avatar, setAvatar] = useState(profile?.avatar || ""); // base64 dataURL
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const handleSave = (e) => {
    e.preventDefault();
    onSubmit?.({ name, bio, website, location, avatar });
  };

  const onPickAvatar = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!/^image\//.test(file.type)) return alert("Please select an image file.");
    if (file.size > 2 * 1024 * 1024) return alert("Image too large (max 2MB).");

    const r = new FileReader();
    r.onload = () => setAvatar(String(r.result || ""));
    r.readAsDataURL(file);
  };

  const handleDelete = async () => {
    if (!userId) return;
    if (!window.confirm("Delete your account? This cannot be undone.")) return;
    try {
      setBusy(true);
      await api.delete(`/api/users/${userId}`);
      clearAuth();
      navigate("/");
    } catch (err) {
      alert(err.message || "Delete failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="w-full max-w-lg p-6 bg-white border rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Edit Profile</h3>

      <label className="block text-sm font-medium mb-1">Name</label>
      <input className="w-full border rounded p-2 mb-3" value={name} onChange={(e) => setName(e.target.value)} />

      <label className="block text-sm font-medium mb-1">Bio</label>
      <textarea className="w-full border rounded p-2 mb-3" rows="3" value={bio} onChange={(e) => setBio(e.target.value)} />

      <label className="block text-sm font-medium mb-1">Website</label>
      <input className="w-full border rounded p-2 mb-3" value={website} onChange={(e) => setWebsite(e.target.value)} />

      <label className="block text-sm font-medium mb-1">Location</label>
      <input className="w-full border rounded p-2 mb-4" value={location} onChange={(e) => setLocation(e.target.value)} />

      <label className="block text-sm font-medium mb-1">Avatar</label>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 border">
          {avatar ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" /> : null}
        </div>
        <input type="file" accept="image/*" onChange={onPickAvatar} className="text-sm" />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button type="button" onClick={onCancel} className="px-3 py-2 border rounded">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-brand-orange text-white rounded font-semibold">Save</button>
        </div>

        {userId && canDelete && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={busy}
            className="px-3 py-2 border border-red-300 text-red-600 rounded hover:bg-red-50 disabled:opacity-60"
          >
            {busy ? "Deleting..." : "Delete Account"}
          </button>
        )}
      </div>
    </form>
  );
}
