"use client";

import { useState, useEffect } from "react";
import api from "../../../lib/api";
import { useToast } from "../../../components/ToastProvider";
import { useConfirm } from "../../../components/ConfirmProvider";
import { motion } from "framer-motion";
import { Trash2, Mail, Calendar } from "lucide-react";

export default function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const { show } = useToast();
  const { confirm } = useConfirm();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await api.get('/contact');
      setMessages(res.data || []);
    } catch (err) {
      show("Failed to fetch messages", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const ok = await confirm({ title: "Delete Message?", description: "This action cannot be undone." });
    if (!ok) return;

    try {
      await api.delete(`/contact/${id}`);
      show("Message deleted", "success");
      setSelectedMessage(null);
      fetchMessages();
    } catch (err) {
      show("Error deleting message", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Messages</h1>
        <p className="text-slate-400 mt-1">View and manage contact form submissions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1 space-y-3">
          {loading ? (
            <div className="text-center py-12">
              <div className="text-slate-400">Loading messages...</div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12 bg-slate-800/20 rounded-xl border border-slate-700/30">
              <p className="text-slate-400">No messages yet</p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <motion.div
                key={msg.id}
                onClick={() => setSelectedMessage(msg)}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  selectedMessage?.id === msg.id
                    ? 'bg-primary-500/20 border border-primary-500/50'
                    : 'bg-slate-800/30 border border-slate-700/30 hover:border-slate-600/50'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <p className="font-semibold text-white truncate">{msg.name}</p>
                <p className="text-sm text-slate-400 truncate">{msg.email}</p>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{msg.subject || msg.message}</p>
              </motion.div>
            ))
          )}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <motion.div
              className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-6 space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedMessage.name}</h2>
                  <div className="flex items-center gap-2 text-slate-400 mt-2">
                    <Mail className="w-4 h-4" />
                    <a href={`mailto:${selectedMessage.email}`} className="hover:text-primary-400 transition-colors">
                      {selectedMessage.email}
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="p-2 rounded hover:bg-red-500/20 text-red-400 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {selectedMessage.subject && (
                <div>
                  <p className="text-sm text-slate-400 mb-1">Subject</p>
                  <p className="text-white font-medium">{selectedMessage.subject}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-slate-400 mb-1">Message</p>
                <div className="bg-slate-900/50 rounded-lg p-4 text-slate-100 whitespace-pre-wrap break-words">
                  {selectedMessage.message}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700/30">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Date</p>
                  <p className="text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {new Date(selectedMessage.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Time</p>
                  <p className="text-white">
                    {new Date(selectedMessage.created_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-12 bg-slate-800/20 rounded-xl border border-slate-700/30 flex items-center justify-center h-full">
              <p className="text-slate-400">Select a message to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
