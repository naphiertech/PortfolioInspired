"use client";

import React, { useRef, useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import styles from "./FloatingTerrain.module.css";

export interface FloatingTerrainProps {
  variant?: "now" | "projects";
  className?: string;
}

export function FloatingTerrain({ variant = "now", className = "" }: FloatingTerrainProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) return;

    const el = rootRef.current;
    if (!el) return;

    // Attach pointer parallax listener to the enclosing section so moving anywhere across the cards activates depth
    const triggerParent = el.closest("section") || el.parentElement || el;
    let rafId: number | null = null;

    const handlePointerMove = (e: PointerEvent) => {
      if (rafId !== null) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        const rect = triggerParent.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        // Normalized relative to center: -1.0 to 1.0
        const x = Math.max(-1, Math.min(1, ((e.clientX - rect.left) / rect.width) * 2 - 1));
        const y = Math.max(-1, Math.min(1, ((e.clientY - rect.top) / rect.height) * 2 - 1));

        el.style.setProperty("--terrain-x", x.toFixed(3));
        el.style.setProperty("--terrain-y", y.toFixed(3));
      });
    };

    const handlePointerLeave = () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      el.style.setProperty("--terrain-x", "0");
      el.style.setProperty("--terrain-y", "0");
    };

    triggerParent.addEventListener("pointermove", handlePointerMove as EventListener, {
      passive: true,
    });
    triggerParent.addEventListener("pointerleave", handlePointerLeave, { passive: true });

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      triggerParent.removeEventListener("pointermove", handlePointerMove as EventListener);
      triggerParent.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [shouldReduceMotion]);

  return (
    <div
      ref={rootRef}
      className={`${styles.terrainRoot} ${className}`}
      aria-hidden="true"
      data-terrain-variant={variant}
    >
      {variant === "now" ? (
        /* ================= NOW VARIANT (Supports 2-Card Grid) ================= */
        <svg
          viewBox="0 0 760 190"
          className={styles.terrainSvg}
          xmlns="http://www.w3.org/2000/svg"
          shapeRendering="crispEdges"
        >
          {/* SHELF LAYER: Directly anchors to card bottoms */}
          <g className={styles.layerShelf}>
            {/* Continuous Bedrock Cap (touches the card bottom edge) */}
            <rect x="-4" y="0" width="768" height="4" className={styles.rockCap} />
            <rect x="0" y="4" width="760" height="5" className={styles.rockPlate} />
            <rect x="8" y="9" width="744" height="6" className={styles.rockBracket} />

            {/* Left Card Foundation Pedestals */}
            <rect x="12" y="2" width="28" height="6" className={styles.rockBracket} />
            <rect x="170" y="2" width="36" height="6" className={styles.rockBracket} />
            <rect x="330" y="2" width="32" height="6" className={styles.rockBracket} />
            {/* Foundation teeth hugging card bottom */}
            <rect x="6" y="0" width="10" height="3" className={styles.rockHi} />
            <rect x="100" y="0" width="20" height="2" className={styles.rockHi} />
            <rect x="250" y="0" width="20" height="2" className={styles.rockHi} />
            <rect x="360" y="0" width="12" height="3" className={styles.rockHi} />

            {/* Center Gorge Bridge between cards */}
            <rect x="368" y="0" width="24" height="4" className={styles.rockPlate} />
            <rect x="372" y="4" width="16" height="8" className={styles.rockFore} />
            <rect x="376" y="12" width="8" height="6" className={styles.rockMid} />

            {/* Right Card Foundation Pedestals */}
            <rect x="398" y="2" width="32" height="6" className={styles.rockBracket} />
            <rect x="560" y="2" width="36" height="6" className={styles.rockBracket} />
            <rect x="718" y="2" width="28" height="6" className={styles.rockBracket} />
            {/* Foundation teeth hugging right card */}
            <rect x="390" y="0" width="12" height="3" className={styles.rockHi} />
            <rect x="490" y="0" width="20" height="2" className={styles.rockHi} />
            <rect x="640" y="0" width="20" height="2" className={styles.rockHi} />
            <rect x="744" y="0" width="10" height="3" className={styles.rockHi} />

            {/* West Promontory Outcrop with Pine Tree */}
            <rect x="-12" y="0" width="14" height="7" className={styles.rockCap} />
            <rect x="-8" y="7" width="12" height="6" className={styles.rockPlate} />
            <g transform="translate(-8, -22)">
              <rect x="4" y="16" width="2" height="6" fill="#38281e" />
              <rect x="1" y="12" width="8" height="4" className={styles.treeLeaf} />
              <rect x="2" y="12" width="3" height="2" className={styles.treeHi} />
              <rect x="2" y="7" width="6" height="5" className={styles.treeLeaf} />
              <rect x="3" y="7" width="2" height="2" className={styles.treeHi} />
              <rect x="3" y="3" width="4" height="4" className={styles.treeLeaf} />
              <rect x="4" y="1" width="2" height="2" className={styles.treeHi} />
            </g>

            {/* East Promontory Outcrop with Antenna Mast */}
            <rect x="758" y="0" width="14" height="7" className={styles.rockCap} />
            <rect x="756" y="7" width="12" height="6" className={styles.rockPlate} />
            <g transform="translate(758, -26)">
              <rect x="4" y="20" width="4" height="6" className={styles.antennaMetal} />
              <rect x="5" y="6" width="2" height="14" className={styles.antennaMetal} />
              <rect x="2" y="11" width="8" height="2" className={styles.antennaMetal} />
              <rect x="5" y="2" width="2" height="4" className={styles.antennaMetal} />
              <rect x="4" y="0" width="4" height="4" fill="#10b981" className={styles.beaconLight} />
            </g>

            {/* CAD Technical Markings */}
            <text x="20" y="25" className={styles.cadTick}>[TERRAIN // SECTOR-NOW]</text>
            <text x="630" y="25" className={styles.cadTick}>ELEV: -185M // FOUNDATION</text>
          </g>

          {/* DEEP LAYER: Mountain Core & Keel */}
          <g className={styles.layerDeep}>
            <rect x="160" y="68" width="440" height="16" className={styles.rockDeep} />
            <rect x="195" y="84" width="370" height="16" className={styles.rockDeep} />
            <rect x="235" y="100" width="290" height="16" className={styles.rockDeep} />
            <rect x="275" y="116" width="210" height="16" className={styles.rockDeep} />
            <rect x="315" y="132" width="130" height="14" className={styles.rockDeep} />
            <rect x="345" y="146" width="70" height="14" className={styles.rockDeep} />
            <rect x="364" y="160" width="32" height="12" className={styles.rockDeep} />
            <rect x="374" y="172" width="12" height="8" className={styles.rockDeep} />
            <rect x="378" y="180" width="4" height="4" className={styles.rockDeep} />

            {/* Deep fissures */}
            <rect x="370" y="90" width="4" height="42" className={styles.rockSh} />
            <rect x="325" y="110" width="4" height="22" className={styles.rockSh} />
            <rect x="420" y="106" width="6" height="26" className={styles.rockSh} />
          </g>

          {/* MID LAYER: Geological Strata */}
          <g className={styles.layerMid}>
            <rect x="28" y="15" width="704" height="14" className={styles.rockMid} />
            <rect x="56" y="29" width="648" height="14" className={styles.rockMid} />
            <rect x="92" y="43" width="576" height="14" className={styles.rockMid} />
            <rect x="136" y="57" width="488" height="14" className={styles.rockMid} />

            <rect x="180" y="71" width="170" height="18" className={styles.rockMid} />
            <rect x="410" y="71" width="160" height="18" className={styles.rockMid} />
            <rect x="220" y="89" width="110" height="16" className={styles.rockMid} />
            <rect x="430" y="89" width="100" height="16" className={styles.rockMid} />
            <rect x="330" y="105" width="100" height="16" className={styles.rockMid} />
            <rect x="350" y="121" width="60" height="16" className={styles.rockMid} />

            {/* Crevice shadows */}
            <rect x="120" y="32" width="8" height="26" className={styles.rockSh} />
            <rect x="270" y="45" width="6" height="32" className={styles.rockSh} />
            <rect x="490" y="42" width="8" height="30" className={styles.rockSh} />
            <rect x="630" y="30" width="6" height="28" className={styles.rockSh} />
          </g>

          {/* FORE LAYER: Facet Ledges & Highlights */}
          <g className={styles.layerFore}>
            <rect x="18" y="15" width="128" height="12" className={styles.rockFore} />
            <rect x="170" y="15" width="170" height="14" className={styles.rockFore} />
            <rect x="364" y="15" width="92" height="16" className={styles.rockFore} />
            <rect x="480" y="15" width="160" height="14" className={styles.rockFore} />
            <rect x="656" y="15" width="90" height="12" className={styles.rockFore} />

            <rect x="44" y="27" width="88" height="12" className={styles.rockFore} />
            <rect x="190" y="29" width="134" height="14" className={styles.rockFore} />
            <rect x="348" y="31" width="114" height="18" className={styles.rockFore} />
            <rect x="500" y="29" width="124" height="14" className={styles.rockFore} />
            <rect x="640" y="27" width="80" height="12" className={styles.rockFore} />

            <rect x="76" y="39" width="52" height="14" className={styles.rockFore} />
            <rect x="216" y="43" width="80" height="16" className={styles.rockFore} />
            <rect x="360" y="49" width="84" height="20" className={styles.rockFore} />
            <rect x="526" y="43" width="72" height="16" className={styles.rockFore} />
            <rect x="648" y="39" width="44" height="12" className={styles.rockFore} />

            {/* Edge Highlights */}
            <rect x="18" y="15" width="48" height="2" className={styles.rockHi} />
            <rect x="170" y="15" width="64" height="2" className={styles.rockHi} />
            <rect x="364" y="15" width="40" height="2" className={styles.rockHi} />
            <rect x="480" y="15" width="56" height="2" className={styles.rockHi} />
            <rect x="656" y="15" width="44" height="2" className={styles.rockHi} />

            <rect x="44" y="27" width="36" height="2" className={styles.rockHi} />
            <rect x="190" y="29" width="42" height="2" className={styles.rockHi} />
            <rect x="348" y="31" width="38" height="2" className={styles.rockHi} />
            <rect x="500" y="29" width="40" height="2" className={styles.rockHi} />

            {/* Second Pine Tree on eastern step */}
            <g transform="translate(696, 6)">
              <rect x="3" y="11" width="2" height="5" fill="#38281e" />
              <rect x="1" y="7" width="6" height="4" className={styles.treeLeaf} />
              <rect x="2" y="7" width="2" height="2" className={styles.treeHi} />
              <rect x="2" y="3" width="4" height="4" className={styles.treeLeaf} />
              <rect x="3" y="1" width="2" height="2" className={styles.treeHi} />
            </g>
          </g>

          {/* DEBRIS LAYER: Detached Floating Rocks */}
          <g className={styles.layerDebris}>
            <rect x="72" y="78" width="8" height="8" className={styles.rockFore} />
            <rect x="72" y="78" width="4" height="4" className={styles.rockHi} />
            <rect x="58" y="92" width="6" height="6" className={styles.rockMid} />
            <rect x="110" y="104" width="6" height="6" className={styles.rockFore} />
            <rect x="100" y="120" width="4" height="4" className={styles.rockDeep} />
            <rect x="142" y="126" width="8" height="8" className={styles.rockMid} />

            <rect x="682" y="76" width="8" height="8" className={styles.rockFore} />
            <rect x="682" y="76" width="4" height="4" className={styles.rockHi} />
            <rect x="700" y="90" width="6" height="6" className={styles.rockMid} />
            <rect x="644" y="102" width="8" height="8" className={styles.rockFore} />
            <rect x="656" y="118" width="4" height="4" className={styles.rockDeep} />
            <rect x="612" y="124" width="6" height="6" className={styles.rockMid} />

            <rect x="306" y="152" width="6" height="6" className={styles.rockDeep} />
            <rect x="444" y="148" width="6" height="6" className={styles.rockDeep} />
            <rect x="348" y="178" width="4" height="4" className={styles.rockDeep} />
            <rect x="414" y="174" width="4" height="4" className={styles.rockDeep} />
          </g>

          {/* MIST LAYER: Stepped Horizontal Pixel Clouds */}
          <g className={styles.layerMist}>
            <rect x="16" y="64" width="70" height="6" className={styles.mistA} />
            <rect x="28" y="60" width="44" height="4" className={styles.mistB} />
            <rect x="24" y="70" width="52" height="4" className={styles.mistA} />

            <rect x="170" y="114" width="104" height="6" className={styles.mistA} />
            <rect x="190" y="110" width="60" height="4" className={styles.mistB} />
            <rect x="182" y="120" width="78" height="4" className={styles.mistA} />

            <rect x="480" y="130" width="112" height="6" className={styles.mistA} />
            <rect x="500" y="126" width="68" height="4" className={styles.mistB} />
            <rect x="490" y="136" width="86" height="4" className={styles.mistA} />

            <rect x="674" y="62" width="78" height="6" className={styles.mistA} />
            <rect x="690" y="58" width="48" height="4" className={styles.mistB} />
            <rect x="682" y="68" width="60" height="4" className={styles.mistA} />
          </g>
        </svg>
      ) : (
        /* ================= PROJECTS VARIANT (Supports 4-Card 2x2 Grid) ================= */
        <svg
          viewBox="0 0 760 230"
          className={styles.terrainSvg}
          xmlns="http://www.w3.org/2000/svg"
          shapeRendering="crispEdges"
        >
          {/* SHELF LAYER */}
          <g className={styles.layerShelf}>
            <rect x="-6" y="0" width="772" height="4" className={styles.rockCap} />
            <rect x="0" y="4" width="760" height="6" className={styles.rockPlate} />
            <rect x="6" y="10" width="748" height="6" className={styles.rockBracket} />

            {/* Heavy CAD Anchor Brackets under 2x2 grid */}
            <rect x="16" y="2" width="36" height="6" className={styles.rockBracket} />
            <rect x="160" y="2" width="44" height="6" className={styles.rockBracket} />
            <rect x="320" y="2" width="40" height="6" className={styles.rockBracket} />
            <rect x="390" y="2" width="40" height="6" className={styles.rockBracket} />
            <rect x="550" y="2" width="44" height="6" className={styles.rockBracket} />
            <rect x="708" y="2" width="36" height="6" className={styles.rockBracket} />

            {/* CAD reticle teeth */}
            <rect x="4" y="0" width="14" height="3" className={styles.rockHi} />
            <rect x="90" y="0" width="24" height="2" className={styles.rockHi} />
            <rect x="260" y="0" width="24" height="2" className={styles.rockHi} />
            <rect x="350" y="0" width="16" height="3" className={styles.rockHi} />
            <rect x="384" y="0" width="16" height="3" className={styles.rockHi} />
            <rect x="480" y="0" width="24" height="2" className={styles.rockHi} />
            <rect x="640" y="0" width="24" height="2" className={styles.rockHi} />
            <rect x="742" y="0" width="14" height="3" className={styles.rockHi} />

            {/* Western Cliff with Twin Pine Trees */}
            <rect x="-16" y="0" width="18" height="8" className={styles.rockCap} />
            <rect x="-12" y="8" width="14" height="6" className={styles.rockPlate} />
            <g transform="translate(-14, -22)">
              <rect x="3" y="16" width="2" height="6" fill="#38281e" />
              <rect x="0" y="12" width="8" height="4" className={styles.treeLeaf} />
              <rect x="1" y="7" width="6" height="5" className={styles.treeLeaf} />
              <rect x="2" y="3" width="4" height="4" className={styles.treeLeaf} />
            </g>
            <g transform="translate(-2, -18)">
              <rect x="3" y="13" width="2" height="5" fill="#38281e" />
              <rect x="1" y="9" width="6" height="4" className={styles.treeLeaf} />
              <rect x="2" y="5" width="4" height="4" className={styles.treeLeaf} />
            </g>

            {/* Eastern Cliff with Observation Beacon */}
            <rect x="758" y="0" width="16" height="8" className={styles.rockCap} />
            <rect x="754" y="8" width="14" height="6" className={styles.rockPlate} />
            <g transform="translate(758, -28)">
              <rect x="4" y="22" width="4" height="6" className={styles.antennaMetal} />
              <rect x="5" y="8" width="2" height="14" className={styles.antennaMetal} />
              <rect x="2" y="14" width="8" height="2" className={styles.antennaMetal} />
              <rect x="5" y="4" width="2" height="4" className={styles.antennaMetal} />
              <rect x="4" y="2" width="4" height="4" fill="#10b981" className={styles.beaconLight} />
            </g>

            <text x="24" y="26" className={styles.cadTick}>[TERRAIN // SECTOR-PROJECTS]</text>
            <text x="618" y="26" className={styles.cadTick}>GEO-MASS // DUAL-KEEL ACTIVE</text>
          </g>

          {/* DEEP LAYER: Asymmetric Twin Keels */}
          <g className={styles.layerDeep}>
            <rect x="140" y="72" width="480" height="16" className={styles.rockDeep} />
            <rect x="170" y="88" width="420" height="16" className={styles.rockDeep} />

            {/* Primary Western Peak (apex at x=327, y=214) */}
            <rect x="200" y="104" width="200" height="16" className={styles.rockDeep} />
            <rect x="230" y="120" width="160" height="16" className={styles.rockDeep} />
            <rect x="260" y="136" width="120" height="16" className={styles.rockDeep} />
            <rect x="284" y="152" width="84" height="14" className={styles.rockDeep} />
            <rect x="300" y="166" width="56" height="14" className={styles.rockDeep} />
            <rect x="310" y="180" width="36" height="12" className={styles.rockDeep} />
            <rect x="318" y="192" width="20" height="10" className={styles.rockDeep} />
            <rect x="324" y="202" width="10" height="8" className={styles.rockDeep} />
            <rect x="327" y="210" width="4" height="4" className={styles.rockDeep} />

            {/* Secondary Eastern Spur (apex at x=512, y=186) */}
            <rect x="430" y="104" width="170" height="16" className={styles.rockDeep} />
            <rect x="450" y="120" width="130" height="16" className={styles.rockDeep} />
            <rect x="470" y="136" width="94" height="14" className={styles.rockDeep} />
            <rect x="488" y="150" width="60" height="12" className={styles.rockDeep} />
            <rect x="498" y="162" width="38" height="10" className={styles.rockDeep} />
            <rect x="506" y="172" width="20" height="8" className={styles.rockDeep} />
            <rect x="512" y="180" width="8" height="6" className={styles.rockDeep} />

            {/* Central Canyon Cleft */}
            <rect x="380" y="100" width="30" height="24" className={styles.rockSh} />
          </g>

          {/* MID LAYER */}
          <g className={styles.layerMid}>
            <rect x="24" y="16" width="712" height="14" className={styles.rockMid} />
            <rect x="50" y="30" width="660" height="14" className={styles.rockMid} />
            <rect x="84" y="44" width="592" height="14" className={styles.rockMid} />
            <rect x="124" y="58" width="512" height="14" className={styles.rockMid} />

            <rect x="170" y="72" width="190" height="18" className={styles.rockMid} />
            <rect x="400" y="72" width="180" height="18" className={styles.rockMid} />
            <rect x="210" y="90" width="130" height="16" className={styles.rockMid} />
            <rect x="430" y="90" width="120" height="16" className={styles.rockMid} />
            <rect x="250" y="106" width="100" height="16" className={styles.rockMid} />
            <rect x="460" y="106" width="80" height="16" className={styles.rockMid} />
          </g>

          {/* FORE LAYER */}
          <g className={styles.layerFore}>
            <rect x="16" y="16" width="130" height="12" className={styles.rockFore} />
            <rect x="164" y="16" width="180" height="14" className={styles.rockFore} />
            <rect x="360" y="16" width="100" height="16" className={styles.rockFore} />
            <rect x="478" y="16" width="170" height="14" className={styles.rockFore} />
            <rect x="664" y="16" width="84" height="12" className={styles.rockFore} />

            <rect x="40" y="28" width="94" height="12" className={styles.rockFore} />
            <rect x="180" y="30" width="144" height="14" className={styles.rockFore} />
            <rect x="340" y="32" width="124" height="18" className={styles.rockFore} />
            <rect x="500" y="30" width="134" height="14" className={styles.rockFore} />
            <rect x="650" y="28" width="70" height="12" className={styles.rockFore} />

            {/* Edge Highlights */}
            <rect x="16" y="16" width="50" height="2" className={styles.rockHi} />
            <rect x="164" y="16" width="68" height="2" className={styles.rockHi} />
            <rect x="360" y="16" width="44" height="2" className={styles.rockHi} />
            <rect x="478" y="16" width="60" height="2" className={styles.rockHi} />
            <rect x="664" y="16" width="40" height="2" className={styles.rockHi} />
          </g>

          {/* DEBRIS LAYER */}
          <g className={styles.layerDebris}>
            {/* Floating rocks in canyon cleft */}
            <rect x="390" y="128" width="10" height="10" className={styles.rockFore} />
            <rect x="390" y="128" width="5" height="5" className={styles.rockHi} />
            <rect x="410" y="146" width="8" height="8" className={styles.rockMid} />
            <rect x="382" y="160" width="6" height="6" className={styles.rockDeep} />
            <rect x="402" y="174" width="4" height="4" className={styles.rockDeep} />

            {/* Flank fragments */}
            <rect x="68" y="80" width="8" height="8" className={styles.rockFore} />
            <rect x="54" y="96" width="6" height="6" className={styles.rockMid} />
            <rect x="696" y="82" width="8" height="8" className={styles.rockFore} />
            <rect x="712" y="98" width="6" height="6" className={styles.rockMid} />
          </g>

          {/* MIST LAYER */}
          <g className={styles.layerMist}>
            <rect x="14" y="68" width="84" height="6" className={styles.mistA} />
            <rect x="28" y="64" width="54" height="4" className={styles.mistB} />

            {/* Gorge Cloud */}
            <rect x="360" y="140" width="90" height="6" className={styles.mistA} />
            <rect x="375" y="136" width="60" height="4" className={styles.mistB} />

            <rect x="660" y="66" width="88" height="6" className={styles.mistA} />
            <rect x="680" y="62" width="54" height="4" className={styles.mistB} />
          </g>
        </svg>
      )}
    </div>
  );
}

export default FloatingTerrain;
