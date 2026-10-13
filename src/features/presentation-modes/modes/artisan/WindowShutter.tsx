"use client";

// Note: The assets are stored in the `/public/image/window-shutter/` directory.

import {
  motion,
  useMotionValue,
  useDragControls,
  PanInfo,
  animate,
} from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

// Adjust this value (in pixels) to control how far down the shutter stops at the top
const TOP_OFFSET = 30;

interface WindowShutterProps {
  isDark?: boolean;
  className?: string;
}

export default function WindowShutter({ isDark = false, className = "" }: WindowShutterProps) {
  const shutterRef = useRef<HTMLDivElement>(null);
  const isFirstLayout = useRef(true);

  const [height, setHeight] = useState(0);
  const [isOpen, setIsOpen] = useState(true); // 1. Initial State set to Open
  const [hasInteracted, setHasInteracted] = useState(false);

  const y = useMotionValue(0);
  const dragControls = useDragControls();

  // The maximum upward position (slightly down from top based on TOP_OFFSET)
  const topLimit = -(height - TOP_OFFSET);

  /*
   * Measure responsive parent height and set starting position to Open
   */
  useEffect(() => {
    if (!shutterRef.current) return;

    const observer = new ResizeObserver(() => {
      const rect = shutterRef.current?.getBoundingClientRect();
      if (rect) {
        setHeight(rect.height);

        // On first render, immediately place the shutter according to initial state
        if (isFirstLayout.current) {
          const initialTopLimit = -(rect.height - TOP_OFFSET);
          y.set(isOpen ? initialTopLimit : 0);
          isFirstLayout.current = false;
        }
      }
    });

    observer.observe(shutterRef.current);
    return () => observer.disconnect();
  }, [y, isOpen]);

  /*
   * Smooth tween animation - clean hard stop, no bounce.
   */
  const animateTo = useCallback(
    (target: number) => {
      animate(y, target, {
        type: "tween",
        ease: [0.32, 0.72, 0, 1], // Smooth ease-out
        duration: 0.45,
      });
    },
    [y]
  );

  // Helper function to safely play audio files with tactile synthesizer fallback
  const playSound = (soundPath: string) => {
    if (typeof window !== "undefined") {
      const audio = new Audio(soundPath);
      audio.volume = 0.4;
      audio.play().catch(() => {
        // Fallback: gentle mechanical tactile click via Web Audio API
        try {
          const AudioContext =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
          if (AudioContext) {
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(160, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.12);
            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.13);
          }
        } catch {
          // Safe no-op
        }
      });
    }
  };

  const open = useCallback(() => {
    setIsOpen(true);
    animateTo(topLimit);
    playSound("/image/window-shutter/shutter-sound.m4a");
  }, [topLimit, animateTo]);

  const close = useCallback(() => {
    setIsOpen(false);
    animateTo(0);
    playSound("/image/window-shutter/shutter-sound.m4a");
  }, [animateTo]);

  // Drag/pointer interaction
  const handleInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  };

  /*
   * Drag end logic using customized active travel distance
   */
  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (!height) return;

    const currentY = y.get();
    const velocity = info.velocity.y;

    // Quick click/tap on the handle bar without drag -> toggle
    if (Math.abs(info.offset.y) < 6 && Math.abs(velocity) < 100) {
      if (isOpen) {
        close();
      } else {
        open();
      }
      return;
    }

    // Total physical area the shutter can travel
    const activeTravelDistance = height - TOP_OFFSET;
    const threshold = activeTravelDistance * 0.4; // 40%

    if (!isOpen) {
      // Closed state - dragging up
      const draggedDistance = Math.abs(currentY);

      if (draggedDistance >= threshold || velocity < -700) {
        open();
      } else {
        close();
      }
    } else {
      // Open state - dragging down (relative to topLimit)
      const draggedDownDistance = currentY - topLimit;

      if (draggedDownDistance >= threshold || velocity > 700) {
        close();
      } else {
        open();
      }
    }
  };

  return (
    <div className={`relative flex flex-col justify-center items-center select-none ${className}`}>
      {/* Window object: theme-based styling (crisp natural light in light mode, sleek night tone in dark mode) */}
      <div
        className="relative w-[300px] h-[240px] sm:w-[320px] sm:h-[256px] transition-[filter] duration-300"
        style={{
          filter: isDark ? "brightness(0.72) contrast(1.02)" : "none",
        }}
      >
        {/* Pixelated Window Scenery */}
        <div className="absolute inset-0 overflow-hidden rounded-[5rem] m-1 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/image/window-shutter/pixel-window-day.gif"
            alt="Pixelated daytime window scenery"
            draggable={false}
            style={{ imageRendering: "pixelated" }}
            className={`absolute inset-0 w-full h-full object-cover object-center mt-3 select-none pointer-events-none transition-opacity duration-200 ${
              isDark ? "opacity-0" : "opacity-100"
            }`}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/image/window-shutter/pixel-window-night.gif"
            alt="Pixelated night window scenery"
            draggable={false}
            style={{ imageRendering: "pixelated" }}
            className={`absolute inset-0 w-full h-full object-cover object-center mt-3 select-none pointer-events-none transition-opacity duration-200 ${
              isDark ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>

        {/* Inner frame */}
        <div className="absolute inset-0 overflow-hidden rounded-[3rem] z-1 pointer-events-none">
          <Image
            src="/image/window-shutter/window-inner-frame.webp"
            alt="window-inner-frame"
            loading="eager"
            fill
            sizes="320px"
            className="object-fill scale-90"
          />
        </div>

        {/* Shutter */}
        <div className="absolute inset-0 overflow-hidden m-4 rounded-2xl z-2">
          <div ref={shutterRef} className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute inset-0 h-full w-full flex justify-center items-center rounded-[2rem] select-none"
              style={{ y }}
              drag="y"
              dragListener={false}
              dragControls={dragControls}
              dragConstraints={{
                top: topLimit, // Stops slightly down from top
                bottom: 0,
              }}
              dragElastic={0} // No elastic overshoot beyond limits
              dragMomentum={false} // No momentum bounce
              onDragStart={handleInteraction}
              onDragEnd={handleDragEnd}
            >
              <Image
                src="/image/window-shutter/window-shutter.webp"
                alt="window-shutter"
                fill
                sizes="320px"
                draggable={false}
                className="pointer-events-none absolute inset-0 h-full w-full object-fill select-none"
              />
              {/* Draggable Shutter Handle Bar */}
              <div
                onPointerDown={(e) => {
                  handleInteraction();
                  dragControls.start(e);
                }}
                className="absolute bottom-1 rounded-b-[6rem] w-[90%] h-6 cursor-grab active:cursor-grabbing touch-none"
                style={{ touchAction: "none" }}
                title="Drag or click to slide shutter"
              />
            </motion.div>
          </div>
        </div>

        {/* Outer frame */}
        <div className="absolute inset-0 overflow-hidden rounded-[3rem] z-3 pointer-events-none">
          <Image
            src="/image/window-shutter/window-outer-frame.webp"
            alt="window-outer-frame"
            fill
            sizes="320px"
            className="object-fill"
          />
        </div>
      </div>
    </div>
  );
}
