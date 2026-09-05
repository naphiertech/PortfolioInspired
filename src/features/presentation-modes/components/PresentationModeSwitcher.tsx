"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, LayoutTemplate, Target, AlignLeft, Bot, Sparkles, Grid } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { usePresentationMode } from "../context/PresentationModeContext";
import { PRESENTATION_MODES } from "../types/config";
import { PresentationMode } from "../types/presentation";
import { useUISound } from "@/context/SoundContext";
import { useViewHint } from "../hooks/useViewHint";

interface PresentationModeSwitcherProps {
  variant?: "dock" | "focus-nav" | "minimal" | "default" | "focus" | "agent";
  className?: string;
}

/**
 * PresentationModeSwitcher
 *
 * Mode-aware presentation switcher featuring:
 * 1. Full-screen blurred backdrop that dims and prevents interaction with background chrome.
 * 2. Distinct mode-specific visual presentations (Default dock-style, Focus technical document, Minimal Roman-serif, Agent workspace).
 * 3. Direct root portaling ensuring popovers are always crystal sharp above the backdrop blur in all modes.
 * 4. Unified presentation state, cookies, routing, keyboard navigation, and accessibility.
 */
export function PresentationModeSwitcher({
  variant = "dock",
  className = "",
}: PresentationModeSwitcherProps) {
  const {
    mode,
    setMode,
    starsEnabled,
    toggleStars,
    gridEnabled,
    toggleGrid,
  } = usePresentationMode();
  const { playClick, playHover } = useUISound();
  const { hasDismissedHint, dismissHint } = useViewHint();
  const shouldReduceMotion = useReducedMotion();

  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [mounted, setMounted] = useState(false);
  const [popoverPos, setPopoverPos] = useState<{
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  }>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Normalize variant to match mode or explicit setting
  const resolvedVariant: "dock" | "focus-nav" | "minimal" | "agent" =
    mode === "agent" || variant === "agent"
      ? "agent"
      : variant === "default"
      ? "dock"
      : variant === "focus"
      ? "focus-nav"
      : variant === "minimal"
      ? "minimal"
      : variant;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only render active, implemented modes (Default, Focus, Minimal)
  const availableModes = Object.values(PRESENTATION_MODES).filter(
    (m) => m.isAvailable
  );

  const currentConfig = PRESENTATION_MODES[mode] || PRESENTATION_MODES.default;

  const closePopover = useCallback(() => {
    setIsOpen(false);
    setFocusedIndex(-1);
    // Return focus to trigger upon closing
    triggerRef.current?.focus();
  }, []);

  // Compute fixed position for the portaled popover relative to the trigger button
  const updatePopoverPosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const isMobile = window.innerWidth < 640;

    if (resolvedVariant === "dock") {
      setPopoverPos({
        bottom: Math.max(16, window.innerHeight - rect.top + 12),
        left: isMobile ? 16 : Math.max(16, rect.left),
      });
    } else if (resolvedVariant === "agent") {
      setPopoverPos({
        top: rect.bottom + 8,
        right: isMobile ? 16 : Math.max(16, window.innerWidth - rect.right),
      });
    } else {
      // focus-nav or minimal
      setPopoverPos({
        top: rect.bottom + 6,
        right: Math.max(16, window.innerWidth - rect.right),
      });
    }
  }, [resolvedVariant]);

  useEffect(() => {
    if (!isOpen) return;
    updatePopoverPosition();
    window.addEventListener("resize", updatePopoverPosition);
    window.addEventListener("scroll", updatePopoverPosition, { passive: true });
    return () => {
      window.removeEventListener("resize", updatePopoverPosition);
      window.removeEventListener("scroll", updatePopoverPosition);
    };
  }, [isOpen, updatePopoverPosition]);

  // Lock body scroll while modal backdrop is active
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Close when clicking outside container or popover
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (
        (containerRef.current && containerRef.current.contains(target)) ||
        (popoverRef.current && popoverRef.current.contains(target))
      ) {
        return;
      }
      closePopover();
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [isOpen, closePopover]);

  // Handle mode selection with universal in-place switching
  const handleSelectMode = useCallback(
    (newMode: PresentationMode) => {
      playClick();
      dismissHint();

      if (newMode === mode) {
        closePopover();
        return;
      }

      setIsOpen(false);
      setFocusedIndex(-1);

      // Universal in-place switch: reset scroll to top immediately during layout transition
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "instant" });
      }
      setMode(newMode);
    },
    [mode, setMode, playClick, closePopover, dismissHint]
  );

  const totalNavItems = availableModes.length + 2;

  // Keyboard navigation within the popover
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        dismissHint();
        setIsOpen(true);
        setFocusedIndex(
          availableModes.findIndex((item) => item.id === mode)
        );
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % totalNavItems);
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev <= 0 ? totalNavItems - 1 : prev - 1
        );
        break;
      case "Home":
        e.preventDefault();
        setFocusedIndex(0);
        break;
      case "End":
        e.preventDefault();
        setFocusedIndex(totalNavItems - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < availableModes.length) {
          handleSelectMode(availableModes[focusedIndex].id);
        } else if (focusedIndex === availableModes.length) {
          playClick();
          toggleStars();
        } else if (focusedIndex === availableModes.length + 1) {
          playClick();
          toggleGrid();
        }
        break;
      case "Escape":
      case "Tab":
        e.preventDefault();
        closePopover();
        break;
    }
  };

  // Sync focus to the arrow-navigated option
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && optionRefs.current[focusedIndex]) {
      optionRefs.current[focusedIndex]?.focus();
    }
  }, [isOpen, focusedIndex]);

  const handleToggleOpen = () => {
    playClick();
    dismissHint();
    if (!isOpen) {
      setFocusedIndex(availableModes.findIndex((item) => item.id === mode));
    }
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      {/* Switcher Trigger in Page Flow / Dock */}
      <div
        ref={containerRef}
        onKeyDown={handleKeyDown}
        className={`relative select-none flex items-center ${
          isOpen ? "z-[70]" : "z-30"
        } ${className}`}
      >
        {/* ========================================================================= */}
        {/* 1. DEFAULT VARIANT: Circular companion button for bottom navigation dock */}
        {/* ========================================================================= */}
        {resolvedVariant === "dock" && (
          <>
            {/* Contextual hint pointing rightward toward the circular button */}
            {!hasDismissedHint && !isOpen && (
              <div className="hidden sm:flex items-center gap-1.5 font-mono text-xs text-muted-foreground/80 tracking-wide pointer-events-none select-none animate-in fade-in duration-300 mr-2.5 whitespace-nowrap">
                <span>Try another view</span>
                <span className="text-muted-foreground/60 font-sans" aria-hidden="true">
                  →
                </span>
              </div>
            )}

            <button
              ref={triggerRef}
              type="button"
              onClick={handleToggleOpen}
              onMouseEnter={playHover}
              aria-haspopup="listbox"
              aria-expanded={isOpen}
              aria-label="Change presentation view"
              title="Change view"
              className={`h-[54px] w-[54px] rounded-full bg-dock backdrop-blur-[16px] border border-border-hairline shadow-nav-dock flex items-center justify-center text-ink/80 hover:text-ink hover:border-border hover:scale-105 active:scale-95 transition-all outline-none focus-visible:ring-2 focus-visible:ring-brand cursor-pointer ${
                isOpen
                  ? "border-ink/40 text-ink bg-surface shadow-md scale-105"
                  : ""
              }`}
            >
              <LayoutTemplate className="w-[18px] h-[18px] text-ink/80 transition-transform" />
            </button>
          </>
        )}

        {/* ========================================================================= */}
        {/* 2. FOCUS VARIANT: Solid structured dropdown button in Focus top header     */}
        {/* ========================================================================= */}
        {resolvedVariant === "focus-nav" && (
          <div className="relative inline-flex flex-col items-center">
            <button
              ref={triggerRef}
              type="button"
              onClick={handleToggleOpen}
              onMouseEnter={playHover}
              aria-haspopup="listbox"
              aria-expanded={isOpen}
              aria-label={`Presentation mode: ${currentConfig.shortLabel || currentConfig.label}. Click to switch.`}
              className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md bg-surface border border-border-hairline text-ink/90 hover:bg-surface-hover hover:border-border hover:text-ink shadow-xs text-xs font-mono tracking-wider transition-colors outline-none focus-visible:ring-1 focus-visible:ring-brand cursor-pointer whitespace-nowrap flex-shrink-0 ${
                isOpen ? "border-border text-ink bg-surface-hover shadow-sm" : ""
              }`}
            >
              <LayoutTemplate className="w-3.5 h-3.5 text-muted-foreground/80 flex-shrink-0" />
              <span className="text-emerald-500 text-[9px] flex-shrink-0" aria-hidden="true">
                ●
              </span>
              <span className="font-semibold uppercase text-[11px] whitespace-nowrap">
                {currentConfig.shortLabel || currentConfig.label}
              </span>
              <ChevronDown
                className={`w-3 h-3 text-muted-foreground/60 transition-transform duration-150 flex-shrink-0 ${
                  isOpen ? "rotate-180 text-ink" : ""
                }`}
                aria-hidden="true"
              />
            </button>

            {/* Contextual hint directly BELOW the FOCUS control, pointing UPWARD */}
            {!hasDismissedHint && !isOpen && (
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none select-none animate-in fade-in duration-300 z-20 whitespace-nowrap">
                <span className="text-muted-foreground/70 text-[11px] leading-none mb-0.5" aria-hidden="true">
                  ↑
                </span>
                <span className="font-mono text-[10px] sm:text-[11px] text-muted-foreground/85 tracking-wide">
                  Try another view
                </span>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. MINIMAL VARIANT: Quiet, understated Roman-serif text trigger            */}
        {/* ========================================================================= */}
        {resolvedVariant === "minimal" && (
          <button
            ref={triggerRef}
            type="button"
            onClick={handleToggleOpen}
            onMouseEnter={playHover}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-label={`Presentation mode: ${currentConfig.label}. Click to switch.`}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-sm font-serif text-zinc-700 dark:text-[#c4bfb6] hover:text-zinc-950 hover:dark:text-white transition-colors outline-none cursor-pointer border border-transparent hover:border-zinc-200 dark:hover:border-white/[0.08] whitespace-nowrap flex-shrink-0 ${
              isOpen
                ? "border-zinc-300/90 dark:border-white/[0.12] text-zinc-950 dark:text-[#f0ede6] bg-zinc-100/80 dark:bg-[#181816]"
                : ""
            }`}
          >
            <span className="tracking-wide capitalize whitespace-nowrap">{currentConfig.label}</span>
            <ChevronDown
              className={`w-3 h-3 text-zinc-400 dark:text-[#827d73] transition-transform duration-150 flex-shrink-0 ${
                isOpen ? "rotate-180 text-zinc-800 dark:text-[#eae6df]" : ""
              }`}
              aria-hidden="true"
            />
          </button>
        )}

        {/* ========================================================================= */}
        {/* 4. AGENT VARIANT: AI Workspace Command-Center Trigger                     */}
        {/* ========================================================================= */}
        {resolvedVariant === "agent" && (
          <button
            ref={triggerRef}
            type="button"
            onClick={handleToggleOpen}
            onMouseEnter={playHover}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-label={`Presentation mode: ${currentConfig.label}. Click to switch.`}
            className={`inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-md bg-surface border border-border-hairline hover:border-border text-ink shadow-xs text-xs font-mono transition-all outline-none focus-visible:ring-1 focus-visible:ring-brand cursor-pointer whitespace-nowrap flex-shrink-0 ${
              isOpen ? "border-ink/40 bg-surface-hover shadow-sm" : ""
            }`}
          >
            <span className="text-brand text-xs font-mono select-none flex-shrink-0" aria-hidden="true">
              ◈
            </span>
            <span className="font-semibold uppercase text-[11px] tracking-wider text-ink whitespace-nowrap">
              {currentConfig.shortLabel || currentConfig.label}
            </span>
            <ChevronDown
              className={`w-3 h-3 text-muted-foreground/60 transition-transform duration-150 flex-shrink-0 ${
                isOpen ? "rotate-180 text-ink" : ""
              }`}
              aria-hidden="true"
            />
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* PORTALED FULL-SCREEN BACKDROP & POPOVER (At root level: z-[60] & z-[70])   */}
      {/* ========================================================================= */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <>
                {/* 1. Full-Screen Blurred Backdrop (z-[60]) */}
                <motion.div
                  key="presentation-switcher-backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: shouldReduceMotion ? 0.05 : 0.18,
                    ease: "easeOut",
                  }}
                  onClick={closePopover}
                  className="fixed inset-0 z-[60] bg-black/15 dark:bg-black/50 backdrop-blur-[6px] pointer-events-auto cursor-default select-none"
                  aria-hidden="true"
                />

                {/* 2. Mode-Specific Popover Menu (z-[70]) */}
                <motion.div
                  key="presentation-switcher-popover"
                  ref={popoverRef}
                  role="listbox"
                  aria-label="Available Presentation Modes"
                  initial={{
                    opacity: 0,
                    scale: shouldReduceMotion ? 1 : 0.98,
                    y: shouldReduceMotion ? 0 : -4,
                  }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    scale: shouldReduceMotion ? 1 : 0.98,
                    y: shouldReduceMotion ? 0 : -4,
                  }}
                  transition={{
                    duration: shouldReduceMotion
                      ? 0.05
                      : resolvedVariant === "agent"
                      ? 0.26
                      : 0.18,
                    ease: [0.16, 1, 0.3, 1] as const,
                  }}
                  style={{
                    position: "fixed",
                    top: popoverPos.top !== undefined ? `${popoverPos.top}px` : undefined,
                    bottom: popoverPos.bottom !== undefined ? `${popoverPos.bottom}px` : undefined,
                    left: popoverPos.left !== undefined ? `${popoverPos.left}px` : undefined,
                    right: popoverPos.right !== undefined ? `${popoverPos.right}px` : undefined,
                    transformOrigin:
                      resolvedVariant === "dock"
                        ? "bottom left"
                        : "top right",
                  }}
                  className={`fixed outline-none z-[70] pointer-events-auto will-change-[transform,opacity] ${
                    resolvedVariant === "agent"
                      ? "w-[calc(100vw-32px)] sm:w-80 max-w-[340px] p-2 rounded-xl bg-surface dark:bg-[#121316] border border-border shadow-2xl font-mono text-ink"
                      : resolvedVariant === "dock"
                      ? "w-64 sm:w-72 p-2 rounded-2xl bg-surface dark:bg-[#141618] border border-border shadow-2xl"
                      : resolvedVariant === "focus-nav"
                      ? "w-64 sm:w-72 p-1.5 rounded-md bg-surface dark:bg-[#141618] border border-border shadow-2xl font-mono"
                      : "w-60 sm:w-64 p-3 rounded-none sm:rounded-sm bg-[#faf8f5] dark:bg-[#181816] border border-zinc-300 dark:border-white/[0.15] shadow-2xl font-serif"
                  }`}
                  onKeyDown={handleKeyDown}
                >
                  {/* --- POPOVER HEADER (Mode-specific) --- */}
                  {resolvedVariant === "agent" && (
                    <div className="px-3 py-2 border-b border-border/80 mb-1.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-ink font-bold tracking-widest uppercase">
                          AGENT
                        </span>
                        <span className="font-mono text-[9px] text-muted-foreground/70 px-1.5 py-0.5 rounded bg-surface-hover/80 border border-border-hairline font-semibold">
                          {availableModes.length} MODES
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
                        <span className="font-mono text-[9px] text-emerald-500 dark:text-emerald-400 font-bold tracking-wider">
                          ACTIVE
                        </span>
                      </div>
                    </div>
                  )}

                  {resolvedVariant === "dock" && (
                    <div className="px-2.5 py-1.5 border-b border-border-divider/70 mb-1.5 flex items-center justify-between">
                      <span className="font-mono text-[10px] text-muted-foreground/70 tracking-widest uppercase">
                        DEFAULT
                      </span>
                      <span className="font-mono text-[9px] text-brand font-medium">● ACTIVE</span>
                    </div>
                  )}

                  {resolvedVariant === "focus-nav" && (
                    <div className="px-2.5 py-1.5 border-b border-border-divider flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] text-muted-foreground/70 tracking-wider uppercase">
                        [ FOCUS ]
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground/50">
                        {String(availableModes.length).padStart(2, "0")} MODES
                      </span>
                    </div>
                  )}

                  {resolvedVariant === "minimal" && (
                    <div className="pb-1.5 border-b border-zinc-200/90 dark:border-white/[0.08] mb-2 flex items-center justify-between">
                      <span className="font-serif italic text-xs text-zinc-600 dark:text-[#9e998e]">
                        Minimal
                      </span>
                      <span className="font-serif text-[11px] text-zinc-400 dark:text-[#787369]">
                        presentation
                      </span>
                    </div>
                  )}

                  {/* --- MODE SELECTION ITEMS (Mode-specific) --- */}
                  <div className="space-y-1">
                    {availableModes.map((item, index) => {
                      const isSelected = item.id === mode;
                      const isFocused = index === focusedIndex;

                      // 1. AGENT WORKSPACE CONTROL ITEM
                      if (resolvedVariant === "agent") {
                        const modeIcons = {
                          default: LayoutTemplate,
                          focus: Target,
                          minimal: AlignLeft,
                          agent: Bot,
                        };
                        const ModeIcon = modeIcons[item.id as keyof typeof modeIcons] || LayoutTemplate;

                        return (
                          <button
                            key={item.id}
                            ref={(el) => {
                              optionRefs.current[index] = el;
                            }}
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            tabIndex={isFocused ? 0 : -1}
                            onClick={() => handleSelectMode(item.id)}
                            onMouseEnter={() => {
                              playHover();
                              setFocusedIndex(index);
                            }}
                            className={`w-full text-left p-2.5 rounded-lg flex items-start gap-2.5 transition-all outline-none cursor-pointer border group ${
                              isSelected
                                ? "bg-surface-hover/90 border-border text-ink shadow-2xs"
                                : isFocused
                                ? "bg-surface-hover/60 border-transparent text-ink"
                                : "border-transparent text-muted-foreground hover:bg-surface-hover/40 hover:text-ink"
                            }`}
                          >
                            <div className="flex items-center gap-1.5 mt-0.5 flex-shrink-0">
                              <span
                                className={`font-mono text-xs select-none ${
                                  isSelected ? "text-emerald-500 font-bold" : "text-muted-foreground/40"
                                }`}
                                aria-hidden="true"
                              >
                                {isSelected ? "●" : "◌"}
                              </span>
                              <ModeIcon
                                className={`w-3.5 h-3.5 transition-colors ${
                                  isSelected ? "text-ink" : "text-muted-foreground/60 group-hover:text-ink"
                                }`}
                                aria-hidden="true"
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink">
                                  {item.label}
                                </span>
                                {isSelected && (
                                  <span className="font-mono text-[9px] font-semibold text-emerald-500 dark:text-emerald-400 uppercase tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                                    ACTIVE
                                  </span>
                                )}
                              </div>
                              <p className="font-sans text-[11.5px] text-muted-foreground leading-snug mt-0.5">
                                {item.description}
                              </p>
                            </div>
                          </button>
                        );
                      }

                      // 2. DEFAULT DOCK POPOVER ITEM
                      if (resolvedVariant === "dock") {
                        return (
                          <button
                            key={item.id}
                            ref={(el) => {
                              optionRefs.current[index] = el;
                            }}
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            tabIndex={isFocused ? 0 : -1}
                            onClick={() => handleSelectMode(item.id)}
                            onMouseEnter={() => {
                              playHover();
                              setFocusedIndex(index);
                            }}
                            className={`w-full text-left p-2.5 rounded-xl flex items-start gap-2.5 transition-colors outline-none cursor-pointer border ${
                              isSelected
                                ? "bg-surface-hover/90 border-border text-ink shadow-2xs"
                                : isFocused
                                ? "bg-surface-hover/80 border-transparent text-ink"
                                : "border-transparent text-muted-foreground hover:bg-surface-hover/60 hover:text-ink"
                            }`}
                          >
                            <span
                              className={`text-xs mt-0.5 flex-shrink-0 ${
                                isSelected
                                  ? item.id === "focus"
                                    ? "text-emerald-500 font-bold"
                                    : item.id === "agent"
                                    ? "text-indigo-400 dark:text-indigo-300 font-bold"
                                    : "text-brand font-bold"
                                  : "text-muted-foreground/40"
                              }`}
                              aria-hidden="true"
                            >
                              {isSelected ? "●" : "○"}
                            </span>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-xs font-semibold uppercase text-ink">
                                  {item.label}
                                </span>
                                {isSelected && (
                                  <span className="font-mono text-[9px] text-muted-foreground/70 uppercase tracking-widest font-semibold">
                                    ACTIVE
                                  </span>
                                )}
                              </div>
                              <p className="font-sans text-[11.5px] text-muted-foreground leading-snug mt-0.5">
                                {item.description}
                              </p>
                            </div>
                          </button>
                        );
                      }

                      // 2. FOCUS POPOVER ITEM (Technical Document / Ledger)
                      if (resolvedVariant === "focus-nav") {
                        return (
                          <button
                            key={item.id}
                            ref={(el) => {
                              optionRefs.current[index] = el;
                            }}
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            tabIndex={isFocused ? 0 : -1}
                            onClick={() => handleSelectMode(item.id)}
                            onMouseEnter={() => {
                              playHover();
                              setFocusedIndex(index);
                            }}
                            className={`w-full text-left px-2.5 py-2 rounded-sm border transition-colors outline-none cursor-pointer ${
                              isSelected
                                ? "bg-surface-hover/90 border-border text-ink shadow-2xs"
                                : isFocused
                                ? "bg-surface-hover/60 border-transparent text-ink"
                                : "border-transparent text-muted-foreground hover:bg-surface-hover/40 hover:text-ink"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`font-mono text-xs font-semibold ${
                                    isSelected ? "text-brand" : "text-muted-foreground/60"
                                  }`}
                                >
                                  {String(index + 1).padStart(2, "0")}
                                </span>
                                <span
                                  className={`font-mono text-xs font-bold uppercase ${
                                    isSelected ? "text-ink" : "text-ink/80"
                                  }`}
                                >
                                  {item.label}
                                </span>
                              </div>
                              {isSelected && (
                                <span className="font-mono text-[9px] font-bold text-emerald-500 dark:text-emerald-400 uppercase tracking-wider">
                                  [ ACTIVE ]
                                </span>
                              )}
                            </div>
                            <p className="font-sans text-[11.5px] text-muted-foreground leading-snug mt-1 pl-6">
                              {item.description}
                            </p>
                          </button>
                        );
                      }

                      // 3. MINIMAL POPOVER ITEM (Roman-serif Editorial)
                      return (
                        <button
                          key={item.id}
                          ref={(el) => {
                            optionRefs.current[index] = el;
                          }}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          tabIndex={isFocused ? 0 : -1}
                          onClick={() => handleSelectMode(item.id)}
                          onMouseEnter={() => {
                            playHover();
                            setFocusedIndex(index);
                          }}
                          className={`w-full text-left py-1.5 px-2 rounded-none transition-colors outline-none cursor-pointer ${
                            isSelected
                              ? "bg-zinc-200/80 dark:bg-white/[0.08] text-zinc-950 dark:text-[#f0ede6]"
                              : isFocused
                              ? "bg-zinc-100 dark:bg-white/[0.05] text-zinc-950 dark:text-[#ede9e2]"
                              : "text-zinc-600 dark:text-[#a8a399] hover:bg-zinc-100/60 dark:hover:bg-white/[0.04] hover:text-zinc-950 hover:dark:text-[#ede9e2]"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-zinc-700 dark:text-[#c4bfb6]">
                                {isSelected ? "•" : "○"}
                              </span>
                              <span className="font-serif text-sm font-medium text-zinc-900 dark:text-[#ede9e2]">
                                {item.label}
                              </span>
                            </div>
                            {isSelected && (
                              <span className="font-serif italic text-[11px] text-zinc-500 dark:text-[#9c978e]">
                                (active)
                              </span>
                            )}
                          </div>
                          <p className="font-serif text-[11.5px] text-zinc-600 dark:text-[#9c978e] leading-snug mt-0.5 italic pl-4">
                            {item.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  {/* --- ANIMATIONS SECTION (Mode-specific) --- */}

                  {/* 1. AGENT VARIANT ANIMATIONS (Command-Center Workspace Controls) */}
                  {resolvedVariant === "agent" && (
                    <div className="mt-2 pt-2 border-t border-border/80">
                      <div className="px-2.5 py-1 mb-1 flex items-center justify-between">
                        <span className="font-mono text-[10px] text-muted-foreground/70 tracking-widest uppercase font-semibold">
                          ANIMATIONS
                        </span>
                        <span className="font-mono text-[9px] text-muted-foreground/50 uppercase">
                          GLOBAL
                        </span>
                      </div>

                      <div className="space-y-1">
                        {/* Stars Background Toggle */}
                        <button
                          ref={(el) => {
                            optionRefs.current[availableModes.length] = el;
                          }}
                          type="button"
                          role="switch"
                          aria-checked={starsEnabled}
                          tabIndex={focusedIndex === availableModes.length ? 0 : -1}
                          aria-label="Toggle Stars Background"
                          onClick={(e) => {
                            e.stopPropagation();
                            playClick();
                            toggleStars();
                          }}
                          onMouseEnter={() => {
                            playHover();
                            setFocusedIndex(availableModes.length);
                          }}
                          className={`w-full text-left p-2.5 rounded-lg flex items-center justify-between transition-all outline-none cursor-pointer border ${
                            focusedIndex === availableModes.length
                              ? "bg-surface-hover/90 border-border text-ink shadow-2xs"
                              : "border-border-hairline/60 bg-surface/40 hover:bg-surface-hover/80 hover:border-border text-ink"
                          } group focus-visible:ring-1 focus-visible:ring-brand`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`w-7 h-7 rounded-md border flex items-center justify-center flex-shrink-0 transition-colors ${
                                starsEnabled
                                  ? "bg-amber-500/10 dark:bg-amber-400/15 border-amber-500/30 text-amber-500 dark:text-amber-400"
                                  : "bg-surface-hover/70 dark:bg-zinc-800/70 border-border-hairline text-muted-foreground/50"
                              }`}
                              aria-hidden="true"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-mono text-xs font-bold uppercase text-ink tracking-wider truncate">
                                Stars Background
                              </span>
                              <span className="font-sans text-[11px] text-muted-foreground leading-tight mt-0.5 truncate">
                                Subtle cosmic starfield
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5 flex-shrink-0 ml-2">
                            <span
                              className={`font-mono text-[9px] font-semibold tracking-wider px-1.5 py-0.5 rounded border transition-colors ${
                                starsEnabled
                                  ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-600 dark:text-emerald-400"
                                  : "bg-surface-hover/80 dark:bg-zinc-800/80 border-border-hairline text-muted-foreground/70"
                              }`}
                            >
                              {starsEnabled ? "[ ON ]" : "[ OFF ]"}
                            </span>
                            <div
                              className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border p-0.5 transition-colors duration-200 ease-in-out ${
                                starsEnabled
                                  ? "bg-emerald-500 border-emerald-600 dark:border-emerald-400/40 shadow-xs"
                                  : "bg-zinc-200 dark:bg-zinc-700/90 border-zinc-300 dark:border-zinc-600 shadow-inner"
                              }`}
                              aria-hidden="true"
                            >
                              <span
                                className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                                  starsEnabled ? "translate-x-4" : "translate-x-0"
                                }`}
                              />
                            </div>
                          </div>
                        </button>

                        {/* Flickering Grid Toggle */}
                        <button
                          ref={(el) => {
                            optionRefs.current[availableModes.length + 1] = el;
                          }}
                          type="button"
                          role="switch"
                          aria-checked={gridEnabled}
                          tabIndex={focusedIndex === availableModes.length + 1 ? 0 : -1}
                          aria-label="Toggle Flickering Grid"
                          onClick={(e) => {
                            e.stopPropagation();
                            playClick();
                            toggleGrid();
                          }}
                          onMouseEnter={() => {
                            playHover();
                            setFocusedIndex(availableModes.length + 1);
                          }}
                          className={`w-full text-left p-2.5 rounded-lg flex items-center justify-between transition-all outline-none cursor-pointer border ${
                            focusedIndex === availableModes.length + 1
                              ? "bg-surface-hover/90 border-border text-ink shadow-2xs"
                              : "border-border-hairline/60 bg-surface/40 hover:bg-surface-hover/80 hover:border-border text-ink"
                          } group focus-visible:ring-1 focus-visible:ring-brand`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`w-7 h-7 rounded-md border flex items-center justify-center flex-shrink-0 transition-colors ${
                                gridEnabled
                                  ? "bg-cyan-500/10 dark:bg-cyan-400/15 border-cyan-500/30 text-cyan-600 dark:text-cyan-400"
                                  : "bg-surface-hover/70 dark:bg-zinc-800/70 border-border-hairline text-muted-foreground/50"
                              }`}
                              aria-hidden="true"
                            >
                              <Grid className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-mono text-xs font-bold uppercase text-ink tracking-wider truncate">
                                Flickering Grid
                              </span>
                              <span className="font-sans text-[11px] text-muted-foreground leading-tight mt-0.5 truncate">
                                Technical blueprint grid
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5 flex-shrink-0 ml-2">
                            <span
                              className={`font-mono text-[9px] font-semibold tracking-wider px-1.5 py-0.5 rounded border transition-colors ${
                                gridEnabled
                                  ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-600 dark:text-emerald-400"
                                  : "bg-surface-hover/80 dark:bg-zinc-800/80 border-border-hairline text-muted-foreground/70"
                              }`}
                            >
                              {gridEnabled ? "[ ON ]" : "[ OFF ]"}
                            </span>
                            <div
                              className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border p-0.5 transition-colors duration-200 ease-in-out ${
                                gridEnabled
                                  ? "bg-emerald-500 border-emerald-600 dark:border-emerald-400/40 shadow-xs"
                                  : "bg-zinc-200 dark:bg-zinc-700/90 border-zinc-300 dark:border-zinc-600 shadow-inner"
                              }`}
                              aria-hidden="true"
                            >
                              <span
                                className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                                  gridEnabled ? "translate-x-4" : "translate-x-0"
                                }`}
                              />
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 2. DEFAULT DOCK VARIANT ANIMATIONS */}
                  {resolvedVariant === "dock" && (
                    <div className="mt-2 pt-2 border-t border-border-divider/70">
                      <div className="px-2.5 py-1 mb-1 flex items-center justify-between">
                        <span className="font-mono text-[10px] text-muted-foreground/70 tracking-widest uppercase">
                          ANIMATIONS
                        </span>
                      </div>
                      <div className="space-y-1">
                        <button
                          ref={(el) => {
                            optionRefs.current[availableModes.length] = el;
                          }}
                          type="button"
                          role="switch"
                          aria-checked={starsEnabled}
                          tabIndex={focusedIndex === availableModes.length ? 0 : -1}
                          aria-label="Toggle Stars Background"
                          onClick={(e) => {
                            e.stopPropagation();
                            playClick();
                            toggleStars();
                          }}
                          onMouseEnter={() => {
                            playHover();
                            setFocusedIndex(availableModes.length);
                          }}
                          className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between transition-colors outline-none cursor-pointer border ${
                            focusedIndex === availableModes.length
                              ? "bg-surface-hover/80 border-border text-ink"
                              : "border-transparent hover:bg-surface-hover/60 text-muted-foreground hover:text-ink"
                          } group`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`w-6 h-6 rounded-md border flex items-center justify-center flex-shrink-0 transition-colors ${
                                starsEnabled
                                  ? "bg-amber-500/10 dark:bg-amber-400/15 border-amber-500/30 text-amber-500 dark:text-amber-400"
                                  : "bg-surface-hover/60 dark:bg-zinc-800/60 border-border-hairline text-muted-foreground/50"
                              }`}
                              aria-hidden="true"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-mono text-xs font-semibold uppercase text-ink">
                                Stars Background
                              </span>
                              <span className="font-sans text-[11px] text-muted-foreground leading-tight mt-0.5">
                                Subtle cosmic starfield
                              </span>
                            </div>
                          </div>

                          {/* Modern Rounded Toggle Switch */}
                          <div
                            className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border p-0.5 transition-colors duration-200 ease-in-out ${
                              starsEnabled
                                ? "bg-emerald-500 border-emerald-600 dark:border-emerald-400/40 shadow-xs"
                                : "bg-zinc-200 dark:bg-zinc-700/90 border-zinc-300 dark:border-zinc-600 shadow-inner"
                            }`}
                            aria-hidden="true"
                          >
                            <span
                              className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                                starsEnabled ? "translate-x-4" : "translate-x-0"
                              }`}
                            />
                          </div>
                        </button>

                        {/* Flickering Grid Toggle */}
                        <button
                          ref={(el) => {
                            optionRefs.current[availableModes.length + 1] = el;
                          }}
                          type="button"
                          role="switch"
                          aria-checked={gridEnabled}
                          tabIndex={focusedIndex === availableModes.length + 1 ? 0 : -1}
                          aria-label="Toggle Flickering Grid"
                          onClick={(e) => {
                            e.stopPropagation();
                            playClick();
                            toggleGrid();
                          }}
                          onMouseEnter={() => {
                            playHover();
                            setFocusedIndex(availableModes.length + 1);
                          }}
                          className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between transition-colors outline-none cursor-pointer border ${
                            focusedIndex === availableModes.length + 1
                              ? "bg-surface-hover/80 border-border text-ink"
                              : "border-transparent hover:bg-surface-hover/60 text-muted-foreground hover:text-ink"
                          } group`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`w-6 h-6 rounded-md border flex items-center justify-center flex-shrink-0 transition-colors ${
                                gridEnabled
                                  ? "bg-cyan-500/10 dark:bg-cyan-400/15 border-cyan-500/30 text-cyan-600 dark:text-cyan-400"
                                  : "bg-surface-hover/60 dark:bg-zinc-800/60 border-border-hairline text-muted-foreground/50"
                              }`}
                              aria-hidden="true"
                            >
                              <Grid className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-mono text-xs font-semibold uppercase text-ink">
                                Flickering Grid
                              </span>
                              <span className="font-sans text-[11px] text-muted-foreground leading-tight mt-0.5">
                                Technical blueprint grid
                              </span>
                            </div>
                          </div>

                          {/* Modern Rounded Toggle Switch */}
                          <div
                            className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border p-0.5 transition-colors duration-200 ease-in-out ${
                              gridEnabled
                                ? "bg-emerald-500 border-emerald-600 dark:border-emerald-400/40 shadow-xs"
                                : "bg-zinc-200 dark:bg-zinc-700/90 border-zinc-300 dark:border-zinc-600 shadow-inner"
                            }`}
                            aria-hidden="true"
                          >
                            <span
                              className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                                gridEnabled ? "translate-x-4" : "translate-x-0"
                              }`}
                            />
                          </div>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 2. FOCUS VARIANT ANIMATIONS */}
                  {resolvedVariant === "focus-nav" && (
                    <div className="mt-2 pt-1.5 border-t border-border-divider">
                      <div className="px-2.5 py-1 mb-0.5 flex items-center justify-between">
                        <span className="font-mono text-[10px] text-muted-foreground/70 tracking-wider uppercase">
                          [ ANIMATIONS ]
                        </span>
                      </div>
                      <button
                        ref={(el) => {
                          optionRefs.current[availableModes.length] = el;
                        }}
                        type="button"
                        role="switch"
                        aria-checked={starsEnabled}
                        tabIndex={focusedIndex === availableModes.length ? 0 : -1}
                        aria-label="Toggle Stars Background"
                        onClick={(e) => {
                          e.stopPropagation();
                          playClick();
                          toggleStars();
                        }}
                        onMouseEnter={() => {
                          playHover();
                          setFocusedIndex(availableModes.length);
                        }}
                        className={`w-full text-left px-2.5 py-2 rounded-sm border transition-colors outline-none cursor-pointer flex items-center justify-between group ${
                          focusedIndex === availableModes.length
                            ? "bg-surface-hover/60 border-border text-ink"
                            : "border-transparent hover:bg-surface-hover/40 text-muted-foreground hover:text-ink"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className={`font-mono text-xs transition-colors ${
                              starsEnabled
                                ? "text-amber-500 dark:text-amber-400"
                                : "text-muted-foreground/50"
                            }`}
                            aria-hidden="true"
                          >
                            ✧
                          </span>
                          <span className="font-mono text-xs font-bold uppercase text-ink/90">
                            STARS BACKGROUND
                          </span>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span
                            className={`font-mono text-[10px] font-bold tracking-wider ${
                              starsEnabled
                                ? "text-emerald-500 dark:text-emerald-400"
                                : "text-muted-foreground/50"
                            }`}
                          >
                            {starsEnabled ? "[ ON ]" : "[ OFF ]"}
                          </span>
                          <div
                            className={`relative inline-flex h-4.5 w-8 flex-shrink-0 cursor-pointer rounded-full border p-0.5 transition-colors duration-150 ${
                              starsEnabled
                                ? "bg-emerald-500 border-emerald-600 dark:border-emerald-400/40"
                                : "bg-zinc-200 dark:bg-zinc-700/90 border-zinc-300 dark:border-zinc-600 shadow-inner"
                            }`}
                            aria-hidden="true"
                          >
                            <span
                              className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-xs transition duration-150 ${
                                starsEnabled ? "translate-x-3.5" : "translate-x-0"
                              }`}
                            />
                          </div>
                        </div>
                      </button>

                      {/* Flickering Grid Toggle */}
                      <button
                        ref={(el) => {
                          optionRefs.current[availableModes.length + 1] = el;
                        }}
                        type="button"
                        role="switch"
                        aria-checked={gridEnabled}
                        tabIndex={focusedIndex === availableModes.length + 1 ? 0 : -1}
                        aria-label="Toggle Flickering Grid"
                        onClick={(e) => {
                          e.stopPropagation();
                          playClick();
                          toggleGrid();
                        }}
                        onMouseEnter={() => {
                          playHover();
                          setFocusedIndex(availableModes.length + 1);
                        }}
                        className={`w-full text-left px-2.5 py-2 rounded-sm border transition-colors outline-none cursor-pointer flex items-center justify-between group mt-0.5 ${
                          focusedIndex === availableModes.length + 1
                            ? "bg-surface-hover/60 border-border text-ink"
                            : "border-transparent hover:bg-surface-hover/40 text-muted-foreground hover:text-ink"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className={`font-mono text-xs transition-colors ${
                              gridEnabled
                                ? "text-cyan-500 dark:text-cyan-400"
                                : "text-muted-foreground/50"
                            }`}
                            aria-hidden="true"
                          >
                            ▦
                          </span>
                          <span className="font-mono text-xs font-bold uppercase text-ink/90">
                            FLICKERING GRID
                          </span>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span
                            className={`font-mono text-[10px] font-bold tracking-wider ${
                              gridEnabled
                                ? "text-emerald-500 dark:text-emerald-400"
                                : "text-muted-foreground/50"
                            }`}
                          >
                            {gridEnabled ? "[ ON ]" : "[ OFF ]"}
                          </span>
                          <div
                            className={`relative inline-flex h-4.5 w-8 flex-shrink-0 cursor-pointer rounded-full border p-0.5 transition-colors duration-150 ${
                              gridEnabled
                                ? "bg-emerald-500 border-emerald-600 dark:border-emerald-400/40"
                                : "bg-zinc-200 dark:bg-zinc-700/90 border-zinc-300 dark:border-zinc-600 shadow-inner"
                            }`}
                            aria-hidden="true"
                          >
                            <span
                              className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-xs transition duration-150 ${
                                gridEnabled ? "translate-x-3.5" : "translate-x-0"
                              }`}
                            />
                          </div>
                        </div>
                      </button>
                    </div>
                  )}

                  {/* 3. MINIMAL VARIANT ANIMATIONS */}
                  {resolvedVariant === "minimal" && (
                    <div className="mt-2.5 pt-2 border-t border-zinc-200/90 dark:border-white/[0.08]">
                      <div className="px-2 pb-1 flex items-center justify-between">
                        <span className="font-serif italic text-xs text-zinc-600 dark:text-[#9e998e]">
                          Animations
                        </span>
                      </div>
                      <button
                        ref={(el) => {
                          optionRefs.current[availableModes.length] = el;
                        }}
                        type="button"
                        role="switch"
                        aria-checked={starsEnabled}
                        tabIndex={focusedIndex === availableModes.length ? 0 : -1}
                        aria-label="Toggle Stars Background"
                        onClick={(e) => {
                          e.stopPropagation();
                          playClick();
                          toggleStars();
                        }}
                        onMouseEnter={() => {
                          playHover();
                          setFocusedIndex(availableModes.length);
                        }}
                        className={`w-full text-left py-1.5 px-2 rounded-none transition-colors outline-none cursor-pointer flex items-center justify-between ${
                          focusedIndex === availableModes.length
                            ? "bg-zinc-100 dark:bg-white/[0.05] text-zinc-950 dark:text-[#ede9e2]"
                            : "text-zinc-600 dark:text-[#a8a399] hover:bg-zinc-100/60 dark:hover:bg-white/[0.04] hover:text-zinc-950 hover:dark:text-[#ede9e2]"
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-xs select-none transition-colors ${
                              starsEnabled
                                ? "text-amber-500/90 dark:text-amber-300/80"
                                : "text-zinc-400 dark:text-[#6a665e]"
                            }`}
                            aria-hidden="true"
                          >
                            ✧
                          </span>
                          <span className="font-serif text-sm font-medium text-zinc-900 dark:text-[#ede9e2]">
                            Stars Background
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-serif italic text-[11px] text-zinc-500 dark:text-[#9c978e]">
                            {starsEnabled ? "(on)" : "(off)"}
                          </span>
                          <div
                            className={`relative inline-flex h-4.5 w-8 flex-shrink-0 cursor-pointer rounded-full border p-0.5 transition-colors duration-200 ${
                              starsEnabled
                                ? "bg-zinc-800 dark:bg-zinc-300 border-zinc-900 dark:border-zinc-200"
                                : "bg-zinc-200 dark:bg-zinc-700 border-zinc-300 dark:border-zinc-600 shadow-inner"
                            }`}
                            aria-hidden="true"
                          >
                            <span
                              className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white dark:bg-zinc-900 shadow-xs transition duration-200 ${
                                starsEnabled ? "translate-x-3.5" : "translate-x-0"
                              }`}
                            />
                          </div>
                        </div>
                      </button>

                      {/* Flickering Grid Toggle */}
                      <button
                        ref={(el) => {
                          optionRefs.current[availableModes.length + 1] = el;
                        }}
                        type="button"
                        role="switch"
                        aria-checked={gridEnabled}
                        tabIndex={focusedIndex === availableModes.length + 1 ? 0 : -1}
                        aria-label="Toggle Flickering Grid"
                        onClick={(e) => {
                          e.stopPropagation();
                          playClick();
                          toggleGrid();
                        }}
                        onMouseEnter={() => {
                          playHover();
                          setFocusedIndex(availableModes.length + 1);
                        }}
                        className={`w-full text-left py-1.5 px-2 rounded-none transition-colors outline-none cursor-pointer flex items-center justify-between mt-0.5 ${
                          focusedIndex === availableModes.length + 1
                            ? "bg-zinc-100 dark:bg-white/[0.05] text-zinc-950 dark:text-[#ede9e2]"
                            : "text-zinc-600 dark:text-[#a8a399] hover:bg-zinc-100/60 dark:hover:bg-white/[0.04] hover:text-zinc-950 hover:dark:text-[#ede9e2]"
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-xs select-none transition-colors ${
                              gridEnabled
                                ? "text-cyan-500/90 dark:text-cyan-300/80"
                                : "text-zinc-400 dark:text-[#6a665e]"
                            }`}
                            aria-hidden="true"
                          >
                            ▦
                          </span>
                          <span className="font-serif text-sm font-medium text-zinc-900 dark:text-[#ede9e2]">
                            Flickering Grid
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-serif italic text-[11px] text-zinc-500 dark:text-[#9c978e]">
                            {gridEnabled ? "(on)" : "(off)"}
                          </span>
                          <div
                            className={`relative inline-flex h-4.5 w-8 flex-shrink-0 cursor-pointer rounded-full border p-0.5 transition-colors duration-200 ${
                              gridEnabled
                                ? "bg-zinc-800 dark:bg-zinc-300 border-zinc-900 dark:border-zinc-200"
                                : "bg-zinc-200 dark:bg-zinc-700 border-zinc-300 dark:border-zinc-600 shadow-inner"
                            }`}
                            aria-hidden="true"
                          >
                            <span
                              className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white dark:bg-zinc-900 shadow-xs transition duration-200 ${
                                gridEnabled ? "translate-x-3.5" : "translate-x-0"
                              }`}
                            />
                          </div>
                        </div>
                      </button>
                    </div>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}

export default PresentationModeSwitcher;
