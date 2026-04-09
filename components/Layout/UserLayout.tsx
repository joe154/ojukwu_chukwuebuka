"use client";

import React from 'react';
import Header from '../Header';
import Footer from '../Footer';
import MotionWrapper from '../MotionWrapper';
import { usePathname } from 'next/navigation';

/**
 * UserLayout - Main layout for user-facing pages
 * Includes: Header, Footer, and main content wrapper
 * Hides Header/Footer for admin routes so admin layout is isolated
 */
export default function UserLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // If current route is under /admin, don't render the global header/footer.
  if (pathname?.startsWith('/admin')) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <MotionWrapper>
        <main className="flex-1 container-max px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {children}
        </main>
      </MotionWrapper>

      <Footer />
    </div>
  );
}
