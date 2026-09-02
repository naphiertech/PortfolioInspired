"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, LayoutTemplate } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { usePresentationMode } from "../context/PresentationModeContext";
import { PRESENTATION_MODES } from "../types/config";
import { PresentationMode } from "../types/presentation";
import { useUISound } from "@/context/SoundContext";
import { useViewHint } from "../hooks/useViewHint";

interface PresentationModeSwitcherProps {
  variant?: "dock" | "focus-nav" | "minimal";
  className?: string;
}

/**
 * PresentationModeSwitcher
 *
 * Presentation-aware switcher supporting three placement variants:
 * 1. "dock": Separate circular floating button beside the bottom NavigationDock (Default Mode).
 * 2. "focus-nav": Solid/near-solid technical control inside the Focus top navigation header (Focus Mode).
 * 3. "minimal": Quiet, understated control inside the Minimal header (Minimal Mode).
 */
export function PresentationModeSwitcher({
  variant = "dock",
  className = "",
}: PresentationModeSwitcherProps) {
  const { mode, setMode } = usePresentationMode();
  const { playClick, playHover } = useUISound();
  const { hasDismissedHint, dismissHint } = useViewHint();
  const shouldReduceMotion = useReducedMotion();

  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Only render active, implemented modes (Default, Focus, Minimal)
  const availableModes = Object.values(PRESENTATION_MODES).filter(
    (m) => m.isAvailable
  );

  const currentConfig = PRESENTATION_MODES[mode] || PRESENTATION_MODES.default;

  const closePopover = useCallback(() => {
    setIsOpen(false);
    setFocusedIndex(-1);
  }, []);

  // Close when clicking outside container
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        closePopover();
      }
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
      closePopover();

      if (newMode === mode) {
        return;
      }

      // Universal in-place switch: reset scroll to top immediately during layout transition
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "instant" });
      }
      setMode(newMode);
    },
    [mode, setMode, playClick, closePopover, dismissHint]
  );

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
        setFocusedIndex((prev) => (prev + 1) % availableModes.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev <= 0 ? availableModes.length - 1 : prev - 1
        );
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < availableModes.length) {
          handleSelectMode(availableModes[focusedIndex].id);
        }
        break;
      case "Escape":
      case "Tab":
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
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      className={`relative select-none flex items-center ${className}`}
    >
      {/* 1. DOCK VARIANT: Circular button beside the main navigation dock */}
      {variant === "dock" && (
        <>
          {/* Subtle contextual hint pointing rightward toward the circular button */}
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

      {/* 2. FOCUS NAV VARIANT: Solid/near-solid dropdown button in Focus top header */}
      {variant === "focus-nav" && (
        <div className="relative inline-flex flex-col items-center">
          <button
            ref={triggerRef}
            type="button"
            onClick={handleToggleOpen}
            onMouseEnter={playHover}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-label={`Presentation mode: ${currentConfig.shortLabel || currentConfig.label}. Click to switch.`}
            className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md bg-surface border border-border-hairline text-ink/90 hover:bg-surface-hover hover:border-border hover:text-ink shadow-xs text-xs font-mono tracking-wider transition-colors outline-none focus-visible:ring-1 focus-visible:ring-brand cursor-pointer ${
              isOpen ? "border-border text-ink bg-surface-hover" : ""
            }`}
          >
            <LayoutTemplate className="w-3.5 h-3.5 text-muted-foreground/80 flex-shrink-0" />
            <span className="text-emerald-500 text-[9px]" aria-hidden="true">
              ●
            </span>
            <span className="font-semibold uppercase text-[11px]">
              VIEW: {currentConfig.shortLabel || currentConfig.label}
            </span>
            <ChevronDown
              className={`w-3 h-3 text-muted-foreground/60 transition-transform duration-150 ${
                isOpen ? "rotate-180 text-ink" : ""
              }`}
              aria-hidden="true"
            />
          </button>

          {/* Contextual hint directly BELOW the VIEW: FOCUS control, pointing UPWARD */}
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

      {/* 3. MINIMAL VARIANT: Quiet, understated text trigger */}
      {variant === "minimal" && (
        <button
          ref={triggerRef}
          type="button"
          onClick={handleToggleOpen}
          onMouseEnter={playHover}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={`Presentation mode: ${currentConfig.label}. Click to switch.`}
          className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-mono text-zinc-600 dark:text-[#9e998e] hover:text-zinc-900 hover:dark:text-[#dedad0] transition-colors outline-none cursor-pointer border border-transparent hover:border-zinc-200 dark:hover:border-white/[0.08] ${
            isOpen ? "border-zinc-200 dark:border-white/[0.08] text-zinc-900 dark:text-[#eae6df] bg-zinc-100 dark:bg-[#141514]" : ""
          }`}
        >
          <span>View</span>
          <ChevronDown
            className={`w-3 h-3 text-zinc-400 dark:text-[#827d73] transition-transform duration-150 ${
              isOpen ? "rotate-180 text-zinc-900 dark:text-[#eae6df]" : ""
            }`}
            aria-hidden="true"
          />
        </button>
      )}

      {/* Popover Listbox */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="listbox"
            aria-label="Available Presentation Modes"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              duration: shouldReduceMotion ? 0.05 : 0.18,
              ease: [0.23, 1, 0.32, 1] as const,
            }}
            style={{
              transformOrigin:
                variant === "dock"
                  ? "bottom left"
                  : "top right",
            }}
            className={`absolute w-60 sm:w-64 p-1 rounded-md bg-page border border-border-hairline shadow-tactile outline-none z-50 pointer-events-auto will-change-[transform,opacity] ${
              variant === "dock"
                ? "bottom-full mb-3 left-0 sm:left-auto sm:right-0"
                : "top-full mt-1.5 right-0"
            }`}
          >
            {/* Popover Header */}
            <div className="px-2.5 py-1 border-b border-border-divider mb-1">
              <span className="font-mono text-[10px] text-muted-foreground/60 tracking-widest uppercase">
                VIEW MODE
              </span>
            </div>

            {/* Mode Options */}
            <div className="space-y-0.5">
              {availableModes.map((item, index) => {
                const isSelected = item.id === mode;
                const isFocused = index === focusedIndex;

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
                    className={`w-full text-left px-2.5 py-2 rounded flex items-start gap-2.5 transition-colors outline-none cursor-pointer ${
                      isSelected
                        ? "bg-surface text-ink font-medium"
                        : isFocused
                        ? "bg-surface-hover/80 text-ink"
                        : "text-muted-foreground hover:bg-surface-hover/60 hover:text-ink"
                    }`}
                  >
                    {/* Status Indicator Icon */}
                    <span
                      className={`text-xs mt-0.5 flex-shrink-0 ${
                        isSelected
                          ? item.id === "focus"
                            ? "text-emerald-500 font-bold"
                            : "text-brand font-bold"
                          : "text-muted-foreground/40"
                      }`}
                      aria-hidden="true"
                    >
                      {isSelected ? "●" : "○"}
                    </span>

                    {/* Text Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-semibold uppercase text-ink">
                          {item.label}
                        </span>
                        {isSelected && (
                          <span className="font-mono text-[9px] text-muted-foreground/60 uppercase tracking-widest">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <p className="font-sans text-[11px] text-muted-foreground leading-snug mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default PresentationModeSwitcher;
