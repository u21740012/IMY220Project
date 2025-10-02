// src/components/AppHeader.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/images/image1.png"; 

export default function AppHeader() {
  return (
    <header className="w-full bg-white border-b px-8 py-4 flex items-center justify-between">
      {/* Left: Logo + Brand */}
      <div className="flex items-center space-x-2">
        <img
          src={logo}
          alt="ReLink Logo"
          className="w-8 h-8 object-contain" 
        />
        <span className="text-xl font-bold">ReLink</span>
      </div>

      <nav className="flex space-x-8 text-gray-700 font-medium">
        <NavLink
          to="/home"
          className={({ isActive }) =>
            isActive ? "text-brand-orange font-semibold" : "hover:text-brand-orange"
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/profile/1"
          className={({ isActive }) =>
            isActive ? "text-brand-orange font-semibold" : "hover:text-brand-orange"
          }
        >
          Profile
        </NavLink>

        <NavLink
          to="/projects"
          className={({ isActive }) =>
            isActive ? "text-brand-orange font-semibold" : "hover:text-brand-orange"
          }
        >
          Projects
        </NavLink>
      </nav>

      <div className="w-10 h-10 bg-gray-300 rounded-full" />
    </header>
  );
}
