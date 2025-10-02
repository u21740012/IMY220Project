import React from "react";

export default function OrganizationsList({ items = [] }) {
  return (
    <div className="mt-6">
      <h4 className="text-sm font-medium text-black mb-3">Organisations</h4>

      <ul className="space-y-3 text-sm text-black">
        {items.map((org, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-gray-400 rounded-full" />
            <span className="font-medium">{org}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6 h-px w-full bg-gray-300" />
    </div>
  );
}
