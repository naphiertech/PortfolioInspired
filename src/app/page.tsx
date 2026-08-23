import React from "react";
import { ProfileHeader } from "@/components/ProfileHeader";
import { AboutSection } from "@/components/AboutSection";
import { CurrentlyBuilding } from "@/components/CurrentlyBuilding";
import { RecentProjects } from "@/components/RecentProjects";
import { TechStack } from "@/components/TechStack";
import { ExperienceTimeline } from "@/components/ExperienceTimeline";
import { Certifications } from "@/components/Certifications";
import { Recommendations } from "@/components/Recommendations";
import { Gallery } from "@/components/Gallery";
import { FooterGrid } from "@/components/FooterGrid";

export default function Home() {
  return (
    <div className="w-full flex flex-col">
      {/* 1. Identity & Hero */}
      <ProfileHeader />

      {/* 2. About Narrative */}
      <AboutSection />

      {/* 2.5. Currently Building Live Dev Note */}
      <CurrentlyBuilding />

      {/* 3. Selected Projects (CAD Grid) */}
      <RecentProjects />

      {/* 4. Tech Stack (<categories/> & Vector Pills) */}
      <TechStack />

      {/* 5. Work Experience Timeline (Unboxed) */}
      <ExperienceTimeline />

      {/* 6. Recent Certifications (Unboxed) */}
      <Certifications />

      {/* 7. Recommendations */}
      <Recommendations />

      {/* 8. Gallery Moments */}
      <Gallery />

      {/* 9. Contact, Social & Memberships Matrix (Unboxed) */}
      <FooterGrid />
    </div>
  );
}
