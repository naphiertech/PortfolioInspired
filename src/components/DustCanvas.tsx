"use client";

import React, { useEffect, useRef } from "react";
import { useSnap, SectionBounds } from "@/context/SnapContext";

interface Particle {
  x: number; // page coordinate X
  y: number; // page coordinate Y
  size: number;
  vx: number;
  vy: number;
  ax: number;
  ay: number;
  alpha: number;
  decay: number;
  life: number;
  delay: number; // in frames
  elapsed: number;
  rotation: number;
  spin: number;
  color: string;
  isCircle: boolean;
}

export function DustCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameIdRef = useRef<number | null>(null);
  const { activeDustBounds } = useSnap();

  // Spawns particles whenever activeDustBounds changes with new bounds
  useEffect(() => {
    if (!activeDustBounds || activeDustBounds.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const isDark = document.documentElement.classList.contains("dark");

    const darkColors = [
      "#fafafa",
      "#e4e4e7",
      "#d4d4d8",
      "#a1a1aa",
      "#71717a",
      "#52525b",
      "#10b981", // subtle emerald speck
      "#34d399",
      "#3f3f46",
    ];

    const lightColors = [
      "#09090b",
      "#18181b",
      "#27272a",
      "#3f3f46",
      "#52525b",
      "#71717a",
      "#059669", // subtle emerald speck
      "#10b981",
      "#a1a1aa",
    ];

    const palette = isDark ? darkColors : lightColors;

    // Resize canvas
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Generate higher density of fine, soft dust particles with original motion
    const newParticles: Particle[] = [];

    activeDustBounds.forEach((bound: SectionBounds) => {
      const area = bound.width * bound.height;
      const isText = bound.id.startsWith("text-");
      const density = isMobile
        ? isText
          ? 0.003
          : 0.00045
        : isText
        ? 0.006
        : 0.0011;
      const minCount = isText ? (isMobile ? 16 : 24) : isMobile ? 60 : 100;
      const maxCount = isText ? (isMobile ? 38 : 60) : isMobile ? 180 : 600;
      const count = Math.min(
        maxCount,
        Math.max(minCount, Math.floor(area * density))
      );

      for (let i = 0; i < count; i++) {
        const relX = Math.random();
        const relY = Math.random();

        const x = bound.left + relX * bound.width;
        const y = bound.top + relY * bound.height;

        // Original wave effect: bottom-left to top-right release
        const normalizedY = 1 - relY;
        const normalizedX = relX;
        const delay = Math.floor(
          (normalizedY * 0.4 + normalizedX * 0.2 + Math.random() * 0.15) * 60
        );

        // Original dynamic upward & rightward velocities
        const vx = 0.7 + Math.random() * 2.2 + (Math.random() - 0.5) * 0.8;
        const vy = -(1.2 + Math.random() * 2.6);

        newParticles.push({
          x,
          y,
          size: Math.random() * 1.9 + 0.7, // Soft, small, fine dust grains
          vx,
          vy,
          ax: 0.015 + (Math.random() - 0.5) * 0.01,
          ay: -0.012 + (Math.random() - 0.5) * 0.01,
          alpha: Math.random() * 0.75 + 0.25,
          decay: Math.random() * 0.012 + 0.008, // Original decay rate
          life: 1.0,
          delay,
          elapsed: 0,
          rotation: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.08,
          color: palette[Math.floor(Math.random() * palette.length)],
          isCircle: Math.random() > 0.4,
        });
      }
    });

    particlesRef.current = [...particlesRef.current, ...newParticles];

    // Render loop
    if (!animationFrameIdRef.current) {
      const render = () => {
        const c = canvasRef.current;
        if (!c) return;
        const cContext = c.getContext("2d");
        if (!cContext) return;

        cContext.clearRect(0, 0, window.innerWidth, window.innerHeight);

        const scrollX = window.scrollX;
        const scrollY = window.scrollY;

        let aliveCount = 0;
        const particles = particlesRef.current;

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.elapsed++;

          if (p.elapsed < p.delay) {
            aliveCount++;
            continue;
          }

          if (p.life <= 0) continue;

          aliveCount++;

          // Physics matching original
          p.vx += p.ax;
          p.vy += p.ay;
          p.vx *= 0.99;
          p.vy *= 0.99;

          p.x += p.vx;
          p.y += p.vy;

          p.rotation += p.spin;
          p.life -= p.decay;

          const screenX = p.x - scrollX;
          const screenY = p.y - scrollY;

          if (
            screenX >= -20 &&
            screenX <= window.innerWidth + 20 &&
            screenY >= -20 &&
            screenY <= window.innerHeight + 20
          ) {
            cContext.save();
            cContext.translate(screenX, screenY);
            cContext.rotate(p.rotation);
            cContext.fillStyle = p.color;
            cContext.globalAlpha = Math.max(0, p.alpha * p.life);

            if (p.isCircle) {
              cContext.beginPath();
              cContext.arc(0, 0, p.size / 2, 0, Math.PI * 2);
              cContext.fill();
            } else {
              cContext.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            }

            cContext.restore();
          }
        }

        // Filter out dead particles
        particlesRef.current = particles.filter(
          (p) => p.life > 0 || p.elapsed < p.delay
        );

        if (aliveCount > 0 && particlesRef.current.length > 0) {
          animationFrameIdRef.current = requestAnimationFrame(render);
        } else {
          cContext.clearRect(0, 0, window.innerWidth, window.innerHeight);
          animationFrameIdRef.current = null;
        }
      };

      animationFrameIdRef.current = requestAnimationFrame(render);
    }
  }, [activeDustBounds]);

  // Window resize listener
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ willChange: "transform" }}
    />
  );
}

export default DustCanvas;
