"use client";

import React from "react";
import type { PolaroidFilmMode, PolaroidPhase } from "./polaroidState";
import styles from "./PolaroidGutter.module.css";

interface PolaroidCameraSpriteProps {
  phase: PolaroidPhase;
  isDark: boolean;
}

/**
 * Hand-authored vintage Polaroid instant camera on a crisp 26x22 pixel grid.
 * Features the iconic cream/charcoal shell, classic 5-color rainbow stripe,
 * top xenon flash bar, viewfinder, red shutter button, and recessed glass lens.
 */
export function PolaroidCameraSprite({
  phase,
  isDark,
}: PolaroidCameraSpriteProps) {
  const isFlashing = phase === "flashing";

  return (
    <svg
      viewBox="0 0 26 22"
      width={72}
      height={62}
      aria-hidden="true"
      shapeRendering="crispEdges"
      className={`${styles.cameraSvg} ${isDark ? styles.themeDark : styles.themeLight}`}
    >
      {/* Top raised flash housing */}
      <rect x="4" y="1" width="18" height="4" className={styles.bodyDark} />
      <rect x="5" y="0" width="16" height="1" className={styles.bodyOutline} />
      <rect x="3" y="1" width="1" height="4" className={styles.bodyOutline} />
      <rect x="22" y="1" width="1" height="4" className={styles.bodyOutline} />

      {/* Xenon Flash Window */}
      <rect
        x="6"
        y="2"
        width="7"
        height="2"
        className={isFlashing ? styles.flashActive : styles.flashWindow}
      />
      <rect x="7" y="2" width="2" height="1" className={styles.flashSpecular} />

      {/* Viewfinder Window */}
      <rect x="17" y="2" width="3" height="2" className={styles.lensDeep} />
      <rect x="18" y="2" width="1" height="1" className={styles.lensGlint} />

      {/* Upper cream camera casing */}
      <rect x="2" y="5" width="22" height="10" className={styles.bodyCream} />
      <rect x="1" y="6" width="1" height="13" className={styles.bodyOutline} />
      <rect x="24" y="6" width="1" height="13" className={styles.bodyOutline} />
      <rect x="2" y="5" width="22" height="1" className={styles.bodyHighlight} />

      {/* Classic 5-color vertical Polaroid rainbow stripe */}
      <rect x="11" y="14" width="1" height="5" fill="#ef4444" />
      <rect x="12" y="14" width="1" height="5" fill="#f97316" />
      <rect x="13" y="14" width="1" height="5" fill="#facc15" />
      <rect x="14" y="14" width="1" height="5" fill="#22c55e" />
      <rect x="15" y="14" width="1" height="5" fill="#3b82f6" />

      {/* Lower dark graphite chassis & film ejection lip */}
      <rect x="2" y="15" width="9" height="5" className={styles.bodyDark} />
      <rect x="16" y="15" width="8" height="5" className={styles.bodyDark} />
      <rect x="2" y="19" width="22" height="2" className={styles.bodyOutline} />
      {/* Film ejection slot */}
      <rect x="5" y="19" width="16" height="1" className={styles.slotDark} />

      {/* Red shutter release button on front right */}
      <rect
        x="19"
        y="8"
        width="3"
        height="3"
        className={isFlashing ? styles.shutterPressed : styles.shutterRed}
      />
      <rect x="20" y="8" width="1" height="1" className={styles.shutterHighlight} />

      {/* Central circular pixel camera lens */}
      <rect x="10" y="6" width="6" height="8" className={styles.bodyOutline} />
      <rect x="9" y="7" width="8" height="6" className={styles.bodyOutline} />
      <rect x="10" y="7" width="6" height="6" className={styles.lensRing} />
      <rect x="11" y="8" width="4" height="4" className={styles.lensDeep} />
      <rect x="12" y="9" width="2" height="2" className={styles.lensCore} />
      <rect x="11" y="8" width="1" height="1" className={styles.lensGlint} />
      <rect x="14" y="11" width="1" height="1" className={styles.lensTint} />
    </svg>
  );
}

interface PolaroidPhotoCardProps {
  sceneIndex: number;
  filmMode: PolaroidFilmMode;
}

/**
 * Miniature 18x21 pixel Polaroid print that ejects from the camera slot and
 * develops into one of 4 hand-crafted pixel memory scenes.
 */
export function PolaroidPhotoCard({
  sceneIndex,
  filmMode,
}: PolaroidPhotoCardProps) {
  return (
    <svg
      viewBox="0 0 18 21"
      width={48}
      height={56}
      aria-hidden="true"
      shapeRendering="crispEdges"
      className={`${styles.photoSvg} ${
        filmMode === "sepia" ? styles.photoSepia : ""
      }`}
    >
      {/* White Polaroid border with thick classic chin */}
      <rect x="0" y="0" width="18" height="21" className={styles.photoBorderOutline} />
      <rect x="1" y="1" width="16" height="19" className={styles.photoPaper} />

      {/* Developing photo window (14x13 inner image) */}
      <g className={styles.photoImageLayer}>
        {sceneIndex === 0 && (
          /* Scene 0: Starry Night Hills & Moon */
          <g>
            <rect x="2" y="2" width="14" height="13" fill="#0f172a" />
            <rect x="12" y="3" width="2" height="2" fill="#fef08a" />
            <rect x="4" y="4" width="1" height="1" fill="#e2e8f0" />
            <rect x="8" y="3" width="1" height="1" fill="#fde68a" />
            <rect x="6" y="6" width="1" height="1" fill="#94a3b8" />
            <rect x="2" y="10" width="6" height="5" fill="#1e293b" />
            <rect x="4" y="9" width="3" height="1" fill="#1e293b" />
            <rect x="7" y="11" width="9" height="4" fill="#334155" />
            <rect x="10" y="10" width="4" height="1" fill="#334155" />
            <rect x="2" y="13" width="14" height="2" fill="#0f766e" />
          </g>
        )}

        {sceneIndex === 1 && (
          /* Scene 1: Golden Sunset Coast */
          <g>
            <rect x="2" y="2" width="14" height="4" fill="#7c2d12" />
            <rect x="2" y="6" width="14" height="3" fill="#ea580c" />
            <rect x="2" y="9" width="14" height="2" fill="#fb923c" />
            <rect x="7" y="7" width="4" height="3" fill="#fef08a" />
            <rect x="8" y="6" width="2" height="1" fill="#fef08a" />
            <rect x="2" y="11" width="14" height="4" fill="#1e3a8a" />
            <rect x="7" y="11" width="4" height="1" fill="#fde047" />
            <rect x="8" y="12" width="2" height="1" fill="#fb923c" />
            <rect x="6" y="13" width="6" height="1" fill="#38bdf8" opacity="0.5" />
          </g>
        )}

        {sceneIndex === 2 && (
          /* Scene 2: Night Festival Fireworks */
          <g>
            <rect x="2" y="2" width="14" height="13" fill="#111827" />
            {/* Pink-gold burst */}
            <rect x="6" y="5" width="2" height="2" fill="#fef08a" />
            <rect x="5" y="4" width="1" height="1" fill="#f472b6" />
            <rect x="8" y="4" width="1" height="1" fill="#f472b6" />
            <rect x="4" y="6" width="1" height="1" fill="#fb7185" />
            <rect x="9" y="6" width="1" height="1" fill="#fb7185" />
            <rect x="6" y="3" width="2" height="1" fill="#facc15" />
            <rect x="6" y="8" width="2" height="1" fill="#f472b6" />
            {/* Cyan burst */}
            <rect x="12" y="7" width="2" height="2" fill="#e0f2fe" />
            <rect x="11" y="6" width="1" height="1" fill="#38bdf8" />
            <rect x="14" y="6" width="1" height="1" fill="#38bdf8" />
            <rect x="12" y="10" width="1" height="1" fill="#22d3ee" />
            {/* City horizon */}
            <rect x="2" y="12" width="14" height="3" fill="#030712" />
            <rect x="4" y="11" width="2" height="1" fill="#030712" />
            <rect x="11" y="11" width="3" height="1" fill="#030712" />
          </g>
        )}

        {sceneIndex === 3 && (
          /* Scene 3: Spotlight Hackathon Trophy */
          <g>
            <rect x="2" y="2" width="14" height="13" fill="#18181b" />
            <rect x="5" y="2" width="8" height="13" fill="#27272a" />
            <rect x="6" y="5" width="6" height="4" fill="#facc15" />
            <rect x="5" y="6" width="1" height="2" fill="#eab308" />
            <rect x="12" y="6" width="1" height="2" fill="#eab308" />
            <rect x="8" y="9" width="2" height="2" fill="#eab308" />
            <rect x="6" y="11" width="6" height="2" fill="#a16207" />
            <rect x="7" y="6" width="1" height="2" fill="#fef9c3" />
            <rect x="4" y="4" width="1" height="1" fill="#fef08a" />
            <rect x="13" y="4" width="1" height="1" fill="#fef08a" />
          </g>
        )}
      </g>

      {/* Chemical dark veil that fades away as the Polaroid develops */}
      <rect x="2" y="2" width="14" height="13" className={styles.developVeil} />

      {/* Subtle handwritten squiggle on bottom Polaroid chin */}
      <rect x="4" y="17" width="6" height="1" className={styles.photoCaptionInk} />
      <rect x="11" y="17" width="3" height="1" className={styles.photoCaptionInk} />
    </svg>
  );
}
