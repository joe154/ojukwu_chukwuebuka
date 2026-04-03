"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { AnimatePresence } from "framer-motion";
import { MotionDiv } from "../lib/motion";

type ToastItem = { id: string; message: string; type?: "success" | "error" | "info" };

type ToastContextType = {
  show: (message: string, type?: ToastItem["type"]) => void;
  success: (m: string) => void;
  error: (m: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const remove = (id: string) => setToasts((t) => t.filter((x) => x.id !== id));

  const show = (message: string, type: ToastItem["type"] = "info") => {
    const id = String(Date.now()) + Math.random().toString(36).slice(2, 8);
    setToasts((t) => [{ id, message, type }, ...t]);
    setTimeout(() => remove(id), 3500);
  };

  const success = (m: string) => show(m, "success");
  const error = (m: string) => show(m, "error");

  return (
    <ToastContext.Provider value={{ show, success, error }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        <AnimatePresence initial={false}>
          {toasts.map((t) => {
            const bg = t.type === "success" ? "bg-green-600" : t.type === "error" ? "bg-red-600" : "bg-black/80";
            return (
              <MotionDiv
                key={t.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className={`min-w-[200px] max-w-sm px-4 py-2 rounded shadow ${bg} text-white`}
              >
                {t.message}
              </MotionDiv>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
