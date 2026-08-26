"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { techSections } from "@/lib/data";
import { TechIcon } from "./TechIcon";
import { SectionHeader } from "./SectionHeader";
import { useUISound } from "@/context/SoundContext";
import {
  sectionContainerVariants,
  staggeredGridVariants,
  gridItemVariants,
  sectionLineVariants,
} from "@/lib/motion";

// Map section titles to code-syntax category tags
const categorySyntaxMap: Record<string, string> = {
  Frontend: "<frontend/>",
  Backend: "<backend/>",
  "Databases & Cloud": "<database-cloud/>",
};

// Home page shows the core primary stack (Frontend, Backend, Databases & Cloud)
const featuredCategoryTitles = ["Frontend", "Backend", "Databases & Cloud"];

export function TechStack() {
  const { playHover, playClick } = useUISound();
  const shouldReduceMotion = useReducedMotion();

  const displayedSections = techSections.filter((sec) =>
    featuredCategoryTitles.includes(sec.title),
  );

  return (
    <motion.section
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView={shouldReduceMotion ? undefined : "visible"}
      viewport={{ once: true, amount: 0.15 }}
      variants={shouldReduceMotion ? undefined : sectionContainerVariants}
      className="w-full space-y-5 select-none mb-16"
      aria-label="Tech Stack"
    >
      {/* Consistent Section Header */}
      <SectionHeader
        label="TECH-STACK"
        description="Technologies, frameworks, and development tools I work with."
        actionHref="/tech-stack"
        actionLabel="all technologies"
        className="mb-5 pb-2 border-b border-border-hairline/40"
      />

      {/* Core Categories with Code-Syntax Headings and Vector-Icon Pills */}
      <motion.div
        variants={shouldReduceMotion ? undefined : staggeredGridVariants}
        className="space-y-5"
      >
        {displayedSections.map((section) => {
          const syntaxTag =
            categorySyntaxMap[section.title] ||
            `<${section.title.toLowerCase().replace(/[^a-z0-9]/g, "-")}/>`;

          return (
            <motion.div
              key={section.title}
              variants={shouldReduceMotion ? undefined : gridItemVariants}
              className="space-y-2.5"
            >
              {/* Category Code Header with Drawing Rule */}
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground/80 lowercase">
                  {syntaxTag}
                </span>
                <motion.div
                  variants={shouldReduceMotion ? undefined : sectionLineVariants}
                  className="h-[1px] flex-1 bg-border-hairline/30 origin-left"
                />
              </div>

              {/* Vector Icon Tech Stack Pills */}
              <div className="flex flex-wrap gap-2">
                {section.items.map((tech) => (
                  <Link
                    key={tech}
                    href={`/tech-stack?tech=${encodeURIComponent(tech.toLowerCase())}`}
                    onMouseEnter={playHover}
                    onClick={playClick}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[4px] bg-surface/50 border border-border-hairline hover:border-border-hairline hover:bg-surface text-ink text-xs font-sans transition-colors cursor-pointer shadow-2xs group"
                    title={`View projects built with ${tech}`}
                  >
                    <TechIcon
                      name={tech}
                      className="w-3.5 h-3.5 text-muted-foreground group-hover:text-ink transition-colors flex-shrink-0"
                    />
                    <span>{tech}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.section>
  );
}

export default TechStack;
