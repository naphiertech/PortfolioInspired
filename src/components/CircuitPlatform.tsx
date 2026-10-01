"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";
import styles from "./CircuitPlatform.module.css";

// Authored terraces and recessed component bays, not a repeated rectangular shelf.
const slabs = [
  "M24 82 H975 V101 H943 V117 H877 V134 H819 V147 H737 V172 H682 V186 H607 V219 H571 V260 H529 V279 H499 V255 H463 V231 H401 V209 H345 V178 H277 V165 H218 V147 H139 V128 H69 V110 H24 Z",
  "M69 96 H934 V112 H877 V126 H817 V140 H728 V161 H656 V178 H597 V200 H558 V245 H522 V262 H501 V238 H479 V216 H415 V193 H362 V164 H294 V151 H232 V130 H139 V115 H69 Z",
  "M133 103 H843 V117 H785 V131 H699 V150 H612 V164 H580 V194 H533 V226 H502 V205 H470 V183 H415 V164 H351 V144 H291 V128 H202 V117 H133 Z",
];
const tiles = [
  [84, 106, 37, 14], [136, 118, 47, 22], [192, 126, 22, 39],
  [242, 141, 44, 16], [300, 149, 23, 31], [355, 171, 48, 18],
  [419, 195, 25, 23], [468, 213, 27, 31], [511, 244, 19, 27],
  [548, 209, 19, 30], [596, 169, 36, 28], [650, 157, 37, 18],
  [710, 142, 26, 21], [766, 132, 41, 17], [853, 114, 25, 22],
  [908, 101, 32, 15],
];
const components = [
  [187, 132, 45, 26], [329, 99, 31, 18], [435, 166, 26, 19],
  [613, 122, 34, 20], [785, 136, 47, 27], [864, 99, 27, 17],
];
const hangers = [
  [110, 121, 202], [151, 138, 230], [268, 161, 260],
  [405, 208, 276], [548, 249, 298], [638, 188, 278],
  [742, 155, 241], [825, 145, 208], [922, 110, 188],
];
const fragments = [
  [50, 160, 5], [184, 241, 7], [226, 203, 4], [299, 281, 5],
  [368, 231, 6], [476, 280, 4], [573, 284, 6], [685, 224, 5],
  [776, 266, 7], [880, 203, 5], [954, 157, 7], [88, 239, 3],
];
const branches = [
  { path: "M40 78 H155 V91 H240 V103 H305 V128 H366 M185 78 V95 H295 V112 H342 V128 M366 140 V166 H395 V202", x: 366, y: 132 },
  { path: "M966 77 H858 V91 H740 V104 H654 V124 H625 M814 80 V98 H714 V114 H679 V124 M610 140 V161 H585 V183 H532 V239", x: 622, y: 128 },
  { path: "M480 77 V87 H541 V99 H817 V118 M937 83 V102 H856 V118 H817 M817 132 V156 H846 V184", x: 817, y: 122 },
];

/** A layered, stepped circuit chassis supporting the complete technology column. */
export function CircuitPlatform({ activeBranches }: { activeBranches: boolean[] }) {
  const reduced = useReducedMotion();
  const id = useId();
  const interacting = activeBranches.some(Boolean);
  return (
    <motion.div
      className={styles.platform}
      aria-hidden="true"
      variants={reduced ? undefined : {
        hidden: { opacity: 0, y: 6 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.32, delay: 0.1, ease: [0.22, 1, 0.36, 1] } },
      }}
    >
      <svg viewBox="0 0 1000 310" focusable="false" fill="none">
        <defs>
          <linearGradient id={id + "-depth"} x1="0" y1="0" x2="0.2" y2="1">
            <stop stopColor="var(--pcb-face)" />
            <stop offset="1" stopColor="var(--pcb-depth)" />
          </linearGradient>
          <pattern id={id + "-pixels"} width="53" height="37" patternUnits="userSpaceOnUse">
            <path d="M2 2 H21 V12 H34 V24 H50 M13 26 H23 V35" stroke="var(--pcb-edge)" strokeWidth="1" opacity=".3" />
            <path d="M30 3 h7 v5 h-7 Z M3 24 h4 v4 h-4 Z" fill="var(--pcb-highlight)" opacity=".22" />
          </pattern>
          <clipPath id={id + "-body"}><path d={slabs[0]} /></clipPath>
        </defs>

        {/* Three offset chassis strata; the darkest core extends below the terraces. */}
        <path d={slabs[0]} fill={`url(#${id}-depth)`} className={styles.bodyOutline} />
        <path className={styles.middleSlab} d={slabs[1]} />
        <path className={styles.frontSlab} d={slabs[2]} />
        <g clipPath={`url(#${id}-body)`}>
          <path className={styles.recess} d="M38 94 H145 V117 H241 V137 H322 V153 H392 V181 H454 V206 H493 V245 H513 V288 H544 V233 H568 V204 H599 V174 H663 V149 H738 V132 H847 V109 H976 V94 H837 V104 H727 V120 H650 V137 H581 V160 H548 V190 H517 V203 H489 V178 H427 V153 H355 V129 H272 V115 H176 V101 H38 Z" />
          {tiles.map(([x, y, w, h], index) => (
            <g key={x} data-depth={y >= 190 ? "deep" : y >= 145 ? "middle" : "front"}>
              <rect className={index % 3 === 0 ? styles.tileDark : styles.tile} x={x} y={y} width={w} height={h} />
              <path className={styles.tileEdge} d={`M${x} ${y + h} V${y} H${x + w}`} />
              <rect className={styles.pixel} x={x + 4} y={y + 4} width="5" height="3" />
            </g>
          ))}
          <path d={slabs[0]} fill={`url(#${id}-pixels)`} />
          <path className={styles.seams} d="M69 106 H130 V123 H191 M239 126 V153 H285 M349 157 H386 V182 M463 219 H490 V241 M560 220 V201 H592 M680 158 H711 V143 H776 M874 121 V108 H932" />
        </g>

        {/* Underslung processor housings and contact pins. */}
        {components.map(([x, y, w, h]) => (
          <g key={x} className={styles.processor} data-depth={y >= 190 ? "deep" : y >= 145 ? "middle" : "front"}>
            <path className={styles.pins} d={`M${x + 7} ${y - 4} v${h + 8} M${x + 15} ${y - 4} v${h + 8} M${x + 23} ${y - 4} v${h + 8}`} />
            <rect x={x} y={y} width={w} height={h} className={styles.socket} />
            <rect x={x + 5} y={y + 5} width={w - 10} height={h - 10} className={styles.processorFace} />
            <path d={`M${x + 5} ${y + 5} h${w - 10}`} className={styles.tileEdge} />
          </g>
        ))}

        {/* Routed traces change emphasis with the existing chip/category selection. */}
        {branches.map((branch, index) => (
          <g key={branch.path} className={styles.branch} data-branch={index} data-active={activeBranches[index]} data-muted={interacting && !activeBranches[index]}>
            <path d={branch.path} className={styles.channel} />
            <motion.path
              d={branch.path}
              pathLength={1}
              className={styles.bus}
              variants={reduced ? undefined : {
                hidden: { strokeDashoffset: 1, opacity: 0 },
                visible: { strokeDashoffset: 0, opacity: 1, transition: { duration: 0.32, delay: 0.16 + index * 0.04, ease: "easeOut" } },
              }}
            />
            <motion.g variants={reduced ? undefined : { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.18, delay: 0.28 + index * 0.04 } } }}>
              <rect className={styles.moduleRim} x={branch.x - 29} y={branch.y - 11} width="58" height="22" />
              <rect className={styles.moduleWell} x={branch.x - 24} y={branch.y - 7} width="48" height="14" />
              <rect className={styles.moduleHalo} x={branch.x - 22} y={branch.y - 5} width="44" height="10" />
              <rect className={styles.moduleLight} x={branch.x - 18} y={branch.y - 2} width="36" height="4" />
              <path className={styles.junctions} d={index === 0 ? "M152 88 h6 v6 h-6 Z M302 100 h6 v6 h-6 Z M392 198 h6 v6 h-6 Z" : index === 1 ? "M737 101 h6 v6 h-6 Z M582 180 h6 v6 h-6 Z M529 236 h6 v6 h-6 Z" : "M477 84 h6 v6 h-6 Z M853 115 h6 v6 h-6 Z M843 181 h6 v6 h-6 Z"} />
            </motion.g>
          </g>
        ))}

        {/* A double-lipped deck joins the last chip row; no detached picture gap. */}
        <path className={styles.deckSide} d="M5 74 H993 V83 H963 V88 H729 V84 H563 V90 H421 V86 H180 V82 H5 Z" />
        <path className={styles.deck} d="M5 72 H50 V66 H140 V70 H365 V67 H454 V72 H685 V68 H786 V71 H931 V64 H971 V72 H993 V76 H5 Z" />
        <path className={styles.edge} d="M12 75 H177 M190 75 H418 M433 75 H682 M698 75 H983 M60 81 H304 M578 83 H890" />
        <path className={styles.deckTraces} d="M64 70 H231 V75 H321 M354 70 H421 V77 H518 M550 73 H674 V69 H710 M747 75 H852 V71 H933" />

        {/* Asymmetric edge stations and upright signal connectors. */}
        <g className={styles.structures}>
          <path className={styles.towerSide} d="M18 51 H40 V71 H18 Z M25 47 H44 V65 H40 V51 H25 Z M941 39 H968 V71 H941 Z M951 31 H977 V59 H968 V39 H951 Z" />
          <path className={styles.towerFace} d="M11 52 H33 V71 H11 Z M17 48 H38 V64 H17 Z M933 40 H960 V70 H933 Z M941 32 H969 V54 H941 Z" />
          <path className={styles.towerHighlight} d="M18 49 H37 M942 33 H968 M934 41 H959 M12 53 H32" />
          <path className={styles.antenna} d="M22 48 V15 H14 V4 M952 32 V6 M974 59 V22 M41 65 V36" />
          <rect className={styles.beacon} x="11" y="1" width="6" height="6" />
          <rect className={styles.beacon} x="949" y="3" width="6" height="6" />
          <rect className={styles.socket} x="971" y="19" width="6" height="6" />
          <path className={styles.pixel} d="M22 55 h5 v3 h-5 Z M945 39 h5 v3 h-5 Z M953 46 h8 v3 h-8 Z" />
          {[110, 273, 436, 717, 861].map((x, index) => (
            <g key={x}>
              <path className={styles.antenna} d={`M${x} 70 V${index % 2 ? 56 : 60}`} />
              <rect className={styles.socket} x={x - 3} y={index % 2 ? 52 : 56} width="6" height="5" />
              <rect className={styles.pixel} x={x - 1} y={index % 2 ? 53 : 57} width="2" height="2" />
            </g>
          ))}
        </g>

        <g className={styles.hangers}>
          {hangers.map(([x, y, end], index) => (
            <g key={x} data-depth={y >= 190 ? "deep" : y >= 145 ? "middle" : "front"}>
              <path className={styles.antenna} d={`M${x} ${y} V${end - 12} H${x + (index % 2 ? 5 : -5)} V${end}`} />
              <rect className={styles.terminal} x={x + (index % 2 ? 2 : -8)} y={end} width="6" height="7" />
              <rect className={styles.pixel} x={x + (index % 2 ? 4 : -6)} y={end + 2} width="2" height="2" />
            </g>
          ))}
        </g>
        <g className={styles.fragments}>
          {fragments.map(([x, y, size]) => <rect key={x} x={x} y={y} width={size} height={size} />)}
          <path className={styles.ghostLines} d="M27 191 H84 M56 197 H103 M860 239 H947 M883 245 H964 M293 257 H338" />
        </g>
      </svg>
    </motion.div>
  );
}
