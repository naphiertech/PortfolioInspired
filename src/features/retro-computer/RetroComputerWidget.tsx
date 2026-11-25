"use client";

import React, { useEffect, useReducer, useRef } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { useUISound } from "@/context/SoundContext";
import {
  createRetroComputerAudio,
  type RetroComputerAudioAdapter,
} from "./retroComputerAudio";
import {
  CRT_BOOT_MS,
  CRT_SHUTDOWN_MS,
  INITIAL_RETRO_COMPUTER_STATE,
  isRetroScreenOn,
  retroComputerReducer,
} from "./retroComputerState";
import { RetroComputerPixelArt } from "./RetroComputerPixelArt";
import styles from "./RetroComputer.module.css";

interface RetroComputerWidgetProps {
  className?: string;
}

/**
 * RetroComputerWidget
 *
 * Interactive 2D 1990s CRT computer perched beside the Standard hero bio.
 * Click cycles: Power On (Happy Mac hello) -> Green Phosphor Terminal ->
 * Bouncing Screensaver -> CRT Beam Power-Off. Shift+Click ejects a 3.5" floppy.
 */
export function RetroComputerWidget({
  className = "",
}: RetroComputerWidgetProps) {
  const { resolvedTheme } = useTheme();
  const { isSoundEnabled, playHover } = useUISound();
  const [state, dispatch] = useReducer(
    retroComputerReducer,
    INITIAL_RETRO_COMPUTER_STATE
  );
  const audioRef = useRef<RetroComputerAudioAdapter | null>(null);

  const isDark = resolvedTheme === "dark";
  const screenOn = isRetroScreenOn(state.mode);

  const getAudio = () => {
    if (!audioRef.current) {
      audioRef.current = createRetroComputerAudio();
    }
    return audioRef.current;
  };

  useEffect(() => {
    if (state.mode === "booting") {
      const timer = setTimeout(() => {
        dispatch({ type: "BOOT_COMPLETE" });
      }, CRT_BOOT_MS);
      return () => clearTimeout(timer);
    }

    if (state.mode === "shutting-down") {
      const timer = setTimeout(() => {
        dispatch({ type: "SHUTDOWN_COMPLETE" });
      }, CRT_SHUTDOWN_MS);
      return () => clearTimeout(timer);
    }
  }, [state.mode, state.cycleCount]);

  useEffect(() => {
    return () => {
      audioRef.current?.dispose();
      audioRef.current = null;
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (e.shiftKey) {
      if (isSoundEnabled) {
        getAudio().playFloppy(!state.floppyEjected);
      }
      dispatch({ type: "CLICK", shiftKey: true });
      return;
    }

    if (state.mode === "booting" || state.mode === "shutting-down") return;

    if (isSoundEnabled) {
      const audio = getAudio();
      if (state.mode === "off") audio.playBoot();
      else if (state.mode === "hello") audio.playTerminal();
      else if (state.mode === "terminal") audio.playScreensaver();
      else if (state.mode === "screensaver") audio.playPowerOff();
    }

    dispatch({ type: "CLICK" });
  };

  const modeGlowClass =
    state.mode === "terminal"
      ? styles.modeTerminal
      : state.mode === "screensaver"
        ? styles.modeScreensaver
        : styles.modeHello;

  const label =
    state.mode === "off"
      ? "Power on retro 90s computer"
      : state.mode === "hello"
        ? "Switch retro computer to terminal"
        : state.mode === "terminal"
          ? "Switch retro computer to screensaver"
          : "Power off retro 90s computer";

  return (
    <div className={`${styles.wrapper} ${className}`}>
      {/* Screen-matched CRT phosphor ambient glow in dark mode */}
      <div
        aria-hidden="true"
        className={`${styles.phosphorRig} ${
          isDark ? styles.phosphorDark : styles.phosphorLight
        } ${modeGlowClass} ${screenOn ? styles.phosphorActive : ""}`}
      >
        <div className={styles.phosphorPool} />
      </div>

      <button
        type="button"
        onClick={handleClick}
        onMouseEnter={playHover}
        aria-label={label}
        aria-pressed={screenOn}
        title={`${label} (Shift+Click for floppy)`}
        className={styles.computerButton}
      >
        <RetroComputerPixelArt
          mode={state.mode}
          floppyEjected={state.floppyEjected}
          isDark={isDark}
        />
      </button>
    </div>
  );
}

export default RetroComputerWidget;
