"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { easeOutCubic } from "@/lib/motion";

export interface ProjectMediaProps {
  src: string;
  alt: string;
  previewSrc?: string | null;
  aspectRatio?: string;
  priority?: boolean;
  sizes?: string;
  badge?: React.ReactNode;
  category?: string;
  className?: string;
  interactiveDepth?: boolean;
  enableDraftingReveal?: boolean;
}

export function ProjectMedia({
  src,
  alt,
  previewSrc,
  aspectRatio = "aspect-video",
  priority = false,
  sizes = "(max-width: 640px) 100vw, 50vw",
  badge,
  category,
  className = "",
  interactiveDepth = true,
  enableDraftingReveal = true,
}: ProjectMediaProps) {
  const [isFinePointer, setIsFinePointer] = useState(false);
  const [previewActive, setPreviewActive] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const shouldReduceMotion = useReducedMotion();

  // Pointer capability detection (ensures hover preview & parallax only activate on desktop mice)
  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    setIsFinePointer(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => setIsFinePointer(e.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  // Framer Motion spring parallax (Image only — card remains completely untilted)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 220, damping: 26, mass: 0.5 };
  const imageX = useSpring(mouseX, springConfig);
  const imageY = useSpring(mouseY, springConfig);

  const handleMouseEnter = () => {
    if (!isFinePointer || !previewSrc || previewError) return;
    // 140ms hover-intent delay prevents visual flicker when sweeping mouse across cards
    hoverTimeoutRef.current = setTimeout(() => {
      setPreviewActive(true);
    }, 140);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setPreviewActive(false);
    // Smoothly reset image springs to center
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isFinePointer || shouldReduceMotion || !interactiveDepth) return;
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const nx = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    // Extremely subtle translation (max +/- 2.5px horizontal, +/- 1.75px vertical)
    mouseX.set(nx * 5);
    mouseY.set(ny * 3.5);
  };

  const validPreviewSrc =
    previewSrc && previewSrc !== src && !previewError ? previewSrc : null;

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      className={`relative w-full ${aspectRatio} rounded-[4px] overflow-hidden bg-surface border border-border-hairline select-none ${className}`}
    >
      {/* Technical Drafting Wipe Curtain Overlay (Slides away smoothly on viewport entry) */}
      {!shouldReduceMotion && enableDraftingReveal && (
        <motion.div
          initial={{ scaleX: 1, opacity: 1 }}
          whileInView={{ scaleX: 0, opacity: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.42, ease: easeOutCubic }}
          style={{ transformOrigin: "right" }}
          aria-hidden="true"
          className="absolute inset-0 bg-surface z-20 pointer-events-none border-l border-border-reticle shadow-[0_0_8px_rgba(255,255,255,0.15)]"
        />
      )}

      {/* Internal Image Wrapper with Pointer Parallax Depth */}
      <motion.div
        style={
          !shouldReduceMotion && isFinePointer && interactiveDepth
            ? { x: imageX, y: imageY }
            : undefined
        }
        className="relative w-full h-full transform-gpu transition-transform duration-300 ease-out group-hover:scale-[1.015]"
      >
        {/* Canonical Primary Image */}
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={`object-cover transition-all duration-300 ease-out ${
            validPreviewSrc && previewActive ? "opacity-0" : "opacity-100"
          } grayscale group-hover:grayscale-0`}
        />

        {/* Intent-Based Preview Image (Crossfades in on intentional hover) */}
        {validPreviewSrc && (
          <Image
            src={validPreviewSrc}
            alt={`${alt} alternate view`}
            fill
            loading="lazy"
            sizes={sizes}
            onError={() => setPreviewError(true)}
            className={`object-cover transition-all duration-300 ease-out ${
              previewActive
                ? "opacity-100 grayscale-0"
                : "opacity-0 grayscale pointer-events-none"
            }`}
          />
        )}
      </motion.div>

      {/* Subtle Gradient Shadow for Contrast */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        aria-hidden="true"
      />

      {/* Optional Top-Left Status Badge */}
      {badge && <div className="absolute top-2.5 left-2.5 z-10">{badge}</div>}

      {/* Optional Top-Right Category Pill */}
      {category && (
        <div className="absolute top-2.5 right-2.5 bg-page/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-mono text-muted-foreground border border-border-hairline z-10 shadow-sm pointer-events-none">
          {category}
        </div>
      )}
    </div>
  );
}

export default ProjectMedia;
