"use client";

import React from 'react';
import MainLayout from '../../components/Layout/MainLayout';

/**
 * User Routes Group Layout
 * Wraps all non-admin pages with MainLayout (includes Header, Footer, and providers)
 */
export default function UserGroupLayout({ children }: { children: React.ReactNode }) {
  return <MainLayout>{children}</MainLayout>;
}
