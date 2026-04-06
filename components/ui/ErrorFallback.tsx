'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Button } from './Button';
import { AlertCircle } from 'lucide-react';

interface ErrorFallbackProps {
  title?: string;
  message: string;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  fullPage?: boolean;
}

export const ErrorFallback = ({
  title = 'Something went wrong',
  message,
  icon,
  action,
  fullPage = false,
}: ErrorFallbackProps) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-16 h-16 bg-rose-500/20 rounded-full flex items-center justify-center">
          {icon || <AlertCircle className="w-8 h-8 text-rose-400" />}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-slate-100 mb-2">{title}</h3>
          <p className="text-slate-400 max-w-xs">{message}</p>
        </div>
        {action && (
          <Button variant="secondary" onClick={action.onClick} className="mt-4">
            {action.label}
          </Button>
        )}
      </motion.div>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm z-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {content}
        </motion.div>
      </div>
    );
  }

  return <div className="card text-center p-8">{content}</div>;
};

interface ErrorBoundaryFallbackProps {
  error: Error;
  resetError: () => void;
}

export const ErrorBoundaryFallback = ({ error, resetError }: ErrorBoundaryFallbackProps) => (
  <ErrorFallback
    title="Application Error"
    message={error.message || 'An unexpected error occurred. Please try again.'}
    action={{ label: 'Try Again', onClick: resetError }}
  />
);
