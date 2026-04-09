"use client";

import { useEffect, useState } from "react";
import { auth } from "../../../lib/firebase";
import { signOut } from "firebase/auth";
import { motion } from "framer-motion";
import { LogOut, User, Mail, Calendar, Shield } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import api from "../../../lib/api";
import { useToast } from "../../../components/ToastProvider";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [adminInfo, setAdminInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { show } = useToast();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      setUser(u);
      if (u) fetchAdminInfo();
    });
    return () => unsub();
  }, []);

  const fetchAdminInfo = async () => {
    try {
      const res = await api.get('/admin');
      setAdminInfo(res.data);
    } catch (err) {
      console.error("Failed to fetch admin info:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      show("Logged out successfully", "success");
      window.location.href = "/";
    } catch (err) {
      show("Logout failed", "error");
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 mt-1">Manage your admin account and preferences</p>
      </motion.div>

      {/* Admin Profile Card */}
      {user && (
        <motion.div
          className="bg-gradient-to-br from-primary-500/10 to-cyan-500/10 border border-primary-500/30 rounded-xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center font-bold text-2xl text-white">
              {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-4">{user?.displayName || "Admin User"}</h2>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-300">
                  <Mail className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-400">Email</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-300">
                  <Shield className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-400">Role</p>
                    <p className="font-medium">Administrator</p>
                  </div>
                </div>

                {user?.metadata?.createdAt && (
                  <div className="flex items-center gap-3 text-slate-300">
                    <Calendar className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-400">Account Created</p>
                      <p className="font-medium">
                        {new Date(user.metadata.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Security Section */}
      <motion.div
        className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Security
        </h3>

        <div className="space-y-4">
          <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/30">
            <h4 className="font-semibold text-white mb-2">Password</h4>
            <p className="text-slate-400 text-sm mb-4">
              Your password is managed by Firebase Authentication. To change your password, visit your Firebase console or use the password reset option on the login page.
            </p>
            <Button variant="secondary" size="sm">
              Reset Password via Email
            </Button>
          </div>

          <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/30">
            <h4 className="font-semibold text-white mb-2">Two-Factor Authentication</h4>
            <p className="text-slate-400 text-sm">
              Two-factor authentication is not currently enabled. For enhanced security, enable 2FA in your Firebase settings.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Preferences Section */}
      <motion.div
        className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-xl font-bold text-white mb-6">Preferences</h3>

        <div className="space-y-4">
          <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/30 flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-white">Email Notifications</h4>
              <p className="text-slate-400 text-sm">Receive notifications for new messages</p>
            </div>
            <input type="checkbox" className="w-5 h-5 rounded" defaultChecked />
          </div>

          <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/30 flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-white">Dark Mode</h4>
              <p className="text-slate-400 text-sm">Use dark theme across the admin panel</p>
            </div>
            <input type="checkbox" className="w-5 h-5 rounded" defaultChecked />
          </div>
        </div>
      </motion.div>

      {/* Logout Section */}
      <motion.div
        className="bg-red-500/5 border border-red-500/20 rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
          <LogOut className="w-5 h-5" />
          Session
        </h3>
        <p className="text-slate-400 mb-4">
          Log out of your admin account. You will be redirected to the homepage and will need to log in again to access the admin panel.
        </p>
        <Button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </motion.div>

      {/* Info Section */}
      <motion.div
        className="bg-slate-800/20 border border-slate-700/30 rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h4 className="font-semibold text-white mb-3">Need Help?</h4>
        <p className="text-slate-400 text-sm mb-4">
          For support or issues with your admin account, please contact the site administrator or visit the documentation.
        </p>
        <div className="flex gap-3">
          <a
            href="/"
            className="px-4 py-2 rounded-lg bg-primary-500/20 text-primary-300 hover:bg-primary-500/30 transition-colors text-sm font-medium"
          >
            Visit Portfolio
          </a>
          <a
            href="/"
            className="px-4 py-2 rounded-lg bg-slate-700/30 text-slate-300 hover:bg-slate-700/50 transition-colors text-sm font-medium"
          >
            Documentation
          </a>
        </div>
      </motion.div>
    </div>
  );
}
