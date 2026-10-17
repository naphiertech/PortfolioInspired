"use client";

import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "@/components/ThemeProvider";
import { HeroSection } from "./HeroSection";
import { DockNav } from "./DockNav";
import { PageTransitionSpiral } from "./PageTransitionSpiral";
import { PresentationModeSwitcher } from "@/features/presentation-modes/components/PresentationModeSwitcher";
const AboutSection = dynamic(() =>
  import("./AboutSection").then((m) => m.AboutSection)
);
const ExperienceSection = dynamic(() =>
  import("./ExperienceSection").then((m) => m.ExperienceSection)
);
const ProjectsSection = dynamic(() =>
  import("./ProjectsSection").then((m) => m.ProjectsSection)
);
const NotesSection = dynamic(() =>
  import("./NotesSection").then((m) => m.NotesSection)
);

type TabType = "home" | "about" | "experience" | "projects" | "notes";

const RESOLVED_TABS: {
  about?: React.ComponentType<{ onNavigateTab?: (tab: TabType) => void }>;
  experience?: React.ComponentType<{ isDark: boolean; onNavigateProjects?: () => void }>;
  projects?: React.ComponentType;
  notes?: React.ComponentType;
} = {};

async function preloadArtisanTab(tab: TabType): Promise<void> {
  try {
    if (tab === "about" && !RESOLVED_TABS.about) {
      const mod = await import("./AboutSection");
      RESOLVED_TABS.about = mod.AboutSection;
    } else if (tab === "experience" && !RESOLVED_TABS.experience) {
      const mod = await import("./ExperienceSection");
      RESOLVED_TABS.experience = mod.ExperienceSection;
    } else if (tab === "projects" && !RESOLVED_TABS.projects) {
      const mod = await import("./ProjectsSection");
      RESOLVED_TABS.projects = mod.ProjectsSection;
    } else if (tab === "notes" && !RESOLVED_TABS.notes) {
      const mod = await import("./NotesSection");
      RESOLVED_TABS.notes = mod.NotesSection;
    }
  } catch {
    // Ignore preload errors
  }
}

const ARTISAN_TAB_QUOTES: Record<Exclude<TabType, "home">, { quote: string; author: string }> = {
  about: {
    quote: "Simplicity is about subtracting the obvious and adding the meaningful.",
    author: "John Maeda",
  },
  experience: {
    quote: "Details are not the details. They make the design.",
    author: "Charles Eames",
  },
  projects: {
    quote: "Make it work, make it right, make it fast.",
    author: "Kent Beck",
  },
  notes: {
    quote: "Programs must be written for people to read, and only incidentally for machines to execute.",
    author: "Harold Abelson",
  },
};

interface ArtisanPortfolioLayoutProps {
  defaultTab?: TabType;
}

export function ArtisanPortfolioLayout({
  defaultTab = "home",
}: ArtisanPortfolioLayoutProps) {
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryTab = params.get("tab") as TabType | null;
    if (queryTab && ["home", "about", "experience", "projects", "notes"].includes(queryTab)) {
      void preloadArtisanTab(queryTab);
      setActiveTab(queryTab);
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  // Warm-preload sub-tabs after initial idle so tab switching is always instantaneous
  useEffect(() => {
    const timer = setTimeout(() => {
      void preloadArtisanTab("about");
      void preloadArtisanTab("experience");
      void preloadArtisanTab("projects");
      void preloadArtisanTab("notes");
    }, 3800);
    return () => clearTimeout(timer);
  }, []);

  // Lock scrolling strictly on desktop when on the Home single-screen hero; allow vertical scroll on mobile
  useEffect(() => {
    const updateScrollLock = () => {
      const isDesktop = window.innerWidth >= 1024;
      if (activeTab === "home" && isDesktop) {
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
        window.scrollTo({ top: 0, behavior: "instant" });
      } else {
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
      }
    };

    updateScrollLock();
    window.addEventListener("resize", updateScrollLock);
    return () => {
      window.removeEventListener("resize", updateScrollLock);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [activeTab]);

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pendingTab, setPendingTab] = useState<TabType | null>(null);

  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const handleToggleTheme = useCallback(
    (event?: React.MouseEvent) => {
      setTheme(isDark ? "light" : "dark", event);
    },
    [isDark, setTheme]
  );

  const handleHoverTab = useCallback((tab: string) => {
    if (tab === "about" || tab === "experience" || tab === "projects" || tab === "notes") {
      void preloadArtisanTab(tab as TabType);
    }
  }, []);

  const handleSelectTab = useCallback(
    (newTab: string) => {
      const tab = newTab as TabType;
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("artisan-tab-switch"));
      }
      if (tab === activeTab) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      if (isTransitioning) return;

      const startTransitionNow = () => {
        setPendingTab(tab);
        setIsTransitioning(true);
      };

      if (tab === "home" || RESOLVED_TABS[tab]) {
        startTransitionNow();
      } else {
        void preloadArtisanTab(tab).then(startTransitionNow);
      }
    },
    [activeTab, isTransitioning]
  );

  const handleTransitionMidpoint = useCallback(() => {
    if (pendingTab) {
      setActiveTab(pendingTab);
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [pendingTab]);

  const handleTransitionComplete = useCallback(() => {
    setIsTransitioning(false);
    setPendingTab(null);
  }, []);

  const activeQuote = activeTab !== "home" ? ARTISAN_TAB_QUOTES[activeTab] : null;
  const ResolvedAbout = RESOLVED_TABS.about || AboutSection;
  const ResolvedExperience = RESOLVED_TABS.experience || ExperienceSection;
  const ResolvedProjects = RESOLVED_TABS.projects || ProjectsSection;
  const ResolvedNotes = RESOLVED_TABS.notes || NotesSection;

  return (
    <div
      className={`artisan-mode w-full bg-background text-foreground selection:bg-foreground selection:text-background relative overflow-x-hidden font-sans ${
        activeTab === "home"
          ? "min-h-dvh lg:h-dvh lg:max-h-dvh lg:overflow-hidden"
          : "min-h-screen"
      }`}
    >
      {/* 1. Discreet Presentation Mode Switcher in Top Right */}
      <div
        data-guide="artisan-switcher"
        className="fixed top-3 sm:top-5 right-3 sm:right-6 z-50 pointer-events-auto"
      >
        <PresentationModeSwitcher variant="agent" />
      </div>

      {/* 2. Main Tab View Dispatcher */}
      <div
        className={`w-full relative ${
          activeTab === "home"
            ? "min-h-dvh lg:h-dvh lg:max-h-dvh lg:overflow-hidden p-0 m-0"
            : "min-h-screen flex flex-col justify-between pb-24 sm:pb-28"
        }`}
      >
        {activeTab === "home" && (
          <HeroSection
            isDark={isDark}
            onNavigate={(tab) => handleSelectTab(tab)}
          />
        )}
        {activeTab === "about" && (
          <ResolvedAbout onNavigateTab={(tab) => handleSelectTab(tab)} />
        )}
        {activeTab === "experience" && (
          <ResolvedExperience
            isDark={isDark}
            onNavigateProjects={() => handleSelectTab("projects")}
          />
        )}
        {activeTab === "projects" && <ResolvedProjects />}
        {activeTab === "notes" && <ResolvedNotes />}

        {activeQuote && (
          <footer
            aria-label="Page closing quote"
            className="w-full max-w-2xl mx-auto px-6 pt-8 sm:pt-10 mt-6 sm:mt-8 border-t border-black/10 dark:border-white/10 flex flex-col items-center text-center"
          >
            <svg
              className="w-5 h-5 text-muted-foreground/40 mb-3"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <blockquote className="font-serif italic text-base sm:text-lg text-foreground/80 leading-relaxed max-w-lg">
              &ldquo;{activeQuote.quote}&rdquo;
            </blockquote>
            <div className="flex items-center justify-center gap-3 mt-3.5 font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              <span className="w-7 h-px bg-black/15 dark:bg-white/15" aria-hidden="true" />
              <span>{activeQuote.author}</span>
              <span className="w-7 h-px bg-black/15 dark:bg-white/15" aria-hidden="true" />
            </div>
          </footer>
        )}
      </div>

      {/* 3. Floating Bottom Tactile Dock */}
      <DockNav
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onHoverTab={handleHoverTab}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
      />

      {/* 4. Architectural Shutter Screen Transition */}
      <PageTransitionSpiral
        isTransitioning={isTransitioning}
        targetTab={pendingTab || activeTab}
        onMidpoint={handleTransitionMidpoint}
        onComplete={handleTransitionComplete}
      />
    </div>
  );
}

export default ArtisanPortfolioLayout;
