"use client";

import React from "react";
import styles from "./MarginArtifactSlot.module.css";

interface MarginArtifactSlotProps {
  side: "left" | "right";
  children: React.ReactNode;
  className?: string;
}

/**
 * Shared layout seam anchoring desktop margin easter eggs squarely inside the
 * 96px architectural blueprint bay (between the main content rail and outer
 * dashed guide) on xl+ viewports.
 */
export function MarginArtifactSlot({
  side,
  children,
  className = "",
}: MarginArtifactSlotProps) {
  return (
    <div
      className={`${styles.slot} ${
        side === "right" ? styles.sideRight : styles.sideLeft
      } ${className}`}
    >
      {children}
    </div>
  );
}
