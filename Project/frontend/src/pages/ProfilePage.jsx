// src/pages/ProfilePage.jsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import ProfileInfo from "../components/profile/ProfileInfo";
import ProjectsList from "../components/profile/ProjectsList";
import EditProfileForm from "../components/forms/EditProfileForm";

export default function ProfilePage() {
  const { id } = useParams(); 
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: `User ${id ?? ""}`.trim(), 
    bio: "Welcome to my profile",
  });

  const projects = [
    { name: "RepositoryName1 / ProjectName1", description: "Repo description" },
    { name: "RepositoryName2 / ProjectName2", description: "Repo description" },
  ];
  const stats = [
    { value: 12, label: "Repositories" },
    { value: 82, label: "Issues Closed" },
    { value: 500, label: "Commits" },
    { value: 102, label: "Open PR" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <AppHeader />

      <main className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-12 gap-8 items-start">
          <aside className="col-span-4">
            <ProfileInfo name={profile.name} onEdit={() => setEditing(true)} />
            <section aria-labelledby="orgs-title" className="mt-6 bg-white border rounded-md p-4">
              <h3 id="orgs-title" className="text-base font-semibold text-black mb-2">
                Organisations
              </h3>
              <ul className="text-sm text-gray-800 space-y-2">
                <li>Organisation1</li>
                <li>Organisation2</li>
              </ul>
            </section>
          </aside>

          <section className="col-span-8 min-w-0 space-y-6">
            <section aria-labelledby="bio-title" className="bg-white border rounded-md p-4">
              <h3 id="bio-title" className="text-base font-semibold text-black mb-1">Bio</h3>
              <p className="text-sm text-gray-800">{profile.bio}</p>
            </section>

            <ProjectsList projects={projects} />

            <section aria-labelledby="stats-title" className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((s) => (
                <article key={s.label} className="bg-white border rounded-md p-4 text-center">
                  <span className="block text-xl font-bold">{s.value}</span>
                  <span className="text-sm text-gray-500">{s.label}</span>
                </article>
              ))}
            </section>
          </section>
        </div>
      </main>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/10">
          <EditProfileForm
            profile={profile}
            onCancel={() => setEditing(false)}
            onSubmit={(p) => {
              setProfile(p);
              setEditing(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
