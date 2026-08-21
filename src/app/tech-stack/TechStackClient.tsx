"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { techSections } from "@/lib/data";
import { TechIcon } from "@/components/TechIcon";

const categorySyntaxMap: Record<string, string> = {
  Frontend: "<frontend/>",
  Backend: "<backend/>",
  "Databases & Cloud": "<database-cloud/>",
  "AI & Machine Learning": "<ai-ml/>",
  "Animation & Design": "<design-animation/>",
  "DevOps & Tools": "<devops-tools/>",
};

export function TechStackClient() {
  const totalSkills = techSections.reduce((acc, cat) => acc + cat.items.length, 0);

  return (
    <div className="w-full select-none">
      {/* Page Header */}
      <div className="mb-10 space-y-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-ink transition-colors duration-150 mb-2 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>cd .. / home</span>
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
              Tech Stack
            </h1>
            <p className="font-mono text-xs text-muted-foreground mt-1">
              {"// Languages, frameworks, databases, and development toolchains"}
            </p>
          </div>
          <span className="font-mono text-xs text-muted-foreground bg-muted-subtle px-2.5 py-1 rounded border border-border-hairline">
            {totalSkills} skills
          </span>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="space-y-6">
        {techSections.map((category) => {
          const syntaxTag =
            categorySyntaxMap[category.title] ||
            `<${category.title.toLowerCase().replace(/[\s&]+/g, "-")}/>`;

          return (
            <div
              key={category.title}
              className="p-5 rounded-lg bg-surface/30 border border-border-hairline space-y-3.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-muted-foreground font-semibold tracking-tight">
                  {syntaxTag}
                </span>
                <span className="font-mono text-[11px] text-muted-foreground/60">
                  {category.items.length} items
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {category.items.map((item) => (
                  <span key={item} className="skill-pill">
                    <TechIcon name={item} className="w-3.5 h-3.5" />
                    <span>{item}</span>
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TechStackClient;
