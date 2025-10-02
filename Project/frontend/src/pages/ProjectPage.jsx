import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import ProjectDetails from "../components/projects/ProjectDetails";
import FilesList from "../components/projects/FilesList";
import Messages from "../components/projects/Messages";
import CreateProjectForm from "../components/forms/CreateProjectForm";
import EditProjectForm from "../components/forms/EditProjectForm";
import ProjectPreview from "../components/common/ProjectPreview";

export default function ProjectPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [projects, setProjects] = useState([
    { id: 1, name: "Repo1/project1", repo: "org/repo1", description: "Project description" },
    { id: 2, name: "Repo2/project2", repo: "org/repo2", description: "Project description" },
    { id: 3, name: "Repo3/project3", repo: "org/repo3", description: "Project description" },
    { id: 4, name: "Repo4/project4", repo: "org/repo4", description: "Project description" },
  ]);

  const initialSelected = Number.isFinite(Number(id)) ? Number(id) : projects[0]?.id;
  const [selectedId, setSelectedId] = useState(initialSelected);

  useEffect(() => {
    if (!id) return;
    const parsed = Number(id);
    if (Number.isFinite(parsed)) setSelectedId(parsed);
  }, [id]);

  const selected = useMemo(
    () => projects.find((p) => p.id === selectedId) || projects[0],
    [projects, selectedId]
  );

  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const files = [
    { path: "src/index.js" },
    { path: "src/pages/HomePage.jsx" },
    { path: "src/components/common/ProjectPreview.jsx" },
  ];
  const messages = [
    { text: "User checked-in src/index.js", time: "2h ago" },
    { text: "User checked-out README.md", time: "3h ago" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <AppHeader />

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-4xl font-extrabold tracking-tight text-[#0F2147]">Projects</h1>
          <button
            className="px-4 py-2 bg-brand-orange text-white rounded-md hover:brightness-95"
            onClick={() => setShowCreate(true)}
          >
            Create Project
          </button>
        </header>

        <section aria-labelledby="current-projects" className="space-y-3">
          <h2 id="current-projects" className="text-lg font-medium text-black">Current Projects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {projects.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedId(p.id);
                  navigate(`/projects/${p.id}`);
                }}
                className={`text-left rounded-md border border-gray-300 bg-white shadow p-4 hover:border-gray-400 ${
                  selectedId === p.id ? "ring-2 ring-brand-orange" : ""
                }`}
              >
                <ProjectPreview
                  title={p.name}
                  description={p.description}
                  showLikes={false}
                  icon="folder"
                />
              </button>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <ProjectDetails project={selected} onEdit={() => setShowEdit(true)} />
            <FilesList files={files} />
          </div>
          <aside className="md:col-span-1">
            <Messages items={messages} />
          </aside>
        </section>
      </main>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/10">
          <CreateProjectForm
            onCancel={() => setShowCreate(false)}
            onSubmit={(newP) => {
              setProjects((prev) => [newP, ...prev]);
              setSelectedId(newP.id);
              navigate(`/projects/${newP.id}`);
              setShowCreate(false);
            }}
          />
        </div>
      )}

      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/10">
          <EditProjectForm
            project={selected}
            onCancel={() => setShowEdit(false)}
            onSubmit={(updated) => {
              setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
              setShowEdit(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
