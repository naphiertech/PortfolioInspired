"use client";

import type { MascotId } from "./mascotState";

export interface MascotAudioAdapter {
  playMascot: (id: MascotId) => void;
  playWave: () => void;
  dispose: () => void;
}

/**
 * Subtle procedural Web Audio micro-chirps for Scout, Tinker, Craft, and their
 * synchronized 3-mascot celebration wave. Lazily initializes AudioContext on click.
 */
export function createMascotAudio(): MascotAudioAdapter {
  let ctx: AudioContext | null = null;

  const ensureContext = (): AudioContext | null => {
    if (typeof window === "undefined") return null;

    if (!ctx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtxClass) return null;
      ctx = new AudioCtxClass();
    }

    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    return ctx;
  };

  const playTone = (
    audioCtx: AudioContext,
    type: OscillatorType,
    freqStart: number,
    freqEnd: number,
    startOffset: number,
    duration: number,
    peakGain: number
  ) => {
    const now = audioCtx.currentTime + startOffset;
    const osc = audioCtx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freqStart, now);
    if (freqEnd !== freqStart) {
      osc.frequency.exponentialRampToValueAtTime(freqEnd, now + duration);
    }

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(peakGain, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.015);
  };

  const playMascot = (id: MascotId) => {
    const audioCtx = ensureContext();
    if (!audioCtx) return;

    try {
      if (id === "scout") {
        // Curious detective "hmm-aha!" upward pip
        playTone(audioCtx, "sine", 540, 760, 0, 0.09, 0.032);
        playTone(audioCtx, "triangle", 780, 1040, 0.075, 0.11, 0.024);
      } else if (id === "tinker") {
        // Playful builder wrench double-tink
        playTone(audioCtx, "triangle", 880, 960, 0, 0.065, 0.03);
        playTone(audioCtx, "triangle", 1180, 1320, 0.075, 0.085, 0.028);
      } else {
        // Cozy shy-peek duck & happy head-bop
        playTone(audioCtx, "sine", 520, 390, 0, 0.11, 0.026);
        playTone(audioCtx, "sine", 460, 660, 0.24, 0.12, 0.03);
      }
    } catch {
      // Fail silently
    }
  };

  const playWave = () => {
    const audioCtx = ensureContext();
    if (!audioCtx) return;

    try {
      const chord = [523.25, 659.25, 783.99, 1046.5];
      chord.forEach((freq, idx) => {
        playTone(audioCtx, "triangle", freq, freq * 1.01, idx * 0.075, 0.18, 0.028);
      });
    } catch {
      // Fail silently
    }
  };

  const dispose = () => {
    if (ctx) {
      const closing = ctx;
      ctx = null;
      closing.close().catch(() => {});
    }
  };

  return { playMascot, playWave, dispose };
}
