"use client";
import { useEffect, useState } from "react";
import { auth } from "../../lib/firebase";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (!user) {
        window.location.href = '/';
      } else {
        setReady(true);
      }
    });
    return () => unsub();
  }, []);

  if (!ready) return <div>Loading admin...</div>;
  return <div className="admin-layout">{children}</div>;
}
