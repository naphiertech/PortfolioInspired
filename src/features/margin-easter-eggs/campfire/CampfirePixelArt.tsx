"use client";

import React from "react";
import type { CampfirePhase, CampfireVariant } from "./campfireState";
import styles from "./CampfireGutter.module.css";

interface CampfirePixelArtProps {
  phase: CampfirePhase;
  variant: CampfireVariant;
  isDark: boolean;
}

const CX = 40;
const CY = 52;
const SX = 2.0;
const SY = 1.0;
const SH = 2.25;

/** Projects a Minecraft 16x16x16 block voxel point into 2:1 isometric SVG coordinates. */
function iso(x: number, y: number, z: number): string {
  const px = +(CX + (x - z) * SX).toFixed(2);
  const py = +(CY + (x + z) * SY - y * SH).toFixed(2);
  return `${px},${py}`;
}

function quad(
  p1: [number, number, number],
  p2: [number, number, number],
  p3: [number, number, number],
  p4: [number, number, number]
): string {
  return `${iso(...p1)} ${iso(...p2)} ${iso(...p3)} ${iso(...p4)}`;
}

// Deterministic bark-grain pattern indices across a 16-voxel log length
const BARK_TOP_BANDS: ReadonlyArray<{ start: number; len: number; tone: "dark" | "light" | "mid" }> = [
  { start: 0, len: 3, tone: "mid" },
  { start: 3, len: 2, tone: "dark" },
  { start: 5, len: 3, tone: "light" },
  { start: 8, len: 3, tone: "dark" },
  { start: 11, len: 2, tone: "light" },
  { start: 13, len: 3, tone: "mid" },
];

const BARK_SIDE_BANDS: ReadonlyArray<{ start: number; len: number; tone: "dark" | "mid" }> = [
  { start: 1, len: 3, tone: "dark" },
  { start: 6, len: 2, tone: "dark" },
  { start: 10, len: 3, tone: "dark" },
];

interface VoxelLogProps {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  z0: number;
  z1: number;
  axis: "x" | "z";
  showFrontRimGlow?: boolean;
}

/**
 * Renders one authentic Minecraft campfire oak log cuboid with bark stripes and
 * concentric tan cut-wood end-grain rings.
 */
function VoxelLog({
  x0,
  x1,
  y0,
  y1,
  z0,
  z1,
  axis,
  showFrontRimGlow = false,
}: VoxelLogProps) {
  const topFace = quad([x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]);
  const rightFace = quad([x1, y1, z0], [x1, y1, z1], [x1, y0, z1], [x1, y0, z0]);
  const leftFace = quad([x0, y1, z1], [x1, y1, z1], [x1, y0, z1], [x0, y0, z1]);

  // Cut end-grain concentric rings (on +X face for X-axis logs, +Z face for Z-axis logs)
  const renderCutEnd = () => {
    if (axis === "x") {
      // +X cut face spans z0..z1, y0..y1
      return (
        <g>
          <polygon points={rightFace} className={styles.woodEndOuter} />
          <polygon
            points={quad(
              [x1, y1 - 0.65, z0 + 0.65],
              [x1, y1 - 0.65, z1 - 0.65],
              [x1, y0 + 0.65, z1 - 0.65],
              [x1, y0 + 0.65, z0 + 0.65]
            )}
            className={styles.woodEndSap}
          />
          <polygon
            points={quad(
              [x1, y1 - 1.3, z0 + 1.3],
              [x1, y1 - 1.3, z1 - 1.3],
              [x1, y0 + 1.3, z1 - 1.3],
              [x1, y0 + 1.3, z0 + 1.3]
            )}
            className={styles.woodEndCore}
          />
        </g>
      );
    }

    // +Z cut face spans x0..x1, y0..y1
    return (
      <g>
        <polygon points={leftFace} className={styles.woodEndOuterLeft} />
        <polygon
          points={quad(
            [x0 + 0.65, y1 - 0.65, z1],
            [x1 - 0.65, y1 - 0.65, z1],
            [x1 - 0.65, y0 + 0.65, z1],
            [x0 + 0.65, y0 + 0.65, z1]
          )}
          className={styles.woodEndSapLeft}
        />
        <polygon
          points={quad(
            [x0 + 1.3, y1 - 1.3, z1],
            [x1 - 1.3, y1 - 1.3, z1],
            [x1 - 1.3, y0 + 1.3, z1],
            [x0 + 1.3, y0 + 1.3, z1]
          )}
          className={styles.woodEndCoreLeft}
        />
      </g>
    );
  };

  // Bark pixel striations along the top and visible long side
  const renderBarkTexture = () => {
    if (axis === "x") {
      const zMid = (z0 + z1) / 2;
      const yMid = (y0 + y1) / 2;
      return (
        <g>
          {/* Top bark grain strips */}
          {BARK_TOP_BANDS.map((band, idx) => (
            <polygon
              key={`xt-${idx}`}
              points={quad(
                [x0 + band.start, y1, idx % 2 === 0 ? z0 + 0.5 : zMid],
                [x0 + band.start + band.len, y1, idx % 2 === 0 ? z0 + 0.5 : zMid],
                [x0 + band.start + band.len, y1, idx % 2 === 0 ? zMid : z1 - 0.5],
                [x0 + band.start, y1, idx % 2 === 0 ? zMid : z1 - 0.5]
              )}
              className={
                band.tone === "dark"
                  ? styles.woodTopDark
                  : band.tone === "light"
                    ? styles.woodTopLight
                    : styles.woodTop
              }
            />
          ))}
          {/* Front-left (+Z) long bark side stripes */}
          {BARK_SIDE_BANDS.map((band, idx) => (
            <polygon
              key={`xs-${idx}`}
              points={quad(
                [x0 + band.start, idx % 2 === 0 ? y1 - 0.4 : yMid, z1],
                [x0 + band.start + band.len, idx % 2 === 0 ? y1 - 0.4 : yMid, z1],
                [x0 + band.start + band.len, idx % 2 === 0 ? yMid : y0 + 0.4, z1],
                [x0 + band.start, idx % 2 === 0 ? yMid : y0 + 0.4, z1]
              )}
              className={styles.woodLeftDark}
            />
          ))}
          {/* Optional warm firelight rim along the pit-facing back edge */}
          {showFrontRimGlow && (
            <polygon
              points={quad(
                [x0 + 3.5, y1, z0],
                [x1 - 3.5, y1, z0],
                [x1 - 3.5, y1, z0 + 0.9],
                [x0 + 3.5, y1, z0 + 0.9]
              )}
              className={styles.logRimLight}
            />
          )}
        </g>
      );
    }

    // Z-axis log bark striations
    const xMid = (x0 + x1) / 2;
    const yMid = (y0 + y1) / 2;
    return (
      <g>
        {BARK_TOP_BANDS.map((band, idx) => (
          <polygon
            key={`zt-${idx}`}
            points={quad(
              [idx % 2 === 0 ? x0 + 0.5 : xMid, y1, z0 + band.start],
              [idx % 2 === 0 ? xMid : x1 - 0.5, y1, z0 + band.start],
              [idx % 2 === 0 ? xMid : x1 - 0.5, y1, z0 + band.start + band.len],
              [idx % 2 === 0 ? x0 + 0.5 : xMid, y1, z0 + band.start + band.len]
            )}
            className={
              band.tone === "dark"
                ? styles.woodTopDark
                : band.tone === "light"
                  ? styles.woodTopLight
                  : styles.woodTop
            }
          />
        ))}
        {/* Front-right (+X) long bark side stripes */}
        {BARK_SIDE_BANDS.map((band, idx) => (
          <polygon
            key={`zs-${idx}`}
            points={quad(
              [x1, idx % 2 === 0 ? y1 - 0.4 : yMid, z0 + band.start],
              [x1, idx % 2 === 0 ? y1 - 0.4 : yMid, z0 + band.start + band.len],
              [x1, idx % 2 === 0 ? yMid : y0 + 0.4, z0 + band.start + band.len],
              [x1, idx % 2 === 0 ? yMid : y0 + 0.4, z0 + band.start]
            )}
            className={styles.woodRightDark}
          />
        ))}
      </g>
    );
  };

  return (
    <g>
      <polygon points={topFace} className={styles.woodTop} />
      {axis === "x" ? (
        <>
          <polygon points={leftFace} className={styles.woodLeft} />
          {renderBarkTexture()}
          {renderCutEnd()}
        </>
      ) : (
        <>
          <polygon points={rightFace} className={styles.woodRight} />
          {renderBarkTexture()}
          {renderCutEnd()}
        </>
      )}
    </g>
  );
}

/**
 * Chunky 3D isometric Minecraft Oak Campfire block (true `#` stacked voxel logs
 * over a recessed dark charcoal/ash pit) with a 4-frame stepped pixel flame that
 * rises naturally from inside the pit between the back and front logs.
 */
export function CampfirePixelArt({
  phase,
  variant,
  isDark,
}: CampfirePixelArtProps) {
  const isBurning = phase === "lit" || phase === "igniting";
  const isIgniting = phase === "igniting";
  const isDousing = phase === "dousing";

  return (
    <svg
      viewBox="0 0 80 88"
      width={78}
      height={86}
      aria-hidden="true"
      className={`${styles.pixelSvg} ${isDark ? styles.themeDark : styles.themeLight} ${
        variant === "soul" ? styles.variantSoul : styles.variantClassic
      } ${isBurning ? styles.isBurning : ""} ${isIgniting ? styles.isIgniting : ""} ${
        isDousing ? styles.isDousing : ""
      }`}
    >
      {/* Subtle grounded contact shadow beneath the isometric block */}
      <polygon
        points={quad([-0.6, 0, -0.6], [16.6, 0, -0.6], [16.6, 0, 16.6], [-0.6, 0, 16.6])}
        className={styles.groundShadow}
      />

      {/* 1. Bottom Layer: Back-left & Front-right Z-axis oak logs + Recessed Charcoal/Ash Slab */}
      {/* Bottom-left Z log (x: 1..5, y: 0..3.5, z: 0..16) */}
      <VoxelLog x0={1} x1={5} y0={0} y1={3.5} z0={0} z1={16} axis="z" />

      {/* Center Recessed Charcoal / Ash Bed visible through the gap (x: 5..11, y: 0..1.5, z: 1..15) */}
      <g>
        <polygon
          points={quad([5, 1.5, 1], [11, 1.5, 1], [11, 1.5, 15], [5, 1.5, 15])}
          className={styles.ashBase}
        />
        <polygon
          points={quad([5, 1.5, 15], [11, 1.5, 15], [11, 0, 15], [5, 0, 15])}
          className={styles.ashEdge}
        />
        {/* Checkered charcoal/slate pixels inside the pit */}
        <polygon
          points={quad([5.6, 1.55, 5], [8, 1.55, 5], [8, 1.55, 8], [5.6, 1.55, 8])}
          className={styles.ashTileLight}
        />
        <polygon
          points={quad([8, 1.55, 8], [10.4, 1.55, 8], [10.4, 1.55, 11], [8, 1.55, 11])}
          className={styles.ashTileLight}
        />
        <polygon
          points={quad([6, 1.55, 11.5], [8.5, 1.55, 11.5], [8.5, 1.55, 14.2], [6, 1.55, 14.2])}
          className={styles.ashTileDark}
        />
        <polygon
          points={quad([8.4, 1.55, 4.5], [10.5, 1.55, 4.5], [10.5, 1.55, 7], [8.4, 1.55, 7])}
          className={styles.ashTileDark}
        />

        {/* Subtle warm hover ember spark when unlit */}
        {!isBurning && (
          <polygon
            points={quad([7.1, 1.6, 7.1], [9.1, 1.6, 7.1], [9.1, 1.6, 9.1], [7.1, 1.6, 9.1])}
            className={styles.hoverEmberGlint}
          />
        )}

        {/* Glowing ember coal bed when lit */}
        {isBurning && (
          <g className={styles.coalBed}>
            <polygon
              points={quad([5.2, 1.6, 4.2], [10.8, 1.6, 4.2], [10.8, 1.6, 12.2], [5.2, 1.6, 12.2])}
              className={styles.coalOuter}
            />
            <polygon
              points={quad([6.2, 1.65, 5.4], [9.8, 1.65, 5.4], [9.8, 1.65, 10.6], [6.2, 1.65, 10.6])}
              className={styles.coalMid}
            />
            <polygon
              points={quad([7, 1.7, 6.6], [9.1, 1.7, 6.6], [9.1, 1.7, 9.4], [7, 1.7, 9.4])}
              className={styles.coalHot}
            />
          </g>
        )}
      </g>

      {/* Bottom-right Z log (x: 11..15, y: 0..3.5, z: 0..16) */}
      <VoxelLog x0={11} x1={15} y0={0} y1={3.5} z0={0} z1={16} axis="z" />

      {/* 2. Top-Back X Log (x: 0..16, y: 3.5..7, z: 1..5) — behind the flames */}
      <VoxelLog x0={0} x1={16} y0={3.5} y1={7} z0={1} z1={5} axis="x" />

      {/* 3. 4-Frame Stepped Minecraft Pixel Flame rising out of the center pit */}
      {isBurning && (
        <g className={styles.flameGroup} shapeRendering="crispEdges">
          {/* Frame 0 */}
          <g className={styles.flameFrame0}>
            <rect x="38" y="13" width="4" height="4" className={styles.fireOuter} />
            <rect x="33" y="19" width="5" height="6" className={styles.fireOuter} />
            <rect x="41" y="21" width="6" height="6" className={styles.fireOuter} />
            <rect x="29" y="25" width="22" height="9" className={styles.fireOuter} />
            <rect x="26" y="34" width="28" height="14" className={styles.fireOuter} />
            <rect x="24" y="42" width="32" height="13" className={styles.fireOuter} />
            <rect x="28" y="55" width="24" height="8" className={styles.fireOuter} />
            {/* Mid */}
            <rect x="35" y="24" width="7" height="7" className={styles.fireMid} />
            <rect x="31" y="31" width="18" height="9" className={styles.fireMid} />
            <rect x="28" y="40" width="24" height="13" className={styles.fireMid} />
            <rect x="31" y="53" width="18" height="8" className={styles.fireMid} />
            {/* Inner */}
            <rect x="35" y="36" width="10" height="7" className={styles.fireInner} />
            <rect x="32" y="43" width="16" height="11" className={styles.fireInner} />
            <rect x="35" y="54" width="10" height="7" className={styles.fireInner} />
            {/* Core */}
            <rect x="37" y="46" width="6" height="8" className={styles.fireCore} />
            <rect x="35" y="51" width="10" height="6" className={styles.fireCore} />
          </g>

          {/* Frame 1 */}
          <g className={styles.flameFrame1}>
            <rect x="44" y="15" width="3" height="4" className={styles.fireOuter} />
            <rect x="37" y="17" width="7" height="7" className={styles.fireOuter} />
            <rect x="31" y="24" width="18" height="7" className={styles.fireOuter} />
            <rect x="27" y="31" width="25" height="10" className={styles.fireOuter} />
            <rect x="24" y="41" width="32" height="14" className={styles.fireOuter} />
            <rect x="28" y="55" width="24" height="8" className={styles.fireOuter} />
            {/* Mid */}
            <rect x="38" y="24" width="8" height="7" className={styles.fireMid} />
            <rect x="31" y="31" width="18" height="10" className={styles.fireMid} />
            <rect x="28" y="41" width="24" height="12" className={styles.fireMid} />
            <rect x="32" y="53" width="17" height="8" className={styles.fireMid} />
            {/* Inner */}
            <rect x="37" y="34" width="8" height="8" className={styles.fireInner} />
            <rect x="32" y="42" width="16" height="12" className={styles.fireInner} />
            <rect x="35" y="54" width="10" height="7" className={styles.fireInner} />
            {/* Core */}
            <rect x="37" y="46" width="7" height="8" className={styles.fireCore} />
            <rect x="35" y="51" width="10" height="6" className={styles.fireCore} />
          </g>

          {/* Frame 2 */}
          <g className={styles.flameFrame2}>
            <rect x="31" y="14" width="4" height="4" className={styles.fireOuter} />
            <rect x="30" y="20" width="7" height="7" className={styles.fireOuter} />
            <rect x="42" y="20" width="5" height="7" className={styles.fireOuter} />
            <rect x="28" y="27" width="24" height="9" className={styles.fireOuter} />
            <rect x="26" y="36" width="28" height="10" className={styles.fireOuter} />
            <rect x="24" y="44" width="32" height="11" className={styles.fireOuter} />
            <rect x="28" y="55" width="24" height="8" className={styles.fireOuter} />
            {/* Mid */}
            <rect x="33" y="27" width="14" height="7" className={styles.fireMid} />
            <rect x="30" y="34" width="20" height="9" className={styles.fireMid} />
            <rect x="28" y="43" width="24" height="10" className={styles.fireMid} />
            <rect x="31" y="53" width="18" height="8" className={styles.fireMid} />
            {/* Inner */}
            <rect x="33" y="37" width="12" height="7" className={styles.fireInner} />
            <rect x="32" y="44" width="16" height="10" className={styles.fireInner} />
            <rect x="35" y="54" width="10" height="7" className={styles.fireInner} />
            {/* Core */}
            <rect x="35" y="46" width="8" height="8" className={styles.fireCore} />
            <rect x="36" y="51" width="9" height="6" className={styles.fireCore} />
          </g>

          {/* Frame 3 */}
          <g className={styles.flameFrame3}>
            <rect x="40" y="11" width="3" height="5" className={styles.fireOuter} />
            <rect x="35" y="18" width="7" height="7" className={styles.fireOuter} />
            <rect x="31" y="25" width="17" height="7" className={styles.fireOuter} />
            <rect x="28" y="32" width="25" height="9" className={styles.fireOuter} />
            <rect x="24" y="41" width="32" height="14" className={styles.fireOuter} />
            <rect x="28" y="55" width="24" height="8" className={styles.fireOuter} />
            {/* Mid */}
            <rect x="36" y="22" width="7" height="8" className={styles.fireMid} />
            <rect x="31" y="30" width="17" height="9" className={styles.fireMid} />
            <rect x="28" y="39" width="24" height="14" className={styles.fireMid} />
            <rect x="31" y="53" width="18" height="8" className={styles.fireMid} />
            {/* Inner */}
            <rect x="35" y="34" width="10" height="9" className={styles.fireInner} />
            <rect x="32" y="43" width="16" height="11" className={styles.fireInner} />
            <rect x="35" y="54" width="10" height="7" className={styles.fireInner} />
            {/* Core */}
            <rect x="37" y="44" width="6" height="10" className={styles.fireCore} />
            <rect x="35" y="51" width="10" height="6" className={styles.fireCore} />
          </g>
        </g>
      )}

      {/* 4. Top-Front X Log (x: 0..16, y: 3.5..7, z: 11..15) — overlaps flame base cleanly */}
      <VoxelLog
        x0={0}
        x1={16}
        y0={3.5}
        y1={7}
        z0={11}
        z1={15}
        axis="x"
        showFrontRimGlow={isBurning}
      />

      {/* Flint-and-steel ignition spark burst */}
      {isIgniting && (
        <g shapeRendering="crispEdges">
          <rect x="38" y="52" width="3" height="3" className={`${styles.spark} ${styles.spark1}`} />
          <rect x="41" y="50" width="3" height="2" className={`${styles.spark} ${styles.spark2}`} />
          <rect x="35" y="54" width="2" height="2" className={`${styles.spark} ${styles.spark3}`} />
          <rect x="43" y="54" width="2" height="2" className={`${styles.spark} ${styles.spark4}`} />
          <rect x="39" y="48" width="2" height="3" className={`${styles.spark} ${styles.spark5}`} />
          <rect x="44" y="51" width="2" height="2" className={`${styles.spark} ${styles.spark6}`} />
        </g>
      )}
    </svg>
  );
}
