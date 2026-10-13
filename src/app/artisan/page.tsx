import type { Metadata } from "next";
import { Suspense } from "react";
import { ArtisanPortfolioLayout } from "@/features/presentation-modes/modes/artisan/ArtisanPortfolioLayout";

export const metadata: Metadata = {
  title: "Artisan Portfolio | Naphier",
  description:
    "Interactive 3D workspace and handcrafted editorial portfolio with tactile train window, MacBook showcase, and field notes.",
};

export default function ArtisanPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ArtisanPortfolioLayout />
    </Suspense>
  );
}
