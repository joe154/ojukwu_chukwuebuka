"use client";

import { useState, useEffect } from "react";
import api from "../../../lib/api";
import { useToast } from "../../../components/ToastProvider";
import { useConfirm } from "../../../components/ConfirmProvider";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { Button } from "../../../components/ui/Button";

export default function SkillsPage() {
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSkill, setNewSkill] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [busy, setBusy] = useState(false);
  const { show } = useToast();
  const { confirm } = useConfirm();

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await api.get('/skills');
      setSkills(res.data || []);
    } catch (err) {
      show("Failed to fetch skills", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;

    setBusy(true);
    try {
      await api.post('/skills', { name: newSkill });
      show("Skill added", "success");
      setNewSkill("");
      fetchSkills();
    } catch (err) {
      show("Error adding skill", "error");
    } finally {
      setBusy(false);
    }
  };

  const handleEdit = (skill: any) => {
    setEditingId(skill.id);
    setEditingName(skill.name);
  };

  const handleSaveEdit = async (id: number) => {
    if (!editingName.trim()) return;

    setBusy(true);
    try {
      await api.put(`/skills/${id}`, { name: editingName });
      show("Skill updated", "success");
      setEditingId(null);
      setEditingName("");
      fetchSkills();
    } catch (err) {
      show("Error updating skill", "error");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id: number) => {
    const ok = await confirm({ title: "Delete Skill?", description: "This will remove the skill from the system." });
    if (!ok) return;

    try {
      await api.delete(`/skills/${id}`);
      show("Skill deleted", "success");
      fetchSkills();
    } catch (err) {
      show("Error deleting skill", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Skills</h1>
        <p className="text-slate-400 mt-1">Manage your technical skills</p>
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
          placeholder="Add a new skill..."
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 focus:outline-none focus:border-primary-500"
        />
        <Button type="submit" disabled={busy || !newSkill.trim()}>
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </motion.form>

      {/* Skills Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="text-slate-400">Loading skills...</div>
        </div>
      ) : skills.length === 0 ? (
        <div className="text-center py-12 bg-slate-800/20 rounded-xl border border-slate-700/30">
          <p className="text-slate-400">No skills yet. Create your first skill!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill, idx) => (
            <motion.div
              key={skill.id}
              className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4 flex items-center justify-between hover:border-slate-600/50 transition-all"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
            >
              <div className="flex-1">
                {editingId === skill.id ? (
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="px-3 py-1 rounded bg-slate-700/50 border border-slate-600/50 text-white focus:outline-none focus:border-primary-500 w-full"
                    autoFocus
                  />
                ) : (
                  <h3 className="font-semibold text-white">{skill.name}</h3>
                )}
              </div>

              <div className="flex gap-2 ml-4">
                {editingId === skill.id ? (
                  <>
                    <button
                      onClick={() => handleSaveEdit(skill.id)}
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
                      onClick={() => handleEdit(skill)}
                      className="p-1 rounded hover:bg-blue-500/20 text-blue-400 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(skill.id)}
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
