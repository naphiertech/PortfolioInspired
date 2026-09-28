"use client";

import React, { useRef, useEffect } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  terrainContainerVariants,
  terrainShelfVariants,
  terrainForeVariants,
  terrainMidVariants,
  terrainDeepVariants,
  terrainDebrisVariants,
  terrainMistVariants,
} from "@/lib/motion";
import styles from "./FloatingTerrain.module.css";

export interface FloatingTerrainProps {
  variant?: "now" | "projects";
  className?: string;
  variants?: Variants;
}

/** Surface-only details stay inside the existing shelf and inherit its motion. */
function ShelfHardware() {
  return (
    <g>
      <path className={styles.contactShade} d="M10 11H366V14H10ZM394 11H750V14H394Z" />
      <path className={styles.metalEtch} d="M46 6H152M216 6H310M438 6H538M606 6H704" />
      {[28, 182, 342, 410, 572, 730].map((x) => (
        <g key={x}>
          <rect x={x} y="4" width="6" height="7" className={styles.rockSh} />
          <rect x={x + 1} y="4" width="4" height="5" className={styles.rockBracket} />
          <rect x={x + 2} y="5" width="2" height="2" className={styles.rockHi} />
        </g>
      ))}
      <path className={styles.rockSh} d="M82 8h18v2H82ZM466 8h14v2h-14ZM666 8h22v2h-22Z" opacity="0.4" />
    </g>
  );
}

/** Recessed hardware and stone chips share the foreground's existing footprint. */
function TerrainSurfaceDetails() {
  return (
    <g>
      <path className={styles.contactShade} d="M22 24H142V26H22ZM176 26H336V28H176ZM370 28H450V30H370ZM486 26H634V28H486ZM668 24H740V26H668ZM52 36H128V38H52ZM198 40H318V42H198ZM508 40H618V42H508Z" />
      <path className={styles.rockBracket} d="M86 18h25v3H97v2H86ZM284 17h34v4h-14v2h-20ZM434 18h15v7h-4v-3h-11ZM581 19h40v3h-16v2h-24ZM674 31h32v3h-17v3h-15Z" />
      <path className={styles.stoneEtch} d="M117 18v5h6v8h-8v4M302 18v6h-7v6h-5v6M447 35h-12v5h-8v7M601 18v7h-8v8h6M86 29h13v4h8" />
      <path className={styles.metalEtch} d="M64 20h16M251 18h19M373 35h18M562 32h18M685 20h12" />
      {/* A pair of embedded service panels, with small fasteners and vent slots. */}
      {[{ x: 202, y: 20 }, { x: 528, y: 22 }].map(({ x, y }) => (
        <g key={x} transform={`translate(${x} ${y})`}>
          <rect x="2" y="2" width="30" height="18" className={styles.rockSh} opacity="0.55" />
          <rect width="30" height="18" className={styles.rockBracket} />
          <path className={styles.metalEtch} d="M1 16V1H28" />
          <rect x="4" y="4" width="21" height="10" className={styles.rockSh} />
          <path className={styles.panelSlots} d="M7 6h10M7 9h10M7 12h7" />
          <rect x="21" y="6" width="2" height="4" className={styles.signalPixel} />
          <path className={styles.rockHi} d="M1 2h2v2H1ZM26 13h2v2h-2Z" opacity="0.65" />
        </g>
      ))}
      <path className={styles.conduitShade} d="M234 29h26v7h17M528 32h-15v-9h-25M380 40h22v6h28" />
      <path className={styles.conduit} d="M234 28h26v7h17M528 31h-15v-9h-25M380 39h22v6h28" />
      <path className={styles.rockBracket} d="M246 26h3v5h-3ZM510 25h6v3h-6ZM411 42h3v6h-3Z" />
      <path className={styles.rockHi} d="M52 31h5v2h-5ZM183 20h4v3h-4ZM323 19h3v2h-3ZM417 34h4v2h-4ZM610 34h5v2h-5ZM716 20h3v3h-3Z" opacity="0.45" />
    </g>
  );
}

export function FloatingTerrain({
  variant = "now",
  className = "",
  variants,
}: FloatingTerrainProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const activeVariants =
    variants ?? (shouldReduceMotion ? undefined : terrainContainerVariants);

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
    <motion.div
      ref={rootRef}
      className={`${styles.terrainRoot} ${className}`}
      aria-hidden="true"
      data-terrain-variant={variant}
      variants={activeVariants}
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
          <motion.g variants={shouldReduceMotion ? undefined : terrainShelfVariants}>
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
              <ShelfHardware />
            </g>
          </motion.g>

          {/* DEEP LAYER: Mountain Core & Keel */}
          <motion.g variants={shouldReduceMotion ? undefined : terrainDeepVariants}>
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
              <path className={styles.facetShade} d="M398 85h25v31h-16v28h-12v16h-11v18h-4v-36h9v-26h9Z" />
              <path className={styles.facetLight} d="M284 118H309V129H327V143H347V156H367V169H376V177H380V162H373V151H357V135H335V120H310V118Z" />
              <path className={styles.stoneEtch} d="M351 139h14v9h8v12M401 138h-8v7M374 168h8v7" />
            </g>
          </motion.g>

          {/* MID LAYER: Geological Strata */}
          <motion.g variants={shouldReduceMotion ? undefined : terrainMidVariants}>
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
              <path className={styles.facetShade} d="M145 59h33v9h-33ZM191 76h48v11h-48ZM443 73h39v14h-39ZM294 92h34v11h-34ZM369 109h29v10h-29Z" />
              <path className={styles.facetLight} d="M137 59h36v2h-36ZM182 73h43v3h-43ZM222 92h29v2h-29ZM414 73h23v3h-23ZM489 93h35v2h-35ZM351 123h19v3h-19Z" />
              <path className={styles.stoneEtch} d="M165 48h20v7h-7v8M244 66h12v15h-8v8M458 59v9h9v13M514 77h19v7h-6v11M347 111h13v7" />
              <path className={styles.conduitShade} d="M300 49v16h18v17h12M561 50v19h-18v14" />
              <path className={styles.conduit} d="M298 49v16h18v17h14M559 50v17h-18v16" />
              <path className={styles.rockBracket} d="M294 57h8v3h-8ZM312 72h8v3h-8ZM537 74h8v3h-8Z" />
            </g>
          </motion.g>

          {/* FORE LAYER: Facet Ledges & Highlights */}
          <motion.g variants={shouldReduceMotion ? undefined : terrainForeVariants}>
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
              <TerrainSurfaceDetails />
              <g transform="translate(696, 6)">
                <rect x="3" y="11" width="2" height="5" fill="#38281e" />
                <rect x="1" y="7" width="6" height="4" className={styles.treeLeaf} />
                <rect x="2" y="7" width="2" height="2" className={styles.treeHi} />
                <rect x="2" y="3" width="4" height="4" className={styles.treeLeaf} />
                <rect x="3" y="1" width="2" height="2" className={styles.treeHi} />
              </g>
            </g>
          </motion.g>

          {/* DEBRIS LAYER: Detached Floating Rocks */}
          <motion.g variants={shouldReduceMotion ? undefined : terrainDebrisVariants}>
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
          </motion.g>

          {/* MIST LAYER: Stepped Horizontal Pixel Clouds */}
          <motion.g variants={shouldReduceMotion ? undefined : terrainMistVariants}>
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
          </motion.g>
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
          <motion.g variants={shouldReduceMotion ? undefined : terrainShelfVariants}>
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
              <ShelfHardware />
            </g>
          </motion.g>

          {/* DEEP LAYER: Asymmetric Twin Keels */}
          <motion.g variants={shouldReduceMotion ? undefined : terrainDeepVariants}>
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
              <path className={styles.facetShade} d="M347 107h32v26h-15v29h-12v17h-9v13h-9v14h-4v-25h6v-30h11ZM536 107h31v26h-17v18h-14v19h-13v9h-5v-22h10v-27h8Z" />
              <path className={styles.facetLight} d="M270 138H288V150H302V164H316V178H324V190H328V199H332V184H328V169H320V153H306V139H292V138ZM473 139h17v12h13v13h8v9h4v-14h-7v-13h-15v-7Z" />
              <path className={styles.stoneEtch} d="M292 155h14v9h-6M330 178h7v8h-5v12M518 144h-9v10h-5M551 122h-12v8" />
            </g>
          </motion.g>

          {/* MID LAYER */}
          <motion.g variants={shouldReduceMotion ? undefined : terrainMidVariants}>
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
              <path className={styles.facetShade} d="M132 61h39v9h-39ZM181 76h52v12h-52ZM293 92h39v12h-39ZM422 75h35v13h-35ZM499 94h43v10h-43ZM300 108h43v12h-43Z" />
              <path className={styles.facetLight} d="M130 59h38v2h-38ZM173 74h44v3h-44ZM213 92h32v2h-32ZM404 74h24v3h-24ZM485 92h37v2h-37ZM253 108h29v3h-29Z" />
              <path className={styles.stoneEtch} d="M103 47h19v6h-7v5M241 63h13v17h-9v8M454 52v10h13v16M579 47h-16v9h7M317 93h-10v11M474 108v8h9" />
              <path className={styles.conduitShade} d="M285 48v16h20v19h13M553 48v22h-18v15" />
              <path className={styles.conduit} d="M283 48v16h20v19h15M551 48v20h-18v17" />
              <path className={styles.rockBracket} d="M279 56h8v3h-8ZM299 73h8v3h-8ZM529 77h8v3h-8Z" />
            </g>
          </motion.g>

          {/* FORE LAYER */}
          <motion.g variants={shouldReduceMotion ? undefined : terrainForeVariants}>
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
              <TerrainSurfaceDetails />
            </g>
          </motion.g>

          {/* DEBRIS LAYER */}
          <motion.g variants={shouldReduceMotion ? undefined : terrainDebrisVariants}>
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
          </motion.g>

          {/* MIST LAYER */}
          <motion.g variants={shouldReduceMotion ? undefined : terrainMistVariants}>
            <g className={styles.layerMist}>
              <rect x="14" y="68" width="84" height="6" className={styles.mistA} />
              <rect x="28" y="64" width="54" height="4" className={styles.mistB} />

              {/* Gorge Cloud */}
              <rect x="360" y="140" width="90" height="6" className={styles.mistA} />
              <rect x="375" y="136" width="60" height="4" className={styles.mistB} />

              <rect x="660" y="66" width="88" height="6" className={styles.mistA} />
              <rect x="680" y="62" width="54" height="4" className={styles.mistB} />
            </g>
          </motion.g>
        </svg>
      )}
    </motion.div>
  );
}

export default FloatingTerrain;
