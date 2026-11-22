"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "@/components/GauntletTrigger.module.css";

type GloveMode = "idle" | "snap" | "settled" | "time";

interface DustParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
}

export interface ThanosGauntletSandboxProps {
  soundEnabled?: boolean;
  label?: string;
}

export function ThanosGauntletSandbox({
  soundEnabled = true,
  label = "Target Module",
}: ThanosGauntletSandboxProps) {
  const [mode, setMode] = useState<GloveMode>("idle");
  const [isDark, setIsDark] = useState(true);
  const [isTargetSnapped, setIsTargetSnapped] = useState(false);
  const [isDissolving, setIsDissolving] = useState(false);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const snapAudioRef = useRef<HTMLAudioElement | null>(null);
  const timeAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const syncTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    syncTheme();
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const playSound = useCallback(
    (type: "snap" | "time") => {
      if (!soundEnabled) return;
      try {
        let audio = type === "snap" ? snapAudioRef.current : timeAudioRef.current;
        if (!audio) {
          audio = new Audio(
            type === "snap"
              ? "/easter-egg/thanos/thanos_snap_sound.mp3"
              : "/easter-egg/thanos/thanos_reverse_sound.mp3"
          );
          if (type === "snap") snapAudioRef.current = audio;
          else timeAudioRef.current = audio;
        }
        audio.currentTime = 0;
        void audio.play().catch(() => {});
      } catch {
        // Audio optional when blocked by browser autoplay policy
      }
    },
    [soundEnabled]
  );

  const spawnDust = useCallback(() => {
    const stage = stageRef.current;
    const target = targetRef.current;
    const canvas = canvasRef.current;
    if (!stage || !target || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const stageRect = stage.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = stageRect.width * dpr;
    canvas.height = stageRect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const originX = targetRect.left - stageRect.left;
    const originY = targetRect.top - stageRect.top;
    const colors = isDark
      ? ["#fafafa", "#d4d4d8", "#a1a1aa", "#71717a", "#52525b"]
      : ["#09090b", "#27272a", "#52525b", "#71717a", "#a1a1aa"];

    const particles: DustParticle[] = [];
    const count = 180;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: originX + Math.random() * targetRect.width,
        y: originY + Math.random() * targetRect.height,
        vx: 0.4 + Math.random() * 1.9,
        vy: -0.35 - Math.random() * 1.4,
        size: 1.5 + Math.random() * 2.5,
        alpha: 0.9,
        decay: 0.012 + Math.random() * 0.015,
        color: colors[i % colors.length],
      });
    }

    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);

    const tick = () => {
      ctx.clearRect(0, 0, stageRect.width, stageRect.height);
      let alive = 0;
      for (const p of particles) {
        if (p.alpha <= 0.02) continue;
        alive++;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 1.015;
        p.alpha -= p.decay;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
      ctx.globalAlpha = 1;
      if (alive > 0) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [isDark]);

  const isBusy = mode === "snap" || mode === "time";

  const handleToggleSnap = () => {
    if (isBusy) return;
    if (isTargetSnapped || mode === "settled") {
      setMode("time");
      playSound("time");
      setTimeout(() => {
        setIsTargetSnapped(false);
        setIsDissolving(false);
      }, 1000);
    } else {
      setMode("snap");
      playSound("snap");
    }
  };

  const handleAnimationEnd = () => {
    if (mode === "snap") {
      setMode("settled");
      setIsDissolving(true);
      spawnDust();
      setTimeout(() => {
        setIsTargetSnapped(true);
        setIsDissolving(false);
      }, 650);
    } else if (mode === "time") {
      setMode("idle");
    }
  };

  let spriteClass = isDark ? styles.idleDark : styles.idleLight;
  if (mode === "snap") spriteClass = isDark ? styles.snapDark : styles.snapLight;
  else if (mode === "time") spriteClass = isDark ? styles.timeDark : styles.timeLight;

  const caption =
    mode === "snap"
      ? "snapping..."
      : mode === "time"
      ? "restoring..."
      : isTargetSnapped
      ? "click to restore"
      : "click gauntlet";

  return (
    <div
      ref={stageRef}
      className="relative w-full min-h-[240px] flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 p-5 sm:p-6 overflow-hidden select-none"
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 w-full h-full z-20"
      />

      {/* Scoped Demo Target Card */}
      <div
        ref={targetRef}
        className={`w-full max-w-[260px] rounded-xl border border-border-hairline bg-surface/65 p-4 transition-all duration-500 ${
          isTargetSnapped
            ? "opacity-0 scale-95 pointer-events-none"
            : isDissolving
            ? "opacity-25 blur-[2px] scale-95"
            : "opacity-100 scale-100"
        }`}
        aria-hidden={isTargetSnapped}
      >
        <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2">
          <span>SANDBOX // TARGET</span>
          <span className="size-1.5 rounded-full bg-ink" />
        </div>
        <h4 className="font-sans text-sm font-semibold text-ink">{label}</h4>
        <p className="font-sans text-xs text-muted-foreground mt-1 leading-relaxed">
          Isolated target card. Dissolves into pixel dust without mutating page layout.
        </p>
      </div>

      {/* Gauntlet Trigger */}
      <div className="relative z-10 flex flex-col items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={handleToggleSnap}
          disabled={isBusy}
          aria-label={isTargetSnapped ? "Restore sandbox card" : "Snap sandbox card"}
          className={`${styles.gauntletWrapper} cursor-pointer focus-visible:ring-2 focus-visible:ring-ink rounded-lg`}
        >
          <div
            onAnimationEnd={handleAnimationEnd}
            className={`${styles.spriteFrame} ${spriteClass}`}
          />
        </button>
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {caption}
        </span>
      </div>
    </div>
  );
}

export default ThanosGauntletSandbox;
