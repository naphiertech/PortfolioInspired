"use client";

export interface MarioAudioAdapter {
  playCoin: () => void;
  playStar: () => void;
  playReset: () => void;
  dispose: () => void;
}

/**
 * Authentic 8-bit NES APU-inspired Web Audio synthesizer for the Mario `?` Block.
 * Uses pure square and triangle waves:
 * - Coin: low bump thud + iconic B5 -> E6 square-wave coin bling
 * - Star (Shift+Click): low bump thud + classic rising 8-bit power-up arpeggio
 * - Reset: subtle 3-note 8-bit re-arm chime
 */
export function createMarioAudio(): MarioAudioAdapter {
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

  const playBlockBump = (audioCtx: AudioContext, now: number) => {
    const osc = audioCtx.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(190, now);
    osc.frequency.exponentialRampToValueAtTime(86, now + 0.06);

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.065, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.075);
  };

  const playCoin = () => {
    const audioCtx = ensureContext();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      playBlockBump(audioCtx, now);

      // Authentic SMB1 Coin: B5 (987.77 Hz) -> E6 (1318.51 Hz) square wave
      const osc = audioCtx.createOscillator();
      osc.type = "square";
      osc.frequency.setValueAtTime(987.77, now + 0.03);
      osc.frequency.setValueAtTime(1318.51, now + 0.105);

      const filter = audioCtx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(4200, now + 0.03);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.0001, now + 0.03);
      gain.gain.linearRampToValueAtTime(0.036, now + 0.036);
      gain.gain.setValueAtTime(0.036, now + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.48);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now + 0.03);
      osc.stop(now + 0.5);
    } catch {
      // Fail silently
    }
  };

  const playStar = () => {
    const audioCtx = ensureContext();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      playBlockBump(audioCtx, now);

      // Rising 8-bit NES power-up arpeggio
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
      const step = 0.052;

      const osc = audioCtx.createOscillator();
      osc.type = "square";

      notes.forEach((freq, idx) => {
        osc.frequency.setValueAtTime(freq, now + 0.03 + idx * step);
      });

      const filter = audioCtx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(4400, now + 0.03);

      const gain = audioCtx.createGain();
      const end = now + 0.03 + notes.length * step + 0.18;
      gain.gain.setValueAtTime(0.0001, now + 0.03);
      gain.gain.linearRampToValueAtTime(0.034, now + 0.04);
      gain.gain.setValueAtTime(0.03, now + 0.03 + (notes.length - 1) * step);
      gain.gain.exponentialRampToValueAtTime(0.0001, end);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now + 0.03);
      osc.stop(end + 0.02);
    } catch {
      // Fail silently
    }
  };

  const playReset = () => {
    const audioCtx = ensureContext();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      const notes = [659.25, 783.99, 1046.5];

      const osc = audioCtx.createOscillator();
      osc.type = "square";
      notes.forEach((freq, idx) => {
        osc.frequency.setValueAtTime(freq, now + idx * 0.045);
      });

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.024, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.24);
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

  return {
    playCoin,
    playStar,
    playReset,
    dispose,
  };
}
