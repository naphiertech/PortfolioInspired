"use client";

import { useCallback, useEffect, useId, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from "framer-motion";
import { usePresentationMode } from "@/features/presentation-modes/context/PresentationModeContext";
import { useCreativeMode } from "../context/CreativeModeContext";
import { SlidersHorizontal } from "lucide-react";
import { CreativeModePanel } from "./CreativeModePanel";
import styles from "../creativeMode.module.css";
import { supportsCreativeMode } from "../lib/creativeModeConfig";

function StyleLauncher({ triggerRef, panelId, panelOpen, onClick }: {
  triggerRef: RefObject<HTMLButtonElement | null>;
  panelId: string;
  panelOpen: boolean;
  onClick: () => void;
}) {
  const isPresent = useIsPresent();
  const reducedMotion = useReducedMotion();
  return (
    <motion.button
      ref={triggerRef}
      type="button"
      aria-label="Open Creative Mode style controls"
      aria-expanded={panelOpen}
      aria-controls={panelId}
      aria-hidden={!isPresent}
      disabled={!isPresent}
      onClick={onClick}
      initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: reducedMotion ? 0 : 10 }}
      transition={{ duration: reducedMotion ? 0.05 : 0.24, ease: "easeOut" }}
      style={{ pointerEvents: isPresent ? "auto" : "none" }}
      className={`tactile-btn gap-1.5 sm:gap-2 h-8 sm:h-9 px-2.5 sm:px-3.5 rounded-full shadow-lg border border-border-hairline bg-surface/95 backdrop-blur-md cursor-pointer ${styles.launcher}`}
    >
      <SlidersHorizontal className="w-3.5 h-3.5 text-brand/80" aria-hidden="true" />
      <span className="text-[11px] sm:text-xs font-sans font-medium">Style</span>
    </motion.button>
  );
}

export function CreativeModeHost() {
  const { mode } = usePresentationMode();
  const { state, panelOpen, setPanelOpen } = useCreativeMode();
  const [mounted, setMounted] = useState(false);
  const reducedMotion = useReducedMotion();
  const previouslyEnabled = useRef(state.enabled);
  const [showConfetti, setShowConfetti] = useState(false);
  const hostRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const closePanel = useCallback(() => {
    setPanelOpen(false);
    triggerRef.current?.focus();
  }, [setPanelOpen]);

  useEffect(() => setMounted(true), []);
  // A mode switch must never replay a still-mounted activation burst.
  useEffect(() => setShowConfetti(false), [mode]);
  useEffect(() => {
    if (state.enabled && !previouslyEnabled.current && !reducedMotion) setShowConfetti(true);
    if (!state.enabled || reducedMotion) setShowConfetti(false);
    previouslyEnabled.current = state.enabled;
  }, [state.enabled, reducedMotion]);

  useEffect(() => {
    if (!mounted || !supportsCreativeMode(mode)) return;
    const chatLauncher = document.querySelector<HTMLElement>("[data-ai-chat-launcher]");
    const host = hostRef.current;
    if (!chatLauncher || !host) return;
    const alignLaunchers = () => {
      const bounds = chatLauncher.getBoundingClientRect();
      host.style.setProperty("--creative-launcher-right", `${window.innerWidth - bounds.left + 12}px`);
      host.style.bottom = `${window.innerHeight - bounds.bottom}px`;
    };
    alignLaunchers();
    const observer = new ResizeObserver(alignLaunchers);
    observer.observe(chatLauncher);
    window.addEventListener("resize", alignLaunchers);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", alignLaunchers);
    };
  }, [mounted, mode, state.enabled]);
  useEffect(() => {
    if (!supportsCreativeMode(mode) || !state.enabled || !panelOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !event.defaultPrevented) closePanel();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !hostRef.current?.contains(event.target)) setPanelOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [mode, state.enabled, panelOpen, closePanel, setPanelOpen]);

  if (!mounted || !supportsCreativeMode(mode)) return null;
  return createPortal(
    <div ref={hostRef} className={styles.host}>
      {showConfetti && !reducedMotion && (
        <div className={styles.confetti} aria-hidden="true">
          {[-48, -36, -24, -12, 0, 12, 24, 36, 48].map((x, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, x: 0, y: 0, rotate: 0 }}
              animate={{ opacity: [0, 0.65, 0], x: [0, x, x * 1.15], y: [0, -78 - (index % 3) * 14, -28], rotate: x * 4 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              onAnimationComplete={index === 8 ? () => setShowConfetti(false) : undefined}
            />
          ))}
        </div>
      )}
      <AnimatePresence>
        {state.enabled && panelOpen && <CreativeModePanel key="panel" id={panelId} onClose={closePanel} />}
        {state.enabled && (
          <StyleLauncher
            key="launcher"
            triggerRef={triggerRef}
            panelId={panelId}
            panelOpen={panelOpen}
            onClick={() => setPanelOpen(!panelOpen)}
          />
        )}
      </AnimatePresence>
    </div>,
    document.body,
  );
}
