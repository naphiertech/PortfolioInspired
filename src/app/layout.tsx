import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SoundProvider } from "@/context/SoundContext";
import { SnapProvider } from "@/context/SnapContext";
import { PresentationModeProvider } from "@/features/presentation-modes/context/PresentationModeContext";
import { resolveInitialPresentationMode } from "@/features/presentation-modes/lib/resolveMode";
import { PRESENTATION_COOKIE_NAME } from "@/features/presentation-modes/types/config";
import { DustCanvas } from "@/components/DustCanvas";
import { ChatWidget } from "@/components/ChatWidget";
import { PWARegister } from "@/components/PWARegister";
import { NavigationDock } from "@/components/NavigationDock";
import { Analytics } from "@vercel/analytics/next";
import { PortfolioShell } from "@/components/PortfolioShell";
import {
  SITE_URL,
  SITE_DEFAULT_TITLE,
  SITE_TITLE_TEMPLATE,
  SITE_DEFAULT_DESCRIPTION,
  SITE_NAME,
  AUTHOR_INFO,
  EDUCATION,
} from "@/lib/siteConfig";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_DEFAULT_TITLE,
    template: SITE_TITLE_TEMPLATE,
  },
  description: SITE_DEFAULT_DESCRIPTION,
  authors: [{ name: AUTHOR_INFO.name, url: SITE_URL }],
  creator: AUTHOR_INFO.name,
  keywords: [
    SITE_NAME,
    "IT Student",
    AUTHOR_INFO.jobTitle,
    "Software Engineer",
    "Developer Portfolio",
    AUTHOR_INFO.city,
    EDUCATION.abbreviation,
    "Next.js",
    "TypeScript",
    "React",
    "Supabase",
    "Tailwind CSS",
  ],
  alternates: {
    canonical: "./",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_DEFAULT_TITLE,
    description: SITE_DEFAULT_DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: SITE_DEFAULT_TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_DEFAULT_TITLE,
    description: SITE_DEFAULT_DESCRIPTION,
    creator: AUTHOR_INFO.handle,
    images: ["/og-image.png"],
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: SITE_NAME,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? {
        google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      }
    : undefined,
};

export const viewport: Viewport = {
  themeColor: "#0b0d0e",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const cookieMode = cookieStore.get(PRESENTATION_COOKIE_NAME)?.value;
  const initialMode = resolveInitialPresentationMode({ cookieMode });

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
          <SoundProvider>
            <SnapProvider>
              <PresentationModeProvider initialMode={initialMode}>
                <PWARegister />

                {/* Mode-Aware Centered Page Shell Container */}
                <PortfolioShell>{children}</PortfolioShell>

                {/* High-Performance Canvas for Snap Dust Disintegration */}
                <DustCanvas />

                {/* Bottom Progressive Blur Overlay */}
                <div className="bottom-progressive-blur" aria-hidden="true" />

                {/* Persistent Floating Navigation Dock */}
                <NavigationDock />

                {/* Global AI Chat Assistant */}
                <ChatWidget />

                {/* Vercel Web Analytics */}
                <Analytics />
              </PresentationModeProvider>
            </SnapProvider>
          </SoundProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
