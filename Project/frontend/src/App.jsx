// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SplashPage from "./pages/SplashPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import ProjectPage from "./pages/ProjectPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SplashPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/profile" element={<Navigate to="/profile/1" replace />} />
      <Route path="/profile/:id" element={<ProfilePage />} />
      <Route path="/projects" element={<ProjectPage />} />
      <Route path="/projects/:id" element={<ProjectPage />} />
    </Routes>
  );
}

