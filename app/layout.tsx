import "./globals.css";
import MainLayout from "../components/Layout/MainLayout";

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
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
