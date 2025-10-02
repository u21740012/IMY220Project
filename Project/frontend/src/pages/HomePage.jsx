// src/pages/HomePage.jsx
import React from "react";
import AppHeader from "../components/AppHeader";
import SearchInput from "../components/home/SearchInput";
import Feed from "../components/home/Feed";
import TopRepositories from "../components/home/TopRepositories";
import RecentActivity from "../components/home/RecentActivity";
import Teams from "../components/home/Teams";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-inter">
      <AppHeader />

      <main className="max-w-[1280px] mx-auto px-10 py-12 space-y-12">
        <div className="grid grid-cols-12 gap-8 items-start">
          <div className="col-span-12 md:col-span-4">
            <h1 className="text-5xl font-extrabold leading-tight text-[#0F2147]">
              Home
            </h1>

            <div className="mt-4 h-[132px] flex flex-col justify-between">
              <SearchInput className="w-[240px] h-8 text-xs px-2 py-1" />
              <div className="flex gap-2 pt-2">
                <button className="w-32 h-8 bg-brand-orange text-white text-xs font-semibold rounded-md">
                  New Repository
                </button>
                <button className="w-28 h-8 bg-white border border-gray-300 text-black text-xs font-semibold rounded-md">
                  Invite Team
                </button>
              </div>
            </div>
          </div>
          <div className="col-span-12 md:col-span-8">
            <Feed className="h-[132px] p-4" />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-4">
            <TopRepositories className="h-full" />
          </div>
          <div className="col-span-12 md:col-span-4">
            <RecentActivity className="h-full" />
          </div>
          <div className="col-span-12 md:col-span-4">
            <Teams className="h-full" />
          </div>
        </div>
      </main>
    </div>
  );
}
