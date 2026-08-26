"use client";

import React from "react";
import { ProjectStatus, projectStatusConfig } from "@/lib/data";

interface ProjectStatusBadgeProps {
  status?: ProjectStatus;
  size?: "sm" | "md";
  className?: string;
}

export function ProjectStatusBadge({
  status,
  size = "md",
  className = "",
}: ProjectStatusBadgeProps) {
  if (!status || !projectStatusConfig[status]) return null;

  const config = projectStatusConfig[status];
  const isSm = size === "sm";

  return (
    <div
      role="status"
      aria-label={`Project Status: ${config.label}`}
      className={`inline-flex items-center gap-1.5 rounded-full border font-mono font-medium leading-none select-none tracking-wide ${
        config.badgeClass
      } ${
        isSm ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]"
      } ${className}`}
    >
      <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
        <span
          className={`relative inline-flex rounded-full h-1.5 w-1.5 ${config.dotClass} ${
            status === "live" ? "animate-status-breathe" : ""
          }`}
        />
      </span>
      <span>{config.label}</span>
    </div>
  );
}

export default ProjectStatusBadge;
