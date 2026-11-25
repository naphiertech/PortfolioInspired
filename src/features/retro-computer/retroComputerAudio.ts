"use client";

export interface RetroComputerAudioAdapter {
  playBoot: () => void;
  playTerminal: () => void;
  playScreensaver: () => void;
  playPowerOff: () => void;
  playFloppy: (ejecting: boolean) => void;
  dispose: () => void;
}

/**
 * Procedural 1990s desktop computer Web Audio synthesizer:
 * - Boot: warm retro Fmaj7 startup chime + subtle CRT static crackle
 * - Terminal: crisp PC-speaker bip + soft mechanical key ticks
 * - Screensaver: playful retro two-note synth chime
 * - Power off: authentic CRT flyback collapse whine + power-switch clunk
 * - Floppy (Shift+Click): mechanical 3.5" drive latch clunk & stepper whir
 */
export function createRetroComputerAudio(): RetroComputerAudioAdapter {
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

    const length = Math.floor(audioCtx.sampleRate * 0.4);
    const buffer = audioCtx.createBuffer(1, length, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    noiseBuffer = buffer;
    return buffer;
  };

  const playBoot = () => {
    const audioCtx = ensureContext();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;

      // 1. Subtle CRT degauss/static onset
      const staticSrc = audioCtx.createBufferSource();
      staticSrc.buffer = ensureNoiseBuffer(audioCtx);
      const staticFilter = audioCtx.createBiquadFilter();
      staticFilter.type = "highpass";
      staticFilter.frequency.setValueAtTime(3400, now);

      const staticGain = audioCtx.createGain();
      staticGain.gain.setValueAtTime(0.001, now);
      staticGain.gain.exponentialRampToValueAtTime(0.025, now + 0.012);
      staticGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      staticSrc.connect(staticFilter);
      staticFilter.connect(staticGain);
      staticGain.connect(audioCtx.destination);
      staticSrc.start(now, 0, 0.09);

      // 2. Warm retro Mac-inspired Fmaj7 startup chord
      const filter = audioCtx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(420, now + 0.04);
      filter.frequency.exponentialRampToValueAtTime(1950, now + 0.16);
      filter.frequency.exponentialRampToValueAtTime(720, now + 0.62);

      const master = audioCtx.createGain();
      master.gain.setValueAtTime(0.0001, now + 0.04);
      master.gain.linearRampToValueAtTime(0.045, now + 0.09);
      master.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);

      filter.connect(master);
      master.connect(audioCtx.destination);

      const chord = [174.61, 220, 261.63, 329.63, 349.23];
      for (const freq of chord) {
        const osc = audioCtx.createOscillator();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + 0.04);
        osc.connect(filter);
        osc.start(now + 0.04);
        osc.stop(now + 0.68);
      }
    } catch {
      // Fail silently
    }
  };

  const playTerminal = () => {
    const audioCtx = ensureContext();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      // Crisp 80s PC-speaker bip
      const osc = audioCtx.createOscillator();
      osc.type = "square";
      osc.frequency.setValueAtTime(980, now);

      const filter = audioCtx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(2800, now);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.024, now + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.065);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.075);
    } catch {
      // Fail silently
    }
  };

  const playScreensaver = () => {
    const audioCtx = ensureContext();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      const notes = [587.33, 880];
      notes.forEach((freq, idx) => {
        const t = now + idx * 0.065;
        const osc = audioCtx.createOscillator();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, t);

        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(0.028, t + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(t);
        osc.stop(t + 0.16);
      });
    } catch {
      // Fail silently
    }
  };

  const playPowerOff = () => {
    const audioCtx = ensureContext();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      // CRT flyback collapse sweep
      const osc = audioCtx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(2150, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.21);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.032, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.23);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.25);

      // Soft physical rocker-switch clunk
      const thud = audioCtx.createOscillator();
      thud.type = "triangle";
      thud.frequency.setValueAtTime(140, now + 0.01);
      thud.frequency.exponentialRampToValueAtTime(55, now + 0.065);

      const thudGain = audioCtx.createGain();
      thudGain.gain.setValueAtTime(0.045, now + 0.01);
      thudGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.075);

      thud.connect(thudGain);
      thudGain.connect(audioCtx.destination);
      thud.start(now + 0.01);
      thud.stop(now + 0.085);
    } catch {
      // Fail silently
    }
  };

  const playFloppy = (ejecting: boolean) => {
    const audioCtx = ensureContext();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      const buffer = ensureNoiseBuffer(audioCtx);

      // Mechanical latch clunk
      const clunk = audioCtx.createBufferSource();
      clunk.buffer = buffer;
      const clunkFilter = audioCtx.createBiquadFilter();
      clunkFilter.type = "bandpass";
      clunkFilter.frequency.setValueAtTime(ejecting ? 1150 : 880, now);
      clunkFilter.Q.setValueAtTime(2.6, now);

      const clunkGain = audioCtx.createGain();
      clunkGain.gain.setValueAtTime(0.001, now);
      clunkGain.gain.exponentialRampToValueAtTime(0.065, now + 0.005);
      clunkGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

      clunk.connect(clunkFilter);
      clunkFilter.connect(clunkGain);
      clunkGain.connect(audioCtx.destination);
      clunk.start(now, 0, 0.05);

      // Stepper motor whir
      const motor = audioCtx.createOscillator();
      motor.type = "sawtooth";
      motor.frequency.setValueAtTime(ejecting ? 125 : 95, now + 0.04);
      motor.frequency.linearRampToValueAtTime(ejecting ? 165 : 130, now + 0.16);

      const motorFilter = audioCtx.createBiquadFilter();
      motorFilter.type = "bandpass";
      motorFilter.frequency.setValueAtTime(480, now + 0.04);

      const motorGain = audioCtx.createGain();
      motorGain.gain.setValueAtTime(0.0001, now + 0.04);
      motorGain.gain.exponentialRampToValueAtTime(0.02, now + 0.06);
      motorGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.19);

      motor.connect(motorFilter);
      motorFilter.connect(motorGain);
      motorGain.connect(audioCtx.destination);
      motor.start(now + 0.04);
      motor.stop(now + 0.21);
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
    playBoot,
    playTerminal,
    playScreensaver,
    playPowerOff,
    playFloppy,
    dispose,
  };
}
