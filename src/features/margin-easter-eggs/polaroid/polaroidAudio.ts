"use client";

export interface PolaroidAudioAdapter {
  playShutterAndEject: () => void;
  dispose: () => void;
}

/**
 * Procedural Web Audio synthesizer for a classic instant camera:
 * 1. Crisp mechanical dual-curtain shutter click ("ka-chk!")
 * 2. Authentic Polaroid motorized photo ejection whir (~560ms)
 */
export function createPolaroidAudio(): PolaroidAudioAdapter {
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

    const length = audioCtx.sampleRate;
    const buffer = audioCtx.createBuffer(1, length, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    noiseBuffer = buffer;
    return buffer;
  };

  const playShutterAndEject = () => {
    const audioCtx = ensureContext();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      const buffer = ensureNoiseBuffer(audioCtx);

      // 1. Shutter curtain open click
      const click1 = audioCtx.createBufferSource();
      click1.buffer = buffer;
      const filter1 = audioCtx.createBiquadFilter();
      filter1.type = "bandpass";
      filter1.frequency.setValueAtTime(2900, now);
      filter1.Q.setValueAtTime(1.9, now);

      const gain1 = audioCtx.createGain();
      gain1.gain.setValueAtTime(0.001, now);
      gain1.gain.exponentialRampToValueAtTime(0.09, now + 0.003);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.028);

      click1.connect(filter1);
      filter1.connect(gain1);
      gain1.connect(audioCtx.destination);
      click1.start(now, 0, 0.032);

      // 2. Shutter mirror return clack (+36ms)
      const click2 = audioCtx.createBufferSource();
      click2.buffer = buffer;
      const filter2 = audioCtx.createBiquadFilter();
      filter2.type = "bandpass";
      filter2.frequency.setValueAtTime(1750, now + 0.036);
      filter2.Q.setValueAtTime(2.4, now + 0.036);

      const gain2 = audioCtx.createGain();
      gain2.gain.setValueAtTime(0.001, now + 0.036);
      gain2.gain.exponentialRampToValueAtTime(0.065, now + 0.04);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.075);

      click2.connect(filter2);
      filter2.connect(gain2);
      gain2.connect(audioCtx.destination);
      click2.start(now + 0.036, 0.1, 0.045);

      // 3. Polaroid motor roller ejection whir (+130ms..680ms)
      const motorStart = now + 0.13;
      const motorEnd = now + 0.68;

      const motorOsc = audioCtx.createOscillator();
      motorOsc.type = "sawtooth";
      motorOsc.frequency.setValueAtTime(148, motorStart);
      motorOsc.frequency.linearRampToValueAtTime(192, motorStart + 0.12);
      motorOsc.frequency.setValueAtTime(188, motorEnd - 0.1);
      motorOsc.frequency.exponentialRampToValueAtTime(118, motorEnd);

      const motorSub = audioCtx.createOscillator();
      motorSub.type = "triangle";
      motorSub.frequency.setValueAtTime(310, motorStart);
      motorSub.frequency.linearRampToValueAtTime(385, motorStart + 0.12);
      motorSub.frequency.exponentialRampToValueAtTime(220, motorEnd);

      const motorFilter = audioCtx.createBiquadFilter();
      motorFilter.type = "bandpass";
      motorFilter.frequency.setValueAtTime(620, motorStart);
      motorFilter.Q.setValueAtTime(1.5, motorStart);

      const motorGain = audioCtx.createGain();
      motorGain.gain.setValueAtTime(0.0001, motorStart);
      motorGain.gain.exponentialRampToValueAtTime(0.022, motorStart + 0.05);
      motorGain.gain.setValueAtTime(0.02, motorEnd - 0.09);
      motorGain.gain.exponentialRampToValueAtTime(0.0001, motorEnd);

      motorOsc.connect(motorFilter);
      motorSub.connect(motorFilter);
      motorFilter.connect(motorGain);
      motorGain.connect(audioCtx.destination);

      motorOsc.start(motorStart);
      motorSub.start(motorStart);
      motorOsc.stop(motorEnd + 0.02);
      motorSub.stop(motorEnd + 0.02);
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
    playShutterAndEject,
    dispose,
  };
}
