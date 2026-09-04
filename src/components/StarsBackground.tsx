"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePresentationMode } from "@/features/presentation-modes/context/PresentationModeContext";
import { useTheme } from "@/components/ThemeProvider";

interface Star {
  x: number; // 0..1 normalized coordinate
  y: number; // 0..1 normalized coordinate
  size: number; // Radius in pixels
  baseAlpha: number; // Resting opacity
  twinkleAmp: number; // Twinkle fluctuation amplitude
  twinkleSpeed: number; // Radians per frame
  twinklePhase: number; // Phase offset
  vx: number; // Normalized drift X velocity
  vy: number; // Normalized drift Y velocity
}

/**
 * StarsBackground
 *
 * Lightweight, ambient global starfield canvas.
 * - Subtly sparse distribution (70-95 stars desktop, 35-45 mobile).
 * - Gentle ambient floating drift and organic sinusoidal twinkle.
 * - Theme-aware: soft off-white/silver in Dark mode, delicate slate-tinted dots in Light mode.
 * - Smooth 500ms CSS fade-in / fade-out when toggled.
 * - Automatically pauses RAF when disabled or when prefers-reduced-motion is active (0% idle CPU).
 * - True background layer: fixed, pointer-events-none, z-0.
 */
export function StarsBackground() {
  const { starsEnabled } = usePresentationMode();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const starsRef = useRef<Star[]>([]);
  const isDarkRef = useRef(isDark);
  isDarkRef.current = isDark;

  // Track if canvas should actively be rendering in the DOM/RAF
  const [isRenderActive, setIsRenderActive] = useState(starsEnabled);

  // Manage fade out and RAF shutdown timing
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (starsEnabled) {
      setIsRenderActive(true);
    } else {
      // Allow 500ms CSS fade-out to complete before unhooking RAF loop
      timeoutId = setTimeout(() => {
        setIsRenderActive(false);
      }, 550);
    }
    return () => clearTimeout(timeoutId);
  }, [starsEnabled]);

  // Generate starfield data (once on mount or upon significant layout dimensions)
  const initStars = (width: number, height: number) => {
    const isMobile = width < 768;
    const count = isMobile ? Math.floor(35 + Math.random() * 10) : Math.floor(75 + Math.random() * 20);

    const stars: Star[] = [];
    for (let i = 0; i < count; i++) {
      // Weighted star sizes: mostly tiny (0.7-1.2px), few medium (1.3-1.6px), rare bright (1.7-1.9px)
      const sizeSeed = Math.random();
      const size =
        sizeSeed < 0.7
          ? 0.75 + Math.random() * 0.45
          : sizeSeed < 0.92
          ? 1.25 + Math.random() * 0.35
          : 1.6 + Math.random() * 0.3;

      stars.push({
        x: Math.random(),
        y: Math.random(),
        size,
        baseAlpha: 0.18 + Math.random() * 0.35,
        twinkleAmp: 0.08 + Math.random() * 0.22,
        twinkleSpeed: 0.006 + Math.random() * 0.016, // Gentle 4-10s cycles
        twinklePhase: Math.random() * Math.PI * 2,
        // Extremely subtle upward / horizontal ambient drift
        vx: (Math.random() - 0.5) * 0.00003,
        vy: -(0.000015 + Math.random() * 0.000045),
      });
    }

    starsRef.current = stars;
  };

  // Main Canvas & RAF lifecycle
  useEffect(() => {
    if (!isRenderActive) {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Canvas sizing with device pixel ratio
    const updateSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Initialize stars if empty
      if (starsRef.current.length === 0) {
        initStars(width, height);
      }
    };

    updateSize();

    // Render single frame of stars
    const renderFrame = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      ctx.clearRect(0, 0, width, height);

      const dark = isDarkRef.current;
      const stars = starsRef.current;

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Motion and Twinkle update (only if motion is not reduced)
        if (!prefersReducedMotion) {
          star.twinklePhase += star.twinkleSpeed;
          star.x += star.vx;
          star.y += star.vy;

          // Seamless edge wrapping
          if (star.x < 0) star.x += 1;
          if (star.x > 1) star.x -= 1;
          if (star.y < 0) star.y += 1;
          if (star.y > 1) star.y -= 1;
        }

        // Calculate opacity with smooth sine breathing
        const sine = Math.sin(star.twinklePhase);
        const dynamicAlpha = star.baseAlpha + star.twinkleAmp * sine;

        // Theme-tuned color and alpha ranges
        let colorString: string;
        if (dark) {
          // Soft silver/off-white in dark mode
          const clampedAlpha = Math.max(0.12, Math.min(0.72, dynamicAlpha));
          colorString = `rgba(240, 244, 255, ${clampedAlpha.toFixed(3)})`;
        } else {
          // Delicate slate-charcoal point in light mode (never harsh black)
          const clampedAlpha = Math.max(0.05, Math.min(0.24, dynamicAlpha * 0.4));
          colorString = `rgba(70, 80, 95, ${clampedAlpha.toFixed(3)})`;
        }

        const px = star.x * width;
        const py = star.y * height;

        ctx.beginPath();
        ctx.arc(px, py, star.size, 0, Math.PI * 2);
        ctx.fillStyle = colorString;
        ctx.fill();
      }
    };

    // If reduced motion is requested, render once and do NOT loop RAF
    if (prefersReducedMotion) {
      renderFrame();
      return;
    }

    // High performance RAF loop
    const animate = () => {
      renderFrame();
      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    animationFrameIdRef.current = requestAnimationFrame(animate);

    // Resize handler (debounced / responsive)
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        updateSize();
        if (prefersReducedMotion) {
          renderFrame();
        }
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

  // Re-draw static frame for reduced motion users when theme switches
  useEffect(() => {
    if (!isRenderActive || !canvasRef.current) return;
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!prefersReducedMotion) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    ctx.clearRect(0, 0, width, height);

    const dark = resolvedTheme === "dark";
    const stars = starsRef.current;

    for (let i = 0; i < stars.length; i++) {
      const star = stars[i];
      const dynamicAlpha = star.baseAlpha;
      const colorString = dark
        ? `rgba(240, 244, 255, ${Math.max(0.12, Math.min(0.72, dynamicAlpha)).toFixed(3)})`
        : `rgba(70, 80, 95, ${Math.max(0.05, Math.min(0.24, dynamicAlpha * 0.4)).toFixed(3)})`;

      ctx.beginPath();
      ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2);
      ctx.fillStyle = colorString;
      ctx.fill();
    }
  }, [resolvedTheme, isRenderActive]);

  // If completely inactive, render null
  if (!isRenderActive && !starsEnabled) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden transition-opacity duration-500 ease-out select-none ${
        starsEnabled ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  );
}

export default StarsBackground;
