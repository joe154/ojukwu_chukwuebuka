"use client";
import { useState, useEffect } from "react";
import api from "../../lib/api";
import { useAuth } from '../../components/AuthProvider';
import SimpleEditor from '../../components/SimpleEditor';
import CategorySelect from '../../components/CategorySelect';
import { useConfirm } from '../../components/ConfirmProvider';
import { useToast } from '../../components/ToastProvider';

export default function Admin() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", link: "" });
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ title: "", description: "", link: "" });
  const [skills, setSkills] = useState<any[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const { confirm } = useConfirm();
  const { show } = useToast();
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [editingCategories, setEditingCategories] = useState<number[]>([]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    api.get('/admin')
      .then(() => {
        setIsAdmin(true);
        fetchProjects();
        fetchSkills();
        fetchCategories();
      })
      .catch(() => {
        setIsAdmin(false);
        setLoading(false);
      });
  }, [user]);

  const fetchProjects = () => {
    api.get('/projects').then((r) => {
      setProjects(r.data || []);
      setLoading(false);
    });
  };

  const handleFile = (e: any) => setFile(e.target.files?.[0] ?? null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!isAdmin) return;
    setBusy(true);
    try {
      let imageUrl = null;
      if (file) {
        const fd = new FormData();
        fd.append('file', file);
        const res = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        imageUrl = res.data.url;
      }
      const payload = { ...form, image: imageUrl, categories: selectedCategories };
      await api.post('/projects', payload);
      setForm({ title: "", description: "", link: "" });
      setFile(null);
      setSelectedCategories([]);
      fetchProjects();
    } catch (err) {
      console.error(err);
      show('Error creating project', 'error');
    } finally {
      setBusy(false);
    }
  };

  const fetchSkills = async () => {
    try {
      const res = await api.get('/skills');
      setSkills(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSkill = async () => {
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
