import { PresentationMode, PresentationModeConfig } from "./presentation";

export const DEFAULT_PRESENTATION_MODE: PresentationMode = "agent";
export const AGENT_FOLIO_ENABLED = true;

export function normalizePresentationMode(mode: PresentationMode): PresentationMode {
  return mode === "agent" && !AGENT_FOLIO_ENABLED ? "default" : mode;
}

export const PRESENTATION_COOKIE_NAME = "naphier_presentation_mode_v2";
export const PRESENTATION_QUERY_PARAM = "mode";
export const PRESENTATION_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export const STARS_COOKIE_NAME = "naphier_stars_background";
export const STARS_STORAGE_KEY = "naphier_stars_background";

export const GRID_COOKIE_NAME = "naphier_flickering_grid";
export const GRID_STORAGE_KEY = "naphier_flickering_grid";

export const PRESENTATION_MODES: Record<PresentationMode, PresentationModeConfig> = {
  default: {
    id: "default",
    label: "Standard",
    shortLabel: "Standard",
    tagline: "Full portfolio experience",
    description: "Full portfolio experience",
    isAvailable: true,
  },
  focus: {
    id: "focus",
    label: "Focus",
    shortLabel: "Focus",
    tagline: "Quick professional overview",
    description: "Quick professional overview",
    isAvailable: true,
  },
  minimal: {
    id: "minimal",
    label: "Minimal",
    shortLabel: "Minimal",
    tagline: "One-page personal profile",
    description: "One-page personal profile",
    isAvailable: true,
  },
  agent: {
    id: "agent",
    label: "Artisan (Default)",
    shortLabel: "Artisan",
    tagline: "Interactive 3D workspace & editorial portfolio",
    description: "Interactive 3D workspace, editorial typography, and tactile craft",
    isAvailable: AGENT_FOLIO_ENABLED,
  },
};

/**
 * Validates if a string is a valid, currently supported PresentationMode.
 */
export function isValidPresentationMode(value: unknown): value is PresentationMode {
  return (
    typeof value === "string" &&
    (value === "default" || value === "focus" || value === "minimal" || value === "agent")
  );
}
