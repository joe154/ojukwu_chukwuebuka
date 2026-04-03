"use client";
import React, { useEffect } from "react";

type Props = { message: string | null };

export default function Toast({ message }: Props) {
  const [visible, setVisible] = React.useState(!!message);
  useEffect(() => {
    setVisible(!!message);
    if (message) {
      const t = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(t);
    }
  }, [message]);

  if (!message) return null;

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-opacity ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="bg-black/80 text-white px-4 py-2 rounded shadow">{message}</div>
    </div>
  );
}
