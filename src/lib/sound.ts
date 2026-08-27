"use client";

/**
 * Web Audio API Sound Engine for Naphier Portfolio.
 * Produces restrained, aesthetic micro-sounds with zero external dependencies or latency.
 */
class WebAudioSoundEngine {
  private ctx: AudioContext | null = null;
  private isUnlocked = false;
  private lastHoverTime = 0;
  private readonly hoverCooldownMs = 45;

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
   * Hover: Ultra-soft, high tick for prominent interactive targets.
   */
  public playHover() {
    const now = Date.now();
    if (now - this.lastHoverTime < this.hoverCooldownMs) return;
    this.lastHoverTime = now;

    try {
      const ctx = this.getContext();
      if (!ctx || ctx.state !== "running") return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(2200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.025);

      gain.gain.setValueAtTime(0.025, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.025);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.025);
    } catch {
      // Fail silently without console warnings
    }
  }

  /**
   * Click / Press: Tactile, deep acoustic micro-click.
   */
  public playClick() {
    try {
      const ctx = this.getContext();
      if (!ctx || ctx.state !== "running") return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1600, ctx.currentTime);

      osc.type = "triangle";
      osc.frequency.setValueAtTime(580, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(240, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // Fail silently
    }
  }

  /**
   * Navigation: Harmonious ascending transition cue.
   */
  public playNavigate() {
    try {
      const ctx = this.getContext();
      if (!ctx || ctx.state !== "running") return;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc2.type = "sine";

      osc1.frequency.setValueAtTime(520, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(650, ctx.currentTime + 0.07);

      osc2.frequency.setValueAtTime(780, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(975, ctx.currentTime + 0.07);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.07);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(ctx.currentTime);
      osc2.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.07);
      osc2.stop(ctx.currentTime + 0.07);
    } catch {
      // Fail silently
    }
  }

  /**
   * Theme Switch: Dual ethereal harmonic shimmer.
   */
  public playTheme() {
    try {
      const ctx = this.getContext();
      if (!ctx || ctx.state !== "running") return;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc2.type = "sine";

      osc1.frequency.setValueAtTime(440, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);

      osc2.frequency.setValueAtTime(660, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.045, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(ctx.currentTime);
      osc2.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.1);
      osc2.stop(ctx.currentTime + 0.1);
    } catch {
      // Fail silently
    }
  }

  /**
   * Modal Open: Crisp upward chime.
   */
  public playOpen() {
    try {
      const ctx = this.getContext();
      if (!ctx || ctx.state !== "running") return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(480, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.06);
    } catch {
      // Fail silently
    }
  }

  /**
   * Modal Close: Gentle descending settling cue.
   */
  public playClose() {
    try {
      const ctx = this.getContext();
      if (!ctx || ctx.state !== "running") return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(780, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(420, ctx.currentTime + 0.055);

      gain.gain.setValueAtTime(0.045, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.055);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.055);
    } catch {
      // Fail silently
    }
  }

  /**
   * Snap: Original physical tactile snap burst with sharp high transient,
   * fast body drop, and cinematic sub-bass resonance. 100% synthetic.
   */
  public playSnap() {
    try {
      const ctx = this.getContext();
      if (!ctx || ctx.state !== "running") return;

      const t = ctx.currentTime;

      // 1. High transient noise burst (friction / click)
      const bufferSize = Math.floor(ctx.sampleRate * 0.04);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = "bandpass";
      noiseFilter.frequency.setValueAtTime(3400, t);
      noiseFilter.Q.setValueAtTime(2.5, t);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.09, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.035);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      noise.start(t);
      noise.stop(t + 0.035);

      // 2. Tactile body "thump" (rapid pitch drop)
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      const oscFilter = ctx.createBiquadFilter();

      oscFilter.type = "lowpass";
      oscFilter.frequency.setValueAtTime(2000, t);

      osc.type = "triangle";
      osc.frequency.setValueAtTime(950, t);
      osc.frequency.exponentialRampToValueAtTime(80, t + 0.06);

      oscGain.gain.setValueAtTime(0.12, t);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);

      osc.connect(oscFilter);
      oscFilter.connect(oscGain);
      oscGain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.06);

      // 3. Resonant sub-tail
      const sub = ctx.createOscillator();
      const subGain = ctx.createGain();
      sub.type = "sine";
      sub.frequency.setValueAtTime(65, t);
      sub.frequency.exponentialRampToValueAtTime(25, t + 0.25);

      subGain.gain.setValueAtTime(0.08, t);
      subGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);

      sub.connect(subGain);
      subGain.connect(ctx.destination);

      sub.start(t);
      sub.stop(t + 0.25);
    } catch {
      // Fail silently
    }
  }

  /**
   * Restore / Rematerialize: Ascending crystal harmonic arpeggio & shimmer.
   * 100% original synthetic sound.
   */
  public playRestore() {
    try {
      const ctx = this.getContext();
      if (!ctx || ctx.state !== "running") return;

      const t = ctx.currentTime;
      // Musical pentatonic crystal frequencies
      const freqs = [523.25, 659.25, 783.99, 987.77, 1174.66, 1318.51];

      freqs.forEach((freq, idx) => {
        const noteTime = t + idx * 0.05;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq * 0.95, noteTime);
        osc.frequency.exponentialRampToValueAtTime(freq, noteTime + 0.08);

        gain.gain.setValueAtTime(0.035, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.25);
      });

      // Shimmer background swell
      const swell = ctx.createOscillator();
      const swellGain = ctx.createGain();
      swell.type = "triangle";
      swell.frequency.setValueAtTime(220, t);
      swell.frequency.exponentialRampToValueAtTime(880, t + 0.35);

      swellGain.gain.setValueAtTime(0.001, t);
      swellGain.gain.linearRampToValueAtTime(0.025, t + 0.18);
      swellGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.38);

      swell.connect(swellGain);
      swellGain.connect(ctx.destination);

      swell.start(t);
      swell.stop(t + 0.38);
    } catch {
      // Fail silently
    }
  }
}

export const soundEngine = new WebAudioSoundEngine();
