"use client";

import { useEffect } from "react";
import { creativeFontVariables, CREATIVE_FONT_PAIRINGS } from "../lib/creativeFonts";
import creativeStyles from "../creativeMode.module.css";
import type { CreativeFontPairing } from "../types/creativeMode";

interface CreativeFontStylesProps {
  fontPairing: CreativeFontPairing;
}

/**
 * CreativeFontStyles
 *
 * Lazily mounts and binds creative font pairings, Google Font variables, and scope CSS
 * only when Creative Mode is actively enabled by the user. Prevents bundling font-face
 * stylesheets and creativeMode styles into the initial critical render path for standard visitors.
 */
export function CreativeFontStyles({ fontPairing }: CreativeFontStylesProps) {
  useEffect(() => {
    const root = document.documentElement;
    const fontClasses = creativeFontVariables.split(" ").filter(Boolean);
    fontClasses.forEach((cls) => root.classList.add(cls));

    const mainEl = document.querySelector("main");
    if (mainEl && creativeStyles.scope) {
      mainEl.classList.add(creativeStyles.scope);
    }

    return () => {
      fontClasses.forEach((cls) => root.classList.remove(cls));
      if (mainEl && creativeStyles.scope) {
        mainEl.classList.remove(creativeStyles.scope);
      }
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const pairing = fontPairing !== "original" ? CREATIVE_FONT_PAIRINGS[fontPairing] : null;

    if (pairing) {
      root.style.setProperty("--creative-font-heading", pairing.heading);
      root.style.setProperty("--creative-font-body", pairing.body);
      root.style.setProperty("--creative-font-mono", pairing.mono);
      root.style.setProperty("--creative-font-heading-weight", String(pairing.weight));
    } else {
      root.style.removeProperty("--creative-font-heading");
      root.style.removeProperty("--creative-font-body");
      root.style.removeProperty("--creative-font-mono");
      root.style.removeProperty("--creative-font-heading-weight");
    }
  }, [fontPairing]);

  return null;
}

export default CreativeFontStyles;
