"use client";

import React, { useEffect, useReducer, useRef } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { useUISound } from "@/context/SoundContext";
import { MarginArtifactSlot } from "../MarginArtifactSlot";
import {
  createGachaponAudio,
  type GachaponAudioAdapter,
} from "./gachaponAudio";
import {
  GACHAPON_CRANK_MS,
  GACHAPON_DROP_MS,
  gachaponReducer,
  INITIAL_GACHAPON_STATE,
  type GachaponCharm,
} from "./gachaponState";
import {
  GachaponCharmSprite,
  GachaponMachineSprite,
} from "./GachaponPixelArt";
import styles from "./GachaponGutter.module.css";

interface GachaponGutterProps {
  className?: string;
}

const CHARM_GLOW_CLASS: Record<GachaponCharm, string> = {
  duck: styles.charmDuck,
  cat: styles.charmCat,
  heart: styles.charmHeart,
  coffee: styles.charmCoffee,
  trophy: styles.charmTrophy,
};

/**
 * GachaponGutter
 *
 * Interactive pixel Japanese Gachapon machine anchored in the right 96px
 * blueprint bay beside Moments & Events. Click cranks the dial, tumbles a
 * capsule, and reveals a collectible pixel charm (Shift+Click for rare trophy).
 */
export function GachaponGutter({ className = "" }: GachaponGutterProps) {
  const { resolvedTheme } = useTheme();
  const { isSoundEnabled, playHover } = useUISound();
  const [state, dispatch] = useReducer(gachaponReducer, INITIAL_GACHAPON_STATE);
  const audioRef = useRef<GachaponAudioAdapter | null>(null);

  const isDark = resolvedTheme === "dark";
  const isCranking = state.phase === "cranking";
  const isRevealed = state.phase === "revealed";

  const getAudio = () => {
    if (!audioRef.current) {
      audioRef.current = createGachaponAudio();
    }
    return audioRef.current;
  };

  useEffect(() => {
    if (state.phase === "cranking") {
      const timer = setTimeout(() => {
        dispatch({ type: "CRANK_COMPLETE" });
      }, GACHAPON_CRANK_MS);
      return () => clearTimeout(timer);
    }

    if (state.phase === "dropping") {
      const timer = setTimeout(() => {
        if (isSoundEnabled) {
          getAudio().playReveal(state.charm === "trophy");
        }
        dispatch({ type: "DROP_COMPLETE" });
      }, GACHAPON_DROP_MS);
      return () => clearTimeout(timer);
    }
  }, [state.phase, state.pullCount, state.charm, isSoundEnabled]);

  useEffect(() => {
    return () => {
      audioRef.current?.dispose();
      audioRef.current = null;
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (state.phase === "cranking" || state.phase === "dropping") return;

    if (isSoundEnabled) {
      getAudio().playCrankAndDrop();
    }

    dispatch({ type: "CRANK", shiftKey: e.shiftKey });
  };

  const label =
    state.pullCount === 0
      ? "Crank Gachapon capsule machine"
      : "Pull next Gachapon capsule";

  return (
    <MarginArtifactSlot side="right" className={className}>
      {/* Pastel dark-mode reveal glow */}
      <div
        aria-hidden="true"
        className={`${styles.glowRig} ${
          isDark ? styles.glowDark : styles.glowLight
        } ${CHARM_GLOW_CLASS[state.charm]} ${
          isRevealed ? styles.glowRigActive : ""
        }`}
      >
        <div className={styles.glowPool} />
      </div>

      {/* Tilted interactive Gachapon machine */}
      <button
        type="button"
        onClick={handleClick}
        onMouseEnter={playHover}
        aria-label={label}
        title={label}
        className={`${styles.gachaponButton} ${
          isCranking ? styles.isCranking : ""
        }`}
      >
        {/* Revealed floating pixel charm above the dome */}
        {isRevealed && (
          <div
            key={state.pullCount}
            aria-hidden="true"
            className={styles.charmStage}
          >
            <span className={`${styles.popSpark} ${styles.popSpark1}`} />
            <span className={`${styles.popSpark} ${styles.popSpark2}`} />
            <span className={`${styles.popSpark} ${styles.popSpark3}`} />
            <span className={`${styles.popSpark} ${styles.popSpark4}`} />
            <div className={styles.charmPop}>
              <GachaponCharmSprite charm={state.charm} />
            </div>
          </div>
        )}

        <span className={styles.machineWrap}>
          <GachaponMachineSprite phase={state.phase} isDark={isDark} />
        </span>
      </button>
    </MarginArtifactSlot>
  );
}

export default GachaponGutter;
