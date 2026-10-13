import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { preload } from "react-dom";
import { Doto, Figtree, JetBrains_Mono, Carrois_Gothic_SC } from "next/font/google";
import "./globals.css";

const fontDoto = Doto({
  subsets: ["latin"],
  variable: "--font-doto",
  display: "swap",
  preload: false,
});

const fontFigtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
  preload: false,
});

const fontJetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  preload: false,
});

const fontCarroisGothic = Carrois_Gothic_SC({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-carrois-gothic-sc",
  display: "swap",
  preload: false,
});
import { ThemeProvider } from "@/components/ThemeProvider";
import { SoundProvider } from "@/context/SoundContext";
import { SnapProvider } from "@/context/SnapContext";
import { PresentationModeProvider } from "@/features/presentation-modes/context/PresentationModeContext";
import { resolveInitialPresentationMode } from "@/features/presentation-modes/lib/resolveMode";
import { PRESENTATION_COOKIE_NAME, STARS_COOKIE_NAME, GRID_COOKIE_NAME } from "@/features/presentation-modes/types/config";
import { PWARegister } from "@/components/PWARegister";
import { Analytics } from "@vercel/analytics/next";
import { PortfolioShell } from "@/components/PortfolioShell";
import { CreativeModeProvider } from "@/features/creative-mode/context/CreativeModeContext";
import { AppOverlays } from "@/components/AppOverlays";
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
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
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
  const cookieStars = cookieStore.get(STARS_COOKIE_NAME)?.value;
  const cookieGrid = cookieStore.get(GRID_COOKIE_NAME)?.value;
  const initialMode = resolveInitialPresentationMode({ cookieMode });
  const initialStarsEnabled = cookieStars === "true";
  const initialGridEnabled = cookieGrid === "true";

  if (initialMode === "agent") {
    preload("/homepage-bg/3D-Room-Dark-Cutout-mobile.webp", {
      as: "image",
      type: "image/webp",
      media: "(max-width: 640px)",
      fetchPriority: "high",
    });
    preload("/homepage-bg/3D-Room-Dark-Cutout.webp", {
      as: "image",
      type: "image/webp",
      media: "(min-width: 641px)",
      fetchPriority: "high",
    });
  }

  return (
    <html lang="en" suppressHydrationWarning className={`dark ${fontDoto.variable} ${fontFigtree.variable} ${fontJetBrainsMono.variable} ${fontCarroisGothic.variable}`}>
      <head>
        <meta name="description" content={SITE_DEFAULT_DESCRIPTION} />
        <link
          rel="preload"
          href="/fonts/sakthi/c41ca59f1c34ba31-s.p.2moef4a_pkre2.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/sakthi/e41d5df559864f9e-s.p.2rlzm4mj5kw8e.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* Anti-flash theme initialization script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var saved = localStorage.getItem('naphier_theme');
                var isDark = saved ? (saved === 'dark' || (saved === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) : true;
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
              <PresentationModeProvider
                initialMode={initialMode}
                initialStarsEnabled={initialStarsEnabled}
                initialGridEnabled={initialGridEnabled}
              >
                <PWARegister />

                <CreativeModeProvider>
                  {/* Mode-Aware Centered Page Shell Container */}
                  <PortfolioShell>{children}</PortfolioShell>

                  {/* Ambient overlays, dock, widgets, and canvas (client-split) */}
                  <AppOverlays />
                </CreativeModeProvider>

                {/* Bottom Progressive Blur Overlay */}
                <div className="bottom-progressive-blur" aria-hidden="true" />

                {/* Vercel Web Analytics (active when deployed) */}
                {process.env.VERCEL && <Analytics />}
              </PresentationModeProvider>
            </SnapProvider>
          </SoundProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
