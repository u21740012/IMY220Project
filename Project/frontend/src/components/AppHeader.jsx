import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/images/image1.png";
import { getAuth } from "../utils/api";

export default function AppHeader() {
  const navigate = useNavigate();
  const { user } = getAuth();

  const goProfile = () => {
    if (user?._id) navigate(`/profile/${user._id}`);
  };

  return (
    <header className="w-full bg-white border-b px-8 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <img src={logo} alt="ReLink Logo" className="w-8 h-8 object-contain" />
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
          to={user?._id ? `/profile/${user._id}` : "/home"}
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

      <button
        onClick={goProfile}
        className="w-10 h-10 rounded-full overflow-hidden bg-gray-300 border border-gray-200"
        title={user?.username || "Profile"}
      >
      {user?.avatar && user.avatar.trim() !== "" ? (
        <img src={user.avatar} alt={user.username || "Profile"} className="w-full h-full object-cover" />
      ) : (
        <span className="sr-only">Profile</span>
      )}
      </button>
    </header>
  );
}
