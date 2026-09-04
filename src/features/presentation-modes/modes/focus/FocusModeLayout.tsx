import React from "react";
import { EditorialDivider } from "@/components/EditorialDivider";
import { FocusNavigation } from "./components/FocusNavigation";
import { FocusHero } from "./components/FocusHero";
import { FocusCapabilities } from "./components/FocusCapabilities";
import { FocusSelectedWork } from "./components/FocusSelectedWork";
import { FocusTechStack } from "./components/FocusTechStack";
import { FocusExperience } from "./components/FocusExperience";
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
      <EditorialDivider className="my-6 sm:my-7" />

      {/* 01 // CORE ENGINEERING CAPABILITIES */}
      <FocusCapabilities />

      {/* Structural Divider */}
      <EditorialDivider className="my-6 sm:my-7" />

      {/* 02 // SELECTED FLAGSHIP SYSTEMS */}
      <FocusSelectedWork />

      {/* Structural Divider */}
      <EditorialDivider className="my-6 sm:my-7" />

      {/* 03 // TECHNICAL STACK */}
      <FocusTechStack />

      {/* Structural Divider */}
      <EditorialDivider className="my-6 sm:my-7" />

      {/* 04 // EXPERIENCE & EDUCATION TIMELINE */}
      <FocusExperience />

      {/* Structural Divider */}
      <EditorialDivider className="my-6 sm:my-7" />

      {/* 06 // CONTACT & AVAILABILITY */}
      <FocusContact />
    </div>
  );
}

export default FocusModeLayout;
