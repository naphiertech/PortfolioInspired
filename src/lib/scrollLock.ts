"use client";

import { useEffect } from "react";

let lockCount = 0;
let savedBodyStyles = {
  overflow: "",
  paddingRight: "",
};

/**
 * Locks body scrolling without causing layout shifts.
 * Automatically measures scrollbar width and applies right-side compensation.
 */
export function lockScroll() {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  lockCount++;
  if (lockCount === 1) {
    // Measure exact scrollbar width
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    savedBodyStyles = {
      overflow: document.body.style.overflow,
      paddingRight: document.body.style.paddingRight,
    };

    // Apply scrollbar compensation if a scrollbar is present
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    document.body.style.overflow = "hidden";
  }
}

/**
 * Restores body scroll and removes compensation cleanly when all active locks are cleared.
 */
export function unlockScroll() {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.body.style.overflow = savedBodyStyles.overflow;
    document.body.style.paddingRight = savedBodyStyles.paddingRight;
  }
}

/**
 * Reusable React hook to manage scroll locking for dialogs/modals/lightboxes.
 */
export function useScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (isLocked) {
      lockScroll();
      return () => {
        unlockScroll();
      };
    }
  }, [isLocked]);
}
