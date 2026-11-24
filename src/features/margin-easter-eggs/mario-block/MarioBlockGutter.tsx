"use client";

import React, { useEffect, useReducer, useRef } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { useUISound } from "@/context/SoundContext";
import { MarginArtifactSlot } from "../MarginArtifactSlot";
import { createMarioAudio, type MarioAudioAdapter } from "./marioAudio";
import {
  INITIAL_MARIO_BLOCK_STATE,
  MARIO_FAST_POP_MS,
  MARIO_MAX_STREAK_COINS,
  MARIO_NORMAL_POP_MS,
  marioBlockReducer,
} from "./marioBlockState";
import { MarioBlockSprite, MarioRewardSprite } from "./MarioBlockPixelArt";
import styles from "./MarioBlockGutter.module.css";

interface MarioBlockGutterProps {
  className?: string;
}

const RAPID_CLICK_WINDOW_MS = 380;

/**
 * MarioBlockGutter
 *
 * Authentic 1985 NES Super Mario Bros. `?` Question Block anchored in the
 * right 96px blueprint bay beside <EXPERIENCE-TIMELINE/>.
 * - Single click: bumps & pops a spinning NES gold coin (Shift+Click: Super Star).
 * - Fast repeated clicks: immediately re-bumps and fires faster stacked coins
 *   (classic 10-coin multi-hit feel) before settling into the spent bronze block.
 */
export function MarioBlockGutter({ className = "" }: MarioBlockGutterProps) {
  const { resolvedTheme } = useTheme();
  const { isSoundEnabled, playHover } = useUISound();
  const [state, dispatch] = useReducer(
    marioBlockReducer,
    INITIAL_MARIO_BLOCK_STATE
  );
  const audioRef = useRef<MarioAudioAdapter | null>(null);
  const lastClickAtRef = useRef<number>(0);
  const popTimersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(
    new Map()
  );

  const isDark = resolvedTheme === "dark";
  const isBumping = state.phase === "bumping";
  const isReady = state.phase === "ready";
  const isSpent = state.phase === "spent";
  const isFastStreak = state.streakCount > 1;

  const getAudio = () => {
    if (!audioRef.current) {
      audioRef.current = createMarioAudio();
    }
    return audioRef.current;
  };

  // Schedule completion timers for each newly launched in-flight coin/star
  useEffect(() => {
    for (const pop of state.activePops) {
      if (popTimersRef.current.has(pop.id)) continue;

      const duration = pop.fast ? MARIO_FAST_POP_MS : MARIO_NORMAL_POP_MS;
      const timer = setTimeout(() => {
        popTimersRef.current.delete(pop.id);
        dispatch({ type: "POP_COMPLETE", id: pop.id });
      }, duration);

      popTimersRef.current.set(pop.id, timer);
    }
  }, [state.activePops]);

  useEffect(() => {
    const timers = popTimersRef.current;
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
      audioRef.current?.dispose();
      audioRef.current = null;
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    const now = performance.now();
    const isRapid = now - lastClickAtRef.current < RAPID_CLICK_WINDOW_MS;
    lastClickAtRef.current = now;

    if (
      state.phase === "bumping" &&
      state.streakCount >= MARIO_MAX_STREAK_COINS
    ) {
      return;
    }

    if (isSoundEnabled) {
      const audio = getAudio();
      if (state.phase === "spent") {
        audio.playReset();
      } else if (e.shiftKey) {
        audio.playStar();
      } else {
        audio.playCoin();
      }
    }

    dispatch({ type: "CLICK", shiftKey: e.shiftKey, fast: isRapid });
  };

  const label = isSpent
    ? "Reset Mario Question Block"
    : "Hit Mario Question Block";

  return (
    <MarginArtifactSlot side="right" className={className}>
      {/* Golden / Star-Power radial ambient glow */}
      <div
        aria-hidden="true"
        className={`${styles.lightRig} ${
          isDark ? styles.lightRigDark : styles.lightRigLight
        } ${state.reward === "star" ? styles.lightRigStar : styles.lightRigCoin} ${
          isReady ? styles.lightRigReady : ""
        } ${isBumping ? styles.lightRigBumping : ""}`}
      >
        <div className={styles.ambientSpill} />
      </div>

      {/* Tilted interactive 16x16 NES `?` Block */}
      <button
        type="button"
        onClick={handleClick}
        onMouseEnter={playHover}
        aria-label={label}
        aria-pressed={isSpent}
        title={label}
        className={`${styles.blockButton} ${isBumping ? styles.isBumping : ""} ${
          isBumping && isFastStreak ? styles.isFastBump : ""
        }`}
      >
        {/* Stacked upright pop-out NES Coins / Stars for rapid-click bursts */}
        {state.activePops.map((pop) => (
          <div
            key={pop.id}
            aria-hidden="true"
            className={`${styles.rewardStage} ${
              pop.fast ? styles.rewardStageFast : ""
            }`}
          >
            <span className={`${styles.sparkle} ${styles.sparkle1}`} />
            <span className={`${styles.sparkle} ${styles.sparkle2}`} />
            <span className={`${styles.sparkle} ${styles.sparkle3}`} />
            <span className={`${styles.sparkle} ${styles.sparkle4}`} />
            <div className={styles.rewardActor}>
              <MarioRewardSprite reward={pop.reward} />
            </div>
          </div>
        ))}

        {/* Re-keyed on each bump so rapid clicks visibly re-punch the block upward */}
        <span key={state.bumpCount} className={styles.blockInner}>
          <MarioBlockSprite phase={state.phase} />
        </span>
      </button>
    </MarginArtifactSlot>
  );
}

export default MarioBlockGutter;
