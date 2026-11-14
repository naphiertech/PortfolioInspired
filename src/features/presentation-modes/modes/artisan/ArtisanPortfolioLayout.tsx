"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { MotionConfig } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";
import { HeroSection } from "./HeroSection";
import { WorkspaceSidebar } from "./WorkspaceSidebar";
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
const MusicSection = dynamic(() =>
  import("./MusicSection").then((m) => m.MusicSection)
);
const ResourcesSection = dynamic(() =>
  import("./ResourcesSection").then((m) => m.ResourcesSection)
);

type TabType =
  | "home"
  | "about"
  | "experience"
  | "projects"
  | "notes"
  | "music"
  | "resources";

const VALID_TABS: readonly TabType[] = [
  "home",
  "about",
  "experience",
  "projects",
  "notes",
  "music",
  "resources",
];

const RESOLVED_TABS: {
  about?: React.ComponentType<{ onNavigateTab?: (tab: TabType) => void }>;
  experience?: React.ComponentType<{ isDark: boolean; onNavigateProjects?: () => void }>;
  projects?: React.ComponentType;
  notes?: React.ComponentType;
  music?: React.ComponentType;
  resources?: React.ComponentType;
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
    } else if (tab === "music" && !RESOLVED_TABS.music) {
      const mod = await import("./MusicSection");
      RESOLVED_TABS.music = mod.MusicSection;
    } else if (tab === "resources" && !RESOLVED_TABS.resources) {
      const mod = await import("./ResourcesSection");
      RESOLVED_TABS.resources = mod.ResourcesSection;
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
  music: {
    quote: "Without music, life would be a mistake.",
    author: "Friedrich Nietzsche",
  },
  resources: {
    quote: "A craftsman is only as sharp as the instruments he keeps clean.",
    author: "Studio Ledger",
  },
};

interface ArtisanPortfolioLayoutProps {
  defaultTab?: TabType;
}

export function ArtisanPortfolioLayout({
  defaultTab = "home",
}: ArtisanPortfolioLayoutProps) {
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab);

  const syncTabUrl = useCallback((tab: TabType) => {
    if (typeof window === "undefined") return;
    const isArtisanStandalone = window.location.pathname === "/artisan";
    const baseRoot = isArtisanStandalone ? "/artisan" : "/";
    const nextPath =
      tab === "music"
        ? "/music"
        : tab === "resources"
        ? "/resources"
        : tab === "home"
        ? baseRoot
        : `${baseRoot}?tab=${tab}`;
    window.history.replaceState({}, "", nextPath);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryTab = params.get("tab") as TabType | null;
    if (queryTab && VALID_TABS.includes(queryTab)) {
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
      void preloadArtisanTab("music");
      void preloadArtisanTab("resources");
    }, 3800);
    return () => clearTimeout(timer);
  }, []);

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pendingTab, setPendingTab] = useState<TabType | null>(null);
  const [targetHash, setTargetHash] = useState<string | null>(null);
  const [activeSubTarget, setActiveSubTarget] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pendingSidebarActionRef = useRef<"lets-talk" | "naphbot" | null>(null);

  const handleCloseSidebar = useCallback(() => {
    if (activeTab === "home" && typeof window !== "undefined" && window.scrollY > 0) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
    setIsSidebarOpen(false);
  }, [activeTab]);

  const handleToggleSidebar = useCallback(() => {
    if (isSidebarOpen && activeTab === "home" && typeof window !== "undefined" && window.scrollY > 0) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
    setIsSidebarOpen((prev) => !prev);
  }, [isSidebarOpen, activeTab]);

  // Lock desktop Home to a single screen when sidebar is closed (Image 1 split);
  // unlock vertical scrolling when sidebar opens (compressed stacked Image 2 flow) or on mobile/sub-tabs.
  useEffect(() => {
    const updateScrollLock = () => {
      const isDesktop = window.innerWidth >= 1024;
      if (activeTab === "home" && !isSidebarOpen && isDesktop) {
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
  }, [activeTab, isSidebarOpen]);

  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const handleToggleTheme = useCallback(
    (event?: React.MouseEvent) => {
      setTheme(isDark ? "light" : "dark", event);
    },
    [isDark, setTheme]
  );

  const handleHoverTab = useCallback((tab: string) => {
    if (
      tab === "about" ||
      tab === "experience" ||
      tab === "projects" ||
      tab === "notes" ||
      tab === "music" ||
      tab === "resources"
    ) {
      void preloadArtisanTab(tab as TabType);
    }
  }, []);

  const handleSelectTab = useCallback(
    (newTab: string) => {
      const [tabStr, hashStr] = newTab.split("#");
      const tab = tabStr as TabType;
      const target = hashStr || null;
      setTargetHash(target);
      setActiveSubTarget(target);

      if (tab === activeTab) {
        if (target && typeof document !== "undefined") {
          const el = document.getElementById(target);
          if (el) {
            const rect = el.getBoundingClientRect();
            const isAlreadyAtTarget =
              rect.top >= -32 &&
              rect.top <= Math.min(220, window.innerHeight * 0.35);
            if (!isAlreadyAtTarget) {
              el.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }
        }
        return;
      }
      if (isTransitioning) return;

      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("artisan-tab-switch"));
      }

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
      syncTabUrl(pendingTab);
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [pendingTab, syncTabUrl]);

  const handleTransitionComplete = useCallback(() => {
    setIsTransitioning(false);
    setPendingTab(null);
    if (targetHash) {
      let attempts = 0;
      const maxAttempts = 15;
      const tryScroll = () => {
        const el = document.getElementById(targetHash);
        if (el) {
          requestAnimationFrame(() => {
            el.scrollIntoView({ behavior: "smooth" });
          });
          setTargetHash(null);
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(tryScroll, 60);
        }
      };
      setTimeout(tryScroll, 60);
    }
  }, [targetHash]);

  const dispatchSidebarAction = useCallback((action: "lets-talk" | "naphbot") => {
    window.dispatchEvent(
      new CustomEvent(
        action === "lets-talk" ? "artisan-open-lets-talk" : "artisan-toggle-naphbot-call"
      )
    );
  }, []);

  const handleTriggerLetsTalk = useCallback(() => {
    if (activeTab === "home" && !isTransitioning) {
      dispatchSidebarAction("lets-talk");
      return;
    }
    pendingSidebarActionRef.current = "lets-talk";
    handleSelectTab("home");
  }, [activeTab, isTransitioning, dispatchSidebarAction, handleSelectTab]);

  const handleTriggerNaphBot = useCallback(() => {
    if (activeTab === "home" && !isTransitioning) {
      dispatchSidebarAction("naphbot");
      return;
    }
    pendingSidebarActionRef.current = "naphbot";
    handleSelectTab("home");
  }, [activeTab, isTransitioning, dispatchSidebarAction, handleSelectTab]);

  useEffect(() => {
    if (activeTab === "home" && !isTransitioning && pendingSidebarActionRef.current) {
      const action = pendingSidebarActionRef.current;
      pendingSidebarActionRef.current = null;
      const timer = setTimeout(() => dispatchSidebarAction(action), 80);
      return () => clearTimeout(timer);
    }
  }, [activeTab, isTransitioning, dispatchSidebarAction]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isEditable =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable);

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "b") {
        if (isEditable) return;
        event.preventDefault();
        handleToggleSidebar();
        return;
      }

      if (
        event.key === "Escape" &&
        isSidebarOpen &&
        document.body.dataset.sideDrawerOpen !== "true" &&
        !document.querySelector('[role="dialog"][aria-modal="true"]')
      ) {
        event.preventDefault();
        handleCloseSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSidebarOpen, handleToggleSidebar, handleCloseSidebar]);

  const activeQuote = activeTab !== "home" ? ARTISAN_TAB_QUOTES[activeTab] : null;
  const isHomeLockedSplit = activeTab === "home" && !isSidebarOpen;
  const ResolvedAbout = RESOLVED_TABS.about || AboutSection;
  const ResolvedExperience = RESOLVED_TABS.experience || ExperienceSection;
  const ResolvedProjects = RESOLVED_TABS.projects || ProjectsSection;
  const ResolvedNotes = RESOLVED_TABS.notes || NotesSection;
  const ResolvedMusic = RESOLVED_TABS.music || MusicSection;
  const ResolvedResources = RESOLVED_TABS.resources || ResourcesSection;

  return (
    <MotionConfig reducedMotion="user">
    <div
      className={`artisan-mode w-full bg-background text-foreground selection:bg-foreground selection:text-background relative overflow-x-hidden font-sans ${
        isHomeLockedSplit
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

      {/* 1.5 Collapsible Floating Workspace Sidebar */}
      <WorkspaceSidebar
        isOpen={isSidebarOpen}
        activeTab={activeTab}
        activeSubTarget={activeSubTarget}
        onClose={handleCloseSidebar}
        onSelectTab={handleSelectTab}
        onTriggerLetsTalk={handleTriggerLetsTalk}
        onTriggerNaphBot={handleTriggerNaphBot}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
      />

      {/* 2. Main Tab View Dispatcher */}
      <div
        className={`w-full relative transition-[padding] duration-[340ms] ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none ${
          isSidebarOpen ? "xl:pl-[276px]" : ""
        } ${
          isHomeLockedSplit
            ? "min-h-dvh lg:h-dvh lg:max-h-dvh lg:overflow-hidden p-0 m-0"
            : activeTab === "home"
            ? "min-h-screen flex flex-col justify-between pb-16 sm:pb-20"
            : "min-h-screen flex flex-col justify-between pb-24 sm:pb-28"
        }`}
      >
        <div
          className={
            activeTab === "home"
              ? isHomeLockedSplit
                ? "block w-full h-full"
                : "block w-full"
              : "hidden"
          }
        >
          <HeroSection
            isDark={isDark}
            activeTab={activeTab}
            isHomeActive={activeTab === "home"}
            onNavigate={(tab) => handleSelectTab(tab)}
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={handleToggleSidebar}
          />
        </div>
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
        {activeTab === "music" && <ResolvedMusic />}
        {activeTab === "resources" && <ResolvedResources />}

        {activeQuote && (
          <footer
            aria-label="Page closing quote"
            className="w-full max-w-2xl mx-auto px-6 pt-8 sm:pt-10 pb-8 sm:pb-0 mt-6 sm:mt-8 border-t border-black/10 dark:border-white/10 flex flex-col items-center text-center"
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
        hidden={isSidebarOpen}
      />

      {/* 4. Architectural Shutter Screen Transition */}
      <PageTransitionSpiral
        isTransitioning={isTransitioning}
        targetTab={pendingTab || activeTab}
        onMidpoint={handleTransitionMidpoint}
        onComplete={handleTransitionComplete}
      />
    </div>
    </MotionConfig>
  );
}

export default ArtisanPortfolioLayout;
