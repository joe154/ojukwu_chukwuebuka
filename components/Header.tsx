"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";

export default function Header() {
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    return auth.onAuthStateChanged((u) => setUser(u));
  }, []);

  const login = async () => {
    // Redirect to centralized login page for Google / email sign-in
    window.location.href = '/login';
  };
  const logout = async () => {
    await signOut(auth);
  };

  return (
    <header className="py-4 px-6 flex justify-between items-center bg-transparent">
      <div className="text-xl font-semibold">My Portfolio</div>
      <nav className="space-x-4">
        <Link href="/">Home</Link>
        <Link href="/projects">Projects</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/admin">Admin</Link>
        {user ? (
          <button onClick={logout} className="ml-4">Logout</button>
        ) : (
          <button onClick={login} className="ml-4">Login</button>
        )}
      </nav>
    </header>
  );
}
