"use client";

import { SlidersHorizontal } from "lucide-react";
import { usePresentationMode } from "@/features/presentation-modes/context/PresentationModeContext";
import { useUISound } from "@/context/SoundContext";
import { useCreativeMode } from "../context/CreativeModeContext";
import styles from "../creativeMode.module.css";
import { supportsCreativeMode } from "../lib/creativeModeConfig";

export interface CreativeModeToggleProps {
  variant?: "default" | "focus" | "minimal";
}

export function CreativeModeToggle({ variant }: CreativeModeToggleProps = {}) {
  const { mode } = usePresentationMode();
  const { state, setEnabled } = useCreativeMode();
  const { playClick } = useUISound();

  if (!supportsCreativeMode(mode)) return null;

  const resolvedVariant: "default" | "focus" | "minimal" =
    variant ?? (mode === "focus" ? "focus" : mode === "minimal" ? "minimal" : "default");

  const isEnabled = state.enabled;

  const variantClasses =
    resolvedVariant === "minimal"
      ? `h-7 w-7 rounded-sm border border-transparent transition-colors duration-150 ${
          isEnabled
            ? "bg-zinc-100/90 dark:bg-white/[0.08] text-zinc-950 dark:text-[#f0ede6]"
            : "bg-transparent text-zinc-500 dark:text-[#8e897f] hover:text-zinc-950 dark:hover:text-[#f0ede6] hover:bg-zinc-100/70 dark:hover:bg-white/[0.05]"
        }`
      : resolvedVariant === "focus"
      ? `h-7 w-7 rounded-[5px] border transition-colors duration-150 ${
          isEnabled
            ? "bg-surface-hover border-ink/25 text-ink"
            : "bg-surface border-border-hairline text-muted-foreground hover:text-ink hover:bg-surface-hover hover:border-border"
        }`
      : `h-[22px] w-[26px] rounded-[4px] border transition-colors duration-150 ${
          isEnabled
            ? "bg-page border-border-hairline text-ink shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
            : "border-transparent bg-transparent text-muted-foreground/70 hover:text-ink hover:bg-surface-hover/50"
        }`;

  const dotClasses =
    resolvedVariant === "minimal"
      ? "bg-zinc-900 dark:bg-[#e5e1d8]"
      : "bg-ink";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isEnabled}
      aria-label={isEnabled ? "Disable Creative mode" : "Enable Creative mode"}
      onPointerDown={(event) => {
        if (event.pointerType === "touch") event.currentTarget.focus({ preventScroll: true });
      }}
      onClick={() => {
        playClick();
        setEnabled(!isEnabled);
      }}
      className={`${styles.topToggle} ${variantClasses}`}
    >
      <SlidersHorizontal
        className="w-3.5 h-3.5"
        strokeWidth={resolvedVariant === "minimal" ? 1.5 : 1.75}
        aria-hidden="true"
      />
      {isEnabled && <span className={`${styles.activeDot} ${dotClasses}`} aria-hidden="true" />}
      <span
        className={`${styles.toggleLabel} ${
          resolvedVariant === "minimal" ? styles.toggleLabelMinimal : ""
        }`}
        aria-hidden="true"
      >
        {isEnabled ? "Creative mode ✓" : "Creative mode"}
      </span>
    </button>
  );
}
