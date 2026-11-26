"use client";

import { useEffect, useState } from "react";

export type PerformanceTier = "high" | "low";

const SESSION_STORAGE_KEY = "naphier_perf_tier_v1";

interface NavigatorWithCapabilities extends Navigator {
  deviceMemory?: number;
  connection?: {
    saveData?: boolean;
    effectiveType?: string;
  };
}

let cachedTier: PerformanceTier | null = null;
const listeners = new Set<(tier: PerformanceTier) => void>();
let monitorStarted = false;

function notifyTier(next: PerformanceTier) {
  if (cachedTier === next) return;
  cachedTier = next;
  if (typeof document !== "undefined") {
    if (next === "low") {
      document.documentElement.dataset.perf = "low";
    } else {
      delete document.documentElement.dataset.perf;
    }
  }
  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, next);
  } catch {
    // Ignore restricted storage contexts
  }
  listeners.forEach((cb) => cb(next));
}

/**
 * Synchronous hardware & preference heuristic.
 * Catches reduced-motion, Save-Data / slow cellular, low RAM (<= 4 GB),
 * and low core count (<= 4 logical CPUs) immediately at 0ms.
 */
export function detectStaticPerformanceTier(): PerformanceTier {
  if (typeof window === "undefined") return "high";

  try {
    const saved = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (saved === "low") return "low";
  } catch {
    // Ignore storage read errors
  }

  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
    return "low";
  }

  const nav = navigator as NavigatorWithCapabilities;
  if (nav.connection?.saveData) {
    return "low";
  }
  const effectiveType = nav.connection?.effectiveType;
  if (effectiveType === "slow-2g" || effectiveType === "2g" || effectiveType === "3g") {
    return "low";
  }

  if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4) {
    return "low";
  }

  if (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 4) {
    return "low";
  }

  return "high";
}

/**
 * Detects coarse touch devices (phones & tablets regardless of reported core count —
 * e.g. 8-core MediaTek Helio G88/G99, Unisoc, Snapdragon 6xx, iPads/iPhones).
 */
export function isCoarseTouchDevice(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(
    window.matchMedia?.("(hover: none) and (pointer: coarse)").matches
  );
}

/**
 * Passive runtime frame-timing & long-task observer.
 * Catches slow CPUs/GPUs that report high core counts or omit deviceMemory
 * (e.g., octa-core budget ARM SoCs, older laptops, Chromebooks, software GPUs).
 * Runs once per session for a short window and immediately disconnects.
 */
export function initPerformanceTierMonitor(): PerformanceTier {
  if (typeof window === "undefined") return "high";

  const initial = cachedTier ?? detectStaticPerformanceTier();
  notifyTier(initial);

  if (initial === "low" || monitorStarted) {
    return initial;
  }
  monitorStarted = true;

  // 1. Passive 12-frame rAF delta probe after initial hydration settles
  const startTimer = window.setTimeout(() => {
    if (cachedTier === "low" || document.hidden) return;
    const deltas: number[] = [];
    let last = performance.now();
    let rafId = 0;

    const sample = (now: number) => {
      if (document.hidden) return;
      const dt = now - last;
      last = now;
      // Ignore single outlier tab-switch pauses (> 250ms)
      if (dt > 0 && dt < 250) {
        deltas.push(dt);
      }
      if (deltas.length < 12) {
        rafId = window.requestAnimationFrame(sample);
      } else {
        deltas.sort((a, b) => a - b);
        const median = deltas[Math.floor(deltas.length / 2)];
        // Sustained < 35fps during idle/light UI signals constrained CPU/GPU
        if (median > 28) {
          notifyTier("low");
        }
      }
    };

    rafId = window.requestAnimationFrame(sample);
    window.setTimeout(() => window.cancelAnimationFrame(rafId), 2000);
  }, 1200);

  // 2. Short Long-Task observer (first 6s post-hydration)
  if (typeof PerformanceObserver !== "undefined") {
    try {
      let severeTasks = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration >= 160) {
            severeTasks += 1;
            if (severeTasks >= 2) {
              notifyTier("low");
              observer.disconnect();
              return;
            }
          }
        }
      });
      observer.observe({ type: "longtask", buffered: false });
      window.setTimeout(() => {
        observer.disconnect();
        window.clearTimeout(startTimer);
      }, 6500);
    } catch {
      // Browser does not support longtask observer (e.g., Safari/Firefox)
    }
  }

  return initial;
}

/**
 * Subscribe to the session performance tier ("high" | "low") without causing SSR mismatches.
 */
export function usePerformanceTier(): {
  tier: PerformanceTier;
  isLowPerf: boolean;
  isCoarseTouch: boolean;
} {
  const [tier, setTier] = useState<PerformanceTier>("high");
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    const resolved = initPerformanceTierMonitor();
    setTier(resolved);
    setCoarse(isCoarseTouchDevice());

    const handleChange = (next: PerformanceTier) => setTier(next);
    listeners.add(handleChange);
    return () => {
      listeners.delete(handleChange);
    };
  }, []);

  return {
    tier,
    isLowPerf: tier === "low",
    isCoarseTouch: coarse,
  };
}
