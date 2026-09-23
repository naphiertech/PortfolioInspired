/** Shared, retained decode cache for the 120 frames actually used by both heroes. */
export const PROFILE_FRAMES = Array.from({ length: 120 }, (_, index) => (index + 1) * 2);
export const PROFILE_FRAME_MS = 1000 / 60;
export const PROFILE_BUFFER_SIZE = 20;

type FrameEntry = {
  image: HTMLImageElement | null;
  pending: boolean;
  promise: Promise<HTMLImageElement | null>;
};
type Job = { frame: number; essential: boolean; run: () => Promise<void>; cancel: () => void };
const cache = new Map<number, FrameEntry>();
const queue: Job[] = [];
let running = 0;
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function pump() {
  while (running < 6 && queue.length) {
    const job = queue.shift()!;
    if (!job.essential && reducedMotion()) {
      job.cancel();
      continue;
    }
    running++;
    void job.run().finally(() => { running--; pump(); });
  }
}

function enqueue(frame: number, essential: boolean) {
  const existing = cache.get(frame);
  if (existing) {
    const job = queue.find(item => item.frame === frame);
    if (job && essential) job.essential = true;
    return existing.promise;
  }
  let complete!: (image: HTMLImageElement | null) => void;
  const entry: FrameEntry = {
    image: null, pending: true,
    promise: new Promise(resolve => { complete = resolve; }),
  };
  cache.set(frame, entry);
  queue.push({
    frame, essential,
    cancel: () => { cache.delete(frame); entry.pending = false; complete(null); },
    run: async () => {
      const image = new Image();
      image.decoding = "async";
      try {
        const url = "/profile/ezgif-frame-" + String(frame).padStart(3, "0") + ".png";
        if (typeof image.decode === "function") {
          image.src = url;
          await image.decode();
        } else {
          await new Promise<void>((resolve, reject) => {
            image.onload = () => resolve();
            image.onerror = () => reject(new Error("Profile frame unavailable"));
            image.src = url;
          });
        }
        if (image.naturalWidth > 0) entry.image = image;
      } catch {
        // Failed frames stay unavailable; never replace a good portrait with one.
      } finally {
        image.onload = null;
        image.onerror = null;
        entry.pending = false;
        complete(entry.image);
      }
    },
  });
  return entry.promise;
}

export function prepareProfileFrames(frames: readonly number[], essential = false) {
  if (typeof window === "undefined" || (!essential && reducedMotion())) return Promise.resolve([]);
  const promises = frames.map(frame => enqueue(frame, essential));
  // A direction change promotes its upcoming buffer ahead of old background work.
  const priority = new Map(frames.map((frame, index) => [frame, index]));
  queue.sort((a, b) => (priority.get(a.frame) ?? Infinity) - (priority.get(b.frame) ?? Infinity));
  pump();
  return Promise.all(promises);
}

export function getProfileFrame(frame: number) { return cache.get(frame); }

export function preloadProfileFrames(reverse = false) {
  void prepareProfileFrames(reverse ? [...PROFILE_FRAMES].reverse() : PROFILE_FRAMES);
}

/** After load, idle work prepares only a small buffer, never the full sequence. */
export function scheduleIdleProfilePreload(delayMs = 3500, reverse = false): () => void {
  if (typeof window === "undefined" || reducedMotion()) return () => {};
  let idle: number | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const warm = () => {
    const frames = reverse ? [...PROFILE_FRAMES].reverse() : PROFILE_FRAMES;
    void prepareProfileFrames(frames.slice(0, PROFILE_BUFFER_SIZE));
  };
  const schedule = () => {
    if ("requestIdleCallback" in window) idle = window.requestIdleCallback(warm);
    else timer = setTimeout(warm, delayMs);
  };
  if (document.readyState === "complete") schedule();
  else window.addEventListener("load", schedule, { once: true });
  return () => {
    window.removeEventListener("load", schedule);
    if (idle !== undefined) window.cancelIdleCallback(idle);
    if (timer !== undefined) clearTimeout(timer);
  };
}
