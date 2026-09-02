/**
 * Currently implemented runtime presentation modes.
 *
 * Future modes ("blueprint" | "story") will be added as union members
 * only when their respective layouts and systems are implemented.
 */
export type PresentationMode = "default" | "focus" | "minimal";

export interface PresentationModeConfig {
  id: PresentationMode;
  label: string;
  shortLabel: string;
  tagline: string;
  description: string;
  isAvailable: boolean;
}
