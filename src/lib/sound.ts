"use client";

/**
 * Web Audio API Sound Engine for Naphier Portfolio.
 * Produces authentic, creamy mechanical keyboard "thock" interaction sounds.
 * Character: Deep, muted, rounded transients, low-mid resonance, zero arcade beeps.
 */
class WebAudioSoundEngine {
  private ctx: AudioContext | null = null;
  private isUnlocked = false;
  private lastHoverTime = 0;
  private readonly hoverCooldownMs = 40;
  private noiseBuffer: AudioBuffer | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;

    if (!this.ctx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }

    if (this.ctx && this.ctx.state === "suspended" && this.isUnlocked) {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  /**
   * Pre-generates a reusable 100ms white/pink noise buffer for physical switch transients.
   */
  private getNoiseBuffer(ctx: AudioContext): AudioBuffer {
    if (!this.noiseBuffer || this.noiseBuffer.sampleRate !== ctx.sampleRate) {
      const bufferSize = Math.floor(ctx.sampleRate * 0.1);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      let lastOut = 0.0;

      // Generate pink-filtered noise for warmer, less harsh transient impact
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // Gain compensation
      }
      this.noiseBuffer = buffer;
    }
    return this.noiseBuffer;
  }

  /**
   * Generates a slight micro-variation factor (±2% to ±4%) so repeated strikes sound organic.
   */
  private getRandomVariation(variance = 0.035): number {
    return 1 + (Math.random() * 2 - 1) * variance;
  }

  /**
   * Unlocks Web Audio on first valid user interaction.
   */
  public initUnlockListener() {
    if (typeof window === "undefined" || this.isUnlocked) return;

    const unlock = () => {
      this.isUnlocked = true;
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      window.removeEventListener("touchstart", unlock);
    };

    window.addEventListener("pointerdown", unlock, { passive: true });
    window.addEventListener("keydown", unlock, { passive: true });
    window.addEventListener("touchstart", unlock, { passive: true });
  }

  /**
   * Hover: Creamy Keycap Brush / Light Stem Tap (22ms).
   * Whisper-quiet, ultra-soft low-mid brush like touching a keycap.
   */
  public playHover() {
    const now = Date.now();
    if (now - this.lastHoverTime < this.hoverCooldownMs) return;
    this.lastHoverTime = now;

    try {
      const ctx = this.getContext();
      if (!ctx || ctx.state !== "running") return;

      const t = ctx.currentTime;
      const pitchVar = this.getRandomVariation(0.04);
      const gainVar = this.getRandomVariation(0.03);

      // 1. Filtered soft transient noise
      const noise = ctx.createBufferSource();
      noise.buffer = this.getNoiseBuffer(ctx);

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = "lowpass";
      noiseFilter.frequency.setValueAtTime(800 * pitchVar, t);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.016 * gainVar, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.015);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      noise.start(t);
      noise.stop(t + 0.015);

      // 2. Soft bottom-out body resonance
      const osc = ctx.createOscillator();
      const oscFilter = ctx.createBiquadFilter();
      const oscGain = ctx.createGain();

      oscFilter.type = "lowpass";
      oscFilter.frequency.setValueAtTime(650, t);

      osc.type = "sine";
      osc.frequency.setValueAtTime(210 * pitchVar, t);
      osc.frequency.exponentialRampToValueAtTime(130 * pitchVar, t + 0.022);

      oscGain.gain.setValueAtTime(0.022 * gainVar, t);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.022);

      osc.connect(oscFilter);
      oscFilter.connect(oscGain);
      oscGain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.022);
    } catch {
      // Fail silently without console warnings
    }
  }

  /**
   * Click / Press: Main Creamy Mechanical Keyboard "Thock" (50ms).
   * Muted impact, warm low-mid housing resonance, rounded transient.
   */
  public playClick() {
    try {
      const ctx = this.getContext();
      if (!ctx || ctx.state !== "running") return;

      const t = ctx.currentTime;
      const pitchVar = this.getRandomVariation(0.04);
      const gainVar = this.getRandomVariation(0.025);

      // 1. Keycap impact noise transient
      const noise = ctx.createBufferSource();
      noise.buffer = this.getNoiseBuffer(ctx);

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = "bandpass";
      noiseFilter.frequency.setValueAtTime(1050 * pitchVar, t);
      noiseFilter.Q.setValueAtTime(1.8, t);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.038 * gainVar, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.018);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      noise.start(t);
      noise.stop(t + 0.018);

      // 2. Primary Switch Housing "Thock"
      const osc = ctx.createOscillator();
      const oscFilter = ctx.createBiquadFilter();
      const oscGain = ctx.createGain();

      oscFilter.type = "lowpass";
      oscFilter.frequency.setValueAtTime(800, t);
      oscFilter.Q.setValueAtTime(1.2, t);

      osc.type = "triangle";
      osc.frequency.setValueAtTime(185 * pitchVar, t);
      osc.frequency.exponentialRampToValueAtTime(92 * pitchVar, t + 0.048);

      oscGain.gain.setValueAtTime(0.07 * gainVar, t);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.048);

      osc.connect(oscFilter);
      oscFilter.connect(oscGain);
      oscGain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.048);

      // 3. Sub-harmonic body warmth
      const sub = ctx.createOscillator();
      const subGain = ctx.createGain();

      sub.type = "sine";
      sub.frequency.setValueAtTime(95 * pitchVar, t);
      sub.frequency.exponentialRampToValueAtTime(58 * pitchVar, t + 0.038);

      subGain.gain.setValueAtTime(0.03 * gainVar, t);
      subGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.038);

      sub.connect(subGain);
      subGain.connect(ctx.destination);

      sub.start(t);
      sub.stop(t + 0.038);
    } catch {
      // Fail silently
    }
  }

  /**
   * Navigation: Two-Stage Full-Stroke Mechanical Thock (80ms).
   * Primary downstroke thock + secondary muted return settling tap.
   */
  public playNavigate() {
    try {
      const ctx = this.getContext();
      if (!ctx || ctx.state !== "running") return;

      const t = ctx.currentTime;
      const pitchVar = this.getRandomVariation(0.03);

      // Stage 1: Main downstroke thock
      const osc1 = ctx.createOscillator();
      const filter1 = ctx.createBiquadFilter();
      const gain1 = ctx.createGain();

      filter1.type = "lowpass";
      filter1.frequency.setValueAtTime(750, t);

      osc1.type = "triangle";
      osc1.frequency.setValueAtTime(175 * pitchVar, t);
      osc1.frequency.exponentialRampToValueAtTime(88 * pitchVar, t + 0.045);

      gain1.gain.setValueAtTime(0.065, t);
      gain1.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);

      osc1.connect(filter1);
      filter1.connect(gain1);
      gain1.connect(ctx.destination);

      osc1.start(t);
      osc1.stop(t + 0.045);

      // Stage 2: Secondary return tap (28ms delay)
      const t2 = t + 0.028;
      const osc2 = ctx.createOscillator();
      const filter2 = ctx.createBiquadFilter();
      const gain2 = ctx.createGain();

      filter2.type = "lowpass";
      filter2.frequency.setValueAtTime(900, t2);

      osc2.type = "sine";
      osc2.frequency.setValueAtTime(215 * pitchVar, t2);
      osc2.frequency.exponentialRampToValueAtTime(135 * pitchVar, t2 + 0.032);

      gain2.gain.setValueAtTime(0.035, t2);
      gain2.gain.exponentialRampToValueAtTime(0.0001, t2 + 0.032);

      osc2.connect(filter2);
      filter2.connect(gain2);
      gain2.connect(ctx.destination);

      osc2.start(t2);
      osc2.stop(t2 + 0.032);
    } catch {
      // Fail silently
    }
  }

  /**
   * Theme Switch: Mechanical Actuation Toggle (90ms).
   * Two-stage switch bump & housing settling thock.
   */
  public playTheme() {
    try {
      const ctx = this.getContext();
      if (!ctx || ctx.state !== "running") return;

      const t = ctx.currentTime;

      // Stage 1: Switch actuation bump
      const osc1 = ctx.createOscillator();
      const filter1 = ctx.createBiquadFilter();
      const gain1 = ctx.createGain();

      filter1.type = "lowpass";
      filter1.frequency.setValueAtTime(800, t);

      osc1.type = "triangle";
      osc1.frequency.setValueAtTime(165, t);
      osc1.frequency.exponentialRampToValueAtTime(105, t + 0.04);

      gain1.gain.setValueAtTime(0.055, t);
      gain1.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);

      osc1.connect(filter1);
      filter1.connect(gain1);
      gain1.connect(ctx.destination);

      osc1.start(t);
      osc1.stop(t + 0.04);

      // Stage 2: Switch settling thock (35ms delay)
      const t2 = t + 0.035;
      const osc2 = ctx.createOscillator();
      const filter2 = ctx.createBiquadFilter();
      const gain2 = ctx.createGain();

      filter2.type = "lowpass";
      filter2.frequency.setValueAtTime(750, t2);

      osc2.type = "sine";
      osc2.frequency.setValueAtTime(205, t2);
      osc2.frequency.exponentialRampToValueAtTime(125, t2 + 0.045);

      gain2.gain.setValueAtTime(0.045, t2);
      gain2.gain.exponentialRampToValueAtTime(0.0001, t2 + 0.045);

      osc2.connect(filter2);
      filter2.connect(gain2);
      gain2.connect(ctx.destination);

      osc2.start(t2);
      osc2.stop(t2 + 0.045);
    } catch {
      // Fail silently
    }
  }

  /**
   * Modal Open: Deep Spacebar / Stabilized Key Thock (60ms).
   * Warm, deep, rounded bottom-out.
   */
  public playOpen() {
    try {
      const ctx = this.getContext();
      if (!ctx || ctx.state !== "running") return;

      const t = ctx.currentTime;
      const pitchVar = this.getRandomVariation(0.03);

      // Noise impact
      const noise = ctx.createBufferSource();
      noise.buffer = this.getNoiseBuffer(ctx);

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = "lowpass";
      noiseFilter.frequency.setValueAtTime(950 * pitchVar, t);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.032, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.016);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      noise.start(t);
      noise.stop(t + 0.016);

      // Deep spacebar body thock
      const osc = ctx.createOscillator();
      const oscFilter = ctx.createBiquadFilter();
      const oscGain = ctx.createGain();

      oscFilter.type = "lowpass";
      oscFilter.frequency.setValueAtTime(700, t);

      osc.type = "triangle";
      osc.frequency.setValueAtTime(155 * pitchVar, t);
      osc.frequency.exponentialRampToValueAtTime(78 * pitchVar, t + 0.058);

      oscGain.gain.setValueAtTime(0.075, t);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.058);

      osc.connect(oscFilter);
      oscFilter.connect(oscGain);
      oscGain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.058);
    } catch {
      // Fail silently
    }
  }

  /**
   * Modal Close: Short Muted Return Tap (35ms).
   */
  public playClose() {
    try {
      const ctx = this.getContext();
      if (!ctx || ctx.state !== "running") return;

      const t = ctx.currentTime;
      const pitchVar = this.getRandomVariation(0.03);

      const osc = ctx.createOscillator();
      const oscFilter = ctx.createBiquadFilter();
      const oscGain = ctx.createGain();

      oscFilter.type = "lowpass";
      oscFilter.frequency.setValueAtTime(850, t);

      osc.type = "sine";
      osc.frequency.setValueAtTime(205 * pitchVar, t);
      osc.frequency.exponentialRampToValueAtTime(120 * pitchVar, t + 0.035);

      oscGain.gain.setValueAtTime(0.05, t);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.035);

      osc.connect(oscFilter);
      oscFilter.connect(oscGain);
      oscGain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.035);
    } catch {
      // Fail silently
    }
  }
}

export const soundEngine = new WebAudioSoundEngine();
