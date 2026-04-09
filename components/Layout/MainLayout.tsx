"use client";

import React from 'react';
import UserLayout from './UserLayout';
import { AuthProvider } from '../AuthProvider';
import { ConfirmProvider } from '../ConfirmProvider';
import { ToastProvider } from '../ToastProvider';

/**
 * MainLayout - Main wrapper for user pages
 * Provides context and wraps with UserLayout (Header + Footer)
 * Does NOT load admin pages
 */
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ConfirmProvider>
        <ToastProvider>
          <UserLayout>
            {children}
          </UserLayout>
        </ToastProvider>
      </ConfirmProvider>
    </AuthProvider>
  );
}
