"use client";

import React, { useEffect, useReducer, useRef } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { useUISound } from "@/context/SoundContext";
import { MarginArtifactSlot } from "../MarginArtifactSlot";
import { createPolaroidAudio, type PolaroidAudioAdapter } from "./polaroidAudio";
import {
  INITIAL_POLAROID_STATE,
  POLAROID_EJECT_MS,
  POLAROID_FLASH_MS,
  polaroidReducer,
} from "./polaroidState";
import { PolaroidCameraSprite, PolaroidPhotoCard } from "./PolaroidPixelArt";
import styles from "./PolaroidGutter.module.css";

interface PolaroidGutterProps {
  className?: string;
}

/**
 * PolaroidGutter
 *
 * Interactive vintage pixel Polaroid camera anchored in the left 96px blueprint
 * bay beside Moments & Events. Click fires a xenon flash + shutter/motor audio
 * and prints a developing miniature pixel memory (Shift+Click for sepia film).
 */
export function PolaroidGutter({ className = "" }: PolaroidGutterProps) {
  const { resolvedTheme } = useTheme();
  const { isSoundEnabled, playHover } = useUISound();
  const [state, dispatch] = useReducer(polaroidReducer, INITIAL_POLAROID_STATE);
  const audioRef = useRef<PolaroidAudioAdapter | null>(null);

  const isDark = resolvedTheme === "dark";
  const isFlashing = state.phase === "flashing";
  const showPhoto = state.phase === "ejecting" || state.phase === "developed";

  const getAudio = () => {
    if (!audioRef.current) {
      audioRef.current = createPolaroidAudio();
    }
    return audioRef.current;
  };

  useEffect(() => {
    if (state.phase === "flashing") {
      const timer = setTimeout(() => {
        dispatch({ type: "FLASH_COMPLETE" });
      }, POLAROID_FLASH_MS);
      return () => clearTimeout(timer);
    }

    if (state.phase === "ejecting") {
      const timer = setTimeout(() => {
        dispatch({ type: "EJECT_COMPLETE" });
      }, POLAROID_EJECT_MS);
      return () => clearTimeout(timer);
    }
  }, [state.phase, state.snapCount]);

  useEffect(() => {
    return () => {
      audioRef.current?.dispose();
      audioRef.current = null;
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (state.phase === "flashing" || state.phase === "ejecting") return;

    if (isSoundEnabled) {
      getAudio().playShutterAndEject();
    }

    dispatch({ type: "SNAP", shiftKey: e.shiftKey });
  };

  const label =
    state.snapCount === 0 ? "Snap a Polaroid photo" : "Snap next Polaroid memory";

  return (
    <MarginArtifactSlot side="left" className={className}>
      {/* Xenon camera flash light pool */}
      <div
        aria-hidden="true"
        className={`${styles.flashRig} ${
          isDark ? styles.flashDark : styles.flashLight
        } ${state.filmMode === "sepia" ? styles.flashSepia : styles.flashColor} ${
          isFlashing ? styles.flashRigActive : ""
        }`}
      >
        <div className={styles.flashBurst} />
      </div>

      {/* Tilted interactive Polaroid camera */}
      <button
        type="button"
        onClick={handleClick}
        onMouseEnter={playHover}
        aria-label={label}
        title={label}
        className={styles.polaroidButton}
      >
        {/* Ejecting developing miniature Polaroid print */}
        {showPhoto && (
          <div aria-hidden="true" className={styles.photoSlot}>
            <div key={state.snapCount} className={styles.photoPrint}>
              <PolaroidPhotoCard
                sceneIndex={state.sceneIndex}
                filmMode={state.filmMode}
              />
            </div>
          </div>
        )}

        <PolaroidCameraSprite phase={state.phase} isDark={isDark} />
      </button>
    </MarginArtifactSlot>
  );
}

export default PolaroidGutter;
