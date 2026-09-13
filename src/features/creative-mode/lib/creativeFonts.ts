import { Geist, Geist_Mono, Instrument_Serif, Instrument_Sans, Newsreader, Bricolage_Grotesque, Figtree, Fraunces, Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import type { CreativeFontPairing } from "../types/creativeMode";

const geist = Geist({ subsets: ["latin"], display: "swap", variable: "--creative-loaded-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], display: "swap", variable: "--creative-loaded-geist-mono" });
const instrumentSerif = Instrument_Serif({ subsets: ["latin"], weight: "400", display: "swap", variable: "--creative-loaded-instrument-serif" });
const instrumentSans = Instrument_Sans({ subsets: ["latin"], display: "swap", variable: "--creative-loaded-instrument-sans" });
const newsreader = Newsreader({ subsets: ["latin"], display: "swap", variable: "--creative-loaded-newsreader" });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], display: "swap", variable: "--creative-loaded-bricolage" });
const figtree = Figtree({ subsets: ["latin"], display: "swap", variable: "--creative-loaded-figtree" });
const fraunces = Fraunces({ subsets: ["latin"], display: "swap", variable: "--creative-loaded-fraunces" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], display: "swap", variable: "--creative-loaded-space" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], display: "swap", variable: "--creative-loaded-plex" });

// Static assets are bundled by Next, independent of the visitor's selection.
export const creativeFontVariables = [geist, geistMono, instrumentSerif, instrumentSans, newsreader, bricolage, figtree, fraunces, spaceGrotesk, plexMono].map(font => font.variable).join(" ");

const existingMono = '"JetBrains Mono", ui-monospace, monospace';
export const CREATIVE_FONT_PAIRINGS = {
  original: { label: "Original", heading: "", body: "", mono: "", weight: 600 },
  geist: { label: "Geist + Geist Mono", heading: "var(--creative-loaded-geist)", body: "var(--creative-loaded-geist)", mono: "var(--creative-loaded-geist-mono)", weight: 600 },
  "instrument-serif": { label: "Instrument Serif + Geist", heading: "var(--creative-loaded-instrument-serif)", body: "var(--creative-loaded-geist)", mono: existingMono, weight: 400 },
  newsreader: { label: "Newsreader + Instrument Sans", heading: "var(--creative-loaded-newsreader)", body: "var(--creative-loaded-instrument-sans)", mono: existingMono, weight: 600 },
  bricolage: { label: "Bricolage Grotesque + Figtree", heading: "var(--creative-loaded-bricolage)", body: "var(--creative-loaded-figtree)", mono: existingMono, weight: 600 },
  fraunces: { label: "Fraunces + Geist", heading: "var(--creative-loaded-fraunces)", body: "var(--creative-loaded-geist)", mono: existingMono, weight: 600 },
  "space-grotesk": { label: "Space Grotesk + IBM Plex Mono", heading: "var(--creative-loaded-space)", body: "var(--creative-loaded-space)", mono: "var(--creative-loaded-plex)", weight: 600 },
} satisfies Record<CreativeFontPairing, { label: string; heading: string; body: string; mono: string; weight: number }>;
