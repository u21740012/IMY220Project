import React from "react";

export default function Messages({ items = [] }) {
  return (
    <section
      aria-labelledby="messages-title"
      className="bg-white border rounded-md p-4 overflow-hidden"
      style={{
        height: "200px",
        maxHeight: "200px",
        minHeight: "200px",
      }}
    >
      <h3
        id="messages-title"
        className="text-base font-semibold text-black mb-2"
      >
        Messages
      </h3>

      <ul
        className="text-sm text-gray-800 space-y-2 sleek-scroll"
        style={{
          overflowY: "auto",
          height: "calc(100% - 40px)",
          paddingRight: "4px",
        }}
      >
        {items.map((m, i) => (
          <li key={i} className="flex items-center justify-between">
            <span>{m.text}</span>
            <span className="text-xs text-gray-500">{m.time}</span>
          </li>
        ))}
      </ul>

      <style>{`
        .sleek-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .sleek-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(150, 150, 150, 0.3);
          border-radius: 9999px;
        }
        .sleek-scroll::-webkit-scrollbar-thumb:hover {
          background-color: rgba(100, 100, 100, 0.5);
        }
        .sleek-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(150,150,150,0.3) transparent;
        }
      `}</style>
    </section>
  );
}
