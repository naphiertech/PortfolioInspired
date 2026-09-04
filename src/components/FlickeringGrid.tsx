"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePresentationMode } from "@/features/presentation-modes/context/PresentationModeContext";
import { useTheme } from "@/components/ThemeProvider";

interface GridPulse {
  x: number; // Viewport pixel X
  y: number; // Viewport pixel Y
  startTime: number;
  duration: number;
  maxAlpha: number;
  type: "intersection" | "segment"; // Crosshair pulse or horizontal/vertical segment trace
  orientation?: "h" | "v";
  segmentLength?: number;
}

const CELL_SIZE = 64; // 64px minor grid module
const MAJOR_INTERVAL = 256; // 256px major architectural rail (every 4 cells)

/**
 * FlickeringGrid
 *
 * Global architectural blueprint drafting grid layer.
 * - Continuous shared coordinate system: center-anchored horizontally at 50%, top-anchored at 0.
 * - Layered CSS background for crisp, zero-CPU static drafting lines.
 * - Lightweight canvas overlay for occasional, subtle localized micro-pulses at grid intersections.
 * - Organic timing: mostly static grid with sporadic, calm individual intersection blooms.
 * - Smooth 500ms visibility fade-in / fade-out.
 * - Halts RAF when disabled or when prefers-reduced-motion is active (0% idle CPU).
 * - Theme-aware: subtle charcoal lines in Dark mode, soft gray in Light mode.
 */
export function FlickeringGrid() {
  const { gridEnabled } = usePresentationMode();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const pulsesRef = useRef<GridPulse[]>([]);
  const lastSpawnTimeRef = useRef<number>(0);
  const nextSpawnDelayRef = useRef<number>(1500); // Initial delay in ms
  const isDarkRef = useRef(isDark);
  isDarkRef.current = isDark;

  // Manage fade out and RAF shutdown timing (0% CPU when inactive)
  const [isRenderActive, setIsRenderActive] = useState(gridEnabled);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (gridEnabled) {
      setIsRenderActive(true);
    } else {
      // Allow 500ms CSS fade-out to finish before stopping RAF
      timeoutId = setTimeout(() => {
        setIsRenderActive(false);
      }, 550);
    }
    return () => clearTimeout(timeoutId);
  }, [gridEnabled]);

  // Main Canvas animation lifecycle for localized intersection pulses
  useEffect(() => {
    if (!isRenderActive) {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
      return;
    }

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // In reduced motion mode, we only render the static CSS blueprint grid without running canvas RAF
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const updateCanvasSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    updateCanvasSize();

    // Helper to calculate exact grid intersection coordinates based on center-anchored 64px grid
    const getRandomGridIntersection = (width: number, height: number) => {
      const centerX = width / 2;
      const totalColsHalf = Math.ceil(centerX / CELL_SIZE);
      const randomCol = Math.floor(
        (Math.random() * 2 - 1) * totalColsHalf
      );
      const totalRows = Math.ceil(height / CELL_SIZE);
      const randomRow = Math.floor(Math.random() * totalRows);

      return {
        x: centerX + randomCol * CELL_SIZE,
        y: randomRow * CELL_SIZE,
      };
    };

    // Animation frame loop
    const render = (now: number) => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = width < 768;

      ctx.clearRect(0, 0, width, height);

      // Check if it's time to spawn an occasional localized pulse (keep mostly static)
      // Limit to at most 2 simultaneous pulses
      if (
        pulsesRef.current.length < (isMobile ? 1 : 2) &&
        now - lastSpawnTimeRef.current > nextSpawnDelayRef.current
      ) {
        const { x, y } = getRandomGridIntersection(width, height);
        const isSegment = Math.random() > 0.65; // 35% of pulses trace a small grid segment
        const dark = isDarkRef.current;

        pulsesRef.current.push({
          x,
          y,
          startTime: now,
          duration: 900 + Math.random() * 500, // 900ms - 1400ms duration
          maxAlpha: dark ? 0.28 + Math.random() * 0.12 : 0.15 + Math.random() * 0.08,
          type: isSegment ? "segment" : "intersection",
          orientation: Math.random() > 0.5 ? "h" : "v",
          segmentLength: CELL_SIZE,
        });

        lastSpawnTimeRef.current = now;
        // Irregular calm spacing: 1.8s to 3.8s on desktop, 2.8s to 5.2s on mobile
        nextSpawnDelayRef.current = isMobile
          ? 2800 + Math.random() * 2400
          : 1800 + Math.random() * 2000;
      }

      // Render active pulses
      const dark = isDarkRef.current;
      const activePulses: GridPulse[] = [];

      for (let i = 0; i < pulsesRef.current.length; i++) {
        const pulse = pulsesRef.current[i];
        const elapsed = now - pulse.startTime;
        const progress = elapsed / pulse.duration;

        if (progress < 1) {
          activePulses.push(pulse);

          // Fast smooth ease-in (~18% of duration), then natural quadratic ease-out decay
          let currentAlpha: number;
          if (progress < 0.18) {
            currentAlpha = (progress / 0.18) * pulse.maxAlpha;
          } else {
            const decay = (progress - 0.18) / 0.82;
            currentAlpha = pulse.maxAlpha * (1 - decay * decay);
          }

          if (currentAlpha > 0.01) {
            const colorRgb = dark ? "230, 240, 255" : "40, 55, 75";

            if (pulse.type === "intersection") {
              // 1. Subtle Precision Drafting Crosshair (12px arms)
              const arm = 8;
              ctx.strokeStyle = `rgba(${colorRgb}, ${currentAlpha.toFixed(3)})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              // Horizontal crosshair arm
              ctx.moveTo(pulse.x - arm, pulse.y);
              ctx.lineTo(pulse.x + arm, pulse.y);
              // Vertical crosshair arm
              ctx.moveTo(pulse.x, pulse.y - arm);
              ctx.lineTo(pulse.x, pulse.y + arm);
              ctx.stroke();

              // Central micro-node dot (1.5px)
              ctx.fillStyle = `rgba(${colorRgb}, ${(currentAlpha * 1.3).toFixed(3)})`;
              ctx.beginPath();
              ctx.arc(pulse.x, pulse.y, 1.5, 0, Math.PI * 2);
              ctx.fill();
            } else {
              // 2. Localized Grid Segment Highlight (64px trace along the grid line)
              const len = pulse.segmentLength || CELL_SIZE;
              ctx.strokeStyle = `rgba(${colorRgb}, ${(currentAlpha * 0.8).toFixed(3)})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              if (pulse.orientation === "h") {
                ctx.moveTo(pulse.x, pulse.y);
                ctx.lineTo(pulse.x + len, pulse.y);
              } else {
                ctx.moveTo(pulse.x, pulse.y);
                ctx.lineTo(pulse.x, pulse.y + len);
              }
              ctx.stroke();

              // Highlight endpoints
              ctx.fillStyle = `rgba(${colorRgb}, ${currentAlpha.toFixed(3)})`;
              ctx.beginPath();
              ctx.arc(pulse.x, pulse.y, 1.2, 0, Math.PI * 2);
              ctx.arc(
                pulse.orientation === "h" ? pulse.x + len : pulse.x,
                pulse.orientation === "v" ? pulse.y + len : pulse.y,
                1.2,
                0,
                Math.PI * 2
              );
              ctx.fill();
            }
          }
        }
      }

      pulsesRef.current = activePulses;
      animationFrameIdRef.current = requestAnimationFrame(render);
    };

    animationFrameIdRef.current = requestAnimationFrame(render);

    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        updateCanvasSize();
      }, 150);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
    };
  }, [isRenderActive]);

  if (!isRenderActive && !gridEnabled) {
    return null;
  }

  // Theme-specific CSS blueprint grid colors
  const secondaryLineColor = isDark
    ? "rgba(255, 255, 255, 0.035)"
    : "rgba(0, 0, 0, 0.035)";
  const primaryLineColor = isDark
    ? "rgba(255, 255, 255, 0.075)"
    : "rgba(0, 0, 0, 0.065)";

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden transition-opacity duration-500 ease-out select-none ${
        gridEnabled ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden="true"
    >
      {/* 1. Static Architectural Blueprint Grid (CSS Gradients, 0% CPU) */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${primaryLineColor} 1px, transparent 1px),
            linear-gradient(to bottom, ${primaryLineColor} 1px, transparent 1px),
            linear-gradient(to right, ${secondaryLineColor} 1px, transparent 1px),
            linear-gradient(to bottom, ${secondaryLineColor} 1px, transparent 1px)
          `,
          backgroundSize: `
            ${MAJOR_INTERVAL}px ${MAJOR_INTERVAL}px,
            ${MAJOR_INTERVAL}px ${MAJOR_INTERVAL}px,
            ${CELL_SIZE}px ${CELL_SIZE}px,
            ${CELL_SIZE}px ${CELL_SIZE}px
          `,
          backgroundPosition: "center top",
        }}
      />

      {/* 2. Soft Vignette: Fades out grid near screen edges for clean framing */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isDark
            ? "radial-gradient(ellipse at 50% 30%, transparent 60%, rgba(11, 13, 14, 0.6) 100%)"
            : "radial-gradient(ellipse at 50% 30%, transparent 60%, rgba(250, 250, 250, 0.6) 100%)",
        }}
      />

      {/* 3. High-Performance Canvas for Subtle Localized Micro-Pulses */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  );
}

export default FlickeringGrid;
