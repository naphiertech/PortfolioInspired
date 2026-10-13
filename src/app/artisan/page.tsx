import type { Metadata } from "next";
import { Suspense } from "react";
import { ArtisanPortfolioLayout } from "@/components/sites/sakthi-portfolio/ArtisanPortfolioLayout";

export const metadata: Metadata = {
  title: "Artisan Portfolio | Naphier",
  description:
    "Handcrafted sketch aesthetic portfolio with Three.js smoke reveal shaders, tactile train window, 3D confidential Manila folders, and interactive playground.",
};

export default function ArtisanPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ArtisanPortfolioLayout />
    </Suspense>
  );
}
