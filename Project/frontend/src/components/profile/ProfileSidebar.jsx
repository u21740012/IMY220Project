import React from "react";
import OrganizationsList from "./OrganizationsList";

export default function ProfileSidebar({
  userName = "User",
  organizations = ["Organisation1", "Organisation1"],
}) {
  return (
    <div className="w-full">
      <div className="w-32 h-32 rounded-full bg-gray-200" />
      <p className="mt-3 text-sm font-medium text-black">{userName}</p>
      <button
        type="button"
        className="mt-3 w-[112px] px-3 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium hover:bg-gray-100"
      >
        Edit Profile
      </button>

      <OrganizationsList items={organizations} />
    </div>
  );
}
