import React, { Suspense } from "react";
import type { Metadata } from "next";
import { TechStackClient } from "./TechStackClient";

export const metadata: Metadata = {
  title: "Tech Stack | Naphier Awalie",
  description:
    "Explore the comprehensive tech stack, frameworks, tools, and platforms utilized by Naphier Awalie.",
};

export default function TechStackPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full py-12 flex justify-center items-center text-muted-foreground font-mono text-xs">
          Loading tech stack...
        </div>
      }
    >
      <TechStackClient />
    </Suspense>
  );
}
