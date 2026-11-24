"use client";

import React from "react";
import type { SaberColor, VaderPhase } from "./vaderState";
import styles from "./VaderGutter.module.css";

interface VaderPixelArtProps {
  phase: VaderPhase;
  saber: SaberColor;
  isDark: boolean;
}

/**
 * Hand-authored pixel-art chibi Darth Vader on a crisp 24x34 integer grid.
 * - Idle: holds metallic lightsaber hilt at his side with helmet, cape, chest
 *   control panel (red/blue), and twin green belt indicators.
 * - Click: extends glowing plasma blade upward with white-hot core, emitter
 *   ignition flash, and subtle rim light reflected onto his glossy helmet.
 */
export function VaderPixelArt({ phase, saber, isDark }: VaderPixelArtProps) {
  const isLit = phase === "igniting" || phase === "on";
  const isIgniting = phase === "igniting";
  const isRetracting = phase === "retracting";

  return (
    <svg
      viewBox="0 0 24 34"
      width={72}
      height={102}
      aria-hidden="true"
      shapeRendering="crispEdges"
      className={`${styles.pixelSvg} ${isDark ? styles.themeDark : styles.themeLight} ${
        saber === "jedi" ? styles.saberJedi : styles.saberSith
      } ${isLit ? styles.isLit : ""} ${isIgniting ? styles.isIgniting : ""} ${
        isRetracting ? styles.isRetracting : ""
      }`}
    >
      {/* Ground contact shadow */}
      <rect x="3" y="31" width="16" height="2" className={styles.groundShadow} />

      {/* ====================================================================
       * 1. Extendable Lightsaber Plasma Blade (scales upward from hilt at y=21)
       * ==================================================================== */}
      <g className={styles.bladeGroup}>
        {/* Outer soft pixel aura */}
        <rect x="17" y="2" width="5" height="19" className={styles.bladeAura} />
        {/* Tapered pixel tip */}
        <rect x="19" y="1" width="1" height="1" className={styles.bladeOuter} />
        {/* Outer plasma edges */}
        <rect x="18" y="2" width="3" height="19" className={styles.bladeOuter} />
        {/* Inner glowing plasma */}
        <rect x="19" y="2" width="1" height="19" className={styles.bladeCore} />
      </g>

      {/* Brief plasma flare at emitter during ignition */}
      {isIgniting && (
        <g className={styles.emitterFlare}>
          <rect x="17" y="19" width="5" height="2" className={styles.bladeOuter} />
          <rect x="18" y="18" width="3" height="4" className={styles.bladeCore} />
        </g>
      )}

      {/* ====================================================================
       * 2. Chibi Darth Vader Cape, Armor & Chest Control Panel
       * ==================================================================== */}
      <g>
        {/* Outer silhouette cape */}
        <rect x="3" y="20" width="14" height="11" className={styles.armorBlack} />
        <rect x="2" y="22" width="16" height="9" className={styles.armorBlack} />
        <rect x="1" y="24" width="2" height="7" className={styles.armorBlack} />

        {/* Left cape drape shading */}
        <rect x="2" y="23" width="2" height="7" className={styles.armorMid} />
        <rect x="4" y="21" width="1" height="9" className={styles.armorDark} />

        {/* Shoulder pauldrons & ribbed chest armor */}
        <rect x="5" y="20" width="10" height="3" className={styles.armorDark} />
        <rect x="6" y="21" width="3" height="2" className={styles.armorMid} />
        <rect x="11" y="21" width="3" height="2" className={styles.armorMid} />
        <rect x="9" y="20" width="2" height="4" className={styles.armorBlack} />

        {/* Torso & tunic folds */}
        <rect x="6" y="24" width="8" height="6" className={styles.armorDark} />
        <rect x="6" y="24" width="1" height="5" className={styles.armorMid} />
        <rect x="13" y="24" width="1" height="5" className={styles.armorMid} />

        {/* Chest life-support control box (red & blue indicators) */}
        <rect x="8" y="24" width="4" height="4" className={styles.armorBlack} />
        <rect x="9" y="24" width="2" height="3" className={styles.armorMid} />
        <rect x="11" y="25" width="1" height="1" className={styles.ledRed} />
        <rect x="11" y="26" width="1" height="1" className={styles.ledBlue} />

        {/* Belt & twin green indicator lights */}
        <rect x="5" y="28" width="10" height="2" className={styles.armorBlack} />
        <rect x="6" y="28" width="1" height="1" className={styles.armorLight} />
        <rect x="7" y="28" width="1" height="1" className={styles.ledGreen} />
        <rect x="12" y="28" width="1" height="1" className={styles.ledGreen} />
        <rect x="13" y="28" width="1" height="1" className={styles.armorLight} />
        <rect x="9" y="28" width="2" height="2" className={styles.armorMid} />

        {/* Right arm reaching out to hold the lightsaber hilt */}
        <rect x="15" y="22" width="3" height="4" className={styles.armorBlack} />
        <rect x="16" y="23" width="2" height="2" className={styles.armorDark} />
      </g>

      {/* ====================================================================
       * 3. Iconic Glossy Darth Vader Helmet & Respirator Grille
       * ==================================================================== */}
      <g>
        {/* Helmet outer silhouette + flared cheek guards */}
        <rect x="7" y="8" width="6" height="1" className={styles.armorBlack} />
        <rect x="6" y="9" width="8" height="2" className={styles.armorBlack} />
        <rect x="5" y="11" width="10" height="4" className={styles.armorBlack} />
        <rect x="4" y="15" width="12" height="3" className={styles.armorBlack} />
        <rect x="3" y="17" width="14" height="2" className={styles.armorBlack} />
        <rect x="5" y="19" width="10" height="1" className={styles.armorBlack} />

        {/* Glossy helmet dome highlights */}
        <rect x="7" y="9" width="2" height="3" className={styles.armorLight} />
        <rect x="11" y="9" width="2" height="3" className={styles.armorLight} />
        <rect x="9" y="8" width="2" height="4" className={styles.armorMid} />
        <rect x="6" y="11" width="8" height="1" className={styles.armorMid} />

        {/* Cheek flares & brow ridge */}
        <rect x="5" y="15" width="2" height="3" className={styles.armorDark} />
        <rect x="13" y="15" width="2" height="3" className={styles.armorDark} />
        <rect x="4" y="17" width="2" height="1" className={styles.armorMid} />
        <rect x="14" y="17" width="2" height="1" className={styles.armorMid} />

        {/* Glossy visor lenses */}
        <rect x="6" y="13" width="3" height="2" className={styles.armorBlack} />
        <rect x="11" y="13" width="3" height="2" className={styles.armorBlack} />
        <rect x="7" y="13" width="1" height="1" className={styles.visorGlint} />
        <rect x="12" y="13" width="1" height="1" className={styles.visorGlint} />
        {/* Nose bridge */}
        <rect x="9" y="12" width="2" height="3" className={styles.armorMid} />

        {/* Triangular respirator grille */}
        <rect x="7" y="16" width="6" height="3" className={styles.armorDark} />
        <rect x="8" y="15" width="4" height="1" className={styles.armorMid} />
        <rect x="8" y="16" width="1" height="3" className={styles.armorBlack} />
        <rect x="10" y="16" width="1" height="3" className={styles.armorBlack} />
        <rect x="12" y="16" width="1" height="2" className={styles.armorBlack} />
        <rect x="9" y="17" width="1" height="2" className={styles.armorLight} />
        <rect x="11" y="17" width="1" height="2" className={styles.armorLight} />
      </g>

      {/* ====================================================================
       * 4. Metallic Lightsaber Hilt
       * ==================================================================== */}
      <g>
        {/* Emitter shroud */}
        <rect x="18" y="21" width="3" height="2" className={styles.hiltLight} />
        {/* Emitter ignition button (subtly glints on hover when off) */}
        <rect
          x="18"
          y="22"
          width="1"
          height="1"
          className={isLit ? styles.bladeOuter : styles.hiltSwitch}
        />
        {/* Hand gripping hilt */}
        <rect x="18" y="23" width="3" height="3" className={styles.hiltDark} />
        <rect x="19" y="24" width="1" height="1" className={styles.hiltLight} />
        {/* Lower pommel */}
        <rect x="18" y="26" width="3" height="3" className={styles.hiltLight} />
        <rect x="18" y="28" width="3" height="1" className={styles.hiltDark} />
      </g>

      {/* ====================================================================
       * 5. Reflected Lightsaber Rim Glow on Vader's Right Helmet & Cape Edge
       * ==================================================================== */}
      {isLit && (
        <g className={styles.armorRimGlow}>
          <rect x="13" y="9" width="1" height="3" />
          <rect x="14" y="11" width="1" height="4" />
          <rect x="15" y="15" width="1" height="3" />
          <rect x="16" y="17" width="1" height="2" />
          <rect x="16" y="20" width="1" height="2" />
          <rect x="17" y="22" width="1" height="3" />
        </g>
      )}
    </svg>
  );
}
