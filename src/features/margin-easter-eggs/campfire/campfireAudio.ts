"use client";

import type { CampfireVariant } from "./campfireState";

export interface CampfireAudioAdapter {
  playIgnite: (variant: CampfireVariant) => void;
  startCrackle: (variant: CampfireVariant) => void;
  stopCrackle: () => void;
  playDouse: () => void;
  dispose: () => void;
}

/**
 * Self-contained procedural Web Audio synthesizer for the campfire easter egg.
 * Instantiates an AudioContext lazily on first user interaction and cleans up
 * all oscillators, buffers, and timers when muted, doused, hidden, or unmounted.
 */
export function createCampfireAudio(): CampfireAudioAdapter {
  let ctx: AudioContext | null = null;
  let noiseBuffer: AudioBuffer | null = null;
  let bedSource: AudioBufferSourceNode | null = null;
  let bedGain: GainNode | null = null;
  let crackleTimer: ReturnType<typeof setTimeout> | null = null;
  let isCrackling = false;

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

    const durationSec = 2;
    const length = audioCtx.sampleRate * durationSec;
    const buffer = audioCtx.createBuffer(1, length, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    noiseBuffer = buffer;
    return buffer;
  };

  const stopCrackle = () => {
    isCrackling = false;

    if (crackleTimer !== null) {
      clearTimeout(crackleTimer);
      crackleTimer = null;
    }

    if (bedGain && ctx) {
      try {
        const now = ctx.currentTime;
        bedGain.gain.cancelScheduledValues(now);
        bedGain.gain.setValueAtTime(Math.max(bedGain.gain.value, 0.0001), now);
        bedGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
      } catch {
        // Ignore teardown audio errors
      }
    }

    if (bedSource) {
      const sourceToStop = bedSource;
      bedSource = null;
      bedGain = null;
      setTimeout(() => {
        try {
          sourceToStop.stop();
          sourceToStop.disconnect();
        } catch {
          // Already stopped
        }
      }, 170);
    }
  };

  const triggerWoodPop = (audioCtx: AudioContext, variant: CampfireVariant) => {
    const now = audioCtx.currentTime;
    const buffer = ensureNoiseBuffer(audioCtx);

    const src = audioCtx.createBufferSource();
    src.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(
      variant === "soul"
        ? 1900 + Math.random() * 1800
        : 1350 + Math.random() * 2200,
      now
    );
    filter.Q.setValueAtTime(3.2 + Math.random() * 2.5, now);

    const gain = audioCtx.createGain();
    const peak = 0.011 + Math.random() * 0.018;
    const popLength = 0.014 + Math.random() * 0.022;

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(peak, now + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + popLength);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    const offset = Math.random() * 1.5;
    src.start(now, offset, popLength + 0.02);
  };

  const scheduleNextPop = (variant: CampfireVariant) => {
    if (!isCrackling) return;
    const delayMs = 240 + Math.random() * 780;
    crackleTimer = setTimeout(() => {
      if (!isCrackling || !ctx || ctx.state !== "running") return;
      try {
        triggerWoodPop(ctx, variant);
        if (Math.random() < 0.28) {
          setTimeout(() => {
            if (isCrackling && ctx && ctx.state === "running") {
              triggerWoodPop(ctx, variant);
            }
          }, 55 + Math.random() * 70);
        }
      } catch {
        // Ignore transient synthesis error
      }
      scheduleNextPop(variant);
    }, delayMs);
  };

  const playIgnite = (variant: CampfireVariant) => {
    const audioCtx = ensureContext();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      const buffer = ensureNoiseBuffer(audioCtx);

      // 1. Metallic flint-and-steel strike
      const strikeSrc = audioCtx.createBufferSource();
      strikeSrc.buffer = buffer;

      const strikeFilter = audioCtx.createBiquadFilter();
      strikeFilter.type = "highpass";
      strikeFilter.frequency.setValueAtTime(3200, now);
      strikeFilter.frequency.exponentialRampToValueAtTime(1700, now + 0.045);

      const strikeGain = audioCtx.createGain();
      strikeGain.gain.setValueAtTime(0.001, now);
      strikeGain.gain.exponentialRampToValueAtTime(0.06, now + 0.004);
      strikeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.055);

      strikeSrc.connect(strikeFilter);
      strikeFilter.connect(strikeGain);
      strikeGain.connect(audioCtx.destination);
      strikeSrc.start(now, 0, 0.065);

      const ping = audioCtx.createOscillator();
      ping.type = "triangle";
      ping.frequency.setValueAtTime(2840, now);
      ping.frequency.exponentialRampToValueAtTime(1920, now + 0.032);

      const pingGain = audioCtx.createGain();
      pingGain.gain.setValueAtTime(0.025, now);
      pingGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.036);

      ping.connect(pingGain);
      pingGain.connect(audioCtx.destination);
      ping.start(now);
      ping.stop(now + 0.04);

      // 2. Soft flame whoosh catching the logs
      const whooshSrc = audioCtx.createBufferSource();
      whooshSrc.buffer = buffer;

      const whooshFilter = audioCtx.createBiquadFilter();
      whooshFilter.type = "bandpass";
      whooshFilter.frequency.setValueAtTime(260, now + 0.025);
      whooshFilter.frequency.exponentialRampToValueAtTime(
        variant === "soul" ? 880 : 620,
        now + 0.12
      );
      whooshFilter.frequency.exponentialRampToValueAtTime(300, now + 0.3);
      whooshFilter.Q.setValueAtTime(1.4, now + 0.025);

      const whooshGain = audioCtx.createGain();
      whooshGain.gain.setValueAtTime(0.0001, now + 0.025);
      whooshGain.gain.exponentialRampToValueAtTime(0.045, now + 0.09);
      whooshGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

      whooshSrc.connect(whooshFilter);
      whooshFilter.connect(whooshGain);
      whooshGain.connect(audioCtx.destination);
      whooshSrc.start(now + 0.025, 0.2, 0.34);

      // 3. Subtle airy chime for Minecraft Soul Fire
      if (variant === "soul") {
        const chime = audioCtx.createOscillator();
        chime.type = "sine";
        chime.frequency.setValueAtTime(587.33, now + 0.04);
        chime.frequency.exponentialRampToValueAtTime(783.99, now + 0.28);

        const chimeGain = audioCtx.createGain();
        chimeGain.gain.setValueAtTime(0.0001, now + 0.04);
        chimeGain.gain.exponentialRampToValueAtTime(0.018, now + 0.09);
        chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.36);

        chime.connect(chimeGain);
        chimeGain.connect(audioCtx.destination);
        chime.start(now + 0.04);
        chime.stop(now + 0.38);
      }
    } catch {
      // Fail silently if browser blocks audio
    }
  };

  const startCrackle = (variant: CampfireVariant) => {
    stopCrackle();
    const audioCtx = ensureContext();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      const buffer = ensureNoiseBuffer(audioCtx);

      const src = audioCtx.createBufferSource();
      src.buffer = buffer;
      src.loop = true;

      const filter = audioCtx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(variant === "soul" ? 340 : 250, now);
      filter.Q.setValueAtTime(0.7, now);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.015, now + 0.26);

      src.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      src.start(now);

      bedSource = src;
      bedGain = gain;
      isCrackling = true;
      scheduleNextPop(variant);
    } catch {
      // Ignore synthesis errors
    }
  };

  const playDouse = () => {
    stopCrackle();
    const audioCtx = ensureContext();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      const buffer = ensureNoiseBuffer(audioCtx);

      const hissSrc = audioCtx.createBufferSource();
      hissSrc.buffer = buffer;

      const hissFilter = audioCtx.createBiquadFilter();
      hissFilter.type = "bandpass";
      hissFilter.frequency.setValueAtTime(2600, now);
      hissFilter.frequency.exponentialRampToValueAtTime(850, now + 0.36);
      hissFilter.Q.setValueAtTime(1.1, now);

      const hissGain = audioCtx.createGain();
      hissGain.gain.setValueAtTime(0.0001, now);
      hissGain.gain.exponentialRampToValueAtTime(0.048, now + 0.025);
      hissGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

      hissSrc.connect(hissFilter);
      hissFilter.connect(hissGain);
      hissGain.connect(audioCtx.destination);
      hissSrc.start(now, 0.4, 0.44);
    } catch {
      // Ignore synthesis errors
    }
  };

  const dispose = () => {
    stopCrackle();
    if (ctx) {
      const closing = ctx;
      ctx = null;
      noiseBuffer = null;
      closing.close().catch(() => {});
    }
  };

  return {
    playIgnite,
    startCrackle,
    stopCrackle,
    playDouse,
    dispose,
  };
}
