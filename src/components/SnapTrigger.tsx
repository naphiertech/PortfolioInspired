"use client";

import React from "react";
import { useSnap } from "@/context/SnapContext";
import { useUISound } from "@/context/SoundContext";
import { SNAP_EASTER_EGG } from "@/lib/siteConfig";

export function SnapTrigger() {
  const { isSnapped, isSnapping, isRestoring, triggerSnap, triggerRestore } =
    useSnap();
  const { playHover } = useUISound();

  const isBusy = isSnapping || isRestoring;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isBusy) return;
    if (isSnapped) {
      triggerRestore();
    } else {
      triggerSnap();
    }
  };

  const fullTriggerText = `${SNAP_EASTER_EGG.triggerLine1} ${SNAP_EASTER_EGG.triggerLine2}`;
  const fullRestoreText = `${SNAP_EASTER_EGG.restoreLine1} ${SNAP_EASTER_EGG.restoreLine2}`;

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseEnter={playHover}
      disabled={isBusy}
      aria-label={isSnapped ? fullRestoreText : fullTriggerText}
      title={isSnapped ? fullRestoreText : fullTriggerText}
      className={`group/snap flex flex-col items-center text-center font-mono text-[10px] sm:text-[11px] leading-[1.25] tracking-tight bg-transparent border-0 p-0 m-0 outline-none select-none transition-all duration-200 cursor-pointer ${
        isSnapped
          ? "text-emerald-500/90 hover:text-emerald-400 dark:text-emerald-400/90 dark:hover:text-emerald-300 font-medium"
          : isBusy
          ? "text-muted-foreground/35 cursor-wait"
          : "text-muted-foreground/50 hover:text-ink dark:text-muted-foreground/45 dark:hover:text-ink"
      }`}
    >
      {isSnapped ? (
        <>
          <span className="whitespace-nowrap">{SNAP_EASTER_EGG.restoreLine1}</span>
          <span className="whitespace-nowrap">{SNAP_EASTER_EGG.restoreLine2}</span>
        </>
      ) : isRestoring ? (
        <>
          <span className="whitespace-nowrap">{SNAP_EASTER_EGG.busyRestoreLine1}</span>
          <span className="whitespace-nowrap">{SNAP_EASTER_EGG.busyRestoreLine2}</span>
        </>
      ) : isSnapping ? (
        <>
          <span className="whitespace-nowrap">{SNAP_EASTER_EGG.busySnapLine1}</span>
          <span className="whitespace-nowrap">{SNAP_EASTER_EGG.busySnapLine2}</span>
        </>
      ) : (
        <>
          <span className="whitespace-nowrap">{SNAP_EASTER_EGG.triggerLine1}</span>
          <span className="whitespace-nowrap">{SNAP_EASTER_EGG.triggerLine2}</span>
        </>
      )}
    </button>
  );
}

export default SnapTrigger;
