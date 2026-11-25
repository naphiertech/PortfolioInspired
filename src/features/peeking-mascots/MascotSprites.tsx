"use client";

import React from "react";
import type { MascotId, MascotMood } from "./mascotState";
import styles from "./PeekingMascots.module.css";

interface MascotSpriteProps {
  id: MascotId;
  mood: MascotMood;
}

/**
 * Shared painterly SVG definitions giving all three mascots the signature
 * Claude-style storybook risograph texture: zero hard outlines, soft beveled
 * terracotta gradients, delicate stipple dots, and organic pastel edge warmth.
 */
function PainterlyDefs({ prefix }: { prefix: string }) {
  return (
    <defs>
      {/* Subtle organic hand-drawn edge softness (no harsh vector rigidity) */}
      <filter id={`${prefix}-organic`} x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.06"
          numOctaves="2"
          seed={prefix === "scout" ? 3 : prefix === "tinker" ? 7 : 11}
          result="noise"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="noise"
          scale="1.35"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>

      {/* Subtle risograph stipple grain pattern for the terracotta body */}
      <pattern
        id={`${prefix}-stipple`}
        width="6"
        height="6"
        patternUnits="userSpaceOnUse"
      >
        <circle cx="1.2" cy="1.5" r="0.65" fill="#9a3c16" opacity="0.22" />
        <circle cx="4.3" cy="3.8" r="0.55" fill="#b44b1f" opacity="0.18" />
        <circle cx="2.6" cy="5.1" r="0.45" fill="#fbd2b4" opacity="0.24" />
      </pattern>

      {/* Subtle felt grain pattern for hats & headphones */}
      <pattern
        id={`${prefix}-felt`}
        width="5"
        height="5"
        patternUnits="userSpaceOnUse"
      >
        <circle cx="1.2" cy="1.2" r="0.55" fill="#ffffff" opacity="0.09" />
        <circle cx="3.6" cy="3.4" r="0.6" fill="#000000" opacity="0.14" />
      </pattern>

      {/* Warm Claude terracotta body gradient (bright soft center, deeper warm edges) */}
      <linearGradient id={`${prefix}-body`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ee8650" />
        <stop offset="52%" stopColor="#df723e" />
        <stop offset="100%" stopColor="#cc5f2e" />
      </linearGradient>

      {/* Subtle top-down warm shade under hat brim */}
      <linearGradient id={`${prefix}-brim-shade`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#8a3817" stopOpacity="0.34" />
        <stop offset="100%" stopColor="#8a3817" stopOpacity="0" />
      </linearGradient>

      {/* Chunky paw soft-shaded gradient */}
      <linearGradient id={`${prefix}-paw`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f18952" />
        <stop offset="72%" stopColor="#e2713b" />
        <stop offset="100%" stopColor="#c45626" />
      </linearGradient>

      {/* Soft unoutlined cream cheek/blush radial glow */}
      <radialGradient id={`${prefix}-cheek`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fae0cc" stopOpacity="0.96" />
        <stop offset="76%" stopColor="#f4cbb0" stopOpacity="0.88" />
        <stop offset="100%" stopColor="#ec9c6f" stopOpacity="0" />
      </radialGradient>

      {/* Frosted magnifying glass lens tint */}
      <radialGradient id={`${prefix}-lens`} cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.48" />
        <stop offset="55%" stopColor="#f8e3d4" stopOpacity="0.26" />
        <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.34" />
      </radialGradient>

      {/* Detective felt brown gradient */}
      <linearGradient id={`${prefix}-felt-brown`} x1="0" y1="0" x2="0.8" y2="1">
        <stop offset="0%" stopColor="#655040" />
        <stop offset="55%" stopColor="#4c3a2d" />
        <stop offset="100%" stopColor="#35271d" />
      </linearGradient>

      {/* Tinker slate-indigo painter cap gradient */}
      <linearGradient id={`${prefix}-cap-slate`} x1="0" y1="0" x2="0.8" y2="1">
        <stop offset="0%" stopColor="#5c6675" />
        <stop offset="58%" stopColor="#3f4754" />
        <stop offset="100%" stopColor="#2a303a" />
      </linearGradient>

      {/* Craft warm-espresso headphone gradient */}
      <linearGradient id={`${prefix}-phone-dark`} x1="0" y1="0" x2="0.8" y2="1">
        <stop offset="0%" stopColor="#524a44" />
        <stop offset="60%" stopColor="#38322e" />
        <stop offset="100%" stopColor="#24201d" />
      </linearGradient>
    </defs>
  );
}

/**
 * Shared Claude-style blocky terracotta body: zero hard outlines, side highlight
 * bevels, risograph stipple dots, soft off-center cream cheek patch, and glossy
 * deep-navy cursor-tracking eyes.
 */
function ClaudeMascotBody({
  prefix,
  eyeLeftX,
  eyeRightX,
  eyeY,
  cheekX,
  cheekY,
  blinkClass,
}: {
  prefix: string;
  eyeLeftX: number;
  eyeRightX: number;
  eyeY: number;
  cheekX: number;
  cheekY: number;
  blinkClass: string;
}) {
  return (
    <g>
      {/* Organic textured slightly-tapered blocky body */}
      <g filter={`url(#${prefix}-organic)`}>
        <path
          d="M23 25 L69 25 L71 57 L21 57 Z"
          fill={`url(#${prefix}-body)`}
        />
        {/* Subtle left & right vertical warm rim edges (like the real Claude block) */}
        <path d="M23 25 L26.5 25 L25 57 L21 57 Z" fill="#f59a66" opacity="0.65" />
        <path d="M65.5 25 L69 25 L71 57 L67 57 Z" fill="#ba4f22" opacity="0.55" />
        {/* Stippled risograph grain overlay */}
        <path d="M23 25 L69 25 L71 57 L21 57 Z" fill={`url(#${prefix}-stipple)`} />
        {/* Soft cast shadow under hat/top edge */}
        <rect x="22" y="25" width="48" height="9" fill={`url(#${prefix}-brim-shade)`} />
      </g>

      {/* Soft unoutlined cream cheek/snout highlight */}
      <ellipse cx={cheekX} cy={cheekY} rx="10" ry="6.2" fill={`url(#${prefix}-cheek)`} />

      {/* Glossy deep-navy cursor-tracking eyes (slightly tilted & expressive) */}
      <g className={styles.eyeTrackGroup}>
        <g
          className={blinkClass}
          style={{
            transformOrigin: `${(eyeLeftX + eyeRightX) / 2}px ${eyeY}px`,
          }}
        >
          <g transform={`rotate(4 ${eyeLeftX} ${eyeY})`}>
            <ellipse cx={eyeLeftX} cy={eyeY} rx="3.7" ry="5.6" fill="#131924" />
            <ellipse
              cx={eyeLeftX + 0.9}
              cy={eyeY - 2.1}
              rx="1.25"
              ry="1.7"
              fill="#f8fafc"
              opacity="0.92"
            />
          </g>
          <g transform={`rotate(4 ${eyeRightX} ${eyeY})`}>
            <ellipse cx={eyeRightX} cy={eyeY} rx="3.7" ry="5.6" fill="#131924" />
            <ellipse
              cx={eyeRightX + 0.9}
              cy={eyeY - 2.1}
              rx="1.25"
              ry="1.7"
              fill="#f8fafc"
              opacity="0.92"
            />
          </g>
        </g>
      </g>
    </g>
  );
}

/**
 * Unoutlined chunky Claude-style paws gripping cleanly over the top card border
 * with warm underside shading and two soft vertical paw marks.
 */
function ClaudeBorderPaws({ prefix }: { prefix: string }) {
  return (
    <g filter={`url(#${prefix}-organic)`}>
      {/* Soft contact underside shadow */}
      <ellipse cx="26.5" cy="59.5" rx="10.5" ry="5.2" fill="#9c4019" opacity="0.28" />
      <ellipse cx="64.5" cy="59.5" rx="10.5" ry="5.2" fill="#9c4019" opacity="0.28" />

      {/* Left plump paw */}
      <rect x="15.5" y="50.5" width="21.5" height="12.5" rx="6.2" fill={`url(#${prefix}-paw)`} />
      <rect x="18" y="51.8" width="15" height="3" rx="1.5" fill="#f7a879" opacity="0.45" />
      <line x1="24.2" y1="54.8" x2="24.2" y2="58.2" stroke="#b94e22" strokeWidth="1.7" strokeLinecap="round" />
      <line x1="28.3" y1="54.8" x2="28.3" y2="58.2" stroke="#b94e22" strokeWidth="1.7" strokeLinecap="round" />

      {/* Right plump paw */}
      <rect x="54" y="50.5" width="21.5" height="12.5" rx="6.2" fill={`url(#${prefix}-paw)`} />
      <rect x="56.5" y="51.8" width="15" height="3" rx="1.5" fill="#f7a879" opacity="0.45" />
      <line x1="62.7" y1="54.8" x2="62.7" y2="58.2" stroke="#b94e22" strokeWidth="1.7" strokeLinecap="round" />
      <line x1="66.8" y1="54.8" x2="66.8" y2="58.2" stroke="#b94e22" strokeWidth="1.7" strokeLinecap="round" />
    </g>
  );
}

/**
 * Three cohesive Claude-style painterly storybook mascots:
 * - Scout (<CURRENT-FOCUS/>): Textured brown felt detective hat + frosted magnifying glass
 * - Tinker (<WHAT-I-BUILD/>): Painterly slate builder cap + brushed mini-wrench
 * - Craft (<HOW-I-WORK/>): Soft felt studio headphones + cozy warm stylus/note aura
 */
export function MascotSprite({ id, mood }: MascotSpriteProps) {
  const isReacting = mood === "reacting";
  const isCelebrating = mood === "celebrating";

  if (id === "scout") {
    return (
      <svg
        viewBox="0 0 92 66"
        width={78}
        height={56}
        aria-hidden="true"
        className={`${styles.mascotSvg} ${isReacting ? styles.scoutReact : ""} ${
          isCelebrating ? styles.waveHop0 : ""
        }`}
      >
        <PainterlyDefs prefix="scout" />

        {/* Discovery sparkle popping on click */}
        {(isReacting || isCelebrating) && (
          <g className={styles.popSparkle}>
            <path d="M46 0.5 L47.5 4.2 L51.2 5.6 L47.5 7 L46 10.7 L44.5 7 L40.8 5.6 L44.5 4.2 Z" fill="#df723e" />
          </g>
        )}

        <g className={styles.bodyGroup}>
          <ClaudeMascotBody
            prefix="scout"
            eyeLeftX={40.5}
            eyeRightX={50.5}
            eyeY={35.5}
            cheekX={55}
            cheekY={44.5}
            blinkClass={styles.blinkSlowA}
          />

          {/* Painterly textured brown felt detective hat (no hard outlines) */}
          <g className={styles.hatGroup} filter="url(#scout-organic)">
            {/* Outer soft felt crown */}
            <path
              d="M21 25 C23 11, 34 6.5, 46 6.5 C58 6.5, 68 11, 70 25 Z"
              fill="url(#scout-felt-brown)"
            />
            <path
              d="M21 25 C23 11, 34 6.5, 46 6.5 C58 6.5, 68 11, 70 25 Z"
              fill="url(#scout-felt)"
            />
            {/* Warm sienna ribbon curving across the crown */}
            <path
              d="M22.5 21 Q45 12 68.5 21 L69.2 24.8 Q45 16.2 22 24.8 Z"
              fill="#a35229"
              opacity="0.88"
            />
            {/* Soft organic rounded hat brim */}
            <path
              d="M14.5 24.5 C25 20.5, 66 20.5, 76.5 24.5 C77.5 28.5, 66 30, 45.5 29.2 C25 30, 14 28.5, 14.5 24.5 Z"
              fill="#423125"
            />
            <path
              d="M18 24.2 C29 21.6, 62 21.6, 73 24.2"
              fill="none"
              stroke="#78604d"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.55"
            />
          </g>

          {/* Translucent frosted magnifying glass */}
          <g className={styles.scoutGlass}>
            <line
              x1="71.5"
              y1="40.5"
              x2="78.5"
              y2="50.5"
              stroke="#4a3425"
              strokeWidth="4.4"
              strokeLinecap="round"
            />
            <circle
              cx="66.5"
              cy="33.5"
              r="10.2"
              fill="url(#scout-lens)"
              stroke="#7b838e"
              strokeWidth="3.2"
            />
            {/* Crisp curved white specular gleam on glass */}
            <path
              d="M61.6 29.2 A6 6 0 0 1 68.8 28.4"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.1"
              strokeLinecap="round"
              opacity="0.92"
            />
          </g>
        </g>

        <ClaudeBorderPaws prefix="scout" />
      </svg>
    );
  }

  if (id === "tinker") {
    return (
      <svg
        viewBox="0 0 92 66"
        width={78}
        height={56}
        aria-hidden="true"
        className={`${styles.mascotSvg} ${isReacting ? styles.tinkerReact : ""} ${
          isCelebrating ? styles.waveHop1 : ""
        }`}
      >
        <PainterlyDefs prefix="tinker" />

        {/* Subtle geometric spark burst on click */}
        {(isReacting || isCelebrating) && (
          <g className={styles.popSparkle}>
            <rect x="37" y="2.5" width="3.8" height="3.8" rx="1" fill="#df723e" />
            <rect x="49" y="0.5" width="3.2" height="3.2" rx="1" fill="#5c6675" />
            <rect x="55" y="5.5" width="3" height="3" rx="1" fill="#f19c66" />
          </g>
        )}

        <g className={styles.bodyGroup}>
          <ClaudeMascotBody
            prefix="tinker"
            eyeLeftX={39}
            eyeRightX={52}
            eyeY={36}
            cheekX={45.5}
            cheekY={45.5}
            blinkClass={styles.blinkSlowB}
          />

          {/* Painterly slate-indigo builder cap (same soft felt finish) */}
          <g className={styles.hatGroup} filter="url(#tinker-organic)">
            <path
              d="M22 25 C24 12, 33 7.5, 46 7.5 C59 7.5, 68 12, 70 25 Z"
              fill="url(#tinker-cap-slate)"
            />
            <path
              d="M22 25 C24 12, 33 7.5, 46 7.5 C59 7.5, 68 12, 70 25 Z"
              fill="url(#tinker-felt)"
            />
            {/* Soft raised crown ridge & warm copper builder emblem */}
            <rect x="41.5" y="8.5" width="9" height="12" rx="4" fill="#6b7788" opacity="0.65" />
            <rect x="43.5" y="15.5" width="5" height="3" rx="1.2" fill="#ee8c56" />
            {/* Curved cap visor brim */}
            <path
              d="M17.5 25 C28 21.5, 64 21.5, 75 25 C75 28.5, 62 29, 46 28.5 C30 29, 17.5 28.5, 17.5 25 Z"
              fill="#313844"
            />
            <path
              d="M22 24.4 C33 22.3, 59 22.3, 70 24.4"
              fill="none"
              stroke="#7e8a9c"
              strokeWidth="1.4"
              strokeLinecap="round"
              opacity="0.55"
            />
          </g>

          {/* Soft-shaded brushed steel mini-wrench */}
          <g className={styles.tinkerWrench} filter="url(#tinker-organic)">
            <rect x="69.5" y="30" width="5.2" height="19" rx="2.5" fill="#8b95a5" />
            <rect x="70.8" y="31" width="1.6" height="16" rx="0.8" fill="#cbd5e1" opacity="0.65" />
            <circle cx="72.1" cy="28.2" r="6" fill="#9ca6b5" />
            <circle cx="72.1" cy="27.2" r="3.2" fill="#475569" opacity="0.22" />
            <path d="M70 22.4 L74.2 22.4 L73.8 27.6 L70.4 27.6 Z" fill="#f8fafc" />
          </g>
        </g>

        <ClaudeBorderPaws prefix="tinker" />
      </svg>
    );
  }

  // Mascot 3: Craft (<HOW-I-WORK/>) — Same painterly Claude terracotta mascot in soft felt headphones
  return (
    <svg
      viewBox="0 0 92 66"
      width={78}
      height={56}
      aria-hidden="true"
      className={`${styles.mascotSvg} ${isReacting ? styles.craftReact : ""} ${
        isCelebrating ? styles.waveHop2 : ""
      }`}
    >
      <PainterlyDefs prefix="craft" />

      {/* Warm music note & sparkle popping on click */}
      {(isReacting || isCelebrating) && (
        <g className={styles.popSparkle}>
          <circle cx="40" cy="7.5" r="2.5" fill="#4c3a2d" />
          <line x1="42.2" y1="7.5" x2="42.2" y2="1.5" stroke="#4c3a2d" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M42.2 1.5 L47.2 3" stroke="#4c3a2d" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M53 3 L54.1 5.8 L56.9 6.9 L54.1 8 L53 10.8 L51.9 8 L49.1 6.9 L51.9 5.8 Z" fill="#df723e" />
        </g>
      )}

      <g className={styles.bodyGroup}>
        {/* Plush overhead studio headphone arch (unoutlined painterly espresso felt) */}
        <g filter="url(#craft-organic)">
          <path
            d="M20 35 C20 13, 31 8, 46 8 C61 8, 72 13, 72 35"
            fill="none"
            stroke="url(#craft-phone-dark)"
            strokeWidth="5.2"
            strokeLinecap="round"
          />
          <path
            d="M24 28 C25 15, 34 11, 46 11 C58 11, 67 15, 68 28"
            fill="none"
            stroke="#8a7c72"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.55"
          />
        </g>

        <ClaudeMascotBody
          prefix="craft"
          eyeLeftX={39}
          eyeRightX={52}
          eyeY={35.5}
          cheekX={45.5}
          cheekY={45}
          blinkClass={styles.blinkSlowC}
        />

        {/* Plush felt studio earcups hugging the sides of the blocky head */}
        <g filter="url(#craft-organic)">
          <rect x="14.5" y="29" width="8.2" height="16.5" rx="4.1" fill="url(#craft-phone-dark)" />
          <rect x="16.4" y="32" width="2.4" height="10" rx="1.2" fill="#a89c93" opacity="0.55" />
          <rect x="69.3" y="29" width="8.2" height="16.5" rx="4.1" fill="url(#craft-phone-dark)" />
          <rect x="73.2" y="32" width="2.4" height="10" rx="1.2" fill="#a89c93" opacity="0.55" />
        </g>
      </g>

      <ClaudeBorderPaws prefix="craft" />
    </svg>
  );
}
