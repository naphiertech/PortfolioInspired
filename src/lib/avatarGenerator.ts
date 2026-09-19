/**
 * Visitor Identity & Avatar Utilities for Ably Realtime Presence
 * - Pure DiceBear Notionists avatars (https://api.dicebear.com/)
 * - Platform-based naming (Windows, Mac, Mobile, Linux)
 * - Detects user platform dynamically
 * - Generates & persists a stable anonymous client ID in localStorage
 */

export type PlatformType = "Windows" | "Mac" | "Mobile" | "Linux";

export interface VisitorProfile {
  id: string;
  name: PlatformType;
  src: string;
  fallback: string;
  isCurrentUser?: boolean;
  variantIndex?: number;
}

export interface VisitorPresenceData {
  name: PlatformType;
  src: string;
  fallback: string;
  variantIndex?: number;
}

const STORAGE_KEY_CURRENT = "portfolio_visitor_platform_self";

/**
 * Detect client operating system / device platform
 */
export function detectPlatform(): PlatformType {
  if (typeof window === "undefined") return "Windows";

  const ua = window.navigator.userAgent;
  const platform =
    (window.navigator as unknown as { userAgentData?: { platform?: string } })
      ?.userAgentData?.platform ||
    window.navigator.platform ||
    "";

  // 1. Mobile devices (iOS, Android, Phone, Tablet)
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
    return "Mobile";
  }
  if (window.matchMedia("(max-width: 640px)").matches && /Mobi|Tablet/i.test(ua)) {
    return "Mobile";
  }

  // 2. macOS
  if (/Macintosh|MacIntel|MacPPC|Mac68K/i.test(platform) || /Mac OS X/i.test(ua)) {
    return "Mac";
  }

  // 3. Windows
  if (/Win32|Win64|Windows|WinCE/i.test(platform) || /Windows/i.test(ua)) {
    return "Windows";
  }

  // 4. Linux
  if (/Linux/i.test(platform) || /Linux/i.test(ua)) {
    return "Linux";
  }

  return "Windows";
}

/**
 * Get DiceBear avatar URL for a platform and variant index
 */
export function getDiceBearAvatar(platform: PlatformType, variant = 0): string {
  const seed = variant === 0 ? platform : `${platform}_${variant}`;
  return `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(seed)}`;
}

/**
 * Retrieve or initialize this visitor's stable anonymous identity in localStorage
 */
export function getOrCreateVisitor(): VisitorProfile {
  const platform = detectPlatform();
  const fallback = platform.slice(0, 2).toUpperCase();

  if (typeof window === "undefined") {
    return {
      id: `anon-${platform.toLowerCase()}-0`,
      name: platform,
      src: getDiceBearAvatar(platform, 0),
      fallback,
      isCurrentUser: true,
      variantIndex: 0,
    };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY_CURRENT);
    if (stored) {
      const parsed: VisitorProfile = JSON.parse(stored);
      // Keep platform updated with device
      parsed.name = platform;
      parsed.src = getDiceBearAvatar(platform, parsed.variantIndex || 0);
      parsed.fallback = fallback;
      parsed.isCurrentUser = true;
      localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(parsed));
      return parsed;
    }

    const newVisitor: VisitorProfile = {
      id: `anon-${platform.toLowerCase()}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      name: platform,
      src: getDiceBearAvatar(platform, 0),
      fallback,
      isCurrentUser: true,
      variantIndex: 0,
    };

    localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(newVisitor));
    return newVisitor;
  } catch {
    return {
      id: `anon-${platform.toLowerCase()}-fallback`,
      name: platform,
      src: getDiceBearAvatar(platform, 0),
      fallback,
      isCurrentUser: true,
      variantIndex: 0,
    };
  }
}
