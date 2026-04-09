"use client";

import { useState, useEffect } from "react";
import api from "../../../lib/api";
import { useToast } from "../../../components/ToastProvider";
import { useConfirm } from "../../../components/ConfirmProvider";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit2, Upload } from "lucide-react";
import { Button } from "../../../components/ui/Button";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: "", description: "", short_description: "", repo_link: "", live_link: "" });
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const { show } = useToast();
  const { confirm } = useConfirm();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data || []);
    } catch (err) {
      show("Failed to fetch projects", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      let imageUrl = null;
      if (file) {
        const fd = new FormData();
        fd.append('file', file);
        const res = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        imageUrl = res.data.url;
      }

      const payload = { ...form, ...(imageUrl && { cover_image: imageUrl }) };

      if (editingId) {
        await api.put(`/projects/${editingId}`, payload);
        show("Project updated", "success");
      } else {
        await api.post('/projects', payload);
        show("Project created", "success");
      }

      setForm({ title: "", description: "", short_description: "", repo_link: "", live_link: "" });
      setFile(null);
      setEditingId(null);
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      show("Error saving project", "error");
    } finally {
      setBusy(false);
    }
  };

  const handleEdit = (project: any) => {
    setForm({
      title: project.title,
      description: project.description,
      short_description: project.short_description,
      repo_link: project.repo_link,
      live_link: project.live_link,
    });
    setEditingId(project.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    const ok = await confirm({ title: "Delete Project?", description: "This action cannot be undone." });
    if (!ok) return;

    try {
      await api.delete(`/projects/${id}`);
      show("Project deleted", "success");
      fetchProjects();
    } catch (err) {
      show("Error deleting project", "error");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ title: "", description: "", short_description: "", repo_link: "", live_link: "" });
    setFile(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          <p className="text-slate-400 mt-1">Manage your portfolio projects</p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <motion.form
          onSubmit={handleSubmit}
          className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-6 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <input
            type="text"
            placeholder="Project Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 focus:outline-none focus:border-primary-500"
            required
          />

          <textarea
            placeholder="Short Description"
            value={form.short_description}
            onChange={(e) => setForm({ ...form, short_description: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 focus:outline-none focus:border-primary-500 resize-none h-20"
          />

          <textarea
            placeholder="Full Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 focus:outline-none focus:border-primary-500 resize-none h-32"
          />

          <input
            type="url"
            placeholder="Repository Link"
            value={form.repo_link}
            onChange={(e) => setForm({ ...form, repo_link: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 focus:outline-none focus:border-primary-500"
          />

          <input
            type="url"
            placeholder="Live Link"
            value={form.live_link}
            onChange={(e) => setForm({ ...form, live_link: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 focus:outline-none focus:border-primary-500"
          />

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Cover Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600/50 text-slate-300 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-primary-500 file:text-white file:cursor-pointer"
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={busy}>
              {busy ? "Saving..." : editingId ? "Update" : "Create"}
            </Button>
            <Button variant="secondary" type="button" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </motion.form>
      )}

      {/* Projects List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="text-slate-400">Loading projects...</div>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 bg-slate-800/20 rounded-xl border border-slate-700/30">
          <p className="text-slate-400">No projects yet. Create your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              className="bg-slate-800/30 border border-slate-700/30 rounded-xl overflow-hidden hover:border-slate-600/50 transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              {project.cover_image && (
                <img src={project.cover_image} alt={project.title} className="w-full h-40 object-cover" />
              )}
              <div className="p-4 space-y-3">
                <h3 className="font-bold text-white truncate">{project.title}</h3>
                <p className="text-sm text-slate-400 line-clamp-2">{project.short_description}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(project)}
                    className="flex-1 px-3 py-2 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="flex-1 px-3 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
