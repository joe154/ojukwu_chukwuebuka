"use client";

import React from 'react';
import Header from '../Header';
import Footer from '../Footer';
import MotionWrapper from '../MotionWrapper';

/**
 * UserLayout - Main layout for user-facing pages
 * Includes: Header, Footer, and main content wrapper
 * Providers are applied by MainLayout wrapper
 * Used for public portfolio, projects, contact, etc.
 */
export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header - Navigation for users */}
      <Header />
      
      {/* Main Content */}
      <MotionWrapper>
        <main className="flex-1 container-max px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {children}
        </main>
      </MotionWrapper>
      
      {/* Footer - Links and info */}
      <Footer />
    </div>
  );
}
