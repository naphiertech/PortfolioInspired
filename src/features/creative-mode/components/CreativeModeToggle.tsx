"use client";

import { usePresentationMode } from "@/features/presentation-modes/context/PresentationModeContext";
import { useCreativeMode } from "../context/CreativeModeContext";
import styles from "../creativeMode.module.css";
import { supportsCreativeMode } from "../lib/creativeModeConfig";

export function CreativeModeToggle() {
  const { mode } = usePresentationMode();
  const { state, setEnabled } = useCreativeMode();
  if (!supportsCreativeMode(mode)) return null;
  return (
      <button
        type="button"
        role="switch"
        aria-checked={state.enabled}
        aria-label="Toggle Creative mode"
        onPointerDown={(event) => {
          if (event.pointerType === "touch") event.currentTarget.focus({ preventScroll: true });
        }}
        onClick={() => setEnabled(!state.enabled)}
        className={styles.topToggle}
      >
        <span className={styles.switchTrack} aria-hidden="true">
          <span className={styles.switchKnob} />
        </span>
        <span className={styles.toggleLabel} aria-hidden="true">
          {state.enabled ? "Creative mode ✓" : "Creative mode?"}
        </span>
      </button>
  );
}
