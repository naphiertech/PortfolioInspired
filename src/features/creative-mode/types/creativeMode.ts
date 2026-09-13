export type TypeScale = "compact" | "standard" | "big";
export type SpacingDensity = "compact" | "balanced" | "airy";
export type ContentWidth = "narrow" | "standard" | "wide";
export type CornerStyle = "sharp" | "soft";
export type MotionLevel = "off" | "subtle" | "expressive";
export type GridStyle = "fine" | "blueprint" | "hidden";
export type CreativeFontPairing = "original" | "geist" | "instrument-serif" | "newsreader" | "bricolage" | "fraunces" | "space-grotesk";

export interface CreativeSettings {
  fontPairing: CreativeFontPairing;
  typeScale: TypeScale;
  spacing: SpacingDensity;
  contentWidth: ContentWidth;
  corners: CornerStyle;
  motion: MotionLevel;
  gridStyle: GridStyle;
}

export interface CreativeModeState extends CreativeSettings {
  enabled: boolean;
}
