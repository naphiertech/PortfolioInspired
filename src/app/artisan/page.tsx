import type { Metadata } from "next";
import { Suspense } from "react";
import { ArtisanPortfolioLayout } from "@/features/presentation-modes/modes/artisan/ArtisanPortfolioLayout";
import { SITE_URL } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Artisan Portfolio",
  description:
    "Interactive 3D workspace and handcrafted editorial portfolio with tactile train window, MacBook showcase, and field notes.",
  alternates: {
    canonical: SITE_URL,
  },
};

export default function ArtisanPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ArtisanPortfolioLayout />
    </Suspense>
  );
}
