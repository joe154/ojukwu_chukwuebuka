"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";
import { Button } from "./ui/Button";
import { Menu, X, LogOut, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { mainNav } from "../lib/navigation";

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setMobileMenuOpen(false);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const navItems = mainNav;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-slate-900/80 border-b border-slate-700/30 backdrop-blur-xl shadow-lg shadow-primary-500/5"
          : "bg-gradient-to-b from-slate-900/50 to-transparent border-b border-slate-700/20 backdrop-blur-md"
      }`}
    >
      <nav className="container-max px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
          <Link
            href="/"
            className="flex items-center gap-2 font-extrabold text-2xl sm:text-3xl bg-gradient-to-r from-primary-400 via-primary-500 to-cyan-400 bg-clip-text text-transparent hover:from-primary-300 hover:to-cyan-300 transition-all duration-300"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold">EB</div>
            <span className="hidden sm:inline">Ebuka</span>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <motion.div className="hidden lg:flex items-center gap-1" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="relative px-4 py-2 text-slate-300 hover:text-slate-100 font-medium transition-colors duration-200 group">
              {item.label}
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary-500 to-cyan-400 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
            </Link>
          ))}
        </motion.div>

        {/* Auth Section */}
        <motion.div className="flex items-center gap-2 sm:gap-3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
          {user ? (
            <>
              <Link href="/admin" className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-slate-300 hover:text-slate-100 hover:bg-slate-700/50 transition-all duration-200 font-medium">
                <Settings className="w-4 h-4" />
                <span className="hidden md:inline">Admin</span>
              </Link>
              <Button variant="secondary" size="sm" onClick={handleLogout} icon={<LogOut className="w-4 h-4" />} className="hidden sm:flex">
                Logout
              </Button>
              <Button variant="secondary" size="sm" onClick={handleLogout} className="sm:hidden">
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button variant="primary" size="sm">
                <span className="hidden sm:inline">Login</span>
                <span className="sm:hidden">Sign In</span>
              </Button>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden ml-2 p-2 hover:bg-slate-700/50 rounded-lg transition-colors duration-200 text-slate-300 hover:text-slate-100" aria-label="Toggle mobile menu" aria-expanded={mobileMenuOpen}>
            <AnimatePresence mode="wait">
              {mobileMenuOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div key="open" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </motion.div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div className="lg:hidden border-t border-slate-700/30 bg-slate-800/50 backdrop-blur-xl" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}>
            <div className="container-max px-4 sm:px-6 py-4 flex flex-col gap-3">
              {navItems.map((item, index) => (
                <motion.div key={item.href} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2, delay: index * 0.05 }}>
                  <Link href={item.href} className="block px-4 py-3 text-slate-300 hover:text-slate-100 hover:bg-slate-700/50 rounded-lg transition-all duration-200 font-medium" onClick={() => setMobileMenuOpen(false)}>
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              {user && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2, delay: 0.2 }}>
                  <Link href="/admin" className="block px-4 py-3 text-slate-300 hover:text-slate-100 hover:bg-slate-700/50 rounded-lg transition-all duration-200 font-medium flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Admin
                  </Link>
                </motion.div>
              )}

              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2, delay: 0.25 }}>
                {user ? (
                  <Button variant="secondary" fullWidth onClick={handleLogout} icon={<LogOut className="w-4 h-4" />}>
                    Logout
                  </Button>
                ) : (
                  <Link href="/login" className="block">
                    <Button variant="primary" fullWidth>
                      Sign In
                    </Button>
                  </Link>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
