import { PresentationMode } from "../types/presentation";
import {
  DEFAULT_PRESENTATION_MODE,
  isValidPresentationMode,
  normalizePresentationMode,
  PRESENTATION_MODES,
} from "../types/config";

export const AVAILABLE_PRESENTATION_MODES: readonly PresentationMode[] = Object.values(PRESENTATION_MODES)
  .filter(mode => mode.isAvailable)
  .map(mode => mode.id);

interface ResolveModeOptions {
  queryMode?: string | string[] | null;
  cookieMode?: string | null;
  isRootPath?: boolean;
}

/**
 * Single Authoritative Mode-Resolution Policy
 *
 * Evaluation Priority:
 * 1. Explicit valid `?mode=` query parameter (e.g. "?mode=focus")
 * 2. Persisted presentation-mode cookie (e.g. "naphier_presentation_mode=agent")
 * 3. Default Mode Fallback ("default")
 *
 * This function is pure and can run in both Server Components and Client Components.
 */
export function resolveInitialPresentationMode(options: ResolveModeOptions): PresentationMode {
  const { queryMode, cookieMode } = options;

  // 1. Explicit URL Query Parameter
  const rawQuery = Array.isArray(queryMode) ? queryMode[0] : queryMode;
  if (rawQuery && isValidPresentationMode(rawQuery)) {
    return normalizePresentationMode(rawQuery);
  }

  // 2. Persisted Cookie
  if (cookieMode && isValidPresentationMode(cookieMode)) {
    return normalizePresentationMode(cookieMode);
  }

  // 3. Default Mode Fallback
  return DEFAULT_PRESENTATION_MODE;
}
