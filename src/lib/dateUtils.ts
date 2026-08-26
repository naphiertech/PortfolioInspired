/**
 * Centralized Date & Time Utility Functions
 * Enforces Asia/Manila (GMT+8) timezone formatting and hydration safety.
 */

export const TARGET_TIMEZONE = "Asia/Manila";

/**
 * Format current time in Asia/Manila without seconds.
 * Example output: "9:52 PM · GMT+8"
 */
export function getManilaTimeString(date: Date = new Date()): string {
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: TARGET_TIMEZONE,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `${formatter.format(date)} · GMT+8`;
  } catch {
    return "GMT+8";
  }
}

/**
 * Format an ISO date string into a clean short date.
 * Example output: "Aug 26, 2026"
 */
export function formatShortDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat("en-US", {
      timeZone: TARGET_TIMEZONE,
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(d);
  } catch {
    return isoString;
  }
}

/**
 * Format an ISO date into relative time (e.g. "2 hours ago", "Yesterday", "3 days ago")
 * or fallback to short date if more than 7 days ago.
 */
export function formatRelativeTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    
    // Future or very recent (less than 60 seconds)
    if (diffMs < 60 * 1000) {
      return "just now";
    }

    const diffMins = Math.floor(diffMs / (60 * 1000));
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    }

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) {
      return "yesterday";
    }
    if (diffDays < 7) {
      return `${diffDays}d ago`;
    }

    // Default to short date if older
    return new Intl.DateTimeFormat("en-US", {
      timeZone: TARGET_TIMEZONE,
      month: "short",
      day: "numeric",
    }).format(date);
  } catch {
    return "recently";
  }
}
