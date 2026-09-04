import React from "react";
import { ebGaramond } from "./fonts";
import { MinimalHeader } from "./components/MinimalHeader";
import { MinimalIntro } from "./components/MinimalIntro";
import { MinimalProjects } from "./components/MinimalProjects";
import { MinimalStack } from "./components/MinimalStack";
import { MinimalCurrent } from "./components/MinimalCurrent";
import { MinimalContributions } from "./components/MinimalContributions";
import { MinimalConnect } from "./components/MinimalConnect";

/**
 * MinimalModeLayout
 *
 * One-page, text-first personal presentation mode inspired by classical editorial typography.
 * - Old-style Roman serif typography (EB Garamond) scoped to this layout
 * - Narrow centered reading width (~640px) with generous whitespace
 * - Only 6 curated sections: Intro, Selected Work, What I Work With, Currently, GitHub Contributions, Connect
 */
export function MinimalModeLayout() {
  return (
    <div
      className={`${ebGaramond.variable} font-serif w-full max-w-[640px] mx-auto text-zinc-800 dark:text-[#beb9ad] selection:bg-[#343532] selection:text-[#eae6df] transition-colors duration-200`}
    >
      {/* 1. Header with View Switcher & Theme Toggle */}
      <MinimalHeader />

      {/* 2. Main Minimal Content */}
      <div className="w-full">
        {/* 2. Introduction & Identity */}
        <MinimalIntro />

        {/* 3. Selected Work */}
        <MinimalProjects />

        {/* 4. What I Work With */}
        <MinimalStack />

        {/* 5. Currently */}
        <MinimalCurrent />

        {/* 6. GitHub Contributions */}
        <MinimalContributions />

        {/* 7. Connect & Minimal Footer */}
        <MinimalConnect />
      </div>
    </div>
  );
}

export default MinimalModeLayout;
