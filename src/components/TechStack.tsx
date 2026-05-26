import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { techSections } from "@/lib/data";

export function TechStack() {
  return (
    <div className="gsap-tech-section bento-card p-4 col-span-1 md:col-span-4 space-y-2 group">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-text-primary dark:text-dark-text-primary">
          Tech Stack
        </h2>
        <Link
          href="/tech-stack"
          className="text-xs text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary flex items-center gap-1 transition-colors cursor-pointer group"
        >
          <span>View All</span>
          <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Stack Items */}
      <div className="space-y-4 pt-2">
        {techSections.map((section) => (
          <div key={section.title}>
            <h3 className="text-sm font-semibold mb-2 text-text-primary dark:text-dark-text-primary">
              {section.title}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {section.items.map((item) => (
                <span
                  key={item}
                  className="gsap-tech-tag px-2.5 py-1 text-xs rounded-md bg-text-primary/5 dark:bg-dark-text-primary/5 text-text-secondary dark:text-dark-text-secondary shadow-[0_1px_1px_rgba(0,0,0,0.02)] border border-border-default/50 dark:border-dark-border/50 select-none hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default TechStack;
