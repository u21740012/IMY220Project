import React, { useEffect, useState } from "react";
import LoginForm from "../forms/LoginForm";
import SignupForm from "../forms/SignupForm";

export default function AuthModal({ initialTab = "signup", onClose }) {
  const [tab, setTab] = useState(initialTab);

  useEffect(() => setTab(initialTab), [initialTab]);
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-28 pointer-events-none">
      <div className="pointer-events-auto w-[420px] rounded-lg border bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Welcome</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="mb-5 inline-flex rounded-md bg-gray-100 p-1">
          <button
            onClick={() => setTab("login")}
            className={`px-3 py-1 text-sm font-semibold rounded ${
              tab === "login"
                ? "bg-white border border-gray-300"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setTab("signup")}
            className={`px-3 py-1 text-sm font-semibold rounded ${
              tab === "signup"
                ? "bg-brand-orange text-white"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Sign Up
          </button>
        </div>

        {tab === "login" ? <LoginForm /> : <SignupForm />}
      </div>
    </div>
  );
}
