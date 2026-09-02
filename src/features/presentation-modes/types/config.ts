import { PresentationMode, PresentationModeConfig } from "./presentation";

export const DEFAULT_PRESENTATION_MODE: PresentationMode = "default";

export const PRESENTATION_COOKIE_NAME = "naphier_presentation_mode";
export const PRESENTATION_QUERY_PARAM = "mode";
export const PRESENTATION_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export const PRESENTATION_MODES: Record<PresentationMode, PresentationModeConfig> = {
  default: {
    id: "default",
    label: "Default",
    shortLabel: "Default",
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
};

/**
 * Validates if a string is a valid, currently supported PresentationMode.
 */
export function isValidPresentationMode(value: unknown): value is PresentationMode {
  return (
    typeof value === "string" &&
    (value === "default" || value === "focus" || value === "minimal")
  );
}
