"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Bot,
  Code2,
  Cpu,
  Database,
  FileCode2,
  GitBranch,
  Globe,
  Layers,
  Search,
  ShieldCheck,
  Sparkles,
  Terminal,
  Wrench,
  X,
} from "lucide-react";
import {
  RESOURCE_CATEGORIES,
  ResourceItem,
  ResourceSubItem,
} from "@/features/resources-drawer";
import { useUISound } from "@/context/SoundContext";

interface ResourcesSectionProps {
  standalone?: boolean;
}

const ICON_MAP: Record<
  ResourceItem["iconType"],
  React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>
> = {
  agent: Bot,
  skill: Sparkles,
  rule: FileCode2,
  platform: Layers,
  terminal: Terminal,
  code: Code2,
  cpu: Cpu,
  shield: ShieldCheck,
  sparkles: Sparkles,
  git: GitBranch,
  database: Database,
  globe: Globe,
};

function getHostLabel(url?: string): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

function renderSubItemLabel(sub: string | ResourceSubItem): {
  name: string;
  detail?: string;
} {
  return typeof sub === "string" ? { name: sub } : sub;
}

export function ResourcesSection({
  standalone = false,
}: ResourcesSectionProps) {
  const { playClick, playHover } = useUISound();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [query, setQuery] = useState("");

  const totalResourceCount = useMemo(
    () =>
      RESOURCE_CATEGORIES.reduce(
        (sum, category) => sum + category.items.length,
        0
      ),
    []
  );

  const visibleCategories = useMemo(() => {
    const q = query.trim().toLowerCase();

    return RESOURCE_CATEGORIES.filter(
      (cat) => selectedCategoryId === "all" || cat.id === selectedCategoryId
    )
      .map((cat) => {
        if (!q) return cat;
        const filteredItems = cat.items.filter((item) => {
          const inCore =
            item.name.toLowerCase().includes(q) ||
            item.role.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q) ||
            (item.badge?.toLowerCase().includes(q) ?? false);
          if (inCore) return true;
          return (item.subItems ?? []).some((sub) => {
            const parsed = renderSubItemLabel(sub);
            return (
              parsed.name.toLowerCase().includes(q) ||
              (parsed.detail?.toLowerCase().includes(q) ?? false)
            );
          });
        });
        return { ...cat, items: filteredItems };
      })
      .filter((cat) => cat.items.length > 0);
  }, [query, selectedCategoryId]);

  return (
    <div className="w-full flex flex-col items-center pt-8 sm:pt-10 pb-4 px-4 sm:px-6">
      {standalone && (
        <div className="w-full max-w-2xl pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-sans text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            <span>Back to Portfolio</span>
          </Link>
        </div>
      )}

      {/* 1. Centered Editorial Header (Matches Selected Projects & Experience) */}
      <div className="space-y-3 text-center max-w-xl px-4 pb-6">
        <h1
          id="resources-page-heading"
          className="text-2xl sm:text-3xl font-mono font-semibold tracking-tight text-foreground"
        >
          Resources &amp; Toolbook
        </h1>
        <p className="font-sans font-medium text-sm md:text-base text-foreground/80 leading-relaxed">
          The coding agents, design skills, architectural workflows, and
          production tooling I rely on to ship full-stack software reliably.
        </p>
      </div>

      {/* 2. Search & Category Filter Bar */}
      <div className="w-full max-w-2xl px-2 space-y-3 pb-6">
        <div className="relative">
          <Search
            className="size-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search agents, workflows, infrastructure..."
            aria-label="Search engineering resources"
            className="w-full h-9 pl-10 pr-9 rounded-full border border-black/12 dark:border-white/10 bg-background font-sans text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-foreground/20"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search query"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              playClick();
              setSelectedCategoryId("all");
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-sans text-xs transition-colors cursor-pointer border ${
              selectedCategoryId === "all"
                ? "bg-foreground text-background border-foreground font-medium"
                : "bg-transparent text-foreground/80 border-black/12 dark:border-white/10 hover:text-foreground hover:border-black/20 dark:hover:border-white/20 hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
            }`}
          >
            <span>All</span>
            <span className="opacity-75 tabular-nums">{totalResourceCount}</span>
          </button>

          {RESOURCE_CATEGORIES.map((category) => {
            const isActive = selectedCategoryId === category.id;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => {
                  playClick();
                  setSelectedCategoryId(category.id);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-sans text-xs transition-colors cursor-pointer border ${
                  isActive
                    ? "bg-foreground text-background border-foreground font-medium"
                    : "bg-transparent text-foreground/80 border-black/12 dark:border-white/10 hover:text-foreground hover:border-black/20 dark:hover:border-white/20 hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
                }`}
              >
                <span className="capitalize">
                  {category.title.toLowerCase()}
                </span>
                <span className="opacity-70 tabular-nums">
                  {category.items.length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Stacked Categories Directory (Mirrors Experience Skills & Field Notes Rhythm) */}
      <div className="w-full max-w-2xl px-2 space-y-10">
        {visibleCategories.length === 0 ? (
          <div className="border-t border-b border-black/10 dark:border-white/10 px-4 py-10 text-center space-y-2.5">
            <p className="font-sans text-sm text-foreground/80">
              No resources match &ldquo;{query}&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSelectedCategoryId("all");
              }}
              className="px-3.5 py-1.5 rounded-full border border-black/12 dark:border-white/10 font-sans text-xs font-medium text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
            >
              Show all resources
            </button>
          </div>
        ) : (
          visibleCategories.map((category) => (
            <section
              key={category.id}
              aria-labelledby={`resource-cat-${category.id}`}
              className="space-y-4 pt-4 border-t border-black/10 dark:border-white/10"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-baseline gap-2.5">
                    <span className="font-mono text-base sm:text-lg text-foreground/40 tabular-nums">
                      {category.number}
                    </span>
                    <h2
                      id={`resource-cat-${category.id}`}
                      className="font-mono text-xl font-semibold tracking-wider text-foreground capitalize"
                    >
                      {category.title.toLowerCase()}
                    </h2>
                  </div>
                  <span className="font-sans text-xs text-muted-foreground tabular-nums">
                    {category.items.length}{" "}
                    {category.items.length === 1 ? "Item" : "Items"}
                  </span>
                </div>
                {category.subtitle && (
                  <p className="font-sans text-xs sm:text-sm text-foreground/75">
                    {category.subtitle}
                  </p>
                )}
              </div>

              <div className="divide-y divide-black/10 dark:divide-white/10 border-t border-b border-black/10 dark:border-white/10">
                {category.items.map((item) => {
                  const Icon = ICON_MAP[item.iconType] ?? Wrench;
                  const host = getHostLabel(item.url);

                  const rowContent = (
                    <div className="space-y-2.5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <span className="mt-0.5 size-8 rounded-full border border-black/12 dark:border-white/10 flex items-center justify-center shrink-0 text-foreground/80">
                            <Icon className="size-4" aria-hidden={true} />
                          </span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-mono text-lg sm:text-xl font-semibold tracking-tight text-foreground group-hover:underline">
                                {item.name}
                              </h3>
                              {item.badge && (
                                <span className="font-sans text-[10px] font-medium uppercase tracking-[0.14em] px-2 py-0.5 rounded-full border border-black/10 dark:border-white/10 text-muted-foreground">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="font-sans text-xs text-muted-foreground mt-0.5">
                              {item.role}
                            </p>
                          </div>
                        </div>

                        {item.url && (
                          <span className="inline-flex items-center gap-1 font-sans text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors shrink-0 pt-1">
                            <span>{item.linkLabel || host || "Open"}</span>
                            <ArrowUpRight
                              className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                              aria-hidden="true"
                            />
                          </span>
                        )}
                      </div>

                      <p className="pl-11 font-sans text-xs sm:text-sm leading-relaxed text-foreground/80">
                        {item.description}
                      </p>

                      {item.subItems && item.subItems.length > 0 && (
                        <div className="pl-11 pt-1 flex flex-wrap gap-1.5">
                          {item.subItems.map((sub, subIdx) => {
                            const parsed = renderSubItemLabel(sub);
                            return (
                              <span
                                key={`${item.id}-sub-${subIdx}`}
                                title={parsed.detail}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-black/12 dark:border-white/10 font-sans text-xs text-foreground/85"
                              >
                                <span>{parsed.name}</span>
                                {parsed.detail && (
                                  <span className="text-muted-foreground">
                                    · {parsed.detail}
                                  </span>
                                )}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );

                  if (item.url) {
                    return (
                      <a
                        key={item.id}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onMouseEnter={playHover}
                        className="group block py-4 px-2 sm:px-3 hover:bg-black/[0.02] dark:hover:bg-white/[0.025] transition-colors"
                      >
                        {rowContent}
                      </a>
                    );
                  }

                  return (
                    <div key={item.id} className="block py-4 px-2 sm:px-3">
                      {rowContent}
                    </div>
                  );
                })}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}

export default ResourcesSection;
