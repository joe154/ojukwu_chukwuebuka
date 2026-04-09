"use client";

import { useState, useEffect } from "react";
import api from "../../lib/api";
import { useAuth } from '../../components/AuthProvider';
import Link from "next/link";
import { motion } from "framer-motion";
import { FolderOpen, Zap, Tag, Mail, Users, TrendingUp } from "lucide-react";

interface Stats {
  projects: number;
  skills: number;
  categories: number;
  messages: number;
  admins: number;
}

const StatCard = ({ icon: Icon, label, value, href, color }: any) => (
  <Link href={href}>
    <motion.div
      className={`p-6 rounded-xl bg-gradient-to-br ${color} border border-slate-700/30 hover:border-slate-600/50 transition-all duration-300 cursor-pointer group`}
      whileHover={{ y: -4, boxShadow: "0 20px 25px -5rgba(0,0,0,0.3)" }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium mb-2">{label}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        <div className={`p-3 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  </Link>
);

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    projects: 0,
    skills: 0,
    categories: 0,
    messages: 0,
    admins: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectsRes, skillsRes, categoriesRes, messagesRes, adminsRes] = await Promise.all([
          api.get('/projects'),
          api.get('/skills'),
          api.get('/categories'),
          api.get('/contact'),
          api.get('/admin'),
        ]);

        setStats({
          projects: projectsRes.data?.length || 0,
          skills: skillsRes.data?.length || 0,
          categories: categoriesRes.data?.length || 0,
          messages: messagesRes.data?.length || 0,
          admins: adminsRes.data?.admins?.length || 1,
        });
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchStats();
  }, [user]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400">Welcome back! Here's an overview of your portfolio.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          icon={FolderOpen}
          label="Projects"
          value={stats.projects}
          href="/admin/projects"
          color="from-blue-500/10 to-blue-600/10 hover:from-blue-500/20 hover:to-blue-600/20"
        />
        <StatCard
          icon={Zap}
          label="Skills"
          value={stats.skills}
          href="/admin/skills"
          color="from-yellow-500/10 to-yellow-600/10 hover:from-yellow-500/20 hover:to-yellow-600/20"
        />
        <StatCard
          icon={Tag}
          label="Categories"
          value={stats.categories}
          href="/admin/categories"
          color="from-purple-500/10 to-purple-600/10 hover:from-purple-500/20 hover:to-purple-600/20"
        />
        <StatCard
          icon={Mail}
          label="Messages"
          value={stats.messages}
          href="/admin/messages"
          color="from-pink-500/10 to-pink-600/10 hover:from-pink-500/20 hover:to-pink-600/20"
        />
        <StatCard
          icon={Users}
          label="Admins"
          value={stats.admins}
          href="/admin/admins"
          color="from-green-500/10 to-green-600/10 hover:from-green-500/20 hover:to-green-600/20"
        />
      </div>

      {/* Quick Actions */}
      <motion.div
        className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link href="/admin/projects">
            <motion.button
              className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-300 hover:from-blue-500/30 hover:to-blue-600/30 font-medium transition-all border border-blue-500/30"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Add New Project
            </motion.button>
          </Link>
          <Link href="/admin/skills">
            <motion.button
              className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-300 hover:from-yellow-500/30 hover:to-yellow-600/30 font-medium transition-all border border-yellow-500/30"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Add Skill
            </motion.button>
          </Link>
          <Link href="/admin/categories">
            <motion.button
              className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-300 hover:from-purple-500/30 hover:to-purple-600/30 font-medium transition-all border border-purple-500/30"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Add Category
            </motion.button>
          </Link>
          <Link href="/admin/messages">
            <motion.button
              className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-pink-500/20 to-pink-600/20 text-pink-300 hover:from-pink-500/30 hover:to-pink-600/30 font-medium transition-all border border-pink-500/30"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View Messages
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
    if (!newSkill) return;
    try {
      await api.post('/skills', { name: newSkill });
      setNewSkill('');
      fetchSkills();
    } catch (err) {
      console.error(err);
      show('Error adding skill', 'error');
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory) return;
    try {
      await api.post('/categories', { name: newCategory });
      setNewCategory('');
      fetchCategories();
      show('Category added', 'success');
    } catch (err) {
      console.error(err);
      show('Error adding category', 'error');
    }
  };

  const handleDeleteCategory = async (id: any) => {
    const ok = await confirm({ title: 'Delete category?', description: 'This will remove the category and unlink it from projects.' });
    if (!ok) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
      show('Category deleted', 'success');
    } catch (err) {
      console.error(err);
      show('Error deleting category', 'error');
    }
  };

  const startEditingCategory = (id: number, name: string) => {
    setEditingCategoryId(id);
    setEditingCategoryName(name);
  };

  const cancelEditCategory = () => {
    setEditingCategoryId(null);
    setEditingCategoryName('');
  };

  const saveCategory = async (id: number) => {
    if (!editingCategoryName) return;
    try {
      await api.put(`/categories/${id}`, { name: editingCategoryName });
      show('Category updated', 'success');
      cancelEditCategory();
      fetchCategories();
    } catch (err) {
      console.error(err);
      show('Error updating category', 'error');
    }
  };

  const moveCategoryUp = async (id: number) => {
    const idx = categories.findIndex(c => c.id === id);
    if (idx <= 0) return;
    const curr = categories[idx];
    const prev = categories[idx - 1];
    const currPos = (curr.position ?? idx);
    const prevPos = (prev.position ?? (idx - 1));
    try {
      await api.put(`/categories/${curr.id}`, { position: prevPos });
      await api.put(`/categories/${prev.id}`, { position: currPos });
      show('Category moved', 'success');
      fetchCategories();
    } catch (err) {
      console.error(err);
      show('Error reordering categories', 'error');
    }
  };

  const moveCategoryDown = async (id: number) => {
    const idx = categories.findIndex(c => c.id === id);
    if (idx === -1 || idx >= categories.length - 1) return;
    const curr = categories[idx];
    const next = categories[idx + 1];
    const currPos = (curr.position ?? idx);
    const nextPos = (next.position ?? (idx + 1));
    try {
      await api.put(`/categories/${curr.id}`, { position: nextPos });
      await api.put(`/categories/${next.id}`, { position: currPos });
      show('Category moved', 'success');
      fetchCategories();
    } catch (err) {
      console.error(err);
      show('Error reordering categories', 'error');
    }
  };

  const handleDeleteSkill = async (id: any) => {
    const ok = await confirm({ title: 'Delete skill?', description: 'This will remove the skill.' });
    if (!ok) return;
    try {
      await api.delete('/skills', { data: { id } });
      fetchSkills();
      show('Skill deleted', 'success');
    } catch (err) {
      console.error(err);
      show('Error deleting skill', 'error');
    }
  };

  const startEdit = (p: any) => {
    setEditingId(p.id);
    setEditForm({ title: p.title, description: p.description, link: p.link || '' });
    setEditingCategories((p.categories || []).map((c:any)=>c.id));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ title: '', description: '', link: '' });
  };

  const saveEdit = async (id: any) => {
    setBusy(true);
    try {
      await api.put(`/projects/${id}`, { ...editForm, categories: editingCategories });
      cancelEdit();
      fetchProjects();
    } catch (err) {
      console.error(err);
      show('Error updating project', 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id: any) => {
    const ok = await confirm({ title: 'Delete project?', description: 'This will permanently delete the project.' });
    if (!ok) return;
    try {
      await api.delete(`/projects/${id}`);
      show('Project deleted', 'success');
      fetchProjects();
    } catch (err) {
      console.error(err);
      show('Error deleting project', 'error');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!isAdmin) return <div className="text-red-600">Access denied. Admins only.</div>;

  return (
    <section>
      <h2 className="text-3xl">Admin Dashboard</h2>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3 max-w-xl">
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <SimpleEditor
          value={form.description}
          onChange={(v) => setForm({ ...form, description: v })}
        />
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Link (optional)"
          value={form.link}
          onChange={(e) => setForm({ ...form, link: e.target.value })}
        />
        <div>
          <label className="block mb-1">Categories</label>
          <CategorySelect categories={categories} selected={selectedCategories} onChange={setSelectedCategories} />
        </div>
        <input type="file" accept="image/*" onChange={handleFile} />
        <div>
          <button disabled={busy} className="px-3 py-2 bg-blue-600 text-white rounded">
            {busy ? 'Saving...' : 'Create Project'}
          </button>
        </div>
      </form>

      <div className="mt-6">
        <h3 className="text-2xl">Skills</h3>
        <div className="flex items-center gap-2 mt-2">
          <input value={newSkill} onChange={(e)=>setNewSkill(e.target.value)} placeholder="New skill" className="px-2 py-1 border rounded" />
          <button onClick={handleAddSkill} className="px-3 py-1 bg-green-600 text-white rounded">Add</button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {skills.map(s=> (
            <div key={s.id} className="px-2 py-1 bg-slate-800 rounded flex items-center gap-2">
              <span>{s.name}</span>
              <button onClick={()=>handleDeleteSkill(s.id)} className="text-red-500">✕</button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-2xl">Categories</h3>
        <div className="flex items-center gap-2 mt-2">
          <input value={newCategory} onChange={(e)=>setNewCategory(e.target.value)} placeholder="New category" className="px-2 py-1 border rounded" />
          <button onClick={handleAddCategory} className="px-3 py-1 bg-green-600 text-white rounded">Add</button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {categories.map((c, idx) => (
            <div key={c.id} className="px-2 py-1 bg-slate-800 rounded flex items-center gap-2">
              {editingCategoryId === c.id ? (
                <>
                  <input value={editingCategoryName} onChange={(e)=>setEditingCategoryName(e.target.value)} className="px-2 py-1 rounded bg-slate-900" />
                  <button onClick={()=>saveCategory(c.id)} className="px-2 py-1 bg-blue-600 rounded">Save</button>
                  <button onClick={cancelEditCategory} className="px-2 py-1 bg-gray-600 rounded">Cancel</button>
                </>
              ) : (
                <>
                  <span>{c.name}</span>
                  <button onClick={()=>startEditingCategory(c.id, c.name)} className="text-yellow-400">Edit</button>
                  <button disabled={idx===0} onClick={()=>moveCategoryUp(c.id)} className="text-slate-300">↑</button>
                  <button disabled={idx===categories.length-1} onClick={()=>moveCategoryDown(c.id)} className="text-slate-300">↓</button>
                  <button onClick={()=>handleDeleteCategory(c.id)} className="text-red-500">✕</button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <h3 className="mt-6 text-2xl">Projects</h3>
      <ul className="mt-4 space-y-3">
        {projects.map((p) => (
          <li key={p.id} className="p-3 border rounded">
            {editingId === p.id ? (
              <div className="space-y-2">
                <input value={editForm.title} onChange={(e)=>setEditForm({...editForm, title: e.target.value})} className="w-full border rounded px-2 py-1" />
                <SimpleEditor value={editForm.description} onChange={(v)=>setEditForm({...editForm, description: v})} />
                <input value={editForm.link} onChange={(e)=>setEditForm({...editForm, link: e.target.value})} className="w-full border rounded px-2 py-1" />
                <div className="flex gap-2 mt-2">
                  <button onClick={()=>saveEdit(p.id)} className="px-3 py-1 bg-blue-600 text-white rounded">Save</button>
                  <button onClick={cancelEdit} className="px-3 py-1 bg-gray-600 text-white rounded">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">{p.title}</div>
                  <div className="text-sm text-gray-600">{p.link}</div>
                </div>
                <div className="space-x-2">
                  <button onClick={()=>startEdit(p)} className="px-2 py-1 bg-yellow-600 text-white rounded">Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="px-2 py-1 bg-red-600 text-white rounded">Delete</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
      {/* Toasts rendered by ToastProvider */}
    </section>
  );
}
