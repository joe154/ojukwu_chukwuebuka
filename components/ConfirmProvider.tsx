"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ConfirmOptions = {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
};

type ConfirmContextType = {
  confirm: (opts: ConfirmOptions) => Promise<boolean>;
};

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used within ConfirmProvider");
  return ctx;
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{
    open: boolean;
    options: ConfirmOptions | null;
    resolve?: (v: boolean) => void;
  }>({ open: false, options: null });

  const confirm = (options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setState({ open: true, options, resolve });
    });
  };

  const handleClose = (result: boolean) => {
    if (state.resolve) state.resolve(result);
    setState({ open: false, options: null });
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <AnimatePresence>
        {state.open && state.options && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50" onClick={() => handleClose(false)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded shadow-lg p-6 z-50 max-w-md w-full"
            >
              <h3 className="text-lg font-semibold mb-2">{state.options.title || "Confirm"}</h3>
              {state.options.description && <p className="text-sm mb-4">{state.options.description}</p>}
              <div className="flex gap-2 justify-end">
                <button
                  className="px-3 py-2 bg-gray-200 rounded"
                  onClick={() => handleClose(false)}
                >
                  {state.options.cancelText || "Cancel"}
                </button>
                <button
                  className="px-3 py-2 bg-red-600 text-white rounded"
                  onClick={() => handleClose(true)}
                >
                  {state.options.confirmText || "Confirm"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ConfirmContext.Provider>
  );
}
