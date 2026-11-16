import type { Metadata } from "next";
import { MusicPresentationRoot } from "@/features/presentation-modes/components/MusicPresentationRoot";
import { FAVORITE_TRACKS } from "@/features/music-drawer";
import { buildCollectionPageJsonLd } from "@/lib/seoSchemas";
import { SITE_URL, SITE_NAME } from "@/lib/siteConfig";

const MUSIC_DESCRIPTION = `Explore ${SITE_NAME}'s curated coding soundtrack and studio rotation playlist across Spotify and YouTube Music.`;

export const metadata: Metadata = {
  title: "Music & Rotation",
  description: MUSIC_DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/music`,
  },
  openGraph: {
    siteName: SITE_NAME,
    title: `Music & Rotation | ${SITE_NAME}`,
    description: `Explore ${SITE_NAME}'s curated coding soundtrack and studio rotation playlist.`,
    url: `${SITE_URL}/music`,
  },
  twitter: {
    card: "summary_large_image",
    title: `Music & Rotation | ${SITE_NAME}`,
    description: `Explore ${SITE_NAME}'s curated coding soundtrack and studio rotation playlist.`,
  },
};

export default function MusicPage() {
  const jsonLd = buildCollectionPageJsonLd({
    path: "/music",
    name: "Music & Rotation",
    description: MUSIC_DESCRIPTION,
    breadcrumbName: "Music",
    items: FAVORITE_TRACKS.map((track) => ({
      name: `${track.title} — ${track.artist}`,
      url: track.spotifyUrl || track.youtubeMusicUrl || `${SITE_URL}/music`,
      description: `${track.artist} (${track.duration})`,
    })),
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MusicPresentationRoot />
    </>
  );
}
