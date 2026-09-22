"use client";

import React from "react";
import { ProjectStatus } from "@/lib/data";

export type StatusType =
  | ProjectStatus
  | "building"
  | "improving"
  | "experimenting"
  | "latest"
  | "latest-activity"
  | "current"
  | "available";

export interface StatusBadgeProps {
  status?: StatusType;
  label?: string;
  size?: "sm" | "md";
  className?: string;
  clickable?: boolean;
}

interface StatusItemConfig {
  defaultLabel: string;
  renderIndicator: () => React.ReactNode;
}

const statusDefinitions: Record<StatusType, StatusItemConfig> = {
  live: {
    defaultLabel: "LIVE",
    renderIndicator: () => (
      <span className="relative flex h-1.5 w-1.5 flex-shrink-0" aria-hidden="true">
        <span className="animate-status-breathe inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500 dark:bg-emerald-400" />
      </span>
    ),
  },
  beta: {
    defaultLabel: "BETA",
    renderIndicator: () => (
      <span
        className="font-mono text-amber-500 dark:text-amber-400 text-[11px] leading-none select-none flex-shrink-0"
        aria-hidden="true"
      >
        ◇
      </span>
    ),
  },
  building: {
    defaultLabel: "BUILDING",
    renderIndicator: () => (
      <span
        className="font-mono text-teal-500 dark:text-teal-400 text-[11px] leading-none select-none flex-shrink-0"
        aria-hidden="true"
      >
        ◌
      </span>
    ),
  },
  improving: {
    defaultLabel: "IMPROVING",
    renderIndicator: () => (
      <span
        className="font-mono text-teal-500 dark:text-teal-400 text-[11px] leading-none select-none flex-shrink-0"
        aria-hidden="true"
      >
        ◌
      </span>
    ),
  },
  experimenting: {
    defaultLabel: "EXPERIMENTING",
    renderIndicator: () => (
      <span
        className="font-mono text-purple-500 dark:text-purple-400 text-[11px] leading-none select-none flex-shrink-0"
        aria-hidden="true"
      >
        ◇
      </span>
    ),
  },
  wip: {
    defaultLabel: "WIP",
    renderIndicator: () => (
      <span
        className="font-mono text-amber-500 dark:text-amber-400 text-[11px] leading-none select-none flex-shrink-0"
        aria-hidden="true"
      >
        ◌
      </span>
    ),
  },
  latest: {
    defaultLabel: "LATEST ACTIVITY",
    renderIndicator: () => (
      <span
        className="font-mono text-sky-500 dark:text-sky-400 text-[11px] leading-none select-none flex-shrink-0"
        aria-hidden="true"
      >
        ↗
      </span>
    ),
  },
  "latest-activity": {
    defaultLabel: "LATEST ACTIVITY",
    renderIndicator: () => (
      <span
        className="font-mono text-sky-500 dark:text-sky-400 text-[11px] leading-none select-none flex-shrink-0"
        aria-hidden="true"
      >
        ↗
      </span>
    ),
  },
  current: {
    defaultLabel: "CURRENT",
    renderIndicator: () => (
      <span className="relative flex h-1.5 w-1.5 flex-shrink-0" aria-hidden="true">
        <span className="animate-status-breathe inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500 dark:bg-emerald-400" />
      </span>
    ),
  },
  active: {
    defaultLabel: "ACTIVE",
    renderIndicator: () => (
      <span className="relative flex h-1.5 w-1.5 flex-shrink-0" aria-hidden="true">
        <span className="inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500 dark:bg-emerald-400" />
      </span>
    ),
  },
  available: {
    defaultLabel: "AVAILABLE FOR WORK",
    renderIndicator: () => (
      <span className="relative flex h-1.5 w-1.5 flex-shrink-0" aria-hidden="true">
        <span className="animate-status-breathe inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500 dark:bg-emerald-400" />
      </span>
    ),
  },
  "school-project": {
    defaultLabel: "SCHOOL PROJECT",
    renderIndicator: () => (
      <span
        className="font-mono text-indigo-500 dark:text-indigo-400 text-[11px] leading-none select-none flex-shrink-0"
        aria-hidden="true"
      >
        ◈
      </span>
    ),
  },
  archived: {
    defaultLabel: "ARCHIVED",
    renderIndicator: () => (
      <span
        className="font-mono text-zinc-400 dark:text-zinc-500 text-[11px] leading-none select-none flex-shrink-0"
        aria-hidden="true"
      >
        ○
      </span>
    ),
  },
};

export function StatusBadge({
  status,
  label,
  size = "md",
  className = "",
  clickable = false,
}: StatusBadgeProps) {
  if (!status || !statusDefinitions[status]) return null;

  const def = statusDefinitions[status];
  const displayLabel = label || def.defaultLabel;
  const isSm = size === "sm";

  return (
    <div
      role="status"
      aria-label={`Status: ${displayLabel}`}
      className={`inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] dark:border-white/[0.10] bg-black/[0.02] dark:bg-white/[0.03] text-zinc-800 dark:text-zinc-200 font-mono font-medium leading-none select-none tracking-wider uppercase ${
        clickable
          ? "hover:border-black/20 dark:hover:border-white/20 transition-colors duration-150 cursor-pointer"
          : "cursor-default"
      } ${
        isSm ? "h-6 px-2.5 text-[11px]" : "h-7 px-3 text-xs"
      } ${className}`}
    >
      {def.renderIndicator()}
      <span className="truncate">{displayLabel}</span>
    </div>
  );
}

export const ProjectStatusBadge = StatusBadge;
export default StatusBadge;

