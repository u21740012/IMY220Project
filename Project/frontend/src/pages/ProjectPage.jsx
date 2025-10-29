import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import ProjectDetails from "../components/projects/ProjectDetails";
import FilesList from "../components/projects/FilesList";
import Messages from "../components/projects/Messages";
import CreateProjectForm from "../components/forms/CreateProjectForm";
import EditProjectForm from "../components/forms/EditProjectForm";
import ProjectPreview from "../components/common/ProjectPreview";
import CollaboratorsList from "../components/projects/CollaboratorsList"; // 🆕
import { api, getAuth } from "../utils/api";

export default function ProjectPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = getAuth();

  const [projects, setProjects] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [checkins, setCheckins] = useState([]);
  const [files, setFiles] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  // -----------------------------
  // Load all projects
  // -----------------------------
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const list = await api.get(`/api/projects?userId=${user?._id}`);
        if (!alive) return;

        const normalized = (list || []).map((p) => ({
          _id: p._id,
          name: p.name,
          description: p.description || "Project",
          owner: p.owner,
          repo: p.repo || "",
          hashtags: Array.isArray(p.hashtags) ? p.hashtags : [],
        }));

        setProjects(normalized);

        const prefer = id && id.length > 12 ? id : normalized[0]?._id || null;
        setSelectedId(prefer);
        if (prefer && (!id || id !== prefer)) {
          navigate(`/projects/${prefer}`, { replace: true });
        }
      } catch (err) {
        console.error("Failed loading projects:", err);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id, user?._id, navigate]);

  // -----------------------------
  // Select current project
  // -----------------------------
  const selected = useMemo(
    () =>
      projects.find((p) => String(p._id) === String(selectedId)) || projects[0],
    [projects, selectedId]
  );

  const isOwner = (p) => {
    if (!user?._id || !p) return false;
    const ownerId =
      typeof p.owner === "object" && p.owner ? p.owner._id : p.owner;
    return String(ownerId) === String(user._id);
  };

  // -----------------------------
  // Load checkins (messages)
  // -----------------------------
  useEffect(() => {
    if (!selected?._id) return;
    let alive = true;
    (async () => {
      try {
        const data = await api.get(`/api/checkins/project/${selected._id}`);
        if (!alive) return;
        setCheckins(
          (data || []).map((c) => ({
            text: `${c.user?.username || "User"}: ${c.message}`,
            time: new Date(c.createdAt).toLocaleString(),
          }))
        );
      } catch {
        setCheckins([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, [selected?._id]);

  // -----------------------------
  // Load project files
  // -----------------------------
  useEffect(() => {
    if (!selected?._id) return;
    let alive = true;
    (async () => {
      try {
        const list = await api.get(`/api/project-files/${selected._id}/files`);
        if (alive) setFiles(list || []);
      } catch {
        setFiles([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, [selected?._id]);

  // -----------------------------
  // Create project
  // -----------------------------
  const handleCreate = async (payload) => {
    try {
      const created = await api.post("/api/projects", {
        ...payload,
        owner: user?._id,
      });
      const newProj = {
        _id: created._id,
        name: created.name,
        description: created.description || "Project",
        owner: created.owner,
        repo: created.repo || "",
        hashtags: Array.isArray(created.hashtags)
          ? created.hashtags
          : [],
      };
      setProjects((prev) => [newProj, ...prev]);
      setSelectedId(newProj._id);
      navigate(`/projects/${newProj._id}`);
      setShowCreate(false);
    } catch (err) {
      alert(err.message || "Create failed");
    }
  };

  // -----------------------------
  // Edit project
  // -----------------------------
  const handleEdit = async (payload) => {
    if (!selected?._id) return;
    try {
      const updated = await api.put(`/api/projects/${selected._id}`, payload);
      setProjects((prev) =>
        prev.map((p) =>
          String(p._id) === String(updated._id)
            ? {
                _id: updated._id,
                name: updated.name,
                description: updated.description || "Project",
                owner: updated.owner,
                repo: updated.repo || "",
                hashtags: Array.isArray(updated.hashtags)
                  ? updated.hashtags
                  : [],
              }
            : p
        )
      );
      setShowEdit(false);
    } catch (err) {
      alert(err.message || "Save failed");
    }
  };

  // -----------------------------
  // Delete project
  // -----------------------------
  const handleDeleteProject = async (projId) => {
    const proj = projects.find((p) => String(p._id) === String(projId));
    if (!proj || !isOwner(proj)) return;

    if (
      !window.confirm(`Delete project "${proj.name}"? This cannot be undone.`)
    )
      return;

    try {
      await api.delete(
        `/api/projects/${projId}?owner=${encodeURIComponent(user._id)}`
      );
      setProjects((prev) => prev.filter((p) => String(p._id) !== String(projId)));

      if (String(selectedId) === String(projId)) {
        const next = projects.find((p) => String(p._id) !== String(projId));
        const nextId = next?._id || null;
        setSelectedId(nextId);
        if (nextId) navigate(`/projects/${nextId}`);
        else navigate(`/projects`);
      }
    } catch (err) {
      alert(err.message || "Delete failed");
    }
  };

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <AppHeader />
      <main className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <h1 className="text-4xl font-extrabold tracking-tight text-[#0F2147]">
            Projects
          </h1>
          <button
            className="px-4 py-2 bg-brand-orange text-white rounded-md hover:brightness-95"
            onClick={() => setShowCreate(true)}
          >
            Create Project
          </button>
        </header>

        {/* Projects Grid */}
        <section aria-labelledby="current-projects" className="space-y-3">
          <h2 id="current-projects" className="text-lg font-medium text-black">
            Current Projects
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {projects.map((p) => {
              const owner = isOwner(p);
              return (
                <div
                  key={p._id}
                  className={`relative group text-left rounded-md border border-gray-300 bg-white shadow p-4 hover:border-gray-400 ${
                    String(selectedId) === String(p._id)
                      ? "ring-2 ring-brand-orange"
                      : ""
                  }`}
                >
                  <button
                    onClick={() => {
                      setSelectedId(p._id);
                      navigate(`/projects/${p._id}`);
                    }}
                    className="w-full text-left"
                  >
                    <ProjectPreview
                      title={p.name}
                      description={p.description || "Project"}
                      showLikes={false}
                      icon="folder"
                    />
                  </button>

                  {owner && (
                    <button
                      type="button"
                      title="Delete project"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProject(p._id);
                      }}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity
                                 p-2 rounded-full border bg-white hover:bg-red-50"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="w-4 h-4"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M9 3h6l1 2h4v2H3V5h4l1-2Zm1 7h2v8h-2v-8Zm4 0h2v8h-2v-8ZM5 7h14l-1 13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 7Z" />
                      </svg>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Selected project */}
        {selected && (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <ProjectDetails
                project={selected}
                onEdit={() => setShowEdit(true)}
              />
              <FilesList
                files={files}
                projectId={selected._id}
                onUploaded={(newFiles) => setFiles(newFiles)}
              />
            </div>

            {/* Right panel: Messages + Collaborators */}
            <aside className="md:col-span-1 space-y-6">
              <Messages items={checkins} />
              <CollaboratorsList
                projectId={selected._id}
                ownerId={selected.owner._id || selected.owner}
              />
            </aside>
          </section>
        )}
      </main>

      {/* Modals */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/10">
          <CreateProjectForm
            onCancel={() => setShowCreate(false)}
            onSubmit={(newP) => handleCreate(newP)}
          />
        </div>
      )}

      {showEdit && selected && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/10">
          <EditProjectForm
            project={{
              id: selected._id,
              name: selected.name,
              repo: selected.repo || "",
              description: selected.description || "",
              hashtags: selected.hashtags || [],
            }}
            onCancel={() => setShowEdit(false)}
            onSubmit={(updated) =>
              handleEdit({
                name: updated.name,
                repo: updated.repo,
                description: updated.description,
                hashtags: Array.isArray(updated.hashtags)
                  ? updated.hashtags
                  : [],
              })
            }
          />
        </div>
      )}
    </div>
  );
}
