import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { AuthProvider } from "../components/AuthProvider";
import MotionWrapper from "../components/MotionWrapper";
import { ConfirmProvider } from "../components/ConfirmProvider";
import { ToastProvider } from "../components/ToastProvider";

export const metadata = {
  title: "Developer Portfolio",
  description: "Modern developer portfolio"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ConfirmProvider>
            <ToastProvider>
              <div className="min-h-screen flex flex-col">
                <Header />
                <MotionWrapper>
                  <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
                </MotionWrapper>
                <Footer />
              </div>
            </ToastProvider>
          </ConfirmProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
