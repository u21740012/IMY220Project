import React from "react";

export default function ProfilePreview({ name = "User", role = "Developer" }) {
  return (
    <article className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-gray-300" />
      <div>
        <h4 className="text-sm font-semibold text-black leading-tight">{name}</h4>
        <p className="text-xs text-gray-600">{role}</p>
      </div>
    </article>
  );
}
