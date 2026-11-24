"use client";

import React from "react";
import type { GachaponCharm, GachaponPhase } from "./gachaponState";
import styles from "./GachaponGutter.module.css";

interface GachaponMachineSpriteProps {
  phase: GachaponPhase;
  isDark: boolean;
}

/**
 * Hand-authored pixel-art Japanese Gachapon Capsule Machine on a 22x30 grid.
 * Features a domed clear globe packed with colorful capsules, cherry-red shell,
 * animated 360deg silver crank dial, and lower dispensing chute.
 */
export function GachaponMachineSprite({
  phase,
  isDark,
}: GachaponMachineSpriteProps) {
  const isCranking = phase === "cranking";
  const isDropping = phase === "dropping";

  return (
    <svg
      viewBox="0 0 22 30"
      width={66}
      height={90}
      aria-hidden="true"
      shapeRendering="crispEdges"
      className={`${styles.machineSvg} ${isDark ? styles.themeDark : styles.themeLight}`}
    >
      {/* Ground contact shadow */}
      <rect x="3" y="28" width="16" height="2" className={styles.groundShadow} />

      {/* Top red lid cap */}
      <rect x="6" y="0" width="10" height="1" className={styles.outline} />
      <rect x="4" y="1" width="14" height="2" className={styles.redMain} />
      <rect x="5" y="1" width="6" height="1" className={styles.redBright} />
      <rect x="3" y="1" width="1" height="2" className={styles.outline} />
      <rect x="18" y="1" width="1" height="2" className={styles.outline} />

      {/* Clear glass dome frame */}
      <rect x="2" y="3" width="1" height="11" className={styles.outline} />
      <rect x="19" y="3" width="1" height="11" className={styles.outline} />
      <rect x="3" y="3" width="16" height="11" className={styles.glassBg} />

      {/* Colorful pixel capsules resting inside the glass dome */}
      <g className={isCranking ? styles.capsulesJostle : undefined}>
        {/* Yellow capsule */}
        <rect x="4" y="9" width="4" height="2" fill="#facc15" />
        <rect x="4" y="11" width="4" height="2" fill="#fef9c3" />
        {/* Sky blue capsule */}
        <rect x="8" y="10" width="4" height="2" fill="#38bdf8" />
        <rect x="8" y="12" width="4" height="1" fill="#e0f2fe" />
        {/* Coral pink capsule */}
        <rect x="12" y="9" width="4" height="2" fill="#fb7185" />
        <rect x="12" y="11" width="4" height="2" fill="#ffe4e6" />
        {/* Mint green capsule */}
        <rect x="15" y="7" width="3" height="2" fill="#34d399" />
        <rect x="15" y="9" width="3" height="2" fill="#d1fae5" />
        {/* Lavender capsule */}
        <rect x="6" y="6" width="4" height="2" fill="#a78bfa" />
        <rect x="6" y="8" width="4" height="2" fill="#ede9fe" />
        {/* Peach capsule */}
        <rect x="10" y="6" width="4" height="2" fill="#fb923c" />
        <rect x="10" y="8" width="4" height="2" fill="#ffedd5" />
      </g>

      {/* Glass diagonal specular highlight */}
      <rect x="4" y="4" width="2" height="1" className={styles.glassShine} />
      <rect x="4" y="5" width="1" height="3" className={styles.glassShine} />

      {/* Cherry-red lower machine housing */}
      <rect x="2" y="14" width="18" height="14" className={styles.redMain} />
      <rect x="1" y="14" width="1" height="14" className={styles.outline} />
      <rect x="20" y="14" width="1" height="14" className={styles.outline} />
      <rect x="2" y="14" width="18" height="1" className={styles.redBright} />
      <rect x="2" y="28" width="18" height="1" className={styles.outline} />
      <rect x="18" y="15" width="2" height="13" className={styles.redDark} />

      {/* Cream front control faceplate */}
      <rect x="4" y="16" width="14" height="11" className={styles.faceplate} />
      <rect x="4" y="16" width="14" height="1" className={styles.faceplateHighlight} />

      {/* Coin slot on upper-right of faceplate */}
      <rect x="15" y="17" width="2" height="3" className={styles.metalDark} />
      <rect x="15" y="18" width="1" height="2" className={styles.outline} />

      {/* Silver rotary crank dial (rotates 360deg on click) */}
      <rect x="8" y="17" width="6" height="6" className={styles.metalDark} />
      <rect x="9" y="17" width="4" height="5" className={styles.metalLight} />
      <g className={isCranking ? styles.crankSpin : styles.crankHandle}>
        <rect x="8" y="19" width="6" height="2" className={styles.metalBright} />
        <rect x="10" y="19" width="2" height="2" className={styles.outline} />
      </g>

      {/* Lower dispensing chute door */}
      <rect x="7" y="24" width="8" height="3" className={styles.outline} />
      <rect x="8" y="24" width="6" height="2" className={styles.chuteDark} />

      {/* Capsule peeking out of chute during drop */}
      {isDropping && (
        <g className={styles.chuteCapsule}>
          <rect x="9" y="24" width="4" height="2" fill="#facc15" />
          <rect x="9" y="26" width="4" height="1" fill="#ffffff" />
        </g>
      )}
    </svg>
  );
}

interface GachaponCharmSpriteProps {
  charm: GachaponCharm;
}

/**
 * Five collectible 14x14 miniature pixel charms popped out of the Gachapon capsule.
 */
export function GachaponCharmSprite({ charm }: GachaponCharmSpriteProps) {
  return (
    <svg
      viewBox="0 0 14 14"
      width={36}
      height={36}
      aria-hidden="true"
      shapeRendering="crispEdges"
      className={styles.charmSvg}
    >
      {charm === "duck" && (
        /* Cute Yellow Rubber Duck */
        <g>
          <rect x="5" y="2" width="4" height="1" fill="#18181b" />
          <rect x="4" y="3" width="6" height="4" fill="#18181b" />
          <rect x="2" y="7" width="10" height="5" fill="#18181b" />
          <rect x="3" y="12" width="8" height="1" fill="#18181b" />
          {/* Yellow head & body */}
          <rect x="5" y="3" width="4" height="4" fill="#facc15" />
          <rect x="3" y="7" width="8" height="4" fill="#facc15" />
          <rect x="4" y="11" width="6" height="1" fill="#eab308" />
          {/* Wing highlight */}
          <rect x="4" y="8" width="4" height="2" fill="#fef08a" />
          {/* Eye */}
          <rect x="8" y="4" width="1" height="1" fill="#18181b" />
          {/* Orange bill */}
          <rect x="10" y="5" width="2" height="2" fill="#f97316" />
        </g>
      )}

      {charm === "cat" && (
        /* Cozy Pixel Kitty Head */
        <g>
          <rect x="2" y="2" width="3" height="3" fill="#18181b" />
          <rect x="9" y="2" width="3" height="3" fill="#18181b" />
          <rect x="2" y="5" width="10" height="7" fill="#18181b" />
          <rect x="3" y="12" width="8" height="1" fill="#18181b" />
          {/* Cream fur */}
          <rect x="3" y="3" width="1" height="2" fill="#f5f5f4" />
          <rect x="10" y="3" width="1" height="2" fill="#f5f5f4" />
          <rect x="3" y="5" width="8" height="6" fill="#f5f5f4" />
          <rect x="4" y="11" width="6" height="1" fill="#e7e5e4" />
          {/* Ginger forehead patch */}
          <rect x="6" y="5" width="2" height="2" fill="#fb923c" />
          {/* Pink inner ears */}
          <rect x="3" y="4" width="1" height="1" fill="#fda4af" />
          <rect x="10" y="4" width="1" height="1" fill="#fda4af" />
          {/* Eyes & tiny pink nose */}
          <rect x="4" y="8" width="1" height="1" fill="#18181b" />
          <rect x="9" y="8" width="1" height="1" fill="#18181b" />
          <rect x="6" y="9" width="2" height="1" fill="#fb7185" />
        </g>
      )}

      {charm === "heart" && (
        /* Glossy Pixel Heart */
        <g>
          <rect x="2" y="2" width="4" height="1" fill="#18181b" />
          <rect x="8" y="2" width="4" height="1" fill="#18181b" />
          <rect x="1" y="3" width="12" height="4" fill="#18181b" />
          <rect x="2" y="7" width="10" height="2" fill="#18181b" />
          <rect x="3" y="9" width="8" height="2" fill="#18181b" />
          <rect x="5" y="11" width="4" height="1" fill="#18181b" />
          <rect x="6" y="12" width="2" height="1" fill="#18181b" />
          {/* Crimson fill */}
          <rect x="2" y="3" width="4" height="4" fill="#ef4444" />
          <rect x="8" y="3" width="4" height="4" fill="#ef4444" />
          <rect x="6" y="4" width="2" height="3" fill="#ef4444" />
          <rect x="3" y="7" width="8" height="2" fill="#dc2626" />
          <rect x="4" y="9" width="6" height="1" fill="#dc2626" />
          <rect x="5" y="10" width="4" height="1" fill="#b91c1c" />
          <rect x="6" y="11" width="2" height="1" fill="#b91c1c" />
          {/* Specular shine */}
          <rect x="3" y="4" width="2" height="1" fill="#fecaca" />
          <rect x="3" y="5" width="1" height="1" fill="#ffffff" />
        </g>
      )}

      {charm === "coffee" && (
        /* Warm Pixel Coffee Mug */
        <g>
          {/* Steam wisps */}
          <rect x="4" y="1" width="1" height="2" fill="#d4d4d8" />
          <rect x="7" y="0" width="1" height="2" fill="#d4d4d8" />
          {/* Outline */}
          <rect x="2" y="4" width="8" height="9" fill="#18181b" />
          <rect x="10" y="6" width="3" height="5" fill="#18181b" />
          {/* Mug body */}
          <rect x="3" y="5" width="6" height="7" fill="#fafaf9" />
          <rect x="10" y="7" width="2" height="3" fill="#e7e5e4" />
          <rect x="10" y="8" width="1" height="1" fill="#18181b" />
          {/* Coffee rim */}
          <rect x="3" y="5" width="6" height="1" fill="#78350f" />
          {/* Warm band */}
          <rect x="3" y="8" width="6" height="2" fill="#d97706" />
        </g>
      )}

      {charm === "trophy" && (
        /* Rare Golden Pixel Trophy */
        <g>
          <rect x="3" y="1" width="8" height="1" fill="#18181b" />
          <rect x="1" y="2" width="12" height="5" fill="#18181b" />
          <rect x="3" y="7" width="8" height="2" fill="#18181b" />
          <rect x="5" y="9" width="4" height="2" fill="#18181b" />
          <rect x="3" y="11" width="8" height="2" fill="#18181b" />
          {/* Gold cup */}
          <rect x="4" y="2" width="6" height="5" fill="#facc15" />
          <rect x="5" y="7" width="4" height="1" fill="#eab308" />
          {/* Handles */}
          <rect x="2" y="3" width="2" height="3" fill="#eab308" />
          <rect x="10" y="3" width="2" height="3" fill="#eab308" />
          {/* Shine */}
          <rect x="5" y="3" width="1" height="3" fill="#fef9c3" />
          {/* Stem & base */}
          <rect x="6" y="8" width="2" height="3" fill="#ca8a04" />
          <rect x="4" y="11" width="6" height="1" fill="#a16207" />
        </g>
      )}
    </svg>
  );
}
