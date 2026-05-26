"use client";

import { useRef } from "react";
import { ProfileHeader } from "@/components/ProfileHeader";
import { AboutSection } from "@/components/AboutSection";
import { TechStack } from "@/components/TechStack";
import { RecentProjects } from "@/components/RecentProjects";
import { Certifications } from "@/components/Certifications";
import { DevCard } from "@/components/DevCard";
import { ExperienceTimeline } from "@/components/ExperienceTimeline";
import { Recommendations } from "@/components/Recommendations";
import { FooterGrid } from "@/components/FooterGrid";
import { Gallery } from "@/components/Gallery";
import { useGsapAnimations } from "@/lib/useGsapAnimations";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Drive all GSAP page entrance animations
  useGsapAnimations(containerRef);

  return (
    <div ref={containerRef} className="relative w-full min-h-screen select-none">
      {/* Centered Content Wrapper (matches live site max-w-4xl) */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Profile Header */}
        <ProfileHeader />

        {/* Bento Grid layout matching the live site's 6-column architecture */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-2 w-full">
          
          {/* Bento Block 1: About (spans 4 columns) */}
          <AboutSection />
          
          {/* Bento Block 2: Right Sidebar Stack (spans 2 columns on desktop, spans 3 grid rows) */}
          <div className="col-span-1 md:col-span-2 md:row-span-3 space-y-2 flex flex-col justify-start">
            
            {/* Devs One Hundred Card */}
            <DevCard />
            
            {/* GDG Zamboanga Card */}
            <div className="flex justify-center w-full">
              <a
                href="https://developers.google.com/community/gdg"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full max-w-[260px] p-4 rounded-lg bg-card-light dark:bg-card-dark border border-border-default dark:border-dark-border transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:shadow-sm cursor-pointer"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-text-secondary dark:text-dark-text-secondary">Community Member</span>
                  </div>
                  <h3 className="text-sm font-bold text-text-primary dark:text-dark-text-primary">GDG Zamboanga</h3>
                  <p className="text-[11px] text-text-muted dark:text-dark-text-muted leading-relaxed">
                    Active member of Google Developer Groups Zamboanga Region, collaborating and sharing web technologies.
                  </p>
                </div>
              </a>
            </div>
            
            {/* Experience Timeline */}
            <ExperienceTimeline />
          </div>

          {/* Bento Block 3: Tech Stack (spans 4 columns) */}
          <TechStack />

          {/* Bento Block 4: Recent Projects (spans 4 columns) */}
          <RecentProjects />

          {/* Bento Block 5: Recent Certifications (spans 3 columns) */}
          <Certifications />

          {/* Bento Block 6: Recommendations Slider (spans 3 columns) */}
          <Recommendations />

          {/* Bento Block 7: Footer Info Grid (spans all 6 columns) */}
          <FooterGrid />

          {/* Bento Block 8: Bottom Gallery Strip (spans all 6 columns) */}
          <Gallery />

        </div>
      </main>
    </div>
  );
}
