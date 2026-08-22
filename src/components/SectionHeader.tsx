"use client";

import React, { ReactNode } from "react";
import Link from "next/link";

interface SectionHeaderProps {
  label: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
  actionComponent?: ReactNode;
  className?: string;
}

export function SectionHeader({
  label,
  description,
  actionHref,
  actionLabel,
  actionComponent,
  className = "mb-4",
}: SectionHeaderProps) {
  // Ensure uppercase syntax tag format (e.g. <SELECTED-PROJECTS/>)
  const cleanLabel = label.replace(/[</>]/g, "").toUpperCase();
  const formattedTag = `<${cleanLabel}/>`;

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-4 ${className}`}
    >
      <div className="space-y-1 min-w-0">
        <h2 className="font-caps text-xs text-muted-foreground uppercase tracking-wider font-mono font-semibold">
          {formattedTag}
        </h2>
        {description && (
          <p className="font-sans text-xs text-muted-foreground/80 leading-relaxed max-w-xl">
            {description}
          </p>
        )}
      </div>

      {(actionComponent || (actionHref && actionLabel)) && (
        <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-auto">
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
        </div>
      )}
    </div>
  );
}

export default SectionHeader;
