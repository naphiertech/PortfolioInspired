"use client";

export interface TruckHornAudioAdapter {
  playHonk: (isRapidDoubleTap?: boolean) => void;
  dispose: () => void;
}

/**
 * Procedural Web Audio synthesizer for a dual-tone semi-truck air horn.
 * Uses brassy sawtooth voices tuned to a classic F#3 / A#3 interval (185 Hz &
 * 233 Hz) shaped through a resonant horn formant filter with pneumatic pitch
 * attack and clean release.
 */
export function createTruckHornAudio(): TruckHornAudioAdapter {
  let ctx: AudioContext | null = null;
  let noiseBuffer: AudioBuffer | null = null;

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

    const length = Math.floor(audioCtx.sampleRate * 0.5);
    const buffer = audioCtx.createBuffer(1, length, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    noiseBuffer = buffer;
    return buffer;
  };

  const playHonk = (isRapidDoubleTap = false) => {
    const audioCtx = ensureContext();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      const holdSec = isRapidDoubleTap ? 0.22 : 0.36;
      const releaseSec = 0.13;
      const end = now + holdSec + releaseSec;

      // Brass horn formant filter chain
      const lowpass = audioCtx.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.setValueAtTime(920, now);
      lowpass.frequency.linearRampToValueAtTime(1180, now + 0.045);
      lowpass.frequency.setValueAtTime(1060, now + holdSec);
      lowpass.frequency.exponentialRampToValueAtTime(420, end);
      lowpass.Q.setValueAtTime(2.3, now);

      const masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.0001, now);
      masterGain.gain.linearRampToValueAtTime(0.055, now + 0.024);
      masterGain.gain.setValueAtTime(0.052, now + holdSec);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, end);

      lowpass.connect(masterGain);
      masterGain.connect(audioCtx.destination);

      // Dual-tone air horn voices (F#3 185Hz + A#3 233Hz + subtle harmonic grit)
      const voices = [
        { freq: 185, type: "sawtooth" as OscillatorType, gain: 0.45 },
        { freq: 233.08, type: "sawtooth" as OscillatorType, gain: 0.42 },
        { freq: 186.4, type: "triangle" as OscillatorType, gain: 0.22 },
      ];

      for (const v of voices) {
        const osc = audioCtx.createOscillator();
        osc.type = v.type;
        // Pneumatic air-valve pitch scoop on attack
        osc.frequency.setValueAtTime(v.freq * 0.955, now);
        osc.frequency.exponentialRampToValueAtTime(v.freq, now + 0.032);
        osc.frequency.setValueAtTime(v.freq, now + holdSec);
        osc.frequency.exponentialRampToValueAtTime(v.freq * 0.975, end);

        const vGain = audioCtx.createGain();
        vGain.gain.setValueAtTime(v.gain, now);

        osc.connect(vGain);
        vGain.connect(lowpass);

        osc.start(now);
        osc.stop(end + 0.02);
      }

      // Subtle compressed-air hiss on horn blast onset
      const airSrc = audioCtx.createBufferSource();
      airSrc.buffer = ensureNoiseBuffer(audioCtx);

      const airFilter = audioCtx.createBiquadFilter();
      airFilter.type = "bandpass";
      airFilter.frequency.setValueAtTime(1600, now);
      airFilter.Q.setValueAtTime(1.4, now);

      const airGain = audioCtx.createGain();
      airGain.gain.setValueAtTime(0.0001, now);
      airGain.gain.exponentialRampToValueAtTime(0.02, now + 0.018);
      airGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

      airSrc.connect(airFilter);
      airFilter.connect(airGain);
      airGain.connect(audioCtx.destination);
      airSrc.start(now, 0, 0.16);
    } catch {
      // Fail silently if blocked
    }
  };

  const dispose = () => {
    if (ctx) {
      const closing = ctx;
      ctx = null;
      noiseBuffer = null;
      closing.close().catch(() => {});
    }
  };

  return { playHonk, dispose };
}
