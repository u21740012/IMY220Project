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

            <div className="mt-4 flex flex-col">
              <SearchInput className="w-64 h-9" />

              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  className="px-4 py-2 rounded-md text-sm font-semibold bg-brand-orange text-white shadow-sm hover:brightness-95"
                >
                  New Repository
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded-md text-sm font-semibold bg-white text-gray-900 border border-gray-300 shadow-sm hover:bg-gray-50"
                >
                  Invite Team
                </button>
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-8">
            <Feed className="p-4" />
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
