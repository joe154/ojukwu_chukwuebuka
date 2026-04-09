"use client";

import { useState, useEffect } from "react";
import api from "../../../lib/api";
import { useToast } from "../../../components/ToastProvider";
import { useConfirm } from "../../../components/ConfirmProvider";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit2, Shield, Edit } from "lucide-react";
import { Button } from "../../../components/ui/Button";

export default function AdminsPage() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ email: "", name: "", role: "admin" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const { show } = useToast();
  const { confirm } = useConfirm();

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await api.get('/admin');
      setAdmins(res.data?.admins || []);
    } catch (err) {
      show("Failed to fetch admins", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email.trim()) return;

    setBusy(true);
    try {
      if (editingId) {
        await api.put(`/admin/${editingId}`, form);
        show("Admin updated", "success");
      } else {
        await api.post('/admin', form);
        show("Admin added", "success");
      }

      setForm({ email: "", name: "", role: "admin" });
      setEditingId(null);
      setShowForm(false);
      fetchAdmins();
    } catch (err) {
      show("Error saving admin", "error");
    } finally {
      setBusy(false);
    }
  };

  const handleEdit = (admin: any) => {
    setForm({
      email: admin.email,
      name: admin.name || "",
      role: admin.role || "admin",
    });
    setEditingId(admin.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    const ok = await confirm({ title: "Remove Admin?", description: "This user will no longer have admin access." });
    if (!ok) return;

    try {
      await api.delete(`/admin/${id}`);
      show("Admin removed", "success");
      fetchAdmins();
    } catch (err) {
      show("Error removing admin", "error");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ email: "", name: "", role: "admin" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Users</h1>
          <p className="text-slate-400 mt-1">Manage admin access and permissions</p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Admin
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
            type="email"
            placeholder="Admin Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 focus:outline-none focus:border-primary-500"
            required
          />

          <input
            type="text"
            placeholder="Admin Name (optional)"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 focus:outline-none focus:border-primary-500"
          />

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600/50 text-white focus:outline-none focus:border-primary-500"
            >
              <option value="admin">Admin (Full Access)</option>
              <option value="editor">Editor (Limited Access)</option>
            </select>
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={busy}>
              {busy ? "Saving..." : editingId ? "Update" : "Add Admin"}
            </Button>
            <Button variant="secondary" type="button" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </motion.form>
      )}

      {/* Admins List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="text-slate-400">Loading admins...</div>
        </div>
      ) : admins.length === 0 ? (
        <div className="text-center py-12 bg-slate-800/20 rounded-xl border border-slate-700/30">
          <p className="text-slate-400">No admins found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {admins.map((admin, idx) => (
            <motion.div
              key={admin.id}
              className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4 flex items-center justify-between hover:border-slate-600/50 transition-all"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center font-bold text-white">
                  {admin.name?.[0]?.toUpperCase() || admin.email[0]?.toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{admin.name || admin.email}</h3>
                  <p className="text-sm text-slate-400">{admin.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary-400" />
                  <span className="text-sm font-medium text-primary-300">
                    {admin.role === 'admin' ? 'Full Access' : 'Limited Access'}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(admin)}
                  className="p-2 rounded hover:bg-blue-500/20 text-blue-400 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(admin.id)}
                  className="p-2 rounded hover:bg-red-500/20 text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
