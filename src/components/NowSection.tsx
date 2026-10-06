"use client";

import React from "react";
import { FieldNotesSection } from "./FieldNotesSection";

/**
 * NowSection (Aliased to FieldNotesSection)
 *
 * Preserves backwards compatibility while redirecting all usage to
 * the redesigned FieldNotesSection.
 */
export function NowSection() {
  return <FieldNotesSection />;
}

export default NowSection;
