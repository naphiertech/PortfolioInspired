import localFont from "next/font/local";

/**
 * EB Garamond - Scoped strictly to Minimal Mode
 * Old-style Roman serif typography inspired by classic print, editorial journals, and personal homepages.
 * Self-hosted via next/font/local to avoid intermittent Google Fonts /l/font extensionless URL build failures.
 */
export const ebGaramond = localFont({
  src: [
    {
      path: "./fonts/eb-garamond-latin-normal.woff2",
      weight: "400 800",
      style: "normal",
    },
    {
      path: "./fonts/eb-garamond-latin-italic.woff2",
      weight: "400 800",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-eb-garamond",
  adjustFontFallback: "Times New Roman",
});
