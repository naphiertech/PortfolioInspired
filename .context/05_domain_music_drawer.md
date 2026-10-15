# 05 Domain: Music Drawer Feature

## 1. Scope & Subsystem Architecture
* **Location**: [`src/features/music-drawer/`](../src/features/music-drawer/)
* **Sound Engine**: Web Audio API via [`src/context/SoundContext.tsx`](../src/context/SoundContext.tsx).
* **Components**: Audio drawer controller, lo-fi synthesizer, waveform frequency visualizer, track playlist.

---

## 2. Invariants & Rules
1. **Zero Autoplay Violation**:
   * Audio NEVER autoplays on initial page visit. Playback requires an explicit user gesture (click/tap) adhering to browser Autoplay Policies.
2. **Web Audio Context Lifecycle**:
   * Global `AudioContext` is suspended until first user interaction, then resumed on demand.
   * Proper teardown of oscillators and gain nodes on track change to prevent memory leaks and audio clipping.
3. **Mute State Persistence**:
   * User volume preferences and mute state are stored in `localStorage` (`portfolio_audio_muted`, `portfolio_audio_volume`).
