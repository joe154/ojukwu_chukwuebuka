"use client";

import { useState, useEffect } from "react";
import api from "../../../lib/api";
import { useToast } from "../../../components/ToastProvider";
import { useConfirm } from "../../../components/ConfirmProvider";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit2, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "../../../components/ui/Button";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [busy, setBusy] = useState(false);
  const { show } = useToast();
  const { confirm } = useConfirm();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data || []);
    } catch (err) {
      show("Failed to fetch categories", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    setBusy(true);
    try {
      await api.post('/categories', { name: newCategory });
      show("Category added", "success");
      setNewCategory("");
      fetchCategories();
    } catch (err) {
      show("Error adding category", "error");
    } finally {
      setBusy(false);
    }
  };

  const handleEdit = (category: any) => {
    setEditingId(category.id);
    setEditingName(category.name);
  };

  const handleSaveEdit = async (id: number) => {
    if (!editingName.trim()) return;

    setBusy(true);
    try {
      await api.put(`/categories/${id}`, { name: editingName });
      show("Category updated", "success");
      setEditingId(null);
      setEditingName("");
      fetchCategories();
    } catch (err) {
      show("Error updating category", "error");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id: number) => {
    const ok = await confirm({ title: "Delete Category?", description: "This will remove the category from the system." });
    if (!ok) return;

    try {
      await api.delete(`/categories/${id}`);
      show("Category deleted", "success");
      fetchCategories();
    } catch (err) {
      show("Error deleting category", "error");
    }
  };

  const handleMove = async (id: number, direction: 'up' | 'down') => {
    const idx = categories.findIndex(c => c.id === id);
    if ((direction === 'up' && idx <= 0) || (direction === 'down' && idx >= categories.length - 1)) return;

    try {
      const curr = categories[idx];
      const target = direction === 'up' ? categories[idx - 1] : categories[idx + 1];
      const currPos = curr.position ?? idx;
      const targetPos = target.position ?? (direction === 'up' ? idx - 1 : idx + 1);

      await api.put(`/categories/${curr.id}`, { position: targetPos });
      await api.put(`/categories/${target.id}`, { position: currPos });
      show("Category moved", "success");
      fetchCategories();
    } catch (err) {
      show("Error moving category", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Categories</h1>
        <p className="text-slate-400 mt-1">Organize your projects by category</p>
      </div>

      {/* Add Form */}
      <motion.form
        onSubmit={handleAdd}
        className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-6 flex gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <input
          type="text"
          placeholder="Add a new category..."
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 focus:outline-none focus:border-primary-500"
        />
        <Button type="submit" disabled={busy || !newCategory.trim()}>
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </motion.form>

      {/* Categories List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="text-slate-400">Loading categories...</div>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12 bg-slate-800/20 rounded-xl border border-slate-700/30">
          <p className="text-slate-400">No categories yet. Create your first category!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {categories.map((category, idx) => (
            <motion.div
              key={category.id}
              className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4 flex items-center justify-between hover:border-slate-600/50 transition-all"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <div className="flex-1">
                {editingId === category.id ? (
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="px-3 py-1 rounded bg-slate-700/50 border border-slate-600/50 text-white focus:outline-none focus:border-primary-500 w-full max-w-xs"
                    autoFocus
                  />
                ) : (
                  <h3 className="font-semibold text-white">{category.name}</h3>
                )}
              </div>

              <div className="flex gap-2">
                {editingId === category.id ? (
                  <>
                    <button
                      onClick={() => handleSaveEdit(category.id)}
                      className="px-3 py-1 rounded text-xs font-medium bg-green-500/20 text-green-300 hover:bg-green-500/30 transition-colors"
                      disabled={busy}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1 rounded text-xs font-medium bg-slate-600/20 text-slate-300 hover:bg-slate-600/30 transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleMove(category.id, 'up')}
                      disabled={idx === 0}
                      className="p-1 rounded hover:bg-blue-500/20 text-blue-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMove(category.id, 'down')}
                      disabled={idx === categories.length - 1}
                      className="p-1 rounded hover:bg-blue-500/20 text-blue-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-1 rounded hover:bg-yellow-500/20 text-yellow-400 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="p-1 rounded hover:bg-red-500/20 text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
