"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { useReducedMotion } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import {
  PROFILE_FRAMES, PROFILE_FRAME_MS, PROFILE_BUFFER_SIZE,
  getProfileFrame, prepareProfileFrames, scheduleIdleProfilePreload,
} from "@/lib/profileAnimation";

/** Only this image changes during playback; hero content never renders at frame rate. */
export function ProfileFrameOverlay({ className, style }: { className: string; style?: CSSProperties }) {
  const { resolvedTheme } = useTheme();
  const reduced = useReducedMotion();
  const imageRef = useRef<HTMLImageElement>(null);
  const position = useRef(-1); // -1 is the existing static, unsunglassed portrait.
  const previousTheme = useRef<string | null>(null);

  useEffect(() => scheduleIdleProfilePreload(3500, resolvedTheme === "dark"), [resolvedTheme]);

  useEffect(() => {
    if (!resolvedTheme) return;
    const target = resolvedTheme === "dark" ? PROFILE_FRAMES.length - 1 : -1;
    const changed = previousTheme.current !== null && previousTheme.current !== resolvedTheme;
    previousTheme.current = resolvedTheme;
    let cancelled = false;
    let raf = 0;
    let revealObserver: MutationObserver | undefined;
    const display = (index: number) => {
      const image = imageRef.current;
      if (cancelled || !image) return;
      if (index < 0) image.style.visibility = "hidden";
      else {
        const decoded = getProfileFrame(PROFILE_FRAMES[index])?.image;
        if (!decoded) return;
        image.src = decoded.src;
        image.style.visibility = "visible";
      }
      position.current = index;
    };
    const play = async () => {
      if (!changed || reduced) {
        if (target >= 0) await prepareProfileFrames([PROFILE_FRAMES[target]], true);
        display(target);
        return;
      }
      const direction = target > position.current ? 1 : -1;
      const path = Array.from({ length: Math.abs(target - position.current) }, (_, index) => position.current + direction * (index + 1));
      if (!path.length) return;
      const frames = path.filter(index => index >= 0).map(index => PROFILE_FRAMES[index]);
      await prepareProfileFrames(frames.slice(0, PROFILE_BUFFER_SIZE));
      if (cancelled) return;
      void prepareProfileFrames(frames.slice(PROFILE_BUFFER_SIZE));
      let start: number | undefined;
      let completed = 0;
      const tick = (time: number) => {
        if (cancelled) return;
        start ??= time;
        const desired = Math.min(path.length, Math.floor((time - start) / PROFILE_FRAME_MS));
        let latest: number | undefined;
        while (completed < desired) {
          const index = path[completed];
          const frame = index >= 0 ? getProfileFrame(PROFILE_FRAMES[index]) : null;
          if (frame?.pending) {
            // Hold the last decoded image and pause the clock during a buffer underrun.
            start = time - completed * PROFILE_FRAME_MS;
            break;
          }
          if (index < 0 || frame?.image) latest = index;
          completed++;
        }
        if (latest !== undefined) display(latest);
        if (completed < path.length) raf = requestAnimationFrame(tick);
      };
      const begin = () => {
        if (cancelled || document.documentElement.dataset.themeTransition) return;
        revealObserver?.disconnect();
        raf = requestAnimationFrame(tick);
      };
      // Root View Transition snapshots are frozen. Do not consume frames behind
      // them, then jump halfway through the sequence when the live DOM reappears.
      if (document.documentElement.dataset.themeTransition) {
        revealObserver = new MutationObserver(begin);
        revealObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme-transition"] });
      } else begin();
    };
    void play();
    return () => { cancelled = true; cancelAnimationFrame(raf); revealObserver?.disconnect(); };
  }, [resolvedTheme, reduced]);

  // No src until a decoded frame is ready; the existing NextImage stays underneath.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img ref={imageRef} alt="" aria-hidden="true" className={className} style={{ ...style, visibility: "hidden" }} />
  );
}
