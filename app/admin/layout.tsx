"use client";

import AdminLayout from "../../components/Layout/AdminLayout";
import { AuthProvider } from "../../components/AuthProvider";
import { ConfirmProvider } from "../../components/ConfirmProvider";
import { ToastProvider } from "../../components/ToastProvider";

/**
 * Admin Route Layout - Isolated admin pages layout
 * Provides context for admin pages and uses AdminLayout (Sidebar only)
 */
export default function AdminRouteLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ConfirmProvider>
        <ToastProvider>
          <AdminLayout>{children}</AdminLayout>
        </ToastProvider>
      </ConfirmProvider>
    </AuthProvider>
  );
}
