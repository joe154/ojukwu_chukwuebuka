"use client";

import React from 'react';
import Header from '../Header';
import Footer from '../Footer';
import MotionWrapper from '../MotionWrapper';
import { AuthProvider } from '../AuthProvider';
import { ConfirmProvider } from '../ConfirmProvider';
import { ToastProvider } from '../ToastProvider';
import { ErrorBoundary } from '../ErrorBoundary';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ConfirmProvider>
          <ToastProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <MotionWrapper>
                <main className="flex-1 container-max px-4 sm:px-6 lg:px-8 py-8 sm:py-12">{children}</main>
              </MotionWrapper>
              <Footer />
            </div>
          </ToastProvider>
        </ConfirmProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
