import type { Metadata } from "next";
import { MusicPresentationRoot } from "@/features/presentation-modes/components/MusicPresentationRoot";
import { SITE_URL, SITE_NAME } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Music & Rotation",
  description:
    `Explore ${SITE_NAME}'s curated coding soundtrack and studio rotation playlist across Spotify and YouTube Music.`,
  alternates: {
    canonical: `${SITE_URL}/music`,
  },
  openGraph: {
    siteName: SITE_NAME,
    title: `Music & Rotation | ${SITE_NAME}`,
    description:
      `Explore ${SITE_NAME}'s curated coding soundtrack and studio rotation playlist.`,
    url: `${SITE_URL}/music`,
  },
  twitter: {
    card: "summary_large_image",
    title: `Music & Rotation | ${SITE_NAME}`,
    description:
      `Explore ${SITE_NAME}'s curated coding soundtrack and studio rotation playlist.`,
  },
};

export default function MusicPage() {
  return <MusicPresentationRoot />;
}
