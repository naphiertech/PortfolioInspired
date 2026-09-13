import type { CreativeModeState } from "../types/creativeMode";
import type { PresentationMode } from "@/features/presentation-modes/types/presentation";

export function supportsCreativeMode(mode: PresentationMode): mode is "default" | "focus" | "minimal" {
  return mode === "default" || mode === "focus" || mode === "minimal";
}

export const INITIAL_CREATIVE_STATE: CreativeModeState = {
  enabled: false,
  fontPairing: "original",
  typeScale: "standard",
  spacing: "balanced",
  contentWidth: "standard",
  corners: "soft",
  motion: "subtle",
  gridStyle: "blueprint",
};

export const CREATIVE_MAPPINGS = {
  default: {
    widths: { narrow: 640, standard: 760, wide: 920 },
    type: { compact: 0.94, standard: 1, big: 1.12 },
    spacing: { compact: 0.8, balanced: 1, airy: 1.25 },
    radii: { sharp: { card: 3, control: 3, panel: 4 }, soft: { card: 14, control: 9, panel: 16 } },
    motion: { off: { duration: 0.01, distance: 0, scale: 1 }, subtle: { duration: 0.2, distance: 2, scale: 1 }, expressive: { duration: 0.36, distance: 8, scale: 1.015 } },
  },
  focus: {
    widths: { narrow: 860, standard: 1020, wide: 1120 },
    type: { compact: 0.95, standard: 1, big: 1.08 },
    spacing: { compact: 0.85, balanced: 1, airy: 1.18 },
    radii: { sharp: { card: 2, control: 2, panel: 3 }, soft: { card: 10, control: 7, panel: 12 } },
    motion: { off: { duration: 0.01, distance: 0, scale: 1 }, subtle: { duration: 0.18, distance: 2, scale: 1 }, expressive: { duration: 0.3, distance: 6, scale: 1.01 } },
  },
  minimal: {
    widths: { narrow: 560, standard: 640, wide: 700 },
    type: { compact: 0.97, standard: 1, big: 1.06 },
    spacing: { compact: 0.9, balanced: 1, airy: 1.15 },
    radii: { sharp: { card: 2, control: 2, panel: 3 }, soft: { card: 8, control: 6, panel: 10 } },
    motion: { off: { duration: 0.01, distance: 0, scale: 1 }, subtle: { duration: 0.16, distance: 1, scale: 1 }, expressive: { duration: 0.28, distance: 4, scale: 1.005 } },
  },
} as const;
