"use client";

import React, { useEffect, useReducer, useRef } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { useUISound } from "@/context/SoundContext";
import { MarginArtifactSlot } from "../MarginArtifactSlot";
import { createDuckAudio, type DuckAudioAdapter } from "./duckAudio";
import {
  DUCK_BUBBLE_MS,
  DUCK_SQUISH_MS,
  INITIAL_DUCK_STATE,
  rubberDuckReducer,
} from "./duckState";
import { RubberDuckPixelArt } from "./RubberDuckPixelArt";
import styles from "./RubberDuckGutter.module.css";

interface RubberDuckGutterProps {
  className?: string;
}

/**
 * RubberDuckGutter
 *
 * Interactive Pixel Rubber Duck Debugger anchored in the left 96px blueprint
 * bay beside <TECH-STACK/>. Click squishes with a procedural squeak and pops a
 * rotating dev-debugging quip (Shift+Click toggles pixel sunglasses).
 */
export function RubberDuckGutter({ className = "" }: RubberDuckGutterProps) {
  const { resolvedTheme } = useTheme();
  const { isSoundEnabled, playHover } = useUISound();
  const [state, dispatch] = useReducer(rubberDuckReducer, INITIAL_DUCK_STATE);
  const audioRef = useRef<DuckAudioAdapter | null>(null);

  const isDark = resolvedTheme === "dark";
  const isSqueaking = state.phase === "squeaking";

  const getAudio = () => {
    if (!audioRef.current) {
      audioRef.current = createDuckAudio();
    }
    return audioRef.current;
  };

  useEffect(() => {
    if (state.phase !== "squeaking") return;
    const timer = setTimeout(() => {
      dispatch({ type: "SQUISH_COMPLETE" });
    }, DUCK_SQUISH_MS);
    return () => clearTimeout(timer);
  }, [state.phase, state.squeakCount]);

  useEffect(() => {
    if (!state.bubbleVisible) return;
    const timer = setTimeout(() => {
      dispatch({ type: "HIDE_BUBBLE" });
    }, DUCK_BUBBLE_MS);
    return () => clearTimeout(timer);
  }, [state.bubbleVisible, state.squeakCount]);

  useEffect(() => {
    return () => {
      audioRef.current?.dispose();
      audioRef.current = null;
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (isSoundEnabled) {
      const audio = getAudio();
      if (e.shiftKey) {
        audio.playCoolToggle();
      } else {
        audio.playSqueak();
      }
    }

    dispatch({ type: "SQUEAK", shiftKey: e.shiftKey });
  };

  return (
    <MarginArtifactSlot side="left" className={className}>
      {/* Warm desk-lamp dark-mode glow while quipping */}
      <div
        aria-hidden="true"
        className={`${styles.glowRig} ${
          isDark ? styles.glowDark : styles.glowLight
        } ${state.bubbleVisible ? styles.glowRigActive : ""}`}
      >
        <div className={styles.glowPool} />
      </div>

      {/* Tilted interactive Rubber Duck Debugger */}
      <button
        type="button"
        onClick={handleClick}
        onMouseEnter={playHover}
        aria-label="Squeeze rubber duck debugger"
        title="Rubber Duck Debugger — click to squeak"
        className={`${styles.duckButton} ${isSqueaking ? styles.isSqueaking : ""}`}
      >
        {state.bubbleVisible && (
          <span
            key={state.squeakCount}
            role="status"
            aria-live="polite"
            className={styles.quipBubble}
          >
            {state.quip}
          </span>
        )}

        <span key={`duck-${state.squeakCount}`} className={styles.duckInner}>
          <RubberDuckPixelArt
            phase={state.phase}
            sunglasses={state.sunglasses}
            isDark={isDark}
          />
        </span>
      </button>
    </MarginArtifactSlot>
  );
}

export default RubberDuckGutter;
