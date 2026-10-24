"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LuX,
  LuTerminal,
  LuArrowUpRight,
  LuSparkles,
  LuZap,
  LuCode,
} from "react-icons/lu";
import { PhoneCall, PhoneOff } from "lucide-react";
import { HotspotId, HOTSPOTS } from "./RoomHotspots";
import {
  HERO_DATA,
  WORKSPACE_DESK_SPECS,
  WORKSPACE_DESK_ESSENTIALS,
  WORKSPACE_DESK_ARTIFACTS,
} from "./data";
import { techSections, fullProjects } from "@/lib/data";

interface RoomObjectModalProps {
  hotspotId: HotspotId | null;
  isDark: boolean;
  onClose: () => void;
  onSelectHotspot?: (id: HotspotId) => void;
  isCallActive?: boolean;
  isTransitionLocked?: boolean;
  onToggleCall?: () => void;
}

export function RoomObjectModal({
  hotspotId,
  isDark,
  onClose,
  onSelectHotspot,
  isCallActive = false,
  isTransitionLocked = false,
  onToggleCall,
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

              {/* 2. Desk Object Switcher Grid */}
              {onSelectHotspot && (
                <div className="px-6 py-3.5 border-b border-black/10 dark:border-white/10 grid grid-cols-2 gap-2 shrink-0">
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
                {hotspotId === "smartphone" && (
                  <SmartphoneContent
                    isCallActive={isCallActive}
                    isTransitionLocked={isTransitionLocked}
                    onToggleCall={() => {
                      if (!isTransitionLocked && onToggleCall) {
                        onToggleCall();
                        onClose();
                      }
                    }}
                  />
                )}
                {hotspotId === "desk_corner" && <DeskCornerContent />}
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
   2. SMARTPHONE: Interactive Desk Phone Call Controller
   ========================================================================= */
function SmartphoneContent({
  isCallActive,
  isTransitionLocked = false,
  onToggleCall,
}: {
  isCallActive: boolean;
  isTransitionLocked?: boolean;
  onToggleCall: () => void;
}) {
  return (
    <div className="space-y-5">
      <div className="p-5 rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.015] dark:bg-white/[0.02] flex flex-col items-center justify-center gap-4 text-center">
        <div
          className={`size-16 rounded-full flex items-center justify-center border transition-all duration-300 ${
            isCallActive
              ? "bg-rose-500/15 border-rose-500/30 text-rose-500"
              : "bg-emerald-500/15 border-emerald-500/30 text-emerald-500"
          }`}
        >
          {isCallActive ? (
            <PhoneOff className="size-7" />
          ) : (
            <PhoneCall className="size-7" />
          )}
        </div>

        <div className="space-y-1">
          <h4 className="font-prime text-xl font-semibold text-foreground">
            {isCallActive ? "Call in Progress" : "Chat with NaphBot"}
          </h4>
          <p className="font-sans text-xs text-muted-foreground max-w-sm">
            {isCallActive
              ? "Naphier is currently on the phone. Click below to end the call and watch him set the phone back on the desk."
              : "Trigger the live desk phone animation sequence — Naphier will pause typing, pick up the smartphone on the desk, and take your call."}
          </p>
        </div>

        <button
          type="button"
          disabled={isTransitionLocked}
          onClick={onToggleCall}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-sans font-semibold transition-all ${
            isTransitionLocked
              ? "opacity-45 cursor-not-allowed bg-foreground/20 text-foreground/60"
              : isCallActive
                ? "bg-rose-600 text-white hover:bg-rose-500 cursor-pointer active:scale-95"
                : "bg-foreground text-background hover:opacity-90 cursor-pointer active:scale-95"
          }`}
        >
          {isCallActive ? (
            <>
              <PhoneOff className="size-3.5" />
              <span className="font-prime">End Call</span>
            </>
          ) : (
            <>
              <PhoneCall className="size-3.5" />
              <span className="font-prime">Chat with NaphBot</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* =========================================================================
   3. DESK CORNER: Laptop Hardware Specs & Left-Side Desk Artifacts
   ========================================================================= */
function DeskCornerContent() {
  const [fanMode, setFanMode] = useState<"quiet" | "balanced" | "turbo">(
    "balanced"
  );

  const fanSpeeds = {
    quiet: { rpm: "1100 RPM", temp: "41°C", noise: "Whisper (19dB)" },
    balanced: { rpm: "2100 RPM", temp: "48°C", noise: "Smooth (25dB)" },
    turbo: { rpm: "3400 RPM", temp: "61°C", noise: "Performance (35dB)" },
  };

  const current = fanSpeeds[fanMode];

  const specs = WORKSPACE_DESK_SPECS;

  return (
    <div className="space-y-5">
      {/* Hardware Spec Breakdown */}
      <div className="grid grid-cols-2 gap-2.5">
        {specs.map((spec) => (
          <div
            key={spec.label}
            className="p-3.5 rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.015] dark:bg-white/[0.02] space-y-1"
          >
            <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground block">
              {spec.label}
            </span>
            <span className="font-mono text-base sm:text-lg font-semibold text-foreground block">
              {spec.value}
            </span>
            <span className="font-sans text-xs text-muted-foreground block">
              {spec.sub}
            </span>
          </div>
        ))}
      </div>

      {/* Left Desk Extension Artifacts */}
      <div className="p-4 rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.015] dark:bg-white/[0.02] space-y-3">
        <h4 className="font-mono text-lg font-semibold text-foreground">
          Left-Side Desk Essentials
        </h4>
        <div className="grid grid-cols-3 gap-2 text-center">
          {WORKSPACE_DESK_ESSENTIALS.map((item) => (
            <div
              key={item.name}
              className="p-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-background"
            >
              <span className="font-mono text-xs sm:text-sm font-semibold text-foreground block">
                {item.name}
              </span>
              <span className="font-sans text-[10px] text-muted-foreground">
                {item.desc}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Laptop Thermal Profile Simulator */}
      <div className="p-4 rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.015] dark:bg-white/[0.02] space-y-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <LuZap className="size-4 text-foreground/80" />
            <h4 className="font-mono text-lg font-semibold text-foreground">
              Laptop Thermal Profile
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
   4. BOOKSHELF: Tactile Book Covers & Official Reading Links
   ========================================================================= */
function BookshelfContent() {
  const books = [
    {
      id: "ddia",
      title: "Designing Data-Intensive Applications",
      author: "Martin Kleppmann",
      publisher: "O'Reilly Media",
      domain: "dataintensive.net",
      url: "https://dataintensive.net/",
      lesson:
        "Reliability, scalability, and maintainability are the foundational pillars of lasting data systems.",
      cover: (
        <div className="relative w-14 h-20 rounded-r-[4px] rounded-l-[2px] bg-[#faf7f2] text-[#18181b] border border-black/15 shadow-[2px_4px_10px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col justify-between p-1.5 select-none">
          {/* Book Spine Crease */}
          <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-r from-black/20 via-black/5 to-transparent pointer-events-none" />
          {/* O'Reilly Crimson Top Band */}
          <div className="w-full h-2.5 bg-[#991b1b] rounded-[1px] flex items-center justify-between px-1">
            <span className="font-sans text-[4.5px] font-bold tracking-widest uppercase text-white/95">
              O&apos;REILLY
            </span>
            <span className="size-1 rounded-full bg-white/80" />
          </div>
          {/* Title & Node Graph Motif */}
          <div className="pl-1 space-y-1">
            <div className="font-mono text-[6px] font-bold leading-[1.1] tracking-tight text-[#111111]">
              DATA-INTENSIVE
              <br />
              APPLICATIONS
            </div>
            <svg viewBox="0 0 40 22" className="w-8 h-4 text-[#991b1b]" fill="none">
              <circle cx="8" cy="11" r="3" stroke="currentColor" strokeWidth="1.4" />
              <circle cx="22" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.3" />
              <circle cx="22" cy="17" r="2.5" stroke="currentColor" strokeWidth="1.3" />
              <circle cx="34" cy="11" r="3" stroke="currentColor" strokeWidth="1.4" />
              <path d="M11 10L19.5 6M11 12L19.5 16M24.5 6L31 10M24.5 16L31 12" stroke="currentColor" strokeWidth="1" />
            </svg>
          </div>
          {/* Bottom Author Line */}
          <div className="pl-1 font-sans text-[4.5px] uppercase tracking-wider text-neutral-500 truncate">
            M. Kleppmann
          </div>
        </div>
      ),
    },
    {
      id: "pragprog",
      title: "The Pragmatic Programmer",
      author: "David Thomas & Andrew Hunt",
      publisher: "20th Anniversary Ed.",
      domain: "pragprog.com",
      url: "https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/",
      lesson:
        "Care about your craft, think critically about your work, and build adaptable software.",
      cover: (
        <div className="relative w-14 h-20 rounded-r-[4px] rounded-l-[2px] bg-[#18181b] text-white border border-white/15 shadow-[2px_4px_10px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col justify-between p-1.5 select-none">
          {/* Book Spine Crease */}
          <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-r from-white/15 via-black/30 to-transparent pointer-events-none" />
          {/* Top Gold Foil Header */}
          <div className="pl-1 flex items-center justify-between">
            <span className="font-sans text-[4.5px] font-semibold uppercase tracking-widest text-amber-400">
              20TH ED
            </span>
            <span className="w-2.5 h-[1.5px] bg-amber-400/80" />
          </div>
          {/* Center Title & Craft Emblem */}
          <div className="pl-1 space-y-1">
            <div className="font-mono text-[6px] font-bold leading-[1.1] tracking-tight text-amber-50">
              THE PRAGMATIC
              <br />
              PROGRAMMER
            </div>
            <div className="w-full h-3.5 rounded-[2px] bg-amber-500/15 border border-amber-400/40 flex items-center justify-center">
              <span className="font-mono text-[6px] text-amber-300 tracking-widest">
                {"</>"}
              </span>
            </div>
          </div>
          {/* Bottom Author */}
          <div className="pl-1 font-sans text-[4.5px] uppercase tracking-wider text-neutral-400 truncate">
            Thomas · Hunt
          </div>
        </div>
      ),
    },
    {
      id: "refactoring-ui",
      title: "Refactoring UI",
      author: "Adam Wathan & Steve Schoger",
      publisher: "Tailwind Labs",
      domain: "refactoringui.com",
      url: "https://www.refactoringui.com/",
      lesson:
        "Design with clear visual hierarchy, deliberate spacing, and restrained typography.",
      cover: (
        <div className="relative w-14 h-20 rounded-r-[4px] rounded-l-[2px] bg-[#0f172a] text-white border border-sky-400/25 shadow-[2px_4px_10px_rgba(0,0,0,0.18)] overflow-hidden flex flex-col justify-between p-1.5 select-none">
          {/* Book Spine Crease */}
          <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-r from-white/15 via-black/25 to-transparent pointer-events-none" />
          {/* Top Grid Accent */}
          <div className="pl-1 flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-sky-400" />
            <span className="font-sans text-[4.5px] font-semibold uppercase tracking-widest text-sky-300">
              DESIGN
            </span>
          </div>
          {/* UI Wireframe Card Motif */}
          <div className="pl-1 space-y-1">
            <div className="font-mono text-[6.5px] font-bold leading-[1.08] text-white">
              Refactoring
              <br />
              <span className="text-sky-400">UI</span>
            </div>
            <div className="p-1 rounded-[2px] bg-white/10 border border-white/15 space-y-0.5">
              <div className="w-4 h-1 rounded-full bg-sky-400/90" />
              <div className="w-6 h-0.5 rounded-full bg-white/50" />
              <div className="w-5 h-0.5 rounded-full bg-white/30" />
            </div>
          </div>
          {/* Bottom Author */}
          <div className="pl-1 font-sans text-[4.5px] uppercase tracking-wider text-slate-400 truncate">
            Wathan · Schoger
          </div>
        </div>
      ),
    },
    {
      id: "clean-arch",
      title: "Clean Architecture",
      author: "Robert C. Martin",
      publisher: "Prentice Hall",
      domain: "oreilly.com",
      url: "https://www.oreilly.com/library/view/clean-architecture-a/9780134494272/",
      lesson:
        "Keep core domain logic independent of frameworks, user interfaces, and external databases.",
      cover: (
        <div className="relative w-14 h-20 rounded-r-[4px] rounded-l-[2px] bg-[#172554] text-white border border-blue-300/20 shadow-[2px_4px_10px_rgba(0,0,0,0.18)] overflow-hidden flex flex-col justify-between p-1.5 select-none">
          {/* Book Spine Crease */}
          <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-r from-white/15 via-black/25 to-transparent pointer-events-none" />
          {/* Top Band */}
          <div className="pl-1 flex items-center justify-between">
            <span className="font-sans text-[4.5px] font-semibold uppercase tracking-wider text-sky-200">
              ROBERT C. MARTIN
            </span>
          </div>
          {/* Concentric Ring Motif */}
          <div className="pl-1 flex flex-col items-start gap-1">
            <div className="font-mono text-[6px] font-bold leading-[1.08] text-white">
              CLEAN
              <br />
              ARCHITECTURE
            </div>
            <svg viewBox="0 0 24 24" className="size-4 text-amber-300" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.2" opacity="0.55" />
              <circle cx="12" cy="12" r="5.5" stroke="#38bdf8" strokeWidth="1.2" opacity="0.85" />
              <circle cx="12" cy="12" r="2.2" fill="#f43f5e" />
            </svg>
          </div>
          {/* Bottom Tag */}
          <div className="pl-1 font-sans text-[4.5px] uppercase tracking-wider text-blue-200/70 truncate">
            Craftsman Series
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        {books.map((b) => (
          <a
            key={b.id}
            href={b.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block p-4 rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.015] dark:bg-white/[0.02] hover:border-black/25 dark:hover:border-white/25 hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-all duration-200"
          >
            <div className="flex items-start gap-4">
              {/* Tactile Miniature Hardcover Book Jacket */}
              <div className="shrink-0 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:-rotate-2">
                {b.cover}
              </div>

              {/* Book Details & Takeaway */}
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h5 className="font-mono text-base sm:text-lg font-semibold text-foreground leading-snug group-hover:underline">
                      {b.title}
                    </h5>
                    <span className="font-sans text-xs text-muted-foreground block">
                      by {b.author} · {b.publisher}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-sans font-medium border border-black/10 dark:border-white/10 text-muted-foreground group-hover:text-foreground group-hover:border-black/20 dark:group-hover:border-white/20 shrink-0 transition-colors">
                    <span>{b.domain}</span>
                    <LuArrowUpRight className="size-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>

                <p className="font-sans text-xs text-foreground/80 leading-relaxed pt-1.5 border-t border-black/10 dark:border-white/10">
                  {b.lesson}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Desk Collectibles */}
      <div className="p-4 rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.015] dark:bg-white/[0.02] space-y-3">
        <h5 className="font-mono text-lg font-semibold text-foreground">
          Desk Artifacts
        </h5>
        <div className="grid grid-cols-3 gap-2 text-center">
          {WORKSPACE_DESK_ARTIFACTS.map((item) => (
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
