import React, { useState } from "react";

export default function EditProfileForm({ profile, onSubmit, onCancel }) {
  const [name, setName] = useState(profile?.name || "User");
  const [bio, setBio] = useState(profile?.bio || "");
  const [website, setWebsite] = useState(profile?.website || "");
  const [location, setLocation] = useState(profile?.location || "");

  const handle = (e) => {
    e.preventDefault();
    onSubmit?.({ ...profile, name, bio, website, location });
  };

  return (
    <form onSubmit={handle} className="w-full max-w-lg p-6 bg-white border rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Edit Profile</h3>
      <label className="block text-sm font-medium mb-1">Name</label>
      <input className="w-full border rounded p-2 mb-3" value={name} onChange={(e)=>setName(e.target.value)} />
      <label className="block text-sm font-medium mb-1">Bio</label>
      <textarea className="w-full border rounded p-2 mb-3" rows="3" value={bio} onChange={(e)=>setBio(e.target.value)} />
      <label className="block text-sm font-medium mb-1">Website</label>
      <input className="w-full border rounded p-2 mb-3" value={website} onChange={(e)=>setWebsite(e.target.value)} />
      <label className="block text-sm font-medium mb-1">Location</label>
      <input className="w-full border rounded p-2 mb-4" value={location} onChange={(e)=>setLocation(e.target.value)} />
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-3 py-2 border rounded">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-brand-orange text-white rounded font-semibold">Save</button>
      </div>
    </form>
  );
}
