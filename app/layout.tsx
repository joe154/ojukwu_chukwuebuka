import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { AuthProvider } from "../components/AuthProvider";
import MotionWrapper from "../components/MotionWrapper";
import { ConfirmProvider } from "../components/ConfirmProvider";
import { ToastProvider } from "../components/ToastProvider";
import { ErrorBoundary } from "../components/ErrorBoundary";

export const metadata = {
  title: "Ebuka - Full-Stack Developer & Designer",
  description: "High-performance web applications with modern technologies. Next.js, React, Node.js, and cloud solutions.",
  keywords: "developer, portfolio, web development, full-stack, React, Next.js",
  openGraph: {
    title: "Ebuka - Full-Stack Developer & Designer",
    description: "High-performance web applications with modern technologies.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#020617" />
      </head>
      <body className="antialiased bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
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
      </body>
    </html>
  );
}
