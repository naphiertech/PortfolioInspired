"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { usePresentationMode } from "../context/PresentationModeContext";
import { ArtisanPortfolioLayout } from "../modes/artisan/ArtisanPortfolioLayout";
import { TechIcon } from "@/components/TechIcon";
import { getProjectsUsingTech, techSections, techStackIntro } from "@/lib/data";

function ArtisanTechStackStandalone() {
  const totalTools = techSections.reduce((acc, section) => acc + section.items.length, 0);

  return (
    <div className="w-full max-w-3xl mx-auto pt-10 sm:pt-12 pb-6 px-5 sm:px-6 space-y-8">
      <div className="space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-sans text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          <span>Home</span>
        </Link>

        <div className="flex flex-wrap items-end justify-between gap-4 pb-5 border-b border-black/10 dark:border-white/10">
          <div className="space-y-1.5">
            <h1 className="font-mono text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
              Tech Stack
            </h1>
            <p className="font-sans text-xs sm:text-sm text-foreground/75 leading-relaxed max-w-xl">
              {techStackIntro.headline} {techStackIntro.footer}
            </p>
          </div>
          <span className="font-sans text-xs text-muted-foreground tabular-nums px-3 py-1 rounded-full border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03]">
            {totalTools} Tools
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {techSections.map((section) => {
          const linkedProjectsMap = new Map<string, string>();
          for (const tool of section.items) {
            for (const proj of getProjectsUsingTech(tool)) {
              if (!linkedProjectsMap.has(proj.slug)) {
                linkedProjectsMap.set(proj.slug, proj.title);
              }
            }
          }
          const linkedProjects = Array.from(linkedProjectsMap.entries());

          return (
            <section
              key={section.title}
              className="p-4 sm:p-5 rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] space-y-3.5"
            >
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-mono text-sm font-semibold tracking-wide text-foreground">
                  {section.title}
                </h2>
                <span className="font-sans text-[11px] text-muted-foreground tabular-nums">
                  {section.items.length} tools
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {section.items.map((tool) => (
                  <span
                    key={tool}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans border border-black/12 dark:border-white/10 bg-background/80 text-foreground/90"
                  >
                    <TechIcon name={tool} className="size-3.5 shrink-0" />
                    <span>{tool}</span>
                  </span>
                ))}
              </div>

              {linkedProjects.length > 0 && (
                <div className="pt-2.5 border-t border-black/10 dark:border-white/10 flex flex-wrap items-center gap-1.5 font-sans">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground mr-1">
                    Used in:
                  </span>
                  {linkedProjects.map(([slug, title]) => (
                    <Link
                      key={slug}
                      href={`/projects/${slug}`}
                      className="text-[11px] font-medium text-foreground/85 hover:text-foreground underline underline-offset-4 transition-colors"
                    >
                      {title}
                    </Link>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>

      <nav
        aria-label="Related portfolio pages"
        className="pt-5 border-t border-black/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-4 font-sans text-xs"
      >
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>See Projects Built With These Tools</span>
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
        <Link
          href="/certifications"
          className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>View Certifications</span>
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </nav>
    </div>
  );
}

export function TechStackPresentationRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  const { mode } = usePresentationMode();

  if (mode === "agent") {
    return (
      <ArtisanPortfolioLayout
        defaultTab="experience"
        initialSectionNode={<ArtisanTechStackStandalone />}
      />
    );
  }

  return <>{children}</>;
}

export default TechStackPresentationRoot;
