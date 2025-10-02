// src/pages/SplashPage.jsx
import React, { useState } from "react";
import SplashHeader from "../components/SplashHeader";
import splashLogo from "../assets/images/image2.png";
import AuthModal from "../components/common/AuthModal";

export default function SplashPage() {
  const [showAuth, setShowAuth] = useState(false);
  const [authTab, setAuthTab] = useState("signup");

  const openAuth = (tab = "signup") => {
    setAuthTab(tab);
    setShowAuth(true);
  };
  const closeAuth = () => setShowAuth(false);

  return (
    <div className="h-screen w-full flex flex-col font-sans bg-splash-gradient">
      <SplashHeader onOpenAuth={openAuth} onHomeClick={closeAuth} />

      <main
        className={`flex-1 max-w-7xl mx-auto px-8 lg:px-20 grid md:grid-cols-2 gap-12 items-center ${
          showAuth ? "hidden" : ""
        }`}
      >
        <div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            Code Together, <span className="text-brand-orange">Share Faster</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-700 max-w-md font-secondary">
            Connect, create, and share effortlessly — all in one place.
          </p>
          <div className="mt-8 flex gap-4">
            <button
              className="px-6 py-3 bg-brand-orange text-white font-semibold rounded-lg shadow hover:bg-orange-600 transition"
              onClick={() => openAuth("signup")}
            >
              Get Started
            </button>
            <button
              className="px-6 py-3 bg-white text-gray-800 font-semibold rounded-lg border hover:bg-gray-100 transition"
              onClick={() => openAuth("signup")}
            >
              Learn More
            </button>
          </div>
        </div>
        <div className="flex justify-center">
          <img
            src={splashLogo}
            alt="Splash Illustration"
            className="w-80 h-80 object-contain rounded-lg shadow"
          />
        </div>
      </main>

      {showAuth && <AuthModal initialTab={authTab} onClose={closeAuth} />}
    </div>
  );
}
