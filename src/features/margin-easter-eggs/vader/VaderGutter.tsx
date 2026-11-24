"use client";

import React, { useEffect, useReducer, useRef } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { useUISound } from "@/context/SoundContext";
import { MarginArtifactSlot } from "../MarginArtifactSlot";
import { createVaderAudio, type VaderAudioAdapter } from "./vaderAudio";
import {
  INITIAL_VADER_STATE,
  isSaberActive,
  SABER_IGNITE_MS,
  SABER_RETRACT_MS,
  vaderReducer,
} from "./vaderState";
import { VaderPixelArt } from "./VaderPixelArt";
import styles from "./VaderGutter.module.css";

interface VaderGutterProps {
  className?: string;
}

/**
 * VaderGutter
 *
 * Interactive pixel-art Darth Vader anchored in the left 96px blueprint bay
 * beside <SELECTED-PROJECTS/>. Click to ignite/retract his crimson lightsaber
 * with Star Wars sound synthesis and dark-mode ambient glow (Shift+Click for
 * Jedi Blue).
 */
export function VaderGutter({ className = "" }: VaderGutterProps) {
  const { resolvedTheme } = useTheme();
  const { isSoundEnabled, playHover } = useUISound();
  const [state, dispatch] = useReducer(vaderReducer, INITIAL_VADER_STATE);
  const audioRef = useRef<VaderAudioAdapter | null>(null);

  const isDark = resolvedTheme === "dark";
  const isActive = isSaberActive(state.phase);
  const isOn = state.phase === "on";
  const isIgniting = state.phase === "igniting";

  const getAudio = () => {
    if (!audioRef.current) {
      audioRef.current = createVaderAudio();
    }
    return audioRef.current;
  };

  useEffect(() => {
    if (state.phase === "igniting") {
      const timer = setTimeout(() => {
        dispatch({ type: "IGNITE_COMPLETE" });
      }, SABER_IGNITE_MS);
      return () => clearTimeout(timer);
    }

    if (state.phase === "retracting") {
      const timer = setTimeout(() => {
        dispatch({ type: "RETRACT_COMPLETE" });
      }, SABER_RETRACT_MS);
      return () => clearTimeout(timer);
    }
  }, [state.phase]);

  // Synchronize subtle lightsaber hum with active state, mute toggle, and tab visibility
  useEffect(() => {
    const audio = audioRef.current;

    if (!isOn || !isSoundEnabled) {
      audio?.stopHum();
      return;
    }

    const activeAudio = getAudio();
    if (document.visibilityState === "visible") {
      activeAudio.startHum(state.saber);
    }

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        activeAudio.stopHum();
      } else if (isOn && isSoundEnabled) {
        activeAudio.startHum(state.saber);
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      activeAudio.stopHum();
    };
  }, [isOn, isSoundEnabled, state.saber]);

  useEffect(() => {
    return () => {
      audioRef.current?.dispose();
      audioRef.current = null;
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    const wantJedi = e.shiftKey;
    const willIgnite =
      state.phase === "off" ||
      state.phase === "retracting" ||
      (state.phase === "on" && wantJedi);

    const nextSaber =
      state.phase === "on" && wantJedi
        ? state.saber === "sith"
          ? "jedi"
          : "sith"
        : wantJedi
          ? "jedi"
          : "sith";

    if (isSoundEnabled) {
      const audio = getAudio();
      if (willIgnite) {
        audio.playIgnite(nextSaber);
      } else if (state.phase === "on") {
        audio.playRetract(state.saber);
      }
    }

    dispatch({ type: "CLICK", shiftKey: wantJedi });
  };

  const label = isActive
    ? "Retract lightsaber"
    : "Ignite Darth Vader's lightsaber";

  return (
    <MarginArtifactSlot side="left" className={className}>
      {/* Realistic crimson/blue lightsaber ambient glow pool */}
      <div
        aria-hidden="true"
        className={`${styles.lightRig} ${
          isDark ? styles.lightRigDark : styles.lightRigLight
        } ${state.saber === "jedi" ? styles.lightRigJedi : styles.lightRigSith} ${
          isActive ? styles.lightRigActive : ""
        } ${isIgniting ? styles.lightRigIgniting : ""}`}
      >
        <div className={styles.ambientSpill} />
        <div className={styles.bladeBloom} />
      </div>

      {/* Tilted interactive pixel Darth Vader */}
      <button
        type="button"
        onClick={handleClick}
        onMouseEnter={playHover}
        aria-label={label}
        aria-pressed={isActive}
        title={label}
        className={styles.vaderButton}
      >
        <VaderPixelArt
          phase={state.phase}
          saber={state.saber}
          isDark={isDark}
        />
      </button>
    </MarginArtifactSlot>
  );
}

export default VaderGutter;
