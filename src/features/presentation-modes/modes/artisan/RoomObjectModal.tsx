"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LuX,
  LuTerminal,
  LuGamepad2,
  LuLamp,
  LuBookOpen,
  LuArrowUpRight,
  LuSparkles,
  LuZap,
  LuCheck,
  LuCode,
} from "react-icons/lu";
import { HotspotId, HOTSPOTS } from "./RoomHotspots";
import { HERO_DATA } from "./data";
import { techSections, fullProjects } from "@/lib/data";
import {
  MusicFeaturedSong,
  MusicPlaylist,
  FAVORITE_TRACKS,
  DEFAULT_TRACK,
  type MusicTrack,
} from "@/features/music-drawer";

interface RoomObjectModalProps {
  hotspotId: HotspotId | null;
  isDark: boolean;
  onClose: () => void;
  onSelectHotspot?: (id: HotspotId) => void;
  customLightColor: string;
  onUpdateLightColor: (color: string) => void;
}

export function RoomObjectModal({
  hotspotId,
  isDark,
  onClose,
  onSelectHotspot,
  customLightColor,
  onUpdateLightColor,
}: RoomObjectModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!hotspotId) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hotspotId, onClose]);

  if (!mounted) return null;

  const currentHotspot = hotspotId
    ? HOTSPOTS.find((h) => h.id === hotspotId) ?? null
    : null;

  const drawerContent = (
    <div className={`artisan-mode font-sans ${isDark ? "dark" : ""}`}>
      <AnimatePresence>
        {currentHotspot && hotspotId && (
          <div className="fixed inset-0 z-[80] flex justify-end select-none">
            {/* Backdrop */}
            <motion.div
              key="drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onClick={onClose}
              className="fixed inset-0 bg-black/40 dark:bg-black/65 backdrop-blur-[2px] cursor-pointer"
            />

            {/* Right-Side Slide Drawer */}
            <motion.aside
              key="drawer-panel"
              role="dialog"
              aria-modal="true"
              aria-label={currentHotspot.title}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
              className="relative z-10 w-full max-w-lg sm:max-w-[540px] h-dvh bg-background text-foreground border-l border-black/10 dark:border-white/10 shadow-2xl flex flex-col overflow-hidden"
            >
              {/* 1. Drawer Header */}
              <div className="px-6 pt-6 pb-4 border-b border-black/10 dark:border-white/10 flex items-start justify-between gap-4 shrink-0">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      {currentHotspot.category} • {currentHotspot.id.replace("_", " ")}
                    </span>
                  </div>
                  <h2 className="font-mono text-2xl sm:text-3xl font-semibold tracking-tight text-foreground leading-tight">
                    {currentHotspot.title}
                  </h2>
                  <p className="font-sans text-xs text-muted-foreground">
                    {currentHotspot.hint}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-sans font-medium border border-black/12 dark:border-white/10 text-muted-foreground hover:text-foreground hover:border-black/20 dark:hover:border-white/20 hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors cursor-pointer shrink-0"
                  aria-label="Close drawer"
                >
                  <span className="text-[11px]">Esc</span>
                  <LuX className="size-3.5" />
                </button>
              </div>

              {/* 2. Desk Object Switcher Grid (All 6 Visible) */}
              {onSelectHotspot && (
                <div className="px-6 py-3.5 border-b border-black/10 dark:border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-2 shrink-0">
                  {HOTSPOTS.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.id === hotspotId;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => onSelectHotspot(item.id)}
                        className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-sans font-medium whitespace-nowrap transition-colors cursor-pointer ${
                          isActive
                            ? "bg-foreground text-background"
                            : "border border-black/12 dark:border-white/10 text-muted-foreground hover:text-foreground hover:border-black/20 dark:hover:border-white/20 hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
                        }`}
                      >
                        <Icon className="size-3.5 shrink-0" />
                        <span className="truncate">{item.title}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 3. Scrollable Drawer Body */}
              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                {hotspotId === "monitors" && <MonitorsContent />}
                {hotspotId === "pc_rig" && <PCRigContent />}
                {hotspotId === "headphones" && <HeadphonesContent />}
                {hotspotId === "gamepad" && <GamepadContent />}
                {hotspotId === "smart_lamp" && (
                  <SmartLampContent
                    currentColor={customLightColor}
                    onSelectColor={onUpdateLightColor}
                  />
                )}
                {hotspotId === "bookshelf" && <BookshelfContent />}
              </div>

              {/* 4. Subtle Artisan Footer */}
              <div className="px-6 py-3.5 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[11px] font-sans text-muted-foreground shrink-0">
                <span>Interactive Workspace</span>
                <button
                  type="button"
                  onClick={onClose}
                  className="font-medium text-foreground/80 hover:text-foreground hover:underline cursor-pointer"
                >
                  Close drawer
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </div>
  );

  return createPortal(drawerContent, document.body);
}

/* =========================================================================
   1. MONITORS: Dev Workstation & Terminal
   ========================================================================= */
function MonitorsContent() {
  const [activeTab, setActiveTab] = useState<"terminal" | "stack" | "projects">(
    "terminal"
  );
  const [commandHistory, setCommandHistory] = useState<
    Array<{ cmd: string; output: string }>
  >([
    {
      cmd: "whoami",
      output:
        "Naphier — Full-Stack & UI/UX Developer, IT Student at ZPPSU. Turning ideas into practical web applications with clean interfaces.",
    },
    {
      cmd: "neofetch",
      output: `OS: Developer Workspace
Host: ZPPSU / CICS Dev Core
Editor: VS Code & Cursor
Shell: zsh 5.9
Stack: Next.js, React, TypeScript, Supabase, Tailwind CSS, Python`,
    },
  ]);
  const [inputVal, setInputVal] = useState("");

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    let output = "";
    if (trimmed === "help") {
      output = "Available commands: whoami, neofetch, stack, projects, status, clear";
    } else if (trimmed === "whoami") {
      output =
        "Naphier — Full-stack developer passionate about practical web applications, clean UI/UX, and reliable relational data architectures.";
    } else if (trimmed === "neofetch") {
      output = `OS: Developer Workspace\nFrameworks: Next.js, React, Flutter\nBackends: Supabase, Node.js, PHP/Laravel, Python\nStyling: Tailwind CSS, Framer Motion, GSAP`;
    } else if (trimmed === "stack") {
      output = techSections
        .map((s) => `${s.title}: ${s.items.join(", ")}`)
        .join("\n");
    } else if (trimmed === "projects") {
      output = fullProjects
        .map((p, i) => `0${i + 1}. ${p.title} (${p.category} • ${p.year})`)
        .join("\n");
    } else if (trimmed === "status") {
      output = `Status: ${HERO_DATA.status} — Open for select freelance projects & software engineering roles.`;
    } else if (trimmed === "clear") {
      setCommandHistory([]);
      return;
    } else {
      output = `Command not found: ${cmd}. Type 'help' for available commands.`;
    }

    setCommandHistory((prev) => [...prev, { cmd, output }]);
    setInputVal("");
  };

  return (
    <div className="space-y-5">
      {/* Section Sub-Tabs */}
      <div className="flex items-center gap-2 pb-3 border-b border-black/10 dark:border-white/10">
        {[
          { id: "terminal" as const, label: "Terminal", icon: LuTerminal },
          { id: "stack" as const, label: "Tech Stack", icon: LuCode },
          { id: "projects" as const, label: "Featured Work", icon: LuSparkles },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-sans font-medium transition-colors cursor-pointer ${
                isActive
                  ? "bg-foreground text-background"
                  : "border border-black/12 dark:border-white/10 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="size-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === "terminal" && (
        <div className="space-y-4">
          {/* Quick Command Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mr-1">
              Run:
            </span>
            {["whoami", "neofetch", "stack", "projects", "status", "clear"].map(
              (btn) => (
                <button
                  key={btn}
                  type="button"
                  onClick={() => handleCommand(btn)}
                  className="font-sans text-[11px] font-medium px-2.5 py-1 rounded-full border border-black/12 dark:border-white/10 text-foreground/85 hover:text-foreground hover:border-black/20 dark:hover:border-white/20 hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors cursor-pointer"
                >
                  ${btn}
                </button>
              )
            )}
          </div>

          {/* Clean Monochrome Artisan Shell Box */}
          <div className="p-4 rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] max-h-80 overflow-y-auto space-y-3 font-sans text-xs">
            {commandHistory.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center gap-2 text-foreground">
                  <span className="text-muted-foreground">naphier@workspace ~$</span>
                  <span className="font-semibold">{item.cmd}</span>
                </div>
                <pre className="text-xs text-foreground/80 whitespace-pre-wrap font-sans leading-relaxed pl-3.5 border-l border-black/15 dark:border-white/15">
                  {item.output}
                </pre>
              </div>
            ))}

            {/* Live Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (inputVal.trim()) handleCommand(inputVal);
              }}
              className="flex items-center gap-2 pt-2 border-t border-black/10 dark:border-white/10"
            >
              <span className="text-muted-foreground shrink-0">
                naphier@workspace ~$
              </span>
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Type 'help' or click a command above..."
                className="flex-1 bg-transparent border-none outline-none text-foreground text-xs font-sans placeholder:text-muted-foreground/60"
              />
            </form>
          </div>
        </div>
      )}

      {activeTab === "stack" && (
        <div className="space-y-4">
          {techSections.map((section) => (
            <div
              key={section.title}
              className="p-3.5 rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.015] dark:bg-white/[0.02] space-y-2.5"
            >
              <h4 className="font-mono text-base font-semibold tracking-tight text-foreground">
                {section.title}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {section.items.map((item) => (
                  <span
                    key={item}
                    className="px-2.5 py-1 rounded-full border border-black/12 dark:border-white/10 text-[11px] font-sans text-foreground/85"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "projects" && (
        <div className="divide-y divide-black/10 dark:divide-white/10 border-t border-b border-black/10 dark:border-white/10">
          {fullProjects.map((p, idx) => (
            <a
              key={p.slug}
              href={p.live || p.github || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3.5 px-2 flex items-start justify-between gap-3 group hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-muted-foreground tabular-nums">
                    0{idx + 1}
                  </span>
                  <h4 className="font-mono text-lg font-semibold text-foreground group-hover:underline">
                    {p.title}
                  </h4>
                </div>
                <p className="font-sans text-xs text-foreground/75 leading-relaxed line-clamp-2">
                  {p.overview}
                </p>
                <span className="inline-block font-sans text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground pt-0.5">
                  {p.category} • {p.year}
                </span>
              </div>
              <LuArrowUpRight className="size-4 text-muted-foreground group-hover:text-foreground shrink-0 mt-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   2. PC RIG: Hardware Specs & Interactive Diagnostics
   ========================================================================= */
function PCRigContent() {
  const [fanMode, setFanMode] = useState<"quiet" | "balanced" | "turbo">(
    "balanced"
  );

  const fanSpeeds = {
    quiet: { rpm: "650 RPM", temp: "38°C", noise: "Silent (18dB)" },
    balanced: { rpm: "1250 RPM", temp: "46°C", noise: "Smooth (26dB)" },
    turbo: { rpm: "2200 RPM", temp: "58°C", noise: "Max Airflow (38dB)" },
  };

  const current = fanSpeeds[fanMode];

  const specs = [
    { label: "Processor", value: "AMD Ryzen", sub: "Multi-Core Dev" },
    { label: "Memory", value: "32 GB DDR5", sub: "Dual Channel" },
    { label: "Fast NVMe", value: "2 TB PCIe 4.0", sub: "7000 MB/s Read" },
    { label: "Environment", value: "Windows & WSL2", sub: "VS Code + Zsh" },
  ];

  return (
    <div className="space-y-5">
      {/* Spec Breakdown */}
      <div className="grid grid-cols-2 gap-2.5">
        {specs.map((spec) => (
          <div
            key={spec.label}
            className="p-3.5 rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.015] dark:bg-white/[0.02] space-y-1"
          >
            <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground block">
              {spec.label}
            </span>
            <span className="font-mono text-lg font-semibold text-foreground block">
              {spec.value}
            </span>
            <span className="font-sans text-xs text-muted-foreground block">
              {spec.sub}
            </span>
          </div>
        ))}
      </div>

      {/* Fan & Performance Simulator */}
      <div className="p-4 rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.015] dark:bg-white/[0.02] space-y-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <LuZap className="size-4 text-foreground/80" />
            <h4 className="font-mono text-lg font-semibold text-foreground">
              Cooling & Thermal Profile
            </h4>
          </div>
          <div className="flex gap-1.5">
            {(["quiet", "balanced", "turbo"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setFanMode(mode)}
                className={`px-3 py-1 rounded-full text-[11px] font-sans font-medium capitalize transition-colors cursor-pointer ${
                  fanMode === mode
                    ? "bg-foreground text-background"
                    : "border border-black/12 dark:border-white/10 text-muted-foreground hover:text-foreground"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Live Gauges */}
        <div className="grid grid-cols-3 gap-3 pt-3 text-center border-t border-black/10 dark:border-white/10">
          <div>
            <span className="font-sans text-[10px] uppercase tracking-[0.14em] text-muted-foreground block">
              Fan Speed
            </span>
            <span className="font-mono text-base font-semibold text-foreground">
              {current.rpm}
            </span>
          </div>
          <div>
            <span className="font-sans text-[10px] uppercase tracking-[0.14em] text-muted-foreground block">
              Core Temp
            </span>
            <span className="font-mono text-base font-semibold text-foreground">
              {current.temp}
            </span>
          </div>
          <div>
            <span className="font-sans text-[10px] uppercase tracking-[0.14em] text-muted-foreground block">
              Acoustics
            </span>
            <span className="font-mono text-base font-semibold text-foreground">
              {current.noise}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   3. HEADPHONES: Now Playing — shared music-drawer CD, featured song & rotation
   ========================================================================= */
function HeadphonesContent() {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack>(DEFAULT_TRACK);

  return (
    <div className="space-y-5">
      {/* Featured Song: rotating CD + Spotify / YouTube Music links */}
      <div className="p-5 rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.015] dark:bg-white/[0.02]">
        <MusicFeaturedSong track={currentTrack} />
      </div>

      {/* My Rotation: same playlist as the default layout music drawer */}
      <div className="p-4 rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.015] dark:bg-white/[0.02] h-[360px] flex flex-col">
        <MusicPlaylist
          tracks={FAVORITE_TRACKS}
          currentTrack={currentTrack}
          onSelectTrack={setCurrentTrack}
          className="mt-0 pt-0 border-t-0"
        />
      </div>
    </div>
  );
}

/* =========================================================================
   4. GAMEPAD: Side Quests & Mini Bug Hunter Arcade
   ========================================================================= */
function GamepadContent() {
  const [bugsSquashed, setBugsSquashed] = useState(0);
  const [activeBugIndex, setActiveBugIndex] = useState(2);

  const bugLabels = [
    "CORS Policy Blocked",
    "Memory Leak Detected",
    "Undefined is not a function",
    "SSR Hydration Mismatch",
    "Missing Hook Dependency",
  ];

  const handleSquash = () => {
    setBugsSquashed((prev) => prev + 1);
    setActiveBugIndex(Math.floor(Math.random() * bugLabels.length));
  };

  return (
    <div className="space-y-5">
      {/* Mini Retro Arcade Game */}
      <div className="p-4 rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.015] dark:bg-white/[0.02] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LuGamepad2 className="size-4 text-foreground/80" />
            <h4 className="font-mono text-lg font-semibold text-foreground">
              Bug Smasher Mini-Game
            </h4>
          </div>
          <span className="font-sans text-xs font-semibold px-2.5 py-1 rounded-full border border-black/12 dark:border-white/10 text-foreground">
            Squashed: {bugsSquashed}
          </span>
        </div>

        <div className="p-5 rounded-xl border border-black/10 dark:border-white/10 bg-background text-center space-y-3.5">
          <p className="font-sans text-xs text-muted-foreground">
            A wild production bug appeared in the pipeline:
          </p>
          <div className="inline-block px-3.5 py-1.5 rounded-full border border-black/12 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.04] text-foreground font-sans text-xs font-medium">
            {bugLabels[activeBugIndex]}
          </div>
          <div>
            <button
              type="button"
              onClick={handleSquash}
              className="px-4 py-2 rounded-full bg-foreground text-background font-sans text-xs font-medium hover:opacity-90 active:scale-95 transition-all cursor-pointer"
            >
              Squash Bug
            </button>
          </div>
        </div>
      </div>

      {/* Favorite Games & Quests */}
      <div className="p-4 rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.015] dark:bg-white/[0.02] space-y-3">
        <h5 className="font-mono text-lg font-semibold text-foreground">
          Off-Hours Inspiration
        </h5>
        <div className="divide-y divide-black/10 dark:divide-white/10">
          {[
            {
              title: "Elden Ring",
              note: "Patience, deliberate timing, and systems mastery.",
            },
            {
              title: "Cyberpunk 2077",
              note: "Diegetic interface design and atmospheric worldbuilding.",
            },
            {
              title: "Hollow Knight",
              note: "Responsive controls and handcrafted environmental detail.",
            },
            {
              title: "Hades & Celeste",
              note: "Tight feedback loops and kinetic polish.",
            },
          ].map((game) => (
            <div key={game.title} className="py-2.5 first:pt-0 last:pb-0">
              <span className="font-mono text-base font-semibold text-foreground block">
                {game.title}
              </span>
              <p className="font-sans text-xs text-muted-foreground">
                {game.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   5. SMART LAMP: Interactive Room RGB Atmosphere Controller
   ========================================================================= */
function SmartLampContent({
  currentColor,
  onSelectColor,
}: {
  currentColor: string;
  onSelectColor: (c: string) => void;
}) {
  const presets = [
    { name: "Studio Cyan", hex: "#06b6d4" },
    { name: "Warm Amber", hex: "#f59e0b" },
    { name: "Emerald Calm", hex: "#10b981" },
    { name: "Soft Violet", hex: "#a855f7" },
    { name: "Sunset Rose", hex: "#f43f5e" },
    { name: "Daylight Sky", hex: "#38bdf8" },
  ];

  return (
    <div className="space-y-5">
      <div className="p-5 rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.015] dark:bg-white/[0.02] flex flex-col items-center justify-center gap-4 text-center">
        <div
          className="size-16 rounded-full flex items-center justify-center transition-all duration-500 border border-black/10 dark:border-white/10"
          style={{
            backgroundColor: `${currentColor}20`,
            boxShadow: `0 0 32px ${currentColor}35`,
          }}
        >
          <LuLamp className="size-7" style={{ color: currentColor }} />
        </div>

        <div className="space-y-1">
          <h4 className="font-mono text-xl font-semibold text-foreground">
            Workspace Ambient Aura
          </h4>
          <p className="font-sans text-xs text-muted-foreground">
            Adjust the ambient halo glow behind the 3D desk setup
          </p>
        </div>

        {/* Color Presets */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {presets.map((p) => {
            const isSelected = currentColor === p.hex;
            return (
              <button
                key={p.name}
                type="button"
                onClick={() => onSelectColor(p.hex)}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-sans font-medium transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-foreground text-background border-foreground"
                    : "border-black/12 dark:border-white/10 text-foreground/85 hover:border-black/20 dark:hover:border-white/20"
                }`}
              >
                <span
                  className="size-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: p.hex }}
                />
                <span>{p.name}</span>
                {isSelected && <LuCheck className="size-3" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   6. BOOKSHELF: Reading List & Engineering Influences
   ========================================================================= */
function BookshelfContent() {
  const books = [
    {
      title: "Designing Data-Intensive Applications",
      author: "Martin Kleppmann",
      lesson:
        "Reliability, scalability, and maintainability are the foundational pillars of lasting data systems.",
    },
    {
      title: "The Pragmatic Programmer",
      author: "David Thomas & Andrew Hunt",
      lesson:
        "Care about your craft, think critically about your work, and build adaptable software.",
    },
    {
      title: "Refactoring UI",
      author: "Adam Wathan & Steve Schoger",
      lesson:
        "Design with clear visual hierarchy, deliberate spacing, and restrained typography.",
    },
    {
      title: "Clean Architecture",
      author: "Robert C. Martin",
      lesson:
        "Keep core domain logic independent of frameworks, user interfaces, and external databases.",
    },
  ];

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        {books.map((b) => (
          <div
            key={b.title}
            className="p-4 rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.015] dark:bg-white/[0.02] space-y-2"
          >
            <div className="flex items-start gap-2.5">
              <LuBookOpen className="size-4 text-muted-foreground shrink-0 mt-1" />
              <div>
                <h5 className="font-mono text-lg font-semibold text-foreground leading-snug">
                  {b.title}
                </h5>
                <span className="font-sans text-xs text-muted-foreground">
                  by {b.author}
                </span>
              </div>
            </div>
            <p className="font-sans text-xs text-foreground/80 leading-relaxed pt-2 border-t border-black/10 dark:border-white/10">
              {b.lesson}
            </p>
          </div>
        ))}
      </div>

      {/* Desk Collectibles */}
      <div className="p-4 rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.015] dark:bg-white/[0.02] space-y-3">
        <h5 className="font-mono text-lg font-semibold text-foreground">
          Desk Artifacts
        </h5>
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { name: "Flip Clock", desc: "Pomodoro focus" },
            { name: "Desk Plants", desc: "Visual calm" },
            { name: "Notebook", desc: "System sketches" },
          ].map((item) => (
            <div
              key={item.name}
              className="p-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-background"
            >
              <span className="font-mono text-sm font-semibold text-foreground block">
                {item.name}
              </span>
              <span className="font-sans text-[10px] text-muted-foreground">
                {item.desc}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RoomObjectModal;
