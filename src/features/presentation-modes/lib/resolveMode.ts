import { PresentationMode } from "../types/presentation";
import {
  DEFAULT_PRESENTATION_MODE,
  isValidPresentationMode,
} from "../types/config";

interface ResolveModeOptions {
  queryMode?: string | string[] | null;
  cookieMode?: string | null;
}

/**
 * Single Authoritative Mode-Resolution Policy
 *
 * Evaluation Priority:
 * 1. Explicit valid `?mode=` query parameter (e.g. "?mode=focus")
 * 2. Persisted presentation-mode cookie
 * 3. Default fallback ("default")
 *
 * This function is pure and can run in both Server Components and Client Components.
 */
export function resolveInitialPresentationMode(options: ResolveModeOptions): PresentationMode {
  const { queryMode, cookieMode } = options;

  // 1. Explicit URL Query Parameter
  const rawQuery = Array.isArray(queryMode) ? queryMode[0] : queryMode;
  if (rawQuery && isValidPresentationMode(rawQuery)) {
    return rawQuery;
  }

  // 2. Persisted Cookie
  if (cookieMode && isValidPresentationMode(cookieMode)) {
    return cookieMode;
  }

  // 3. Default Mode Fallback
  return DEFAULT_PRESENTATION_MODE;
}
