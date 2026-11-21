"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import { techSections } from "@/lib/data";
import { SectionHeader } from "./SectionHeader";
import { useUISound } from "@/context/SoundContext";
import circuitStyles from "./CircuitPlatform.module.css";
import { TechIconTile } from "./TechIconTile";
import {
  sectionContainerVariants,
  staggeredGridVariants,
  gridItemVariants,
} from "@/lib/motion";
import { CreativeSceneReveal, useCreativeMode } from "@/features/creative-mode";

const CircuitPlatform = dynamic(
  () => import("./CircuitPlatform").then((m) => m.CircuitPlatform),
  {
    ssr: false,
    loading: () => <div className="w-full aspect-[1024/334]" aria-hidden="true" />,
  },
);

// Map section titles to code-syntax category tags
const categorySyntaxMap: Record<string, string> = {
  Frontend: "<frontend/>",
  Backend: "<backend/>",
  "Databases & Cloud": "<database-cloud/>",
};

// Home page shows the core primary stack (Frontend, Backend, Databases & Cloud)
const featuredCategoryTitles = ["Frontend", "Backend", "Databases & Cloud"];

// Visual pairings only; navigation and the technology catalog stay authoritative.
const circuitPairings = [
  ["React", "TypeScript", "Next.js", "Tailwind CSS"],
  ["HTML5", "CSS3", "JavaScript"],
  ["Vue.js", "TypeScript", "Tailwind CSS"],
  ["Flutter", "Dart", "Firebase"],
  ["Node.js", "Express.js", "TypeScript", "MongoDB"],
  ["PHP", "Laravel", "MySQL"],
  ["Python", "FastAPI", "PostgreSQL"],
  ["Supabase", "PostgreSQL", "React"],
  ["Prisma", "PostgreSQL", "TypeScript"],
];
type CircuitSelection = { category: string; tech?: string };

export function TechStack() {
  const { playHover, playClick } = useUISound();
  const shouldReduceMotion = useReducedMotion();
  const { active: creativeActive, effectiveMotion } = useCreativeMode();
  const [hovered, setHovered] = useState<CircuitSelection | null>(null);
  const [focused, setFocused] = useState<CircuitSelection | null>(null);
  const selection = hovered ?? focused;
  const related = new Set(selection?.tech
    ? [selection.tech, ...circuitPairings.filter(pair => pair.includes(selection.tech!)).flat()]
    : []);
  const connected = (category: string, tech: string) => !!selection &&
    (selection.tech ? related.has(tech) : selection.category === category);

  const displayedSections = techSections.filter((sec) =>
    featuredCategoryTitles.includes(sec.title),
  );

  return (
    <motion.section
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView={shouldReduceMotion ? undefined : "visible"}
      viewport={{ once: true, amount: 0.15 }}
      variants={shouldReduceMotion ? undefined : sectionContainerVariants}
      className={`w-full space-y-3 select-none mb-0 ${creativeActive ? "pb-0" : "pb-3 sm:pb-4"}`}
      aria-label="Tech Stack"
    >
      {/* Consistent Section Header */}
      <SectionHeader
        label="TECH-STACK"
        description="Technologies, frameworks, and development tools I work with."
        actionHref="/experience#tech-stack"
        actionLabel="all technologies"
        className="mb-2 pb-2 border-b border-border-hairline/40"
      />

      {/* Core Categories with Minimal Side Tags and Orthogonal CAD Tech Chips */}
      <motion.div
        variants={shouldReduceMotion ? undefined : staggeredGridVariants}
        className={`space-y-4 ${circuitStyles.environment}`}
        data-creative-circuit={creativeActive ? "on" : "off"}
      >
        {displayedSections.map((section, catIdx) => {
          const syntaxTag =
            categorySyntaxMap[section.title] ||
            `<${section.title.toLowerCase().replace(/[^a-z0-9]/g, "-")}/>`;
          const isCategoryConnected = section.items.some((tech) =>
            connected(section.title, tech),
          );

          return (
            <motion.div
              key={section.title}
              variants={shouldReduceMotion ? undefined : gridItemVariants}
              className={`grid grid-cols-1 md:grid-cols-[148px_minmax(0,1fr)] gap-2 md:gap-4 items-start ${circuitStyles.category}`}
              data-branch={catIdx}
              data-connected={isCategoryConnected}
              data-last-category={catIdx === displayedSections.length - 1 ? "true" : undefined}
              onPointerEnter={() => setHovered({ category: section.title })}
              onPointerLeave={() => setHovered(null)}
            >
              {/* Minimal Side Rail Node & Code Tag */}
              <div className="flex items-center gap-2 md:h-8">
                <span
                  aria-hidden="true"
                  className={`w-1.5 h-1.5 rounded-[1.5px] flex-shrink-0 ${circuitStyles.branchDot}`}
                />
                <h3
                  className={`text-xs lowercase transition-colors duration-150 ${
                    isCategoryConnected ? "text-ink" : "text-ink/70"
                  }`}
                >
                  <code className="font-mono whitespace-nowrap">{syntaxTag}</code>
                </h3>
              </div>

              {/* Orthogonal Hairline Tech Chips */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  {section.items.map((tech) => (
                    <TechIconTile
                      key={tech}
                      name={tech}
                      href={`/experience?tech=${encodeURIComponent(tech.toLowerCase())}#tech-stack`}
                      dataConnected={connected(section.title, tech)}
                      dataMuted={!!selection && !connected(section.title, tech)}
                      onMouseEnter={playHover}
                      onPointerEnter={() => setHovered({ category: section.title, tech })}
                      onPointerLeave={() => setHovered({ category: section.title })}
                      onFocus={() => setFocused({ category: section.title, tech })}
                      onBlur={() => setFocused(null)}
                      onClick={playClick}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
        <CreativeSceneReveal className="!mt-0">
          <CircuitPlatform
            activeBranches={displayedSections.map(section => section.items.some(tech => connected(section.title, tech)))}
            paused={effectiveMotion === "off"}
          />
        </CreativeSceneReveal>
      </motion.div>
    </motion.section>
  );
}

export default TechStack;
