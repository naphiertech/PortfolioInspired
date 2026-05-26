"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { projects } from "@/lib/data";
import { gsap } from "gsap";

export function RecentProjects() {
  const onCardEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    gsap.to(e.currentTarget, { y: -2, duration: 0.2, ease: "power2.out" });
  };

  const onCardLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    gsap.to(e.currentTarget, { y: 0, duration: 0.2, ease: "power2.out" });
  };

  return (
    <div className="gsap-projects-section bento-card p-4 col-span-1 md:col-span-4 space-y-2 group">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-text-primary dark:text-dark-text-primary">
          Recent Projects
        </h2>
        <Link
          href="/projects"
          className="text-xs text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary flex items-center gap-1 transition-colors cursor-pointer group"
        >
          <span>View All</span>
          <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
        {projects.map((project) => (
          <a
            key={project.name}
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={onCardEnter}
            onMouseLeave={onCardLeave}
            className="gsap-project-card bento-card p-3 space-y-1 block hover:border-gray-400 dark:hover:border-neutral-700 hover:shadow-sm cursor-pointer group/project"
          >
            <h3 className="text-sm font-semibold text-text-primary dark:text-dark-text-primary group-hover/project:text-blue-600 dark:group-hover/project:text-blue-400 transition-colors">
              {project.name}
            </h3>
            <p className="text-xs text-text-secondary dark:text-dark-text-secondary leading-snug">
              {project.description}
            </p>
            <span className="text-[11px] text-text-muted dark:text-dark-text-muted font-mono bg-gray-100 dark:bg-zinc-900 px-2 py-0.5 rounded-md inline-block mt-1.5 border border-border-default/50 dark:border-dark-border/50">
              {project.url}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
export default RecentProjects;
