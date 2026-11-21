"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import styles from "./CircuitPlatform.module.css";

/**
 * CircuitPlatform
 *
 * Full-resolution (1024x334) smooth dual-theme (Light & Dark) cyber-circuit
 * floating island anchoring <TECH-STACK/>, paired with a smooth anti-aliased
 * SVG lighting & data-pulse overlay. Auto-pauses off-screen via
 * IntersectionObserver and freezes under prefers-reduced-motion.
 */
export function CircuitPlatform({
  activeBranches,
  paused = false,
}: {
  activeBranches: boolean[];
  paused?: boolean;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const uid = useId().replace(/:/g, "");

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const interacting = activeBranches.some(Boolean);
  const cyanGlowId = `cp-cg-${uid}`;
  const goldGlowId = `cp-gg-${uid}`;
  const spireGradId = `cp-sg-${uid}`;

  return (
    <div
      ref={rootRef}
      className={styles.platform}
      data-active={inView && !paused}
      aria-hidden="true"
    >
      <div className={styles.frame}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/image/tech-island-dark.webp"
          alt=""
          width={1024}
          height={334}
          decoding="async"
          loading="eager"
          className={styles.darkImg}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/image/tech-island-light.webp"
          alt=""
          width={1024}
          height={334}
          decoding="async"
          loading="eager"
          className={styles.lightImg}
        />

        {/* Smooth vector ambient lighting, plasma shimmer & interactive branch energy */}
        <svg
          viewBox="0 0 1024 334"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.overlaySvg}
          shapeRendering="geometricPrecision"
          focusable="false"
        >
          <defs>
            <radialGradient id={cyanGlowId} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#a5f3fc" stopOpacity="0.65" />
              <stop offset="45%" stopColor="#22d3ee" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
            </radialGradient>
            <radialGradient id={goldGlowId} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.82" />
              <stop offset="48%" stopColor="#f59e0b" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>
            <linearGradient id={spireGradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e0ffff" stopOpacity="0.82" />
              <stop offset="55%" stopColor="#22d3ee" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Branch 1 (<backend/>): Center holographic cube & bottom central plasma keel */}
          <g
            className={styles.branchZone}
            data-active={activeBranches[1]}
            data-muted={interacting && !activeBranches[1]}
          >
            <ellipse
              cx="512"
              cy="68"
              rx="66"
              ry="46"
              fill={`url(#${cyanGlowId})`}
              className={styles.holoAnim}
            />
            <g className={styles.moteAnimA}>
              <circle cx="496" cy="70" r="1.8" fill="#e0ffff" />
              <circle cx="526" cy="78" r="1.4" fill="#67e8f9" />
            </g>
            <g className={styles.moteAnimB}>
              <circle cx="513" cy="74" r="1.6" fill="#e0ffff" />
              <circle cx="489" cy="60" r="1.3" fill="#67e8f9" />
            </g>

            {/* Smooth pulsing central cyan plasma keel beam & sparks */}
            <g className={`${styles.spireAnchor} ${styles.spireAnim}`}>
              <rect
                x="505"
                y="218"
                width="14"
                height="94"
                rx="7"
                fill={`url(#${spireGradId})`}
              />
            </g>
            <g className={styles.sparkAnimA}>
              <circle cx="502" cy="240" r="1.6" fill="#e0ffff" />
              <circle cx="521" cy="252" r="1.4" fill="#67e8f9" />
            </g>
            <g className={styles.sparkAnimB}>
              <circle cx="512" cy="256" r="1.8" fill="#e0ffff" />
              <circle cx="494" cy="244" r="1.3" fill="#67e8f9" />
            </g>
          </g>

          {/* Branch 0 (<frontend/>): Left </> screen, gear hologram & cyan PCB bus pulse */}
          <g
            className={styles.branchZone}
            data-active={activeBranches[0]}
            data-muted={interacting && !activeBranches[0]}
          >
            <path
              d="M 204 120 H 250 L 268 134 H 310 L 338 153 H 370"
              className={`${styles.tracePulseCyan} ${styles.packetCyanAnim}`}
            />
            <ellipse cx="156" cy="54" rx="28" ry="16" fill={`url(#${cyanGlowId})`} opacity="0.5" />
            <ellipse cx="314" cy="172" rx="22" ry="26" fill={`url(#${cyanGlowId})`} opacity="0.5" />
          </g>

          {/* Branch 2 (<database-cloud/>): Waveform, {} banner, cloud/db holos & gold PCB pulse */}
          <g
            className={styles.branchZone}
            data-active={activeBranches[2]}
            data-muted={interacting && !activeBranches[2]}
          >
            <path
              d="M 534 176 L 555 157 H 589 L 602 144 H 710 L 730 128 H 776"
              className={`${styles.tracePulseGold} ${styles.packetGoldAnim}`}
            />
            <path
              d="M 780 125 H 810 L 820 116 H 846"
              className={`${styles.tracePulseGold} ${styles.packetGoldAnim}`}
            />
            <ellipse cx="746" cy="74" rx="34" ry="18" fill={`url(#${cyanGlowId})`} opacity="0.48" />
            <ellipse cx="632" cy="184" rx="28" ry="30" fill={`url(#${cyanGlowId})`} opacity="0.48" />
            <ellipse cx="776" cy="162" rx="24" ry="28" fill={`url(#${cyanGlowId})`} opacity="0.48" />
            <ellipse cx="940" cy="56" rx="20" ry="28" fill={`url(#${cyanGlowId})`} opacity="0.48" />
          </g>

          {/* Staggered warm amber pendant lantern blooms */}
          <g className={styles.lanternAnimA}>
            <circle cx="60" cy="158" r="10" fill={`url(#${goldGlowId})`} />
            <circle cx="194" cy="232" r="11" fill={`url(#${goldGlowId})`} />
            <circle cx="796" cy="224" r="11" fill={`url(#${goldGlowId})`} />
            <circle cx="944" cy="164" r="10" fill={`url(#${goldGlowId})`} />
          </g>
          <g className={styles.lanternAnimB}>
            <circle cx="138" cy="204" r="11" fill={`url(#${goldGlowId})`} />
            <circle cx="740" cy="262" r="12" fill={`url(#${goldGlowId})`} />
            <circle cx="928" cy="182" r="10" fill={`url(#${goldGlowId})`} />
          </g>
          <g className={styles.lanternAnimC}>
            <circle cx="277" cy="278" r="12" fill={`url(#${goldGlowId})`} />
            <circle cx="868" cy="196" r="10" fill={`url(#${goldGlowId})`} />
          </g>
        </svg>
      </div>
    </div>
  );
}

export default CircuitPlatform;
