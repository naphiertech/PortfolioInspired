"use client";

import React, { useEffect, useReducer, useRef } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { useUISound } from "@/context/SoundContext";
import { MarginArtifactSlot } from "../MarginArtifactSlot";
import { createCampfireAudio, type CampfireAudioAdapter } from "./campfireAudio";
import {
  campfireReducer,
  DOUSE_DURATION_MS,
  IGNITE_DURATION_MS,
  INITIAL_CAMPFIRE_STATE,
  isCampfireActive,
} from "./campfireState";
import { CampfirePixelArt } from "./CampfirePixelArt";
import styles from "./CampfireGutter.module.css";

interface CampfireGutterProps {
  className?: string;
}

/**
 * CampfireGutter
 *
 * Interactive Minecraft Oak Campfire anchored in the right 96px blueprint bay
 * beside <FIELD-NOTES/>. Click to ignite/extinguish; Shift+Click for Soul Fire.
 */
export function CampfireGutter({ className = "" }: CampfireGutterProps) {
  const { resolvedTheme } = useTheme();
  const { isSoundEnabled, playHover } = useUISound();
  const [state, dispatch] = useReducer(campfireReducer, INITIAL_CAMPFIRE_STATE);
  const audioRef = useRef<CampfireAudioAdapter | null>(null);

  const isDark = resolvedTheme === "dark";
  const isBurning = isCampfireActive(state.phase);
  const isLit = state.phase === "lit";
  const isIgniting = state.phase === "igniting";
  const isDousing = state.phase === "dousing";

  const getAudio = () => {
    if (!audioRef.current) {
      audioRef.current = createCampfireAudio();
    }
    return audioRef.current;
  };

  useEffect(() => {
    if (state.phase === "igniting") {
      const timer = setTimeout(() => {
        dispatch({ type: "IGNITE_COMPLETE" });
      }, IGNITE_DURATION_MS);
      return () => clearTimeout(timer);
    }

    if (state.phase === "dousing") {
      const timer = setTimeout(() => {
        dispatch({ type: "DOUSE_COMPLETE" });
      }, DOUSE_DURATION_MS);
      return () => clearTimeout(timer);
    }
  }, [state.phase]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!isLit || !isSoundEnabled) {
      audio?.stopCrackle();
      return;
    }

    const activeAudio = getAudio();
    if (document.visibilityState === "visible") {
      activeAudio.startCrackle(state.variant);
    }

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        activeAudio.stopCrackle();
      } else if (isLit && isSoundEnabled) {
        activeAudio.startCrackle(state.variant);
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      activeAudio.stopCrackle();
    };
  }, [isLit, isSoundEnabled, state.variant]);

  useEffect(() => {
    return () => {
      audioRef.current?.dispose();
      audioRef.current = null;
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    const wantSoul = e.shiftKey;
    const willIgnite =
      state.phase === "unlit" ||
      state.phase === "dousing" ||
      (state.phase === "lit" && wantSoul);

    const nextVariant =
      state.phase === "lit" && wantSoul
        ? state.variant === "classic"
          ? "soul"
          : "classic"
        : wantSoul
          ? "soul"
          : "classic";

    if (isSoundEnabled) {
      const audio = getAudio();
      if (willIgnite) {
        audio.playIgnite(nextVariant);
      } else if (state.phase === "lit") {
        audio.playDouse();
      }
    }

    dispatch({ type: "CLICK", shiftKey: wantSoul });
  };

  const label = isBurning
    ? state.variant === "soul"
      ? "Extinguish soul campfire"
      : "Extinguish campfire"
    : "Light campfire";

  return (
    <MarginArtifactSlot side="right" className={className}>
      {/* Realistic multi-layer radial ambient firelight pool */}
      <div
        aria-hidden="true"
        className={`${styles.lightRig} ${
          isDark ? styles.lightRigDark : styles.lightRigLight
        } ${
          state.variant === "soul" ? styles.lightRigSoul : styles.lightRigClassic
        } ${isBurning ? styles.lightRigActive : ""} ${
          isIgniting ? styles.lightRigIgniting : ""
        }`}
      >
        <div className={styles.ambientSpill} />
        <div className={styles.hearthGlow} />
        <div className={styles.groundBounce} />
      </div>

      {/* Tilted interactive Minecraft Oak Campfire block */}
      <button
        type="button"
        onClick={handleClick}
        onMouseEnter={playHover}
        aria-label={label}
        aria-pressed={isBurning}
        title={label}
        className={styles.campfireButton}
      >
        {(isLit || isDousing) && (
          <div
            aria-hidden="true"
            className={`${styles.smokeOverlay} ${
              isDark ? styles.smokeDark : styles.smokeLight
            }`}
          >
            {isLit && (
              <>
                <span className={`${styles.smokePuff} ${styles.smokePuff1}`} />
                <span className={`${styles.smokePuff} ${styles.smokePuff2}`} />
                <span className={`${styles.smokePuff} ${styles.smokePuff3}`} />
                <span className={`${styles.smokePuff} ${styles.smokePuff4}`} />
                <span
                  className={`${styles.emberPixel} ${styles.ember1} ${
                    state.variant === "soul" ? styles.emberSoul : styles.emberClassic
                  }`}
                />
                <span
                  className={`${styles.emberPixel} ${styles.ember2} ${
                    state.variant === "soul" ? styles.emberSoul : styles.emberClassic
                  }`}
                />
                <span
                  className={`${styles.emberPixel} ${styles.ember3} ${
                    state.variant === "soul" ? styles.emberSoul : styles.emberClassic
                  }`}
                />
              </>
            )}

            {isDousing && (
              <>
                <span className={styles.dousePuff} />
                <span className={`${styles.dousePuff} ${styles.dousePuff2}`} />
                <span className={`${styles.dousePuff} ${styles.dousePuff3}`} />
              </>
            )}
          </div>
        )}

        <CampfirePixelArt
          phase={state.phase}
          variant={state.variant}
          isDark={isDark}
        />
      </button>
    </MarginArtifactSlot>
  );
}

export default CampfireGutter;
