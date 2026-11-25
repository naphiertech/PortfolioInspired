"use client";

export interface DuckAudioAdapter {
  playSqueak: () => void;
  playCoolToggle: () => void;
  dispose: () => void;
}

/**
 * Procedural Web Audio rubber-duck squeaker!
 * Synthesizes a cheerful nasal upward-downward reed-squeak pitch sweep
 * (720 Hz -> 1620 Hz -> 1140 Hz) through a resonant bandpass filter.
 */
export function createDuckAudio(): DuckAudioAdapter {
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

  const playSqueak = () => {
    const audioCtx = ensureContext();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(720, now);
      osc.frequency.exponentialRampToValueAtTime(1640, now + 0.065);
      osc.frequency.exponentialRampToValueAtTime(1120, now + 0.145);

      const overtone = audioCtx.createOscillator();
      overtone.type = "sine";
      overtone.frequency.setValueAtTime(1440, now);
      overtone.frequency.exponentialRampToValueAtTime(3280, now + 0.065);
      overtone.frequency.exponentialRampToValueAtTime(2240, now + 0.145);

      const filter = audioCtx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1650, now);
      filter.Q.setValueAtTime(2.6, now);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.068, now + 0.016);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.155);

      const overGain = audioCtx.createGain();
      overGain.gain.setValueAtTime(0.35, now);

      osc.connect(filter);
      overtone.connect(overGain);
      overGain.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      overtone.start(now);
      osc.stop(now + 0.17);
      overtone.stop(now + 0.17);
    } catch {
      // Fail silently
    }
  };

  const playCoolToggle = () => {
    const audioCtx = ensureContext();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      const notes = [659.25, 987.77];
      notes.forEach((freq, idx) => {
        const start = now + idx * 0.065;
        const osc = audioCtx.createOscillator();
        osc.type = "square";
        osc.frequency.setValueAtTime(freq, start);

        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.linearRampToValueAtTime(0.028, start + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.16);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(start);
        osc.stop(start + 0.18);
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

  return { playSqueak, playCoolToggle, dispose };
}
