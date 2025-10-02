import React from "react";

export default function ProfileInfo({ name = "User", onEdit }) {
  return (
    <section aria-labelledby="profile-title">
      <div className="flex items-center gap-4">
        <div className="w-32 h-32 rounded-full bg-gray-200" />
        <div>
          <h2 id="profile-title" className="text-xl font-bold">{name}</h2>
          <button
            onClick={onEdit}
            className="mt-2 px-4 py-2 border rounded bg-white hover:bg-gray-100"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </section>
  );
}
