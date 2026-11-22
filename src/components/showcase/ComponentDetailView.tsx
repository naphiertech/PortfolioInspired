"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Copy,
  RotateCcw,
} from "lucide-react";
import type {
  ComponentCatalogItem,
  LoadedComponentSourceFile,
} from "@/lib/componentsCatalog";
import { ReadingShelf } from "@/components/ReadingShelf";
import { FloatingTerrain } from "@/components/FloatingTerrain";
import { RocketMountain } from "@/components/RocketMountain";
import { ContributionTruckPreview } from "./ContributionTruckPreview";
import { ThanosGauntletSandbox } from "./ThanosGauntletSandbox";
import { AICompanionWidget } from "./AICompanionWidget";
import { usePresentationMode } from "@/features/presentation-modes/context/PresentationModeContext";
import { FocusNavigation } from "@/features/presentation-modes/modes/focus/components/FocusNavigation";
import { MinimalHeader } from "@/features/presentation-modes/modes/minimal/components/MinimalHeader";
import { ebGaramond } from "@/features/presentation-modes/modes/minimal/fonts";
import { EditorialDivider } from "@/components/EditorialDivider";
import { useUISound } from "@/context/SoundContext";

type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

const PACKAGE_MANAGERS: PackageManager[] = ["npm", "pnpm", "yarn", "bun"];

function formatInstallCommand(pm: PackageManager, deps: string[]): string {
  if (deps.length === 0) return "";
  const joined = deps.join(" ");
  switch (pm) {
    case "npm":
      return `npm install ${joined}`;
    case "pnpm":
      return `pnpm add ${joined}`;
    case "yarn":
      return `yarn add ${joined}`;
    case "bun":
      return `bun add ${joined}`;
  }
}

export interface ComponentDetailViewProps {
  item: ComponentCatalogItem;
  sourceFiles: LoadedComponentSourceFile[];
  prevItem: ComponentCatalogItem | null;
  nextItem: ComponentCatalogItem | null;
}

export function ComponentDetailView({
  item,
  sourceFiles,
  prevItem,
  nextItem,
}: ComponentDetailViewProps) {
  const { mode } = usePresentationMode();
  const { playHover, playClick } = useUISound();

  const isFocus = mode === "focus";
  const isMinimal = mode === "minimal";
  const isArtisan = mode === "agent";

  // Top Stage Tabs
  const [stageTab, setStageTab] = useState<"preview" | "code">("preview");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Install & Source File Tabs
  const [pkgManager, setPkgManager] = useState<PackageManager>("npm");
  const [activeFileIdx, setActiveFileIdx] = useState(0);
  const [showAllSource, setShowAllSource] = useState(false);

  // Interactive Component Sandbox States
  const [shelfHoverLift, setShelfHoverLift] = useState(10);
  const [shelfScale, setShelfScale] = useState(1);
  const [truckWeeks, setTruckWeeks] = useState(36);
  const [truckMonths, setTruckMonths] = useState(true);
  const [terrainVariant, setTerrainVariant] = useState<"now" | "projects">("now");
  const [gauntletSound, setGauntletSound] = useState(true);
  const [aiVariant, setAiVariant] = useState<"artisan" | "standard">("artisan");
  const [aiDefaultOpen, setAiDefaultOpen] = useState(false);
  const [mountainPaused, setMountainPaused] = useState(false);

  const handleCopy = (id: string, text: string) => {
    playClick();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId((current) => (current === id ? null : current));
    }, 1800);
  };

  const resetProps = () => {
    playClick();
    setShelfHoverLift(10);
    setShelfScale(1);
    setTruckWeeks(36);
    setTruckMonths(true);
    setTerrainVariant("now");
    setGauntletSound(true);
    setAiVariant("artisan");
    setAiDefaultOpen(false);
    setMountainPaused(false);
  };

  const activeSourceFile = sourceFiles[activeFileIdx] ?? sourceFiles[0];
  const collapsedPreviewCode = useMemo(() => {
    if (!activeSourceFile) return "";
    if (showAllSource || activeSourceFile.lineCount <= 26) {
      return activeSourceFile.code;
    }
    return activeSourceFile.code.split("\n").slice(0, 24).join("\n");
  }, [activeSourceFile, showAllSource]);

  const installCommand = formatInstallCommand(pkgManager, item.dependencies);

  const containerClass = isMinimal
    ? `${ebGaramond.variable} font-serif w-full max-w-[640px] mx-auto text-zinc-800 dark:text-[#beb9ad] selection:bg-[#343532] selection:text-[#eae6df] pb-16`
    : isArtisan
    ? "w-full max-w-3xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10 pb-14"
    : "w-full pb-12";

  const surfaceBoxClass = isMinimal
    ? "rounded-xl border border-zinc-200/80 dark:border-white/[0.08] bg-zinc-50/60 dark:bg-white/[0.02]"
    : isArtisan
    ? "rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.015] dark:bg-white/[0.02]"
    : "rounded-xl border border-border-hairline bg-surface/35";

  const sectionTitleClass = isMinimal
    ? "font-serif italic text-lg text-zinc-900 dark:text-[#eae6df]"
    : isArtisan
    ? "font-mono text-lg font-semibold text-foreground"
    : "font-code text-xs uppercase tracking-wider text-muted-foreground font-semibold";

  const h1Class = isMinimal
    ? "font-serif italic text-2xl sm:text-3xl text-zinc-900 dark:text-[#eae6df] font-normal tracking-tight"
    : isArtisan
    ? "font-mono text-2xl sm:text-3xl font-semibold tracking-tight text-foreground"
    : isFocus
    ? "font-sans text-2xl sm:text-3xl font-bold text-ink tracking-tight"
    : "font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight";

  const renderLivePreview = () => {
    switch (item.slug) {
      case "reading-shelf":
        return (
          <div className="w-full py-6 px-2 sm:px-4">
            <ReadingShelf
              embedded
              hoverLift={shelfHoverLift}
              scale={shelfScale}
            />
          </div>
        );

      case "contribution-truck":
        return (
          <div className="w-full py-6 px-2 sm:px-4">
            <ContributionTruckPreview weeks={truckWeeks} showMonths={truckMonths} />
          </div>
        );

      case "floating-islands":
        return (
          <section
            aria-label="Floating islands interactive parallax stage"
            className="w-full py-4 px-3 sm:px-6 flex flex-col items-center justify-center min-h-[260px]"
          >
            <div className="w-full max-w-[660px]">
              <FloatingTerrain variant={terrainVariant} />
            </div>
            <p className="font-code text-[10px] uppercase tracking-widest text-muted-foreground mt-2">
              Move cursor across preview to drive parallax depth
            </p>
          </section>
        );

      case "thanos-gauntlet":
        return (
          <ThanosGauntletSandbox
            soundEnabled={gauntletSound}
            label="Target Module"
          />
        );

      case "ai-companion-toggle":
        return (
          <div className="relative w-full h-[260px] flex flex-col justify-between p-4 sm:p-5 overflow-hidden">
            <div className="flex items-center justify-between font-code text-[10px] uppercase tracking-widest text-muted-foreground">
              <span>Corner Stage ({aiVariant})</span>
              <span>Click companion below right</span>
            </div>
            <div className="self-end">
              <AICompanionWidget
                contained
                variant={aiVariant}
                defaultOpen={aiDefaultOpen}
              />
            </div>
          </div>
        );

      case "rocket-mountain":
        return (
          <div className="w-full py-6 px-3 sm:px-6 flex items-center justify-center min-h-[240px]">
            <div className="w-full max-w-[560px]">
              <RocketMountain paused={mountainPaused} />
            </div>
          </div>
        );
    }
  };

  const renderPropsControls = () => {
    switch (item.slug) {
      case "reading-shelf":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor="prop-hover-lift" className="font-code text-muted-foreground">
                  hoverLift
                </label>
                <span className="font-code tabular-nums text-ink">{shelfHoverLift}px</span>
              </div>
              <input
                id="prop-hover-lift"
                type="range"
                min={0}
                max={20}
                step={1}
                value={shelfHoverLift}
                onChange={(e) => setShelfHoverLift(Number(e.target.value))}
                className="w-full accent-zinc-900 dark:accent-zinc-100 cursor-pointer"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor="prop-shelf-scale" className="font-code text-muted-foreground">
                  scale
                </label>
                <span className="font-code tabular-nums text-ink">{shelfScale.toFixed(2)}x</span>
              </div>
              <input
                id="prop-shelf-scale"
                type="range"
                min={0.7}
                max={1.1}
                step={0.05}
                value={shelfScale}
                onChange={(e) => setShelfScale(Number(e.target.value))}
                className="w-full accent-zinc-900 dark:accent-zinc-100 cursor-pointer"
              />
            </div>
          </div>
        );

      case "contribution-truck":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor="prop-truck-weeks" className="font-code text-muted-foreground">
                  weeks
                </label>
                <span className="font-code tabular-nums text-ink">{truckWeeks}</span>
              </div>
              <input
                id="prop-truck-weeks"
                type="range"
                min={20}
                max={52}
                step={2}
                value={truckWeeks}
                onChange={(e) => setTruckWeeks(Number(e.target.value))}
                className="w-full accent-zinc-900 dark:accent-zinc-100 cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="font-code text-xs text-muted-foreground">showMonths</span>
              <button
                type="button"
                aria-pressed={truckMonths}
                onClick={() => {
                  playClick();
                  setTruckMonths((v) => !v);
                }}
                className="px-3 py-1.5 rounded-md border border-border-hairline font-code text-xs cursor-pointer hover:bg-surface/60"
              >
                {truckMonths ? "true" : "false"}
              </button>
            </div>
          </div>
        );

      case "floating-islands":
        return (
          <div className="flex items-center justify-between gap-4">
            <span className="font-code text-xs text-muted-foreground">variant</span>
            <div className="inline-flex rounded-lg border border-border-hairline p-0.5 gap-1">
              {(["now", "projects"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={terrainVariant === v}
                  onClick={() => {
                    playClick();
                    setTerrainVariant(v);
                  }}
                  className={`px-3 py-1 rounded-md font-code text-xs cursor-pointer transition-colors ${
                    terrainVariant === v
                      ? "bg-ink text-page"
                      : "text-muted-foreground hover:text-ink"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        );

      case "thanos-gauntlet":
        return (
          <div className="flex items-center justify-between gap-4">
            <span className="font-code text-xs text-muted-foreground">soundEnabled</span>
            <button
              type="button"
              aria-pressed={gauntletSound}
              onClick={() => {
                playClick();
                setGauntletSound((v) => !v);
              }}
              className="px-3 py-1.5 rounded-md border border-border-hairline font-code text-xs cursor-pointer hover:bg-surface/60"
            >
              {gauntletSound ? "true" : "false"}
            </button>
          </div>
        );

      case "ai-companion-toggle":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="flex items-center justify-between gap-3">
              <span className="font-code text-xs text-muted-foreground">variant</span>
              <div className="inline-flex rounded-lg border border-border-hairline p-0.5 gap-1">
                {(["artisan", "standard"] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    aria-pressed={aiVariant === v}
                    onClick={() => {
                      playClick();
                      setAiVariant(v);
                    }}
                    className={`px-2.5 py-1 rounded-md font-code text-xs cursor-pointer transition-colors ${
                      aiVariant === v
                        ? "bg-ink text-page"
                        : "text-muted-foreground hover:text-ink"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="font-code text-xs text-muted-foreground">defaultOpen</span>
              <button
                type="button"
                aria-pressed={aiDefaultOpen}
                onClick={() => {
                  playClick();
                  setAiDefaultOpen((v) => !v);
                }}
                className="px-3 py-1.5 rounded-md border border-border-hairline font-code text-xs cursor-pointer hover:bg-surface/60"
              >
                {aiDefaultOpen ? "true" : "false"}
              </button>
            </div>
          </div>
        );

      case "rocket-mountain":
        return (
          <div className="flex items-center justify-between gap-4">
            <span className="font-code text-xs text-muted-foreground">paused</span>
            <button
              type="button"
              aria-pressed={mountainPaused}
              onClick={() => {
                playClick();
                setMountainPaused((v) => !v);
              }}
              className="px-3 py-1.5 rounded-md border border-border-hairline font-code text-xs cursor-pointer hover:bg-surface/60"
            >
              {mountainPaused ? "true (paused)" : "false (active)"}
            </button>
          </div>
        );
    }
  };

  return (
    <div className={containerClass}>
      {isFocus && <FocusNavigation />}
      {isMinimal && <MinimalHeader />}

      <div
        className={
          isMinimal
            ? "pt-8 sm:pt-10 space-y-7"
            : isFocus || isArtisan
            ? "space-y-6"
            : "pt-4 sm:pt-5 space-y-5"
        }
      >
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-code text-xs text-muted-foreground">
          <Link
            href="/components"
            onMouseEnter={playHover}
            onClick={playClick}
            className="inline-flex items-center gap-1.5 hover:text-ink transition-colors group mb-1"
          >
            <ArrowLeft
              className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1"
              aria-hidden="true"
            />
            <span>{isMinimal || isArtisan ? "Components" : "cd .. / components"}</span>
          </Link>
          {(isMinimal || isArtisan) && (
            <>
              <span aria-hidden="true">/</span>
              <span className="text-ink/85 truncate">{item.title}</span>
            </>
          )}
        </nav>

        {/* Title & Copy Usage Header */}
        <header className="space-y-2.5">
          {!isMinimal && !isArtisan && !isFocus && (
            <span className="font-caps text-xs text-muted-foreground uppercase tracking-wider font-code font-semibold block">
              &lt;{item.slug}/&gt;
            </span>
          )}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h1 className={h1Class}>{item.title}</h1>
                {item.isNew && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-code font-medium bg-muted-subtle text-ink border border-border-hairline">
                    New
                  </span>
                )}
              </div>
              <p
                className={
                  isMinimal
                    ? "font-serif text-[15px] sm:text-base text-zinc-600 dark:text-[#9e998e] leading-relaxed"
                    : "font-sans text-sm text-muted-foreground leading-relaxed max-w-2xl"
                }
              >
                {item.description}
              </p>
            </div>

            <button
              type="button"
              onMouseEnter={playHover}
              onClick={() => handleCopy("usage-top", item.usageCode)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-hairline bg-surface/50 hover:bg-surface text-xs font-code text-ink transition-colors cursor-pointer shrink-0 self-start"
            >
              {copiedId === "usage-top" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-ink" aria-hidden="true" />
                  <span>Copied usage</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Copy usage</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* 1. Interactive Preview / Code Stage */}
        <section aria-label="Component preview and example code" className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div
              role="tablist"
              aria-label="Stage view"
              className="inline-flex rounded-lg border border-border-hairline p-0.5 bg-surface/30"
            >
              {(["preview", "code"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={stageTab === tab}
                  onClick={() => {
                    playClick();
                    setStageTab(tab);
                  }}
                  className={`px-3 py-1 rounded-md font-code text-xs capitalize transition-colors cursor-pointer ${
                    stageTab === tab
                      ? "bg-ink text-page font-medium"
                      : "text-muted-foreground hover:text-ink"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() =>
                handleCopy(
                  "stage-copy",
                  stageTab === "code" ? item.usageCode : activeSourceFile?.code || item.usageCode
                )
              }
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border-hairline font-code text-xs text-muted-foreground hover:text-ink transition-colors cursor-pointer"
            >
              {copiedId === "stage-copy" ? (
                <>
                  <Check className="w-3 h-3 text-ink" aria-hidden="true" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" aria-hidden="true" />
                  <span>{stageTab === "code" ? "Copy example" : "Copy source"}</span>
                </>
              )}
            </button>
          </div>

          <div className={`${surfaceBoxClass} overflow-hidden`}>
            {stageTab === "preview" ? (
              renderLivePreview()
            ) : (
              <pre className="p-4 sm:p-5 overflow-x-auto font-code text-xs leading-relaxed text-ink">
                <code>{item.usageCode}</code>
              </pre>
            )}
          </div>
        </section>

        {/* 2. Interactive Controls */}
        <section aria-label="Interactive controls" className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className={sectionTitleClass}>Interactive Controls</h2>
            <button
              type="button"
              onClick={resetProps}
              className="inline-flex items-center gap-1.5 font-code text-xs text-muted-foreground hover:text-ink transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" aria-hidden="true" />
              <span>Reset</span>
            </button>
          </div>
          <div className={`${surfaceBoxClass} p-4 sm:p-5`}>{renderPropsControls()}</div>
        </section>

        {/* 3. Dependencies & Static Assets */}
        <section aria-label="Installation" className="space-y-3">
          <h2 className={sectionTitleClass}>Installation</h2>

          {item.dependencies.length > 0 ? (
            <div className={`${surfaceBoxClass} overflow-hidden`}>
              <div className="flex items-center justify-between px-3 py-2 border-b border-border-hairline/70">
                <div className="flex items-center gap-1">
                  {PACKAGE_MANAGERS.map((pm) => (
                    <button
                      key={pm}
                      type="button"
                      aria-pressed={pkgManager === pm}
                      onClick={() => {
                        playClick();
                        setPkgManager(pm);
                      }}
                      className={`px-2 py-0.5 rounded font-code text-[11px] cursor-pointer transition-colors ${
                        pkgManager === pm
                          ? "bg-ink text-page font-medium"
                          : "text-muted-foreground hover:text-ink"
                      }`}
                    >
                      {pm}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy("deps-cli", installCommand)}
                  className="inline-flex items-center gap-1 font-code text-[11px] text-muted-foreground hover:text-ink cursor-pointer"
                >
                  {copiedId === "deps-cli" ? (
                    <>
                      <Check className="w-3 h-3 text-ink" aria-hidden="true" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" aria-hidden="true" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3.5 overflow-x-auto font-code text-xs text-ink">
                <code>{installCommand}</code>
              </pre>
            </div>
          ) : (
            <div className={`${surfaceBoxClass} p-3.5 font-code text-xs text-muted-foreground`}>
              Zero external dependencies — drop the source files directly into your project.
            </div>
          )}

          {item.assets && item.assets.length > 0 && (
            <div className={`${surfaceBoxClass} p-4 space-y-2`}>
              <div className="font-code text-[11px] uppercase tracking-wider text-muted-foreground">
                Required Public Assets
              </div>
              <p className="font-sans text-xs text-muted-foreground">
                Place these sprite sheets and optional audio cues under <code className="font-code">public/</code>:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 font-code text-[11px] text-ink/85">
                {item.assets.map((asset) => (
                  <li key={asset} className="truncate">
                    {asset}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* 4. Props API & Behavior Notes */}
        <section aria-label="Props and behavior" className="space-y-3">
          <h2 className={sectionTitleClass}>Props API</h2>
          <div className={`${surfaceBoxClass} overflow-x-auto`}>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-hairline/70 font-code text-[11px] text-muted-foreground">
                  <th className="py-2.5 px-3.5 font-medium">Prop</th>
                  <th className="py-2.5 px-3.5 font-medium">Type</th>
                  <th className="py-2.5 px-3.5 font-medium">Default</th>
                  <th className="py-2.5 px-3.5 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-hairline/50 text-xs">
                {item.props.map((prop) => (
                  <tr key={prop.name}>
                    <td className="py-2.5 px-3.5 font-code font-semibold text-ink whitespace-nowrap">
                      {prop.name}
                    </td>
                    <td className="py-2.5 px-3.5 font-code text-ink/80 whitespace-nowrap">
                      {prop.type}
                    </td>
                    <td className="py-2.5 px-3.5 font-code text-muted-foreground whitespace-nowrap">
                      {prop.defaultValue}
                    </td>
                    <td className="py-2.5 px-3.5 font-sans text-muted-foreground leading-relaxed min-w-[200px]">
                      {prop.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="space-y-1.5 pl-4 list-disc font-sans text-xs text-muted-foreground leading-relaxed">
            {item.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </section>

        {/* 5. Source Files Viewer */}
        <section aria-label="Source files" className="space-y-3">
          <h2 className={sectionTitleClass}>Source Files</h2>
          <div className={`${surfaceBoxClass} overflow-hidden`}>
            <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 border-b border-border-hairline/70">
              <div className="flex flex-wrap items-center gap-1" role="tablist" aria-label="Source files">
                {sourceFiles.map((file, idx) => (
                  <button
                    key={file.label}
                    type="button"
                    role="tab"
                    aria-selected={activeFileIdx === idx}
                    onClick={() => {
                      playClick();
                      setActiveFileIdx(idx);
                      setShowAllSource(false);
                    }}
                    className={`px-2.5 py-1 rounded font-code text-[11px] transition-colors cursor-pointer ${
                      activeFileIdx === idx
                        ? "bg-ink text-page font-medium"
                        : "text-muted-foreground hover:text-ink"
                    }`}
                  >
                    {file.label}
                  </button>
                ))}
              </div>

              {activeSourceFile && (
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(`file-${activeSourceFile.label}`, activeSourceFile.code)
                  }
                  className="inline-flex items-center gap-1.5 font-code text-[11px] text-muted-foreground hover:text-ink cursor-pointer"
                >
                  {copiedId === `file-${activeSourceFile.label}` ? (
                    <>
                      <Check className="w-3 h-3 text-ink" aria-hidden="true" />
                      <span>Copied file</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" aria-hidden="true" />
                      <span>Copy file ({activeSourceFile.lineCount} lines)</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {activeSourceFile && (
              <div className="relative">
                <pre className="p-4 overflow-x-auto font-code text-[11.5px] leading-relaxed text-ink/90">
                  <code>{collapsedPreviewCode}</code>
                </pre>
                {activeSourceFile.lineCount > 26 && (
                  <div className="px-4 py-2.5 border-t border-border-hairline/70 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        playClick();
                        setShowAllSource((v) => !v);
                      }}
                      className="inline-flex items-center gap-1.5 font-code text-xs text-muted-foreground hover:text-ink cursor-pointer"
                    >
                      <span>
                        {showAllSource
                          ? "Collapse source"
                          : `Show all (${activeSourceFile.lineCount} lines)`}
                      </span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform ${
                          showAllSource ? "rotate-180" : ""
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {!isMinimal && !isArtisan && <EditorialDivider className="my-2" />}

        {/* Prev / Next Footer Navigation */}
        <nav
          aria-label="Component pagination"
          className="flex items-center justify-between gap-4 pt-2 font-code text-xs"
        >
          {prevItem ? (
            <Link
              href={`/components/${prevItem.slug}`}
              onMouseEnter={playHover}
              onClick={playClick}
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-ink transition-colors group"
            >
              <ArrowLeft
                className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1"
                aria-hidden="true"
              />
              <span>{prevItem.title}</span>
            </Link>
          ) : (
            <span />
          )}

          {nextItem ? (
            <Link
              href={`/components/${nextItem.slug}`}
              onMouseEnter={playHover}
              onClick={playClick}
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-ink transition-colors group"
            >
              <span>{nextItem.title}</span>
              <ArrowRight
                className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </div>
    </div>
  );
}

export default ComponentDetailView;
