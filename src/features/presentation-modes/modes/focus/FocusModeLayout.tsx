import React from "react";
import { EditorialDivider } from "@/components/EditorialDivider";
import { FocusNavigation } from "./components/FocusNavigation";
import { FocusHero } from "./components/FocusHero";
import { FocusCapabilities } from "./components/FocusCapabilities";
import { FocusFieldNotes } from "./components/FocusFieldNotes";
import { FocusSelectedWork } from "./components/FocusSelectedWork";
import { FocusTechStack } from "./components/FocusTechStack";
import { FocusExperience } from "./components/FocusExperience";
import { ReadingShelf } from "@/components/ReadingShelf";
import { FocusContact } from "./components/FocusContact";

/**
 * FocusModeLayout
 *
 * High-signal engineering overview presentation.
 * Designed for recruiters, hiring managers, and quick technical evaluations.
 */
export function FocusModeLayout() {
  return (
    <div className="w-full flex flex-col pt-1 pb-8">
      {/* Focus Top Navigation */}
      <FocusNavigation />

      {/* 00 // PROFILE OVERVIEW */}
      <FocusHero />

      {/* Structural Divider */}
      <EditorialDivider variant="hatch" className="my-4 sm:my-5" />

      {/* 01 // CORE ENGINEERING CAPABILITIES */}
      <FocusCapabilities />

      {/* Structural Divider */}
      <EditorialDivider variant="hatch" className="my-4 sm:my-5" />

      {/* 02 // FIELD NOTES (Editorial Engineering Observations) */}
      <FocusFieldNotes />

      {/* Structural Divider */}
      <EditorialDivider variant="hatch" className="my-4 sm:my-5" />

      {/* 03 // SELECTED FLAGSHIP SYSTEMS */}
      <FocusSelectedWork />

      {/* Structural Divider */}
      <EditorialDivider variant="hatch" className="my-4 sm:my-5" />

      {/* 03 // TECHNICAL STACK */}
      <FocusTechStack />

      {/* Structural Divider */}
      <EditorialDivider variant="hatch" className="my-4 sm:my-5" />

      {/* 04 // EXPERIENCE & EDUCATION TIMELINE */}
      <FocusExperience />

      {/* Structural Divider */}
      <EditorialDivider variant="hatch" className="my-4 sm:my-5" />

      {/* 06 // READING SHELF */}
      <ReadingShelf variant="focus" />

      {/* Structural Divider */}
      <EditorialDivider variant="hatch" className="my-4 sm:my-5" />

      {/* 07 // CONTACT & AVAILABILITY */}
      <FocusContact />
    </div>
  );
}

export default FocusModeLayout;
