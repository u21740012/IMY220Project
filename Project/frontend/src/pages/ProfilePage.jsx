import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import ProfileInfo from "../components/profile/ProfileInfo";
import ProjectsList from "../components/profile/ProjectsList";
import EditProfileForm from "../components/forms/EditProfileForm";
import FriendsPanel from "../components/profile/FriendsPanel";
import { api, getAuth } from "../utils/api";

export default function ProfilePage() {
  const { id } = useParams();
  const { user: me } = getAuth();
  const isOwner = Boolean(me?._id && String(me._id) === String(id));

  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    (async () => {
      try {
        const [userRes, projectsRes] = await Promise.all([
          api.get(`/api/users/${id}`),
          api.get(`/api/projects?owner=${encodeURIComponent(id)}`),
        ]);
        if (!alive) return;

        const u = userRes.user || userRes;
        setProfile({
          _id: u._id,
          name: u.username || "User",
          bio: u.bio || "",
          website: u.website || "",
          location: u.location || "",
          email: u.email,
          avatar: u.avatar || null,
        });

        setProjects(
          (projectsRes || []).map((p) => ({
            _id: p._id,
            name: p.name,
            description: p.description || "Repository description",
            owner: p.owner,
          }))
        );
      } catch (err) {
        console.error("Failed loading profile:", err);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  const onSaveProfile = async (p) => {
    try {
      const updatedRes = await api.put(`/api/users/${profile._id}`, {
        username: p.name,
        bio: p.bio,
        website: p.website,
        location: p.location,
        avatar: p.avatar, // base64
      });
      const updated = updatedRes.user || updatedRes;
      setProfile((prev) => ({
        ...prev,
        name: updated.username,
        bio: updated.bio || "",
        website: updated.website || "",
        location: updated.location || "",
        avatar: updated.avatar || null,
      }));
      setEditing(false);
    } catch (err) {
      alert(err.message || "Update failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <AppHeader />
        <main className="max-w-6xl mx-auto p-6">Loading…</main>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <AppHeader />
        <main className="max-w-6xl mx-auto p-6">User not found.</main>
      </div>
    );
  }

  const stats = [
    { value: projects.length, label: "Repositories" },
    { value: 0, label: "Issues Closed" },
    { value: 0, label: "Commits" },
    { value: 0, label: "Open PR" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <AppHeader />
      <main className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-12 gap-8 items-start">
          <aside className="col-span-12 md:col-span-4 space-y-6">
            <ProfileInfo
              name={profile.name}
              userId={profile._id}
              avatar={profile.avatar}
              isOwner={isOwner}
              onEdit={() => setEditing(true)}
              onAvatarChanged={(b64) =>
                setProfile((prev) => ({ ...prev, avatar: b64 }))
              }
            />

            <FriendsPanel userId={profile._id} isOwner={isOwner} />
          </aside>

          <section className="col-span-12 md:col-span-8 min-w-0 space-y-6">
            <section aria-labelledby="bio-title" className="bg-white border rounded-md p-4">
              <h3 id="bio-title" className="text-base font-semibold text-black mb-1">
                Bio
              </h3>
              <p className="text-sm text-gray-800">{profile.bio || "No bio yet."}</p>
            </section>

            <ProjectsList
              projects={projects}
              onDeleted={(deletedId) =>
                setProjects((prev) => prev.filter((p) => String(p._id) !== String(deletedId)))
              }
            />

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
            profile={{
              name: profile.name,
              bio: profile.bio,
              website: profile.website,
              location: profile.location,
              avatar: profile.avatar,
            }}
            userId={profile._id}
            canDelete={isOwner}
            onCancel={() => setEditing(false)}
            onSubmit={onSaveProfile}
          />
        </div>
      )}
    </div>
  );
}
