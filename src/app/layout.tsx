import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ChatWidget } from "@/components/ChatWidget";
import { PWARegister } from "@/components/PWARegister";
import { NavigationDock } from "@/components/NavigationDock";

export const metadata: Metadata = {
  title: "Naphier Awalie | IT Student & Full-Stack Developer",
  description:
    "Personal portfolio of Naphier Awalie, an IT Student and Full-Stack Developer crafting high-performance, accessible, and clean digital solutions.",
  keywords: [
    "Naphier Awalie",
    "IT Student",
    "Full-Stack Developer",
    "Software Engineer",
    "Portfolio",
    "Zamboanga City",
    "ZPPSU",
    "Next.js",
    "TypeScript",
    "React",
  ],
  manifest: "/icon/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Naphier Awalie",
  },
  icons: {
    icon: [
      { url: "/icon/favicon.ico" },
      { url: "/icon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/icon/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0d0e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        {/* Anti-flash theme initialization script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var saved = localStorage.getItem('naphier_theme');
                var isDark = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches) || (saved === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                if (isDark) {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                } else {
                  document.documentElement.classList.add('light');
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="antialiased bg-page text-ink min-h-screen selection:bg-brand selection:text-page">
        <ThemeProvider>
          <PWARegister />

          {/* Centered Page Shell Container (760px reading anchor) */}
          <div className="max-w-reading mx-auto px-4 sm:px-6 pt-12 pb-32 relative min-h-screen flex flex-col justify-between">
            <main className="w-full">{children}</main>

            {/* Minimalist Tech Footer */}
            <footer className="w-full mt-20 pt-8 border-t border-border-divider text-center">
              <p className="text-xs font-mono text-muted-foreground">
                &copy; 2026 Naphier Awalie. Designed with precision & craft.
              </p>
            </footer>
          </div>

          {/* Bottom Progressive Blur Overlay */}
          <div className="bottom-progressive-blur" aria-hidden="true" />

          {/* Persistent Floating Navigation Dock */}
          <NavigationDock />

          {/* AI Assistant Chat Widget */}
          <ChatWidget />
        </ThemeProvider>
      </body>
    </html>
  );
}
