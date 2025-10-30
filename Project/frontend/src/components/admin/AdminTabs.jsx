import React, { useState, useEffect } from "react";
import { api } from "../../utils/api";
import ProjectTypeForm from "./ProjectTypeForm";

export default function AdminTabs() {
  const [tab, setTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [checkins, setCheckins] = useState([]);
  const [types, setTypes] = useState([]);

  useEffect(() => {
    (async () => {
      if (tab === "users") setUsers(await api.get("/api/admin/users"));
      if (tab === "projects") setProjects(await api.get("/api/admin/projects"));
      if (tab === "activity") setCheckins(await api.get("/api/admin/checkins"));
      if (tab === "types") setTypes(await api.get("/api/admin/project-types"));
    })().catch(console.error);
  }, [tab]);

  const deleteItem = async (endpoint, id) => {
    if (!window.confirm("Are you sure?")) return;
    await api.delete(`/api/admin/${endpoint}/${id}`);
    setTab((t) => t); 
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex space-x-6 border-b mb-4">
        {["users", "projects", "activity", "types"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-2 ${
              tab === t
                ? "border-b-2 border-brand-orange text-brand-orange font-semibold"
                : "text-gray-500 hover:text-brand-orange"
            }`}
          >
            {t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === "users" && (
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-gray-600">
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b">
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => deleteItem("users", u._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {tab === "projects" && (
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-gray-600">
              <th>Name</th>
              <th>Owner</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p._id} className="border-b">
                <td>{p.name}</td>
                <td>{p.owner?.username || "Unknown"}</td>
                <td>
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => deleteItem("projects", p._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {tab === "activity" && (
        <ul className="space-y-2">
          {checkins.map((c) => (
            <li key={c._id} className="border-b py-2 text-gray-700">
              <strong>{c.user?.username || "User"}:</strong> {c.message}
            </li>
          ))}
        </ul>
      )}

      {tab === "types" && (
        <div className="space-y-4">
          <ProjectTypeForm
            onCreated={(newType) => setTypes((prev) => [...prev, newType])}
          />
          <ul>
            {types.map((t) => (
              <li
                key={t._id}
                className="flex justify-between border-b py-2 text-gray-700"
              >
                <span>{t.name}</span>
                <button
                  className="text-red-500 hover:underline"
                  onClick={() => deleteItem("project-types", t._id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
