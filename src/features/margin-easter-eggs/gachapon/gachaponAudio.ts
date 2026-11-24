"use client";

export interface GachaponAudioAdapter {
  playCrankAndDrop: () => void;
  playReveal: (isRare: boolean) => void;
  dispose: () => void;
}

/**
 * Procedural Web Audio synthesizer for the Gachapon Capsule Machine:
 * - Mechanical plastic dial ratchet ("clack-clack-clack") + hollow capsule drop
 * - Cheerful pastel pop-chime on charm reveal (extra sparkle note for rare trophy)
 */
export function createGachaponAudio(): GachaponAudioAdapter {
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

  const playRatchetClick = (
    audioCtx: AudioContext,
    buffer: AudioBuffer,
    when: number,
    pitch: number
  ) => {
    const src = audioCtx.createBufferSource();
    src.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(pitch, when);
    filter.Q.setValueAtTime(3.2, when);

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.001, when);
    gain.gain.exponentialRampToValueAtTime(0.065, when + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.026);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    src.start(when, 0, 0.03);
  };

  const playCrankAndDrop = () => {
    const audioCtx = ensureContext();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      const buffer = ensureNoiseBuffer(audioCtx);

      // 1. 3 mechanical dial ratchet clicks
      playRatchetClick(audioCtx, buffer, now, 1650);
      playRatchetClick(audioCtx, buffer, now + 0.105, 1820);
      playRatchetClick(audioCtx, buffer, now + 0.21, 1980);

      // 2. Hollow plastic capsule tumble thunk (+360ms & +435ms)
      const thunks = [
        { t: now + 0.36, fStart: 420, fEnd: 210, vol: 0.05 },
        { t: now + 0.44, fStart: 510, fEnd: 280, vol: 0.035 },
      ];
      for (const th of thunks) {
        const osc = audioCtx.createOscillator();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(th.fStart, th.t);
        osc.frequency.exponentialRampToValueAtTime(th.fEnd, th.t + 0.055);

        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(th.vol, th.t);
        gain.gain.exponentialRampToValueAtTime(0.0001, th.t + 0.065);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(th.t);
        osc.stop(th.t + 0.07);
      }
    } catch {
      // Fail silently
    }
  };

  const playReveal = (isRare: boolean) => {
    const audioCtx = ensureContext();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      const notes = isRare
        ? [783.99, 987.77, 1174.66, 1567.98]
        : [659.25, 880, 1174.66];

      notes.forEach((freq, idx) => {
        const start = now + idx * 0.062;
        const osc = audioCtx.createOscillator();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, start);

        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.linearRampToValueAtTime(0.036, start + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.22);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(start);
        osc.stop(start + 0.24);
      });
    } catch {
      // Fail silently
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

  return {
    playCrankAndDrop,
    playReveal,
    dispose,
  };
}
