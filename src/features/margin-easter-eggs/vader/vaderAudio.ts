"use client";

import type { SaberColor } from "./vaderState";

export interface VaderAudioAdapter {
  playIgnite: (saber: SaberColor) => void;
  startHum: (saber: SaberColor) => void;
  stopHum: () => void;
  playRetract: (saber: SaberColor) => void;
  dispose: () => void;
}

export interface VaderAudioOptions {
  /** Optional custom MP3 overrides (falls back cleanly to Web Audio synth). */
  audioUrls?: {
    ignite?: string;
    retract?: string;
  };
}

/**
 * Procedural Star Wars lightsaber audio synthesizer (Ben Burtt-inspired):
 * - Snap-hiss ignition burst + rising dual-sawtooth plasma bloom
 * - Subtle throbbing dual-detuned lightsaber hum while lit
 * - Pitch-dropping vwoom-off retraction sweep
 *
 * Also supports optional MP3 drop-in adapters via `options.audioUrls`.
 */
export function createVaderAudio(
  options: VaderAudioOptions = {}
): VaderAudioAdapter {
  let ctx: AudioContext | null = null;
  let noiseBuffer: AudioBuffer | null = null;
  let humOscA: OscillatorNode | null = null;
  let humOscB: OscillatorNode | null = null;
  let humGain: GainNode | null = null;
  let igniteHtmlAudio: HTMLAudioElement | null = null;
  let retractHtmlAudio: HTMLAudioElement | null = null;

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

  const ensureNoiseBuffer = (audioCtx: AudioContext): AudioBuffer => {
    if (noiseBuffer && noiseBuffer.sampleRate === audioCtx.sampleRate) {
      return noiseBuffer;
    }

    const length = audioCtx.sampleRate * 1.5;
    const buffer = audioCtx.createBuffer(1, length, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    noiseBuffer = buffer;
    return buffer;
  };

  const stopHum = () => {
    if (humGain && ctx) {
      try {
        const now = ctx.currentTime;
        humGain.gain.cancelScheduledValues(now);
        humGain.gain.setValueAtTime(Math.max(humGain.gain.value, 0.0001), now);
        humGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
      } catch {
        // Ignore teardown errors
      }
    }

    const a = humOscA;
    const b = humOscB;
    humOscA = null;
    humOscB = null;
    humGain = null;

    if (a || b) {
      setTimeout(() => {
        try {
          a?.stop();
          a?.disconnect();
          b?.stop();
          b?.disconnect();
        } catch {
          // Already stopped
        }
      }, 170);
    }
  };

  const playSynthIgnite = (saber: SaberColor) => {
    const audioCtx = ensureContext();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      const buffer = ensureNoiseBuffer(audioCtx);
      const baseFreq = saber === "jedi" ? 104 : 88;

      // 1. Classic sharp "snap-hiss" plasma crackle
      const snapSrc = audioCtx.createBufferSource();
      snapSrc.buffer = buffer;

      const snapFilter = audioCtx.createBiquadFilter();
      snapFilter.type = "bandpass";
      snapFilter.frequency.setValueAtTime(2800, now);
      snapFilter.frequency.exponentialRampToValueAtTime(720, now + 0.24);
      snapFilter.Q.setValueAtTime(1.8, now);

      const snapGain = audioCtx.createGain();
      snapGain.gain.setValueAtTime(0.001, now);
      snapGain.gain.exponentialRampToValueAtTime(0.085, now + 0.012);
      snapGain.gain.exponentialRampToValueAtTime(0.028, now + 0.09);
      snapGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.34);

      snapSrc.connect(snapFilter);
      snapFilter.connect(snapGain);
      snapGain.connect(audioCtx.destination);
      snapSrc.start(now, 0, 0.36);

      // 2. Dual-oscillator plasma power-up sweep
      const oscA = audioCtx.createOscillator();
      const oscB = audioCtx.createOscillator();
      oscA.type = "sawtooth";
      oscB.type = "sawtooth";

      oscA.frequency.setValueAtTime(baseFreq * 0.65, now);
      oscA.frequency.exponentialRampToValueAtTime(baseFreq * 1.18, now + 0.14);
      oscA.frequency.exponentialRampToValueAtTime(baseFreq, now + 0.32);

      oscB.frequency.setValueAtTime(baseFreq * 1.32, now);
      oscB.frequency.exponentialRampToValueAtTime(baseFreq * 2.04, now + 0.14);
      oscB.frequency.exponentialRampToValueAtTime(baseFreq * 1.035, now + 0.32);

      const toneFilter = audioCtx.createBiquadFilter();
      toneFilter.type = "lowpass";
      toneFilter.frequency.setValueAtTime(240, now);
      toneFilter.frequency.exponentialRampToValueAtTime(1650, now + 0.11);
      toneFilter.frequency.exponentialRampToValueAtTime(340, now + 0.34);
      toneFilter.Q.setValueAtTime(2.6, now);

      const toneGain = audioCtx.createGain();
      toneGain.gain.setValueAtTime(0.0001, now);
      toneGain.gain.exponentialRampToValueAtTime(0.048, now + 0.045);
      toneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.36);

      oscA.connect(toneFilter);
      oscB.connect(toneFilter);
      toneFilter.connect(toneGain);
      toneGain.connect(audioCtx.destination);

      oscA.start(now);
      oscB.start(now);
      oscA.stop(now + 0.38);
      oscB.stop(now + 0.38);
    } catch {
      // Fail silently
    }
  };

  const playIgnite = (saber: SaberColor) => {
    const customUrl = options.audioUrls?.ignite;
    if (customUrl && typeof window !== "undefined") {
      try {
        if (!igniteHtmlAudio) {
          igniteHtmlAudio = new Audio(customUrl);
          igniteHtmlAudio.volume = 0.45;
        }
        igniteHtmlAudio.currentTime = 0;
        igniteHtmlAudio.play().catch(() => playSynthIgnite(saber));
        return;
      } catch {
        // Fallback to synth
      }
    }
    playSynthIgnite(saber);
  };

  const startHum = (saber: SaberColor) => {
    stopHum();
    const audioCtx = ensureContext();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      const baseFreq = saber === "jedi" ? 104 : 88;

      const oscA = audioCtx.createOscillator();
      const oscB = audioCtx.createOscillator();
      oscA.type = "sawtooth";
      oscB.type = "triangle";

      // Slight detune (~3.2Hz) creates the iconic throbbing lightsaber interference hum
      oscA.frequency.setValueAtTime(baseFreq, now);
      oscB.frequency.setValueAtTime(baseFreq + 3.2, now);

      const filter = audioCtx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(230, now);
      filter.Q.setValueAtTime(2.1, now);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.015, now + 0.22);

      oscA.connect(filter);
      oscB.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      oscA.start(now);
      oscB.start(now);

      humOscA = oscA;
      humOscB = oscB;
      humGain = gain;
    } catch {
      // Fail silently
    }
  };

  const playSynthRetract = (saber: SaberColor) => {
    const audioCtx = ensureContext();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      const buffer = ensureNoiseBuffer(audioCtx);
      const baseFreq = saber === "jedi" ? 104 : 88;

      // Pitch-dropping power-down sweep
      const oscA = audioCtx.createOscillator();
      const oscB = audioCtx.createOscillator();
      oscA.type = "sawtooth";
      oscB.type = "triangle";

      oscA.frequency.setValueAtTime(baseFreq * 1.12, now);
      oscA.frequency.exponentialRampToValueAtTime(38, now + 0.28);

      oscB.frequency.setValueAtTime(baseFreq * 1.16, now);
      oscB.frequency.exponentialRampToValueAtTime(41, now + 0.28);

      const filter = audioCtx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(760, now);
      filter.frequency.exponentialRampToValueAtTime(120, now + 0.28);
      filter.Q.setValueAtTime(2.2, now);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.042, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

      oscA.connect(filter);
      oscB.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      oscA.start(now);
      oscB.start(now);
      oscA.stop(now + 0.32);
      oscB.stop(now + 0.32);

      // Soft trailing plasma hiss
      const hissSrc = audioCtx.createBufferSource();
      hissSrc.buffer = buffer;

      const hissFilter = audioCtx.createBiquadFilter();
      hissFilter.type = "bandpass";
      hissFilter.frequency.setValueAtTime(1500, now);
      hissFilter.frequency.exponentialRampToValueAtTime(420, now + 0.22);

      const hissGain = audioCtx.createGain();
      hissGain.gain.setValueAtTime(0.03, now);
      hissGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);

      hissSrc.connect(hissFilter);
      hissFilter.connect(hissGain);
      hissGain.connect(audioCtx.destination);
      hissSrc.start(now, 0.2, 0.26);
    } catch {
      // Fail silently
    }
  };

  const playRetract = (saber: SaberColor) => {
    stopHum();
    const customUrl = options.audioUrls?.retract;
    if (customUrl && typeof window !== "undefined") {
      try {
        if (!retractHtmlAudio) {
          retractHtmlAudio = new Audio(customUrl);
          retractHtmlAudio.volume = 0.45;
        }
        retractHtmlAudio.currentTime = 0;
        retractHtmlAudio.play().catch(() => playSynthRetract(saber));
        return;
      } catch {
        // Fallback to synth
      }
    }
    playSynthRetract(saber);
  };

  const dispose = () => {
    stopHum();
    if (ctx) {
      const closing = ctx;
      ctx = null;
      noiseBuffer = null;
      closing.close().catch(() => {});
    }
  };

  return {
    playIgnite,
    startHum,
    stopHum,
    playRetract,
    dispose,
  };
}
