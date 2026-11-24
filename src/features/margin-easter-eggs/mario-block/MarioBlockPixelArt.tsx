"use client";

import React from "react";
import type { MarioBlockPhase, MarioBlockReward } from "./marioBlockState";
import styles from "./MarioBlockGutter.module.css";

interface MarioBlockSpriteProps {
  phase: MarioBlockPhase;
}

/**
 * Exact 16x16 NES Super Mario Bros. (1985) Question Block & Spent Empty Block.
 * - Ready: authentic 1px rounded NES tile corners, top-left peach-gold bevel,
 *   black bottom-right frame, 4 black corner rivets, pulsing gold face, and
 *   chunky NES `?` glyph with 1px black bottom-right drop shadow.
 * - Spent: authentic 16x16 NES bronze/brown empty block with 4 corner rivets.
 */
export function MarioBlockSprite({ phase }: MarioBlockSpriteProps) {
  const isSpent = phase === "spent";

  return (
    <svg
      viewBox="0 0 16 16"
      width={56}
      height={56}
      aria-hidden="true"
      shapeRendering="crispEdges"
      className={styles.blockSvg}
    >
      {!isSpent ? (
        <g>
          {/* Main animated pulsing gold face (1px inset from rounded corners) */}
          <rect x="1" y="1" width="14" height="14" className={styles.qBlockFill} />

          {/* Top & Left 1px warm NES highlight bevel */}
          <rect x="1" y="0" width="14" height="1" className={styles.qBlockHighlight} />
          <rect x="0" y="1" width="1" height="14" className={styles.qBlockHighlight} />

          {/* Bottom & Right 1px pure black NES frame */}
          <rect x="1" y="15" width="14" height="1" className={styles.nesBlack} />
          <rect x="15" y="1" width="1" height="14" className={styles.nesBlack} />

          {/* 4 Iconic NES corner rivets */}
          <rect x="2" y="2" width="1" height="1" className={styles.nesBlack} />
          <rect x="13" y="2" width="1" height="1" className={styles.nesBlack} />
          <rect x="2" y="13" width="1" height="1" className={styles.nesBlack} />
          <rect x="13" y="13" width="1" height="1" className={styles.nesBlack} />

          {/* 1px Black Drop Shadow for the `?` glyph (shifted +1, +1) */}
          <g transform="translate(1, 1)" className={styles.nesBlack}>
            <rect x="5" y="3" width="6" height="1" />
            <rect x="4" y="4" width="3" height="2" />
            <rect x="9" y="4" width="3" height="3" />
            <rect x="7" y="7" width="4" height="1" />
            <rect x="7" y="8" width="3" height="2" />
            <rect x="7" y="11" width="3" height="2" />
          </g>

          {/* Original 1985 NES `?` Glyph Face */}
          <g className={styles.qBlockGlyph}>
            <rect x="5" y="3" width="6" height="1" />
            <rect x="4" y="4" width="3" height="2" />
            <rect x="9" y="4" width="3" height="3" />
            <rect x="7" y="7" width="4" height="1" />
            <rect x="7" y="8" width="3" height="2" />
            <rect x="7" y="11" width="3" height="2" />
          </g>
        </g>
      ) : (
        <g>
          {/* Spent / Empty 16x16 NES Bronze Block */}
          <rect x="1" y="1" width="14" height="14" className={styles.spentFill} />

          {/* Inner top-left tan bevel */}
          <rect x="1" y="1" width="14" height="1" className={styles.spentHighlight} />
          <rect x="1" y="1" width="1" height="14" className={styles.spentHighlight} />

          {/* Inner bottom-right dark umber shadow */}
          <rect x="2" y="14" width="13" height="1" className={styles.spentShadow} />
          <rect x="14" y="2" width="1" height="13" className={styles.spentShadow} />

          {/* Outer 1px black border (rounded 1px corners) */}
          <rect x="1" y="0" width="14" height="1" className={styles.nesBlack} />
          <rect x="1" y="15" width="14" height="1" className={styles.nesBlack} />
          <rect x="0" y="1" width="1" height="14" className={styles.nesBlack} />
          <rect x="15" y="1" width="1" height="14" className={styles.nesBlack} />

          {/* 4 Black Corner Rivets */}
          <rect x="2" y="2" width="1" height="1" className={styles.nesBlack} />
          <rect x="13" y="2" width="1" height="1" className={styles.nesBlack} />
          <rect x="2" y="13" width="1" height="1" className={styles.nesBlack} />
          <rect x="13" y="13" width="1" height="1" className={styles.nesBlack} />
        </g>
      )}
    </svg>
  );
}

interface MarioRewardSpriteProps {
  reward: MarioBlockReward;
}

/**
 * Exact 16x16 NES Spinning Gold Coin (4-frame spin) or NES Super Star (Shift+Click).
 */
export function MarioRewardSprite({ reward }: MarioRewardSpriteProps) {
  if (reward === "star") {
    return (
      <svg
        viewBox="0 0 16 16"
        width={42}
        height={42}
        aria-hidden="true"
        shapeRendering="crispEdges"
        className={styles.rewardSvg}
      >
        {/* 16x16 Original NES Super Starman */}
        <g className={styles.nesBlack}>
          <rect x="7" y="0" width="2" height="1" />
          <rect x="6" y="1" width="4" height="2" />
          <rect x="5" y="3" width="6" height="2" />
          <rect x="1" y="5" width="14" height="2" />
          <rect x="2" y="7" width="12" height="2" />
          <rect x="3" y="9" width="10" height="2" />
          <rect x="2" y="11" width="12" height="2" />
          <rect x="1" y="13" width="6" height="2" />
          <rect x="9" y="13" width="6" height="2" />
          <rect x="1" y="15" width="4" height="1" />
          <rect x="11" y="15" width="4" height="1" />
        </g>
        <g className={styles.starBody}>
          <rect x="7" y="1" width="2" height="2" />
          <rect x="6" y="3" width="4" height="2" />
          <rect x="2" y="6" width="12" height="1" />
          <rect x="3" y="7" width="10" height="2" />
          <rect x="4" y="9" width="8" height="2" />
          <rect x="3" y="11" width="10" height="1" />
          <rect x="2" y="12" width="5" height="2" />
          <rect x="9" y="12" width="5" height="2" />
          <rect x="2" y="14" width="3" height="1" />
          <rect x="11" y="14" width="3" height="1" />
        </g>
        {/* Iconic NES Starman vertical black eyes */}
        <rect x="6" y="6" width="1" height="3" className={styles.nesBlack} />
        <rect x="9" y="6" width="1" height="3" className={styles.nesBlack} />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 16 16"
      width={38}
      height={38}
      aria-hidden="true"
      shapeRendering="crispEdges"
      className={styles.rewardSvg}
    >
      {/* Frame 0: Full Front NES Coin */}
      <g className={styles.coinFrame0}>
        <rect x="5" y="1" width="6" height="1" className={styles.nesBlack} />
        <rect x="4" y="2" width="8" height="1" className={styles.nesBlack} />
        <rect x="3" y="3" width="10" height="10" className={styles.nesBlack} />
        <rect x="4" y="13" width="8" height="1" className={styles.nesBlack} />
        <rect x="5" y="14" width="6" height="1" className={styles.nesBlack} />
        {/* Gold face */}
        <rect x="5" y="2" width="6" height="12" className={styles.coinGold} />
        <rect x="4" y="3" width="8" height="10" className={styles.coinGold} />
        {/* Left highlight */}
        <rect x="5" y="2" width="2" height="1" className={styles.coinShine} />
        <rect x="4" y="3" width="1" height="10" className={styles.coinShine} />
        {/* Embossed center slot */}
        <rect x="7" y="4" width="1" height="8" className={styles.coinShine} />
        <rect x="8" y="4" width="1" height="8" className={styles.coinShade} />
      </g>

      {/* Frame 1: 3/4 Turn */}
      <g className={styles.coinFrame1}>
        <rect x="6" y="1" width="4" height="1" className={styles.nesBlack} />
        <rect x="5" y="2" width="6" height="12" className={styles.nesBlack} />
        <rect x="6" y="14" width="4" height="1" className={styles.nesBlack} />
        <rect x="6" y="2" width="4" height="12" className={styles.coinGold} />
        <rect x="6" y="3" width="1" height="10" className={styles.coinShine} />
        <rect x="8" y="4" width="1" height="8" className={styles.coinShade} />
      </g>

      {/* Frame 2: Thin Edge-On */}
      <g className={styles.coinFrame2}>
        <rect x="6" y="1" width="4" height="14" className={styles.nesBlack} />
        <rect x="7" y="2" width="2" height="12" className={styles.coinShine} />
      </g>

      {/* Frame 3: 3/4 Reverse */}
      <g className={styles.coinFrame3}>
        <rect x="6" y="1" width="4" height="1" className={styles.nesBlack} />
        <rect x="5" y="2" width="6" height="12" className={styles.nesBlack} />
        <rect x="6" y="14" width="4" height="1" className={styles.nesBlack} />
        <rect x="6" y="2" width="4" height="12" className={styles.coinGold} />
        <rect x="9" y="3" width="1" height="10" className={styles.coinShine} />
        <rect x="7" y="4" width="1" height="8" className={styles.coinShade} />
      </g>
    </svg>
  );
}
