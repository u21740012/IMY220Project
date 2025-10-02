// src/components/SplashHeader.jsx
import React from "react";
import logo from "../assets/images/image1.png";

export default function SplashHeader({ onOpenAuth, onHomeClick }) {
  return (
    <header className="w-full flex items-center justify-between px-8 py-4">
      <div className="flex items-center space-x-2">
        <img src={logo} alt="ReLink Splash Logo" className="w-8 h-8" />
        <span className="text-xl font-bold">ReLink</span>
      </div>

      <nav className="hidden md:flex space-x-8 text-gray-700 font-medium">
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            onHomeClick?.();
          }}
        >
          Home
        </a>
        <a href="#about">About</a>
        <a href="#features">Features</a>
        <a href="#contact">Contact</a>
      </nav>

      <button
        type="button"
        onClick={() => onOpenAuth?.("signup")}
        className="px-4 py-2 bg-brand-orange text-white rounded-lg font-semibold hover:bg-orange-600 transition"
      >
        Sign Up
      </button>
    </header>
  );
}
