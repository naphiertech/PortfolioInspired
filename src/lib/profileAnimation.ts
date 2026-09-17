/**
 * Utility for deferred caching of avatar sunglasses transition frames.
 *
 * Prevents network congestion on initial page load by:
 * 1. Never blocking initial render or LCP with hundreds of simultaneous image requests.
 * 2. Only loading even frames (2, 4, 6, ..., 240) since the 60fps loop advances by 2 frames per tick.
 * 3. Batching requests during browser idle time (requestIdleCallback) or upon ThemeToggle hover intent.
 * 4. Skipping preloading completely when prefers-reduced-motion is active.
 */

let hasPreloaded = false;

export function preloadProfileFrames() {
  if (hasPreloaded || typeof window === "undefined") return;

  // Skip if user prefers reduced motion
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) {
    return;
  }

  hasPreloaded = true;

  // Preload only the even frames actually rendered by the animation loop
  const frames: number[] = [];
  for (let i = 2; i <= 240; i += 2) {
    frames.push(i);
  }

  let index = 0;
  const BATCH_SIZE = 6;

  function loadNextBatch() {
    const limit = Math.min(index + BATCH_SIZE, frames.length);
    for (; index < limit; index++) {
      const frameNum = frames[index];
      const img = new Image();
      img.src = `/profile/ezgif-frame-${String(frameNum).padStart(3, "0")}.png`;
    }

    if (index < frames.length) {
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(loadNextBatch, { timeout: 1000 });
      } else {
        setTimeout(loadNextBatch, 80);
      }
    }
  }

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(loadNextBatch, { timeout: 1000 });
  } else {
    setTimeout(loadNextBatch, 80);
  }
}

/**
 * Schedule deferred frame preloading after page is fully idle and LCP has settled.
 */
export function scheduleIdleProfilePreload(delayMs = 3500): () => void {
  if (typeof window === "undefined" || hasPreloaded) return () => {};

  const timer = setTimeout(() => {
    preloadProfileFrames();
  }, delayMs);

  return () => clearTimeout(timer);
}
