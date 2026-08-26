"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  sectionLabelVariants,
  sectionLineVariants,
  contentBlockVariants,
} from "@/lib/motion";

interface SectionHeaderProps {
  label: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
  actionComponent?: ReactNode;
  className?: string;
  hasDivider?: boolean;
}

export function SectionHeader({
  label,
  description,
  actionHref,
  actionLabel,
  actionComponent,
  className = "mb-4",
  hasDivider,
}: SectionHeaderProps) {
  const shouldReduceMotion = useReducedMotion();

  // Ensure uppercase syntax tag format (e.g. <SELECTED-PROJECTS/>)
  const cleanLabel = label.replace(/[</>]/g, "").toUpperCase();
  const formattedTag = `<${cleanLabel}/>`;

  // Determine if this section header has a divider rule
  const showDivider =
    hasDivider ?? (className.includes("border-b") || className.includes("border-border-hairline"));

  // Strip border-b classes from the flex container so line animates separately
  const containerClass = className
    .replace(/border-b\s*border-border-hairline\/\d+/g, "")
    .replace(/border-b/g, "")
    .replace(/pb-2/g, "")
    .trim();

  return (
    <div className={`space-y-2 ${containerClass}`}>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-4">
        <div className="space-y-1 min-w-0">
          <motion.h2
            variants={shouldReduceMotion ? undefined : sectionLabelVariants}
            className="font-caps text-xs text-muted-foreground uppercase tracking-wider font-mono font-semibold"
          >
            {formattedTag}
          </motion.h2>

          {description && (
            <motion.p
              variants={shouldReduceMotion ? undefined : contentBlockVariants}
              className="font-sans text-xs text-muted-foreground/80 leading-relaxed max-w-xl"
            >
              {description}
            </motion.p>
          )}
        </div>

        {(actionComponent || (actionHref && actionLabel)) && (
          <motion.div
            variants={shouldReduceMotion ? undefined : contentBlockVariants}
            className="flex items-center gap-2 flex-shrink-0 self-start sm:self-auto"
          >
            {actionComponent ? (
              actionComponent
            ) : (
              <Link
                href={actionHref!}
                className="font-mono text-xs text-muted-foreground hover:text-ink flex items-center gap-1 transition-colors duration-200 group"
              >
                <span>{actionLabel}</span>
                <span className="text-muted-foreground/60 group-hover:text-ink transition-transform group-hover:translate-x-0.5">
                  -&gt;
                </span>
              </Link>
            )}
          </motion.div>
        )}
      </div>

      {/* Horizontally drawing hairline divider */}
      {showDivider && (
        <motion.div
          variants={shouldReduceMotion ? undefined : sectionLineVariants}
          className="h-[1px] w-full bg-border-hairline/40 origin-left"
        />
      )}
    </div>
  );
}

export default SectionHeader;
