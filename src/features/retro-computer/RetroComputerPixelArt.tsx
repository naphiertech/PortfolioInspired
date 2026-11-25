"use client";

import React from "react";
import type { RetroScreenMode } from "./retroComputerState";
import styles from "./RetroComputer.module.css";

interface RetroComputerPixelArtProps {
  mode: RetroScreenMode;
  floppyEjected: boolean;
  isDark: boolean;
}

/**
 * Handcrafted 2D pixel-editorial 1990s all-in-one beige CRT computer on a
 * 38x40 integer grid:
 * - Warm putty-beige casing, top vents, recessed CRT bezel, power LED, 3.5"
 *   floppy drive slot (with Shift+Click ejectable disk), and mini keyboard.
 * - Live CRT modes: standby glare, boot beam flash, Happy Mac hello face,
 *   phosphor-green scrolling mini-terminal, bouncing cube screensaver, and
 *   classic CRT power-off beam collapse.
 */
export function RetroComputerPixelArt({
  mode,
  floppyEjected,
  isDark,
}: RetroComputerPixelArtProps) {
  const isOn =
    mode === "booting" ||
    mode === "hello" ||
    mode === "terminal" ||
    mode === "screensaver";

  return (
    <svg
      viewBox="0 0 38 40"
      width={90}
      height={95}
      aria-hidden="true"
      shapeRendering="crispEdges"
      className={`${styles.computerSvg} ${isDark ? styles.themeDark : styles.themeLight}`}
    >
      {/* Subtle desk contact shadow */}
      <rect x="4" y="38" width="30" height="2" className={styles.deskShadow} />

      {/* ====================================================================
       * 1. Retro Beige CRT Chassis (All-in-One 1980s/90s Silhouette)
       * ==================================================================== */}
      {/* Outer pixel outline */}
      <rect x="5" y="1" width="28" height="1" className={styles.caseOutline} />
      <rect x="4" y="2" width="1" height="27" className={styles.caseOutline} />
      <rect x="33" y="2" width="1" height="27" className={styles.caseOutline} />
      <rect x="5" y="29" width="28" height="1" className={styles.caseOutline} />

      {/* Main beige housing */}
      <rect x="5" y="2" width="28" height="27" className={styles.caseMain} />
      {/* Sunlit top & left bevel */}
      <rect x="5" y="2" width="28" height="1" className={styles.caseHighlight} />
      <rect x="5" y="2" width="1" height="26" className={styles.caseHighlight} />
      {/* Right & bottom shaded bevel */}
      <rect x="32" y="3" width="1" height="26" className={styles.caseShadow} />
      <rect x="5" y="28" width="28" height="1" className={styles.caseShadow} />

      {/* Top ventilation slots */}
      <rect x="8" y="4" width="3" height="1" className={styles.ventSlot} />
      <rect x="13" y="4" width="3" height="1" className={styles.ventSlot} />
      <rect x="22" y="4" width="3" height="1" className={styles.ventSlot} />
      <rect x="27" y="4" width="3" height="1" className={styles.ventSlot} />

      {/* Recessed CRT monitor bezel */}
      <rect x="7" y="6" width="24" height="16" className={styles.bezelDeep} />
      <rect x="7" y="22" width="24" height="1" className={styles.caseHighlight} />
      <rect x="31" y="7" width="1" height="15" className={styles.caseHighlight} />

      {/* ====================================================================
       * 2. Interactive 22x14 Pixel CRT Display (x: 8..29, y: 7..20)
       * ==================================================================== */}
      <g>
        {/* Base dark CRT glass */}
        <rect x="8" y="7" width="22" height="14" className={styles.crtOffBg} />

        {/* OFF / STANDBY: Diagonal curved glass reflection */}
        {mode === "off" && (
          <g className={styles.crtGlare}>
            <rect x="10" y="9" width="3" height="1" />
            <rect x="10" y="10" width="1" height="2" />
            <rect x="26" y="18" width="2" height="1" opacity="0.45" />
          </g>
        )}

        {/* BOOTING: Classic horizontal CRT beam flash expanding vertically */}
        {mode === "booting" && (
          <g>
            <rect x="8" y="7" width="22" height="14" fill="#d8ece0" className={styles.crtFlashFill} />
            <rect x="8" y="13" width="22" height="2" fill="#ffffff" className={styles.crtBeamOn} />
          </g>
        )}

        {/* HELLO: Iconic Happy Mac smiling pixel face */}
        {mode === "hello" && (
          <g>
            <rect x="8" y="7" width="22" height="14" className={styles.crtHelloBg} />
            {/* Happy pixel face */}
            <rect x="15" y="10" width="2" height="2" fill="#18181b" />
            <rect x="21" y="10" width="2" height="2" fill="#18181b" />
            <rect x="18" y="11" width="1" height="3" fill="#18181b" />
            <rect x="17" y="13" width="1" height="1" fill="#18181b" />
            {/* Cheerful curved pixel smile */}
            <rect x="15" y="15" width="1" height="1" fill="#18181b" />
            <rect x="16" y="16" width="6" height="1" fill="#18181b" />
            <rect x="22" y="15" width="1" height="1" fill="#18181b" />
            {/* Blinking bottom-right status pixel */}
            <rect x="27" y="18" width="1" height="1" fill="#18181b" className={styles.blinkCursor} />
          </g>
        )}

        {/* TERMINAL: Phosphor-green scrolling mini-code terminal */}
        {mode === "terminal" && (
          <g>
            <rect x="8" y="7" width="22" height="14" fill="#071a0e" />
            {/* Prompt + scrolling mini code bars */}
            <rect x="10" y="9" width="2" height="1" fill="#86efac" />
            <rect x="13" y="9" width="9" height="1" fill="#4ade80" />
            <rect x="10" y="11" width="14" height="1" fill="#22c55e" opacity="0.85" />
            <rect x="10" y="13" width="11" height="1" fill="#4ade80" opacity="0.9" />
            <rect x="10" y="15" width="16" height="1" fill="#22c55e" opacity="0.8" />
            <rect x="10" y="17" width="2" height="1" fill="#86efac" />
            <rect x="13" y="17" width="5" height="1" fill="#4ade80" />
            <rect x="19" y="17" width="2" height="1" fill="#bbf7d0" className={styles.blinkCursor} />
          </g>
        )}

        {/* SCREENSAVER: Midnight CRT with bouncing glowing pixel cube */}
        {mode === "screensaver" && (
          <g>
            <rect x="8" y="7" width="22" height="14" fill="#090d1a" />
            <rect x="11" y="9" width="3" height="3" fill="#38bdf8" className={styles.bouncingCube} />
          </g>
        )}

        {/* SHUTTING DOWN: Classic CRT beam collapse to bright center dot */}
        {mode === "shutting-down" && (
          <g>
            <rect x="8" y="13" width="22" height="2" fill="#ffffff" className={styles.crtBeamOff} />
          </g>
        )}

        {/* Subtle horizontal CRT scanlines when powered on */}
        {isOn && (
          <g opacity="0.16" fill="#000000">
            <rect x="8" y="8" width="22" height="1" />
            <rect x="8" y="10" width="22" height="1" />
            <rect x="8" y="12" width="22" height="1" />
            <rect x="8" y="14" width="22" height="1" />
            <rect x="8" y="16" width="22" height="1" />
            <rect x="8" y="18" width="22" height="1" />
            <rect x="8" y="20" width="22" height="1" />
          </g>
        )}
      </g>

      {/* ====================================================================
       * 3. Front Chin: Emblem, Power LED, & 3.5" Floppy Drive Slot
       * ==================================================================== */}
      {/* Tiny classic 3-pixel badge */}
      <rect x="8" y="24" width="1" height="1" fill="#22c55e" />
      <rect x="8" y="25" width="1" height="1" fill="#facc15" />
      <rect x="8" y="26" width="1" height="1" fill="#ef4444" />

      {/* Power status LED */}
      <rect
        x="11"
        y="25"
        width="2"
        height="1"
        className={isOn ? styles.ledOn : styles.ledStandby}
      />

      {/* 3.5" Floppy Disk Slot */}
      <rect x="20" y="25" width="10" height="1" className={styles.caseOutline} />
      <rect x="24" y="24" width="2" height="3" className={styles.bezelDeep} />

      {/* Ejectable 3.5" Pixel Floppy Disk (Shift+Click secret!) */}
      {floppyEjected && (
        <g className={styles.floppyDisk}>
          <rect x="21" y="25" width="8" height="6" fill="#18181b" />
          <rect x="22" y="26" width="6" height="4" fill="#3f3f46" />
          {/* Silver metal shutter */}
          <rect x="23" y="26" width="4" height="2" fill="#d4d4d8" />
          {/* Paper label */}
          <rect x="22" y="28" width="6" height="2" fill="#fafaf9" />
        </g>
      )}

      {/* ====================================================================
       * 4. Stand & Miniature Detached 90s Mechanical Keyboard
       * ==================================================================== */}
      {/* Compact CRT stand neck */}
      <rect x="10" y="30" width="18" height="2" className={styles.caseShadow} />
      <rect x="9" y="30" width="1" height="2" className={styles.caseOutline} />
      <rect x="28" y="30" width="1" height="2" className={styles.caseOutline} />

      {/* Detached retro keyboard tucked neatly in front */}
      <rect x="3" y="32" width="32" height="1" className={styles.caseOutline} />
      <rect x="2" y="33" width="1" height="5" className={styles.caseOutline} />
      <rect x="35" y="33" width="1" height="5" className={styles.caseOutline} />
      <rect x="3" y="38" width="32" height="1" className={styles.caseOutline} />
      <rect x="3" y="33" width="32" height="5" className={styles.caseMain} />
      <rect x="3" y="37" width="32" height="1" className={styles.caseShadow} />

      {/* Miniature pixel keycap rows */}
      <g className={styles.keycap}>
        <rect x="5" y="34" width="2" height="1" />
        <rect x="8" y="34" width="2" height="1" />
        <rect x="11" y="34" width="2" height="1" />
        <rect x="14" y="34" width="2" height="1" />
        <rect x="17" y="34" width="2" height="1" />
        <rect x="20" y="34" width="2" height="1" />
        <rect x="23" y="34" width="2" height="1" />
        <rect x="26" y="34" width="2" height="1" />
        <rect x="29" y="34" width="4" height="1" />

        <rect x="5" y="36" width="4" height="1" />
        <rect x="11" y="36" width="12" height="1" />
        <rect x="25" y="36" width="3" height="1" />
        <rect x="29" y="36" width="4" height="1" />
      </g>
    </svg>
  );
}
