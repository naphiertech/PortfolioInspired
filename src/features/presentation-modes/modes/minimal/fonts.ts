import { EB_Garamond } from "next/font/google";

/**
 * EB Garamond - Scoped strictly to Minimal Mode
 * Old-style Roman serif typography inspired by classic print, editorial journals, and personal homepages.
 */
export const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-eb-garamond",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});
