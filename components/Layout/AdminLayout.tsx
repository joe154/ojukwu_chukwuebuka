"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FolderOpen,
  Zap,
  Tag,
  Mail,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const adminNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'Projects', href: '/admin/projects', icon: <FolderOpen className="w-5 h-5" /> },
  { label: 'Skills', href: '/admin/skills', icon: <Zap className="w-5 h-5" /> },
  { label: 'Categories', href: '/admin/categories', icon: <Tag className="w-5 h-5" /> },
  { label: 'Messages', href: '/admin/messages', icon: <Mail className="w-5 h-5" /> },
  { label: 'Admin Users', href: '/admin/admins', icon: <Users className="w-5 h-5" /> },
  { label: 'Settings', href: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      if (!u) {
        window.location.href = '/login';
      } else {
        setUser(u);
        setReady(true);
      }
    });
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/';
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-slate-300 text-lg">Loading admin panel...</div>
      </div>
    );
  }

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100">
      {/* Sidebar */}
      <motion.aside
        className="fixed lg:relative z-40 h-screen bg-slate-800/50 border-r border-slate-700/30 backdrop-blur-xl overflow-y-auto w-64"
        animate={{ x: sidebarOpen ? 0 : -256 }}
        transition={{ duration: 0.3 }}
      >
        {/* Sidebar Header */}
        <div className="sticky top-0 p-6 border-b border-slate-700/30 bg-slate-800/80 backdrop-blur">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-lg flex items-center justify-center font-bold">
              EB
            </div>
            <span className="font-bold text-lg">Admin</span>
          </Link>
          <p className="text-xs text-slate-400">{user?.email}</p>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {adminNavItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  // Close sidebar on mobile after click
                  if (window.innerWidth < 1024) {
                    setSidebarOpen(false);
                  }
                }}
                className="relative"
              >
                <motion.div
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    active
                      ? 'bg-gradient-to-r from-primary-500/20 to-cyan-500/20 text-primary-300'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/30'
                  }`}
                  whileHover={{ x: 4 }}
                  whileTap={{ x: 2 }}
                >
                  {item.icon}
                  <span className="flex-1">{item.label}</span>
                  {active && (
                    <motion.div layoutId="activeIndicator" className="w-1 h-1 bg-primary-400 rounded-full" />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700/30 bg-slate-800/80 backdrop-blur">
          <motion.button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
            whileHover={{ x: 4 }}
            whileTap={{ x: 2 }}
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </motion.button>
        </div>
      </motion.aside>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed lg:hidden inset-0 bg-black/50 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-slate-800/50 border-b border-slate-700/30 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            {sidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          <div className="flex-1 hidden lg:block" />

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-100">{user?.displayName || 'Admin'}</p>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center font-bold text-white">
              {user?.displayName?.[0]?.toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-6 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
