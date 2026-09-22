"use client";

import React, { useEffect, useState } from "react";

type LoadingView = "profile" | "work" | "projects" | "project" | "tech" | "certifications";

const titles: Record<LoadingView, string> = {
  profile: "Portfolio",
  work: "Work & Availability",
  projects: "Projects",
  project: "Project",
  tech: "Tech Stack",
  certifications: "Certifications",
};

function Lines() {
  return (
    <div className="space-y-3">
      <div className="h-2 w-2/3 bg-muted-subtle rounded-sm" />
      <div className="h-px w-full bg-border-hairline" />
      <div className="h-px w-5/6 bg-border-hairline" />
    </div>
  );
}

interface RouteLoadingProps {
  view?: LoadingView;
  delayMs?: number;
}

/**
 * RouteLoading
 *
 * Delayed route skeleton:
 * - Does not show the skeleton immediately on click to prevent unnecessary flashing on fast routes.
 * - If destination renders within ~350ms, the skeleton is never painted.
 * - If navigation is still pending after ~350ms, smoothly reveals the skeleton.
 * - Instantly unmounts when the destination is ready.
 */
export function RouteLoading({
  view = "profile",
  delayMs = 350,
}: RouteLoadingProps) {
  const [showSkeleton, setShowSkeleton] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowSkeleton(true);
    }, delayMs);

    return () => {
      window.clearTimeout(timer);
    };
  }, [delayMs]);

  const media = view === "projects" || view === "project" || view === "profile";

  return (
    <div
      className={`w-full min-h-[60vh] transition-opacity duration-200 ease-out ${
        showSkeleton ? "opacity-100" : "opacity-0 pointer-events-none select-none"
      }`}
      aria-busy="true"
    >
      <span role="status" className="sr-only">
        Loading {titles[view]}…
      </span>
      <div aria-hidden={!showSkeleton}>
        <div className="mb-10 space-y-3">
          <div className="font-mono text-[10px] tracking-wider text-muted-foreground">
            {"// LOADING"}
          </div>
          <h1 className="font-display text-2xl sm:text-3xl text-ink font-bold">
            {titles[view]}
          </h1>
          <div className="h-px w-2/3 max-w-sm bg-border-hairline" />
        </div>
        <div className="border-t border-border-hairline pt-8">
          {view === "tech" ? (
            <div className="space-y-10">
              {[0, 1, 2].map((row) => (
                <div key={row} className="space-y-4">
                  <div className="h-2 w-28 bg-muted-subtle" />
                  <div className="flex flex-wrap gap-2">
                    {[0, 1, 2, 3, 4, 5].map((tag) => (
                      <span
                        key={tag}
                        className="h-8 w-24 rounded border border-border-hairline"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className={
                view === "projects" || view === "certifications"
                  ? "grid grid-cols-1 sm:grid-cols-2 gap-6"
                  : "space-y-8"
              }
            >
              {Array.from(
                { length: view === "project" || view === "profile" ? 1 : 4 },
                (_, index) => (
                  <div
                    key={index}
                    className="border border-dashed border-border-hairline rounded p-3 space-y-5"
                  >
                    {media && (
                      <div className="aspect-video border border-border-hairline flex items-center justify-center text-muted-foreground/40 font-mono text-xs">
                        +
                      </div>
                    )}
                    <Lines />
                    <div className="flex gap-2">
                      <span className="h-5 w-16 border border-border-hairline rounded-sm" />
                      <span className="h-5 w-20 border border-border-hairline rounded-sm" />
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

