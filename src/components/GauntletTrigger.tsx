"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSnap } from "@/context/SnapContext";
import { useUISound } from "@/context/SoundContext";
import styles from "./GauntletTrigger.module.css";

type GloveMode = "idle" | "snap" | "settled" | "time";

export function GauntletTrigger() {
  const { isSnapped, isSnapping, isRestoring, triggerSnap, triggerRestore } = useSnap();
  const { isSoundEnabled, playSnap, playRestore, playHover } = useUISound();

  const [mode, setMode] = useState<GloveMode>("idle");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const snapAudioRef = useRef<HTMLAudioElement | null>(null);
  const timeAudioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize and observe dark mode on document element
  useEffect(() => {
    const checkDark = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };
    checkDark();

    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Preload authentic Thanos audio assets locally with error safety
  useEffect(() => {
    try {
      const snapAudio = new Audio("/easter-egg/thanos/thanos_snap_sound.mp3");
      snapAudio.preload = "auto";
      snapAudioRef.current = snapAudio;

      const timeAudio = new Audio("/easter-egg/thanos/thanos_reverse_sound.mp3");
      timeAudio.preload = "auto";
      timeAudioRef.current = timeAudio;
    } catch {
      // Audio preloading prevented or unsupported
    }
  }, []);

  // Keep internal glove state synchronized with global snap session
  useEffect(() => {
    if (isSnapped && mode !== "time" && mode !== "snap") {
      setMode("settled");
    } else if (!isSnapped && !isSnapping && !isRestoring && mode === "settled") {
      setMode("idle");
    }
  }, [isSnapped, isSnapping, isRestoring, mode]);

  const isBusy = mode === "snap" || mode === "time" || isSnapping || isRestoring;

  // Play audio with fallback to SoundContext
  const playThanosAudio = useCallback(
    (type: "snap" | "time") => {
      if (!isSoundEnabled) return;
      try {
        const audio = type === "snap" ? snapAudioRef.current : timeAudioRef.current;
        if (audio) {
          audio.currentTime = 0;
          audio.play().catch(() => {
            // If HTMLAudioElement play fails, trigger synthetic fallback
            if (type === "snap") playSnap();
            else playRestore();
          });
        } else {
          if (type === "snap") playSnap();
          else playRestore();
        }
      } catch {
        if (type === "snap") playSnap();
        else playRestore();
      }
    },
    [isSoundEnabled, playSnap, playRestore]
  );

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isBusy) return;

    if (isSnapped || mode === "settled") {
      // 2. RESTORE ACTION: Play Time Stone animation (thanos_time.png, 48 frames, 2.25s)
      setMode("time");
      playThanosAudio("time");

      // Mid-mandala trigger: at 1000ms peak sacred geometry rotation, initiate section restoration
      setTimeout(() => {
        triggerRestore();
      }, 1000);
    } else {
      // 1. SNAP ACTION: Play Snap animation (thanos_snap.png, 48 frames, 2.25s)
      setMode("snap");
      playThanosAudio("snap");
    }
  };

  const handleAnimationEnd = () => {
    if (mode === "snap") {
      // Snap animation completed (2.25s): glove enters settled pose, destruction initiates
      setMode("settled");
      triggerSnap({ skipSound: true, delayMs: 150 });
    } else if (mode === "time") {
      // Time Stone restore animation completed: return to idle
      setMode("idle");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick(e as unknown as React.MouseEvent);
    }
  };

  // Resolve appropriate sprite CSS class based on mode and current theme
  let spriteClass = "";
  if (mode === "idle" || mode === "settled") {
    spriteClass = isDarkMode ? styles.idleDark : styles.idleLight;
  } else if (mode === "snap") {
    spriteClass = isDarkMode ? styles.snapDark : styles.snapLight;
  } else if (mode === "time") {
    spriteClass = isDarkMode ? styles.timeDark : styles.timeLight;
  }

  const tooltipLabel =
    isSnapped || mode === "settled"
      ? "Gauntlet: Click to Restore"
      : isBusy
      ? "Gauntlet active..."
      : "Thanos Infinity Gauntlet — Click to Snap";

  return (
    <button
      type="button"
      className={styles.gauntletWrapper}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => {
        if (!isBusy) playHover();
      }}
      aria-label={tooltipLabel}
      title={tooltipLabel}
      tabIndex={0}
    >
      <div
        className={`${styles.spriteFrame} ${spriteClass}`}
        onAnimationEnd={handleAnimationEnd}
      />
    </button>
  );
}

export default GauntletTrigger;
