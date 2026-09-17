"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Target, Layers, Workflow } from "lucide-react";
import { profileInfo } from "@/lib/data";
import { SnappedFragment } from "./SnappedFragment";
import {
  staggeredGridVariants,
  gridItemVariants,
} from "@/lib/motion";

export function ProfileInfoBlock() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className="w-full select-none my-4 sm:my-5"
      aria-label="Profile Highlights"
    >
      {/* Architectural Cohesive Matrix: Editorial Focus, Structured Capabilities, Concise Principles */}
      <motion.div
        initial={shouldReduceMotion ? false : "hidden"}
        whileInView={shouldReduceMotion ? undefined : "visible"}
        viewport={{ once: true, amount: 0.15 }}
        variants={shouldReduceMotion ? undefined : staggeredGridVariants}
        className="grid grid-cols-1 md:grid-cols-3 rounded-lg bg-surface/20 border border-border-hairline divide-y md:divide-y-0 md:divide-x divide-border-hairline/60 overflow-hidden"
      >
        {/* Column 1 — Current Focus: Editorial & Textual Statement */}
        <motion.div
          variants={shouldReduceMotion ? undefined : gridItemVariants}
          className="p-4 sm:p-4.5 flex flex-col justify-between space-y-3 group hover:bg-surface/30 transition-colors"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Target
                className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 flex-shrink-0"
                aria-hidden="true"
              />
              <span className="font-mono text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                &lt;CURRENT-FOCUS/&gt;
              </span>
            </div>
            <p className="font-sans text-xs sm:text-[13px] text-muted-foreground leading-relaxed">
              Building accessible<SnappedFragment id="focus-qualifiers">{", performant, and polished"}</SnappedFragment> digital experiences while strengthening <SnappedFragment id="focus-realworld">{"real-world "}</SnappedFragment>full-stack skills.
            </p>
          </div>

          <div className="pt-2 border-t border-border-hairline/40">
            <span className="font-mono text-[10px] sm:text-[11px] text-muted-foreground/80 dark:text-emerald-400/90 select-text leading-tight block">
              &gt; learn · build<SnappedFragment id="terminal-iterate">{" · iterate"}</SnappedFragment> · ship
            </span>
          </div>
        </motion.div>

        {/* Column 2 — What I Build: Scannable Capability Matrix */}
        <motion.div
          variants={shouldReduceMotion ? undefined : gridItemVariants}
          className="p-4 sm:p-4.5 flex flex-col justify-between space-y-3 group hover:bg-surface/30 transition-colors"
        >
          <div className="space-y-2.5">
            <div className="flex items-center gap-1.5">
              <Layers
                className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 flex-shrink-0"
                aria-hidden="true"
              />
              <span className="font-mono text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                &lt;WHAT-I-BUILD/&gt;
              </span>
            </div>

            {/* High-signal capability list */}
            <ul className="space-y-1.5 pt-0.5">
              <li className="flex items-start gap-1.5 text-xs text-muted-foreground leading-snug">
                <span className="font-mono text-emerald-500/80 dark:text-emerald-400/80 text-[11px] select-none mt-0.5" aria-hidden="true">›</span>
                <span>
                  <SnappedFragment id="build-fullstack">{"Full-Stack "}</SnappedFragment>Web Apps &amp; <SnappedFragment id="build-responsive">{"Responsive "}</SnappedFragment>Interfaces
                </span>
              </li>
              <li className="flex items-start gap-1.5 text-xs text-muted-foreground leading-snug">
                <span className="font-mono text-emerald-500/80 dark:text-emerald-400/80 text-[11px] select-none mt-0.5" aria-hidden="true">›</span>
                <span>
                  Dashboards<SnappedFragment id="build-portals">{" & Portals"}</SnappedFragment>, APIs<SnappedFragment id="build-integrations">{" & Integrations"}</SnappedFragment>
                </span>
              </li>
              <li className="flex items-start gap-1.5 text-xs text-muted-foreground leading-snug">
                <span className="font-mono text-emerald-500/80 dark:text-emerald-400/80 text-[11px] select-none mt-0.5" aria-hidden="true">›</span>
                <span>
                  UI Systems<SnappedFragment id="build-tooling">{" & Tooling"}</SnappedFragment>, <SnappedFragment id="build-db">{"Database "}</SnappedFragment>Tools
                </span>
              </li>
            </ul>
          </div>

          <div className="pt-2 border-t border-border-hairline/40">
            <span className="font-mono text-[10px] sm:text-[11px] text-muted-foreground/60 leading-tight block">
              practical software &amp; tools
            </span>
          </div>
        </motion.div>

        {/* Column 3 — How I Work: Concise Engineering Principles */}
        <motion.div
          variants={shouldReduceMotion ? undefined : gridItemVariants}
          className="p-4 sm:p-4.5 flex flex-col justify-between space-y-3 group hover:bg-surface/30 transition-colors"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Workflow
                className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 flex-shrink-0"
                aria-hidden="true"
              />
              <span className="font-mono text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                &lt;HOW-I-WORK/&gt;
              </span>
            </div>

            <ul className="space-y-1.5 pt-0.5">
              {profileInfo.howIWork.principles.map((principle) => (
                <li
                  key={principle}
                  className="flex items-start gap-1.5 text-xs text-muted-foreground leading-snug"
                >
                  <span
                    className="font-mono text-emerald-500/80 dark:text-emerald-400/80 text-[11px] select-none mt-0.5"
                    aria-hidden="true"
                  >
                    ›
                  </span>
                  <span>
                    {principle === "Clean architecture & modularity" ? (
                      <>
                        Clean architecture
                        <SnappedFragment id="how-modularity">
                          {" & modularity"}
                        </SnappedFragment>
                      </>
                    ) : principle === "Thoughtful, accessible interfaces" ? (
                      <>
                        Thoughtful
                        <SnappedFragment id="how-accessible">
                          {", accessible"}
                        </SnappedFragment>
                        {" interfaces"}
                      </>
                    ) : principle === "Fast iteration & continuous learning" ? (
                      <>
                        Fast iteration
                        <SnappedFragment id="how-continuous">
                          {" & continuous learning"}
                        </SnappedFragment>
                      </>
                    ) : (
                      principle
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-2 border-t border-border-hairline/40">
            <span className="font-mono text-[10px] sm:text-[11px] text-muted-foreground/60 leading-tight block">
              craft · performance · accessibility
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default ProfileInfoBlock;

