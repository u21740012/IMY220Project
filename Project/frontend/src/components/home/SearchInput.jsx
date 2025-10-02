// src/components/home/SearchInput.jsx
import React from "react";

export default function SearchInput({ className = "" }) {
  return (
    <input
      type="text"
      placeholder="Search"
      className={`border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-orange ${className}`}
    />
  );
}
