// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SplashPage from "./pages/SplashPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import ProjectPage from "./pages/ProjectPage";
import { getAuth } from "./utils/auth";

export default function App() {
  const { user } = getAuth();

  return (
    <Routes>
      <Route path="/" element={<SplashPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route
        path="/profile"
        element={
          user ? <Navigate to={`/profile/${user._id}`} replace /> : <Navigate to="/" replace />
        }
      />
      <Route path="/profile/:id" element={<ProfilePage />} />
      <Route path="/projects" element={<ProjectPage />} />
      <Route path="/projects/:id" element={<ProjectPage />} />
    </Routes>
  );
}

