import React from "react";

export default function Messages({ items = [] }) {
  return (
    <section aria-labelledby="messages-title" className="bg-white border rounded-md p-4">
      <h3 id="messages-title" className="text-base font-semibold text-black mb-2">Messages</h3>
      <ul className="text-sm text-gray-800 space-y-2">
        {items.map((m, i) => (
          <li key={i} className="flex items-center justify-between">
            <span>{m.text}</span>
            <span className="text-xs text-gray-500">{m.time}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

