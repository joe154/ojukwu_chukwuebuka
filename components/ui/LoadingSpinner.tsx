'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullPage?: boolean;
  message?: string;
}

export const LoadingSpinner = ({ size = 'md', fullPage = false, message }: LoadingSpinnerProps) => {
  const sizeMap = {
    sm: 32,
    md: 48,
    lg: 64,
  };

  const spinnerSize = sizeMap[size];

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.svg
        className="animate-spin"
        width={spinnerSize}
        height={spinnerSize}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <circle cx="24" cy="24" r="20" stroke="#cbd5e1" strokeWidth="3" opacity="0.25" />
        <motion.circle
          cx="24"
          cy="24"
          r="20"
          stroke="url(#gradient)"
          strokeWidth="3"
          strokeLinecap="round"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          strokeDasharray="94.25"
          strokeDashoffset="47.12"
        />
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="48" y2="48">
            <stop offset="0%" stopColor="#29b6f6" />
            <stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>
        </defs>
      </motion.svg>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <p className="text-sm text-slate-400 text-center max-w-xs">{message}</p>
        </motion.div>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm z-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {spinner}
        </motion.div>
      </div>
    );
  }

  return spinner;
};
