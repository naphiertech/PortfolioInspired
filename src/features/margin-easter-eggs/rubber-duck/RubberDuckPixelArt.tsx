"use client";

import React from "react";
import type { DuckPhase } from "./duckState";
import styles from "./RubberDuckGutter.module.css";

interface RubberDuckPixelArtProps {
  phase: DuckPhase;
  sunglasses: boolean;
  isDark: boolean;
}

/**
 * Hand-authored 24x24 pixel Rubber Duck Debugger facing right toward <TECH-STACK/>.
 * - Opens its orange beak while squeaking
 * - Shift+Click snaps on classic pixel "deal-with-it" sunglasses
 */
export function RubberDuckPixelArt({
  phase,
  sunglasses,
  isDark,
}: RubberDuckPixelArtProps) {
  const isSqueaking = phase === "squeaking";

  return (
    <svg
      viewBox="0 0 24 24"
      width={62}
      height={62}
      aria-hidden="true"
      shapeRendering="crispEdges"
      className={`${styles.duckSvg} ${isDark ? styles.themeDark : styles.themeLight}`}
    >
      {/* Ground contact shadow */}
      <rect x="4" y="21" width="15" height="2" className={styles.groundShadow} />

      {/* Crisp dark pixel outline */}
      <g className={styles.outline}>
        {/* Head tuft & crown */}
        <rect x="10" y="2" width="4" height="1" />
        <rect x="8" y="3" width="8" height="1" />
        <rect x="7" y="4" width="10" height="6" />
        {/* Beak outline */}
        <rect x="17" y="6" width="4" height={isSqueaking ? 4 : 3} />
        {/* Neck & body outline */}
        <rect x="3" y="10" width="16" height="10" />
        <rect x="2" y="11" width="2" height="5" />
        <rect x="4" y="20" width="14" height="1" />
      </g>

      {/* Golden yellow head & body */}
      <rect x="9" y="3" width="6" height="1" fill="#facc15" />
      <rect x="8" y="4" width="8" height="6" fill="#facc15" />
      <rect x="3" y="11" width="2" height="4" fill="#facc15" />
      <rect x="4" y="11" width="14" height="8" fill="#facc15" />
      <rect x="5" y="19" width="12" height="1" fill="#eab308" />

      {/* Sunlit cream-yellow head & wing shine */}
      <rect x="9" y="4" width="3" height="2" fill="#fef08a" />
      <rect x="6" y="13" width="7" height="4" fill="#eab308" />
      <rect x="7" y="13" width="5" height="2" fill="#fef08a" />
      {/* Tail tip */}
      <rect x="3" y="11" width="1" height="2" fill="#fef08a" />

      {/* Orange beak (opens briefly during squeak!) */}
      {isSqueaking ? (
        <g>
          <rect x="17" y="6" width="3" height="1" fill="#fb923c" />
          <rect x="17" y="7" width="3" height="1" fill="#9a3412" />
          <rect x="17" y="8" width="3" height="1" fill="#f97316" />
        </g>
      ) : (
        <g>
          <rect x="17" y="7" width="3" height="1" fill="#fb923c" />
          <rect x="17" y="8" width="3" height="1" fill="#ea580c" />
        </g>
      )}

      {/* Expressive eye OR Shift+Click pixel hacker sunglasses */}
      {sunglasses ? (
        <g>
          {/* Classic pixel deal-with-it shades */}
          <rect x="8" y="5" width="9" height="1" fill="#09090b" />
          <rect x="11" y="5" width="6" height="3" fill="#09090b" />
          <rect x="12" y="6" width="1" height="1" fill="#ffffff" />
          <rect x="15" y="6" width="1" height="1" fill="#ffffff" />
        </g>
      ) : (
        <g>
          <rect x="13" y="5" width="2" height="2" fill="#09090b" />
          <rect x="14" y="5" width="1" height="1" fill="#ffffff" />
        </g>
      )}
    </svg>
  );
}
