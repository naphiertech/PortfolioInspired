import { PresentationMode } from "../types/presentation";
import {
  DEFAULT_PRESENTATION_MODE,
  isValidPresentationMode,
} from "../types/config";

export const AVAILABLE_PRESENTATION_MODES: readonly PresentationMode[] = [
  "default",
  "focus",
  "minimal",
  "agent",
] as const;

/**
 * Returns a random presentation mode from the available modes with uniform distribution.
 * If isRootPath is false, excludes 'minimal' since minimal is strictly a single-page profile on "/".
 */
export function getRandomPresentationMode(isRootPath: boolean = true): PresentationMode {
  const candidateModes = isRootPath
    ? AVAILABLE_PRESENTATION_MODES
    : AVAILABLE_PRESENTATION_MODES.filter((m) => m !== "minimal");

  const randomIndex = Math.floor(Math.random() * candidateModes.length);
  return candidateModes[randomIndex];
}

interface ResolveModeOptions {
  queryMode?: string | string[] | null;
  cookieMode?: string | null;
  randomizeIfUnset?: boolean;
  isRootPath?: boolean;
}

/**
 * Single Authoritative Mode-Resolution Policy
 *
 * Evaluation Priority:
 * 1. Explicit valid `?mode=` query parameter (e.g. "?mode=focus")
 * 2. Persisted presentation-mode cookie (e.g. "naphier_presentation_mode=agent")
 * 3. Randomized first entry (if randomizeIfUnset is true) or Default Mode Fallback ("default")
 *
 * This function is pure and can run in both Server Components and Client Components.
 */
export function resolveInitialPresentationMode(options: ResolveModeOptions): PresentationMode {
  const { queryMode, cookieMode, randomizeIfUnset = false, isRootPath = true } = options;

  // 1. Explicit URL Query Parameter
  const rawQuery = Array.isArray(queryMode) ? queryMode[0] : queryMode;
  if (rawQuery && isValidPresentationMode(rawQuery)) {
    return rawQuery;
  }

  // 2. Persisted Cookie
  if (cookieMode && isValidPresentationMode(cookieMode)) {
    return cookieMode;
  }

  // 3. Randomized First Entry Fallback
  if (randomizeIfUnset) {
    return getRandomPresentationMode(isRootPath);
  }

  // 4. Default Mode Fallback
  return DEFAULT_PRESENTATION_MODE;
}
