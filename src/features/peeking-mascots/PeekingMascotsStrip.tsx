"use client";

import React, { useEffect, useReducer, useRef } from "react";
import { useUISound } from "@/context/SoundContext";
import { createMascotAudio, type MascotAudioAdapter } from "./mascotAudio";
import {
  INITIAL_MASCOT_TRIO_STATE,
  MASCOT_IDS,
  MASCOT_REACT_MS,
  MASCOT_WAVE_MS,
  mascotTrioReducer,
  type MascotId,
} from "./mascotState";
import { MascotSprite } from "./MascotSprites";
import styles from "./PeekingMascots.module.css";

const MASCOT_META: Record<MascotId, { label: string; title: string }> = {
  scout: {
    label: "Greet Scout (Current Focus mascot)",
    title: "Scout — click to inspect",
  },
  tinker: {
    label: "Greet Tinker (What I Build mascot)",
    title: "Tinker — click to tinker",
  },
  craft: {
    label: "Greet Craft (How I Work mascot)",
    title: "Craft — click to say hi",
  },
};

const MAX_EYE_X = 3.1;
const MAX_EYE_Y = 2.1;

/**
 * PeekingMascotsStrip
 *
 * Three interactive peeking mascots perched along the top border of
 * ProfileInfoBlock (1 per column on md+, side-by-side trio on mobile).
 * Eyes smoothly track the user's pointer at 60fps via rAF CSS variables with
 * zero React re-renders. Clicking each mascot triggers a distinct reaction;
 * greeting all three launches a synchronized wave celebration.
 */
export function PeekingMascotsStrip() {
  const { isSoundEnabled, playHover } = useUISound();
  const [state, dispatch] = useReducer(
    mascotTrioReducer,
    INITIAL_MASCOT_TRIO_STATE
  );

  const buttonRefs = useRef<Record<MascotId, HTMLButtonElement | null>>({
    scout: null,
    tinker: null,
    craft: null,
  });
  const audioRef = useRef<MascotAudioAdapter | null>(null);
  const reactTimersRef = useRef<
    Partial<Record<MascotId, ReturnType<typeof setTimeout>>>
  >({});

  const getAudio = () => {
    if (!audioRef.current) {
      audioRef.current = createMascotAudio();
    }
    return audioRef.current;
  };

  // Single passive pointermove listener updating CSS eye variables via rAF (zero re-renders)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduced || coarse) return;

    let rafId: number | null = null;
    let pointerX = 0;
    let pointerY = 0;

    const updateEyes = () => {
      rafId = null;
      for (const id of MASCOT_IDS) {
        const el = buttonRefs.current[id];
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height * 0.56;
        const dx = pointerX - cx;
        const dy = pointerY - cy;
        const dist = Math.hypot(dx, dy);

        if (dist < 1) {
          el.style.setProperty("--eye-x", "0px");
          el.style.setProperty("--eye-y", "0px");
          continue;
        }

        // Smooth ease-out magnitude so eyes track gently near and fully at distance
        const factor = Math.min(1, dist / 220);
        const ux = (dx / dist) * MAX_EYE_X * factor;
        const uy = (dy / dist) * MAX_EYE_Y * factor;

        el.style.setProperty("--eye-x", `${ux.toFixed(2)}px`);
        el.style.setProperty("--eye-y", `${uy.toFixed(2)}px`);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      pointerX = e.clientX;
      pointerY = e.clientY;
      if (rafId === null) {
        rafId = window.requestAnimationFrame(updateEyes);
      }
    };

    const onPointerLeave = () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
      for (const id of MASCOT_IDS) {
        const el = buttonRefs.current[id];
        if (!el) continue;
        el.style.setProperty("--eye-x", "0px");
        el.style.setProperty("--eye-y", "0px");
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("mouseleave", onPointerLeave);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("mouseleave", onPointerLeave);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  // Reset synchronized wave celebration after it plays
  useEffect(() => {
    if (state.waveCount === 0) return;
    const timer = setTimeout(() => {
      dispatch({ type: "WAVE_COMPLETE" });
    }, MASCOT_WAVE_MS);
    return () => clearTimeout(timer);
  }, [state.waveCount]);

  // Clean up timers & Web Audio on unmount
  useEffect(() => {
    const timers = reactTimersRef.current;
    return () => {
      for (const id of MASCOT_IDS) {
        const t = timers[id];
        if (t) clearTimeout(t);
      }
      audioRef.current?.dispose();
      audioRef.current = null;
    };
  }, []);

  const handleClick = (id: MascotId) => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    const willTriggerWave = MASCOT_IDS.every(
      (m) => m === id || state.greeted[m]
    );

    if (isSoundEnabled) {
      const audio = getAudio();
      if (willTriggerWave) {
        audio.playWave();
      } else {
        audio.playMascot(id);
      }
    }

    const existing = reactTimersRef.current[id];
    if (existing) clearTimeout(existing);

    dispatch({ type: "CLICK", id });

    if (!willTriggerWave) {
      reactTimersRef.current[id] = setTimeout(() => {
        dispatch({ type: "REACT_COMPLETE", id });
      }, MASCOT_REACT_MS[id]);
    }
  };

  return (
    <div className={styles.stripDesktop}>
      {MASCOT_IDS.map((id) => {
        const meta = MASCOT_META[id];
        return (
          <button
            key={id}
            ref={(node) => {
              buttonRefs.current[id] = node;
            }}
            type="button"
            onClick={handleClick(id)}
            onMouseEnter={playHover}
            aria-label={meta.label}
            title={meta.title}
            className={styles.mascotButton}
          >
            <MascotSprite
              key={`${id}-${state.reactionNonce[id]}-${state.waveCount}`}
              id={id}
              mood={state.moods[id]}
            />
          </button>
        );
      })}
    </div>
  );
}

export default PeekingMascotsStrip;
