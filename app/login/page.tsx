"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, googleProvider } from "../../lib/firebase";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { motion } from "framer-motion";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { LogIn, Mail, Lock, Chrome } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRegister, setIsRegister] = useState(false);

  const handleGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/admin");
    } catch (e: any) {
      setError(e.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push("/admin");
    } catch (e: any) {
      setError(e.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.section
      className="min-h-[calc(100vh-200px)] flex items-center justify-center py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="text-center mb-8 space-y-3" variants={itemVariants}>
          <div className="flex justify-center">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <LogIn className="w-7 h-7 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-100 mb-2">
              {isRegister ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="text-slate-400">
              {isRegister
                ? "Join our community of developers"
                : "Admin access for portfolio management"}
            </p>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}

        {/* Form Card */}
        <motion.div variants={itemVariants}>
          <Card className="card-lg space-y-6">
            <form onSubmit={handleEmail} className="space-y-4">
              <Input
                type="email"
                label="Email Address"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="w-4 h-4" />}
                iconPosition="left"
                required
                disabled={loading}
              />

              <Input
                type="password"
                label="Password"
                placeholder={isRegister ? "Create a strong password" : "Enter your password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="w-4 h-4" />}
                iconPosition="left"
                required
                disabled={loading}
              />

              {/* Remember Me / Sign Up Toggle */}
              <div className="flex items-center justify-between">
                {!isRegister && (
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-primary-500 cursor-pointer accent-primary-500"
                    />
                    <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                      Remember me
                    </span>
                  </label>
                )}
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={isRegister}
                    onChange={(e) => {
                      setIsRegister(e.target.checked);
                      setError(null);
                    }}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-primary-500 cursor-pointer accent-primary-500"
                  />
                  <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                    {isRegister ? "Sign in instead" : "Create account"}
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={loading}
                disabled={loading}
              >
                {isRegister ? "Create Account" : "Sign In"}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700/30"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-800 text-slate-400">Or continue with</span>
              </div>
            </div>

              // Google Sign In
            <Button
              type="button"
              variant="secondary"
              size="lg"
              fullWidth
              onClick={handleGoogle}
              disabled={loading}
              icon={<Chrome className="w-4 h-4" />}
            >
              Google
            </Button>
          </Card>
        </motion.div>

        {/* Info Text */}
        <motion.div className="mt-6 p-4 bg-slate-800/30 rounded-lg border border-slate-700/30" variants={itemVariants}>
          <p className="text-xs text-slate-400 leading-relaxed">
            <span className="font-semibold text-slate-300">Note:</span> After signing in, if you need admin access, your Firebase UID or email
            needs to be added to the backend `admins` table.
          </p>
        </motion.div>

        {/* Back to Home */}
        <motion.div className="mt-6 text-center" variants={itemVariants}>
          <Link
            href="/"
            className="text-sm text-primary-400 hover:text-primary-300 transition-colors duration-200 inline-flex items-center gap-1"
          >
            ← Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
