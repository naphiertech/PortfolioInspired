"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  COMPONENTS_CATALOG,
  type ComponentCategory,
} from "@/lib/componentsCatalog";
import { ComponentThumbnail } from "./ComponentThumbnail";
import { usePresentationMode } from "@/features/presentation-modes/context/PresentationModeContext";
import { FocusNavigation } from "@/features/presentation-modes/modes/focus/components/FocusNavigation";
import { MinimalHeader } from "@/features/presentation-modes/modes/minimal/components/MinimalHeader";
import { ebGaramond } from "@/features/presentation-modes/modes/minimal/fonts";
import { EditorialDivider } from "@/components/EditorialDivider";
import { useUISound } from "@/context/SoundContext";

type FilterValue = "all" | ComponentCategory;

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "interactive", label: "Interactive" },
  { value: "pixel-scenes", label: "Pixel Scenes" },
  { value: "widgets", label: "Widgets" },
];

export interface ComponentsCatalogViewProps {
  insideArtisanShell?: boolean;
}

function MarginHandNote({ visibilityClass }: { visibilityClass: string }) {
  return (
    <aside
      aria-hidden="true"
      className={`pointer-events-none select-none absolute top-4 left-[calc(100%+2rem)] w-36 text-muted-foreground ${visibilityClass}`}
    >
      <span className="block font-hand text-xl font-medium leading-[1.1] rotate-[3deg]">
        Copy, paste,{" "}
        <br />
        make it yours
      </span>
      <svg
        viewBox="0 0 72 52"
        fill="none"
        className="w-14 h-10 mt-1 ml-1 opacity-85"
        aria-hidden="true"
      >
        <path
          d="M58 5 C61 23 45 41 11 38 M20 30 C16 34 12 37 8 38 C12 40 16 43 20 47"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </aside>
  );
}

export function ComponentsCatalogView({
  insideArtisanShell = false,
}: ComponentsCatalogViewProps) {
  const { mode } = usePresentationMode();
  const { playHover, playClick } = useUISound();
  const [filter, setFilter] = useState<FilterValue>("all");

  const isFocus = mode === "focus";
  const isMinimal = mode === "minimal";
  const isArtisan = mode === "agent" || insideArtisanShell;

  const filteredItems = useMemo(() => {
    if (filter === "all") return COMPONENTS_CATALOG;
    return COMPONENTS_CATALOG.filter((item) => item.category === filter);
  }, [filter]);

  const countsByFilter = useMemo(() => {
    return {
      all: COMPONENTS_CATALOG.length,
      interactive: COMPONENTS_CATALOG.filter((i) => i.category === "interactive").length,
      "pixel-scenes": COMPONENTS_CATALOG.filter((i) => i.category === "pixel-scenes").length,
      widgets: COMPONENTS_CATALOG.filter((i) => i.category === "widgets").length,
    };
  }, []);

  const containerClass = isMinimal
    ? `${ebGaramond.variable} font-serif w-full max-w-[640px] mx-auto text-zinc-800 dark:text-[#beb9ad] selection:bg-[#343532] selection:text-[#eae6df] pb-16`
    : isArtisan
    ? "w-full max-w-3xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10 pb-12"
    : "w-full pb-8";

  const titleClass = isMinimal
    ? "font-serif italic text-2xl sm:text-3xl text-zinc-900 dark:text-[#eae6df] font-normal tracking-tight"
    : isArtisan
    ? "font-mono text-2xl sm:text-3xl font-semibold tracking-tight text-foreground"
    : isFocus
    ? "font-sans text-2xl sm:text-3xl font-bold text-ink tracking-tight"
    : "font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight";

  const subtitleClass = isMinimal
    ? "font-serif text-[15px] sm:text-base text-zinc-600 dark:text-[#9e998e] leading-relaxed max-w-xl"
    : isArtisan
    ? "font-sans font-normal text-sm md:text-[15px] text-foreground/80 leading-relaxed max-w-xl"
    : "font-sans text-sm text-muted-foreground leading-relaxed max-w-xl";

  const cardClass = isMinimal
    ? "group relative flex items-start gap-4 p-4 sm:p-5 rounded-xl border border-zinc-200/80 dark:border-white/[0.08] bg-zinc-50/60 dark:bg-white/[0.02] hover:border-zinc-400/70 dark:hover:border-white/25 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
    : isArtisan
    ? "group relative flex items-start gap-4 p-4 sm:p-5 rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.015] dark:bg-white/[0.02] hover:border-black/25 dark:hover:border-white/25 hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
    : "group relative flex items-start gap-4 p-4 sm:p-5 rounded-lg border border-border-hairline bg-surface/25 hover:bg-surface/55 hover:border-border-dashed transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink";

  const cardTitleClass = isMinimal
    ? "font-serif text-[17px] font-medium text-zinc-900 dark:text-[#eae6df] group-hover:underline underline-offset-4 leading-snug"
    : isArtisan
    ? "font-mono text-base sm:text-lg font-semibold text-foreground leading-snug group-hover:underline underline-offset-4"
    : "font-sans text-[15px] font-semibold text-ink leading-snug group-hover:text-brand transition-colors";

  const cardSummaryClass = isMinimal
    ? "font-serif text-sm text-zinc-600 dark:text-[#9e998e] leading-relaxed"
    : isArtisan
    ? "font-sans text-xs text-foreground/75 leading-relaxed"
    : "font-sans text-xs text-muted-foreground leading-relaxed";

  const thumbFrameClass = isMinimal
    ? "shrink-0 size-12 rounded-lg border border-zinc-200/90 dark:border-white/[0.1] bg-white dark:bg-zinc-900/70 flex items-center justify-center text-zinc-900 dark:text-[#eae6df]"
    : isArtisan
    ? "shrink-0 size-12 rounded-xl border border-black/10 dark:border-white/10 bg-background flex items-center justify-center text-foreground"
    : "shrink-0 size-12 rounded-md border border-border-hairline bg-page/80 flex items-center justify-center text-ink";

  const marginVisibility = isFocus
    ? "hidden 2xl:block"
    : isArtisan
    ? "hidden min-[1360px]:block"
    : "hidden xl:block";

  return (
    <div className={containerClass}>
      {isFocus && <FocusNavigation />}
      {isMinimal && <MinimalHeader />}

      <div
        className={
          isMinimal
            ? "pt-8 sm:pt-10 space-y-6"
            : isFocus || isArtisan
            ? "space-y-5"
            : "pt-4 sm:pt-5 space-y-5"
        }
      >
        {/* Breadcrumb */}
        {!insideArtisanShell && (
          <div>
            <Link
              href="/"
              onMouseEnter={playHover}
              onClick={playClick}
              className={
                isMinimal
                  ? "inline-flex items-center gap-1.5 text-xs font-code text-zinc-500 dark:text-[#827d73] hover:text-zinc-900 hover:dark:text-[#eae6df] transition-colors group"
                  : isArtisan
                  ? "inline-flex items-center gap-1.5 font-sans text-xs font-medium text-muted-foreground hover:text-foreground transition-colors group"
                  : "inline-flex items-center gap-1.5 font-code text-xs text-muted-foreground hover:text-ink transition-colors mb-1 group"
              }
            >
              <ArrowLeft
                className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1"
                aria-hidden="true"
              />
              <span>{isMinimal || isArtisan ? "Home" : "cd .. / home"}</span>
            </Link>
          </div>
        )}

        {/* Mode-Native Hero */}
        <header className="space-y-3">
          <div className={isArtisan ? "text-center space-y-2 pb-1" : "space-y-2"}>
            <h1 className={titleClass}>Drop in. Customize. Ship.</h1>
            <p className={`${subtitleClass} ${isArtisan ? "mx-auto" : ""}`}>
              Interactive UI primitives and pixel-art scenes extracted from this portfolio — inspect props live and copy the code directly.
            </p>
          </div>

          {/* Category Filter Chips */}
          <div
            role="group"
            aria-label="Filter components by category"
            className={`flex flex-wrap items-center gap-2 pt-1 ${
              isArtisan ? "justify-center" : ""
            }`}
          >
            {FILTERS.map((chip) => {
              const active = filter === chip.value;
              const count = countsByFilter[chip.value];
              return (
                <button
                  key={chip.value}
                  type="button"
                  aria-pressed={active}
                  onMouseEnter={playHover}
                  onClick={() => {
                    playClick();
                    setFilter(chip.value);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 ${
                    isMinimal
                      ? active
                        ? "bg-zinc-900 text-white dark:bg-[#eae6df] dark:text-[#181816] font-sans font-medium"
                        : "border border-zinc-300/80 dark:border-white/[0.1] text-zinc-600 dark:text-[#9e998e] hover:text-zinc-900 dark:hover:text-[#eae6df] font-sans"
                      : isArtisan
                      ? active
                        ? "bg-foreground text-background font-sans font-medium"
                        : "border border-black/12 dark:border-white/12 text-muted-foreground hover:text-foreground font-sans"
                      : active
                      ? "bg-ink text-page font-code font-medium"
                      : "border border-border-hairline bg-surface/40 text-muted-foreground hover:text-ink font-code"
                  }`}
                >
                  <span>{chip.label}</span>
                  <span className="opacity-70 tabular-nums text-[11px]">{count}</span>
                </button>
              );
            })}
          </div>
        </header>

        {!isMinimal && !isArtisan && <EditorialDivider className="my-4 sm:my-5" />}
        {(isMinimal || isArtisan) && (
          <div
            className={
              isMinimal
                ? "border-b border-zinc-200/80 dark:border-white/[0.08]"
                : "border-b border-black/10 dark:border-white/10"
            }
          />
        )}

        {/* 2-Column Catalog Grid + Handwritten Gutter Note */}
        <section aria-label="Components catalog" className="relative pt-1">
          <MarginHandNote visibilityClass={marginVisibility} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            {filteredItems.map((item) => (
              <Link
                key={item.slug}
                href={`/components/${item.slug}`}
                onMouseEnter={playHover}
                onClick={playClick}
                className={cardClass}
              >
                <div className={thumbFrameClass}>
                  <ComponentThumbnail slug={item.slug} className="size-10" />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <h2 className={cardTitleClass}>{item.title}</h2>
                      {item.isNew && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-code font-medium bg-muted-subtle text-ink border border-border-hairline shrink-0">
                          New
                        </span>
                      )}
                    </div>
                    <ArrowRight
                      className="w-3.5 h-3.5 shrink-0 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5 group-hover:text-ink"
                      aria-hidden="true"
                    />
                  </div>
                  <p className={cardSummaryClass}>{item.summary}</p>
                  <div className="pt-1 flex items-center gap-2 font-code text-[10px] text-muted-foreground/75">
                    <span>{item.categoryLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {item.sourceFiles.length}{" "}
                      {item.sourceFiles.length === 1 ? "file" : "files"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default ComponentsCatalogView;
