"use client";

import { useState, useEffect, useCallback } from "react";

const HINT_STORAGE_KEY = "portfolio_view_hint_dismissed_v2";

/**
 * useViewHint
 *
 * Lightweight persistent hook to show a subtle "Try another view" annotation
 * until the visitor has interacted with the presentation switcher at least once.
 * Shared across both Default and Focus presentation modes.
 */
export function useViewHint() {
  const [hasDismissedHint, setHasDismissedHint] = useState<boolean>(true);

  useEffect(() => {
    try {
      const isDismissed = localStorage.getItem(HINT_STORAGE_KEY);
      if (isDismissed !== "true") {
        setHasDismissedHint(false);
      }
    } catch {
      // Fallback for private browsing or disabled storage
      setHasDismissedHint(false);
    }
  }, []);

  const dismissHint = useCallback(() => {
    setHasDismissedHint(true);
    try {
      localStorage.setItem(HINT_STORAGE_KEY, "true");
    } catch {
      // ignore
    }
  }, []);

  return { hasDismissedHint, dismissHint };
}
