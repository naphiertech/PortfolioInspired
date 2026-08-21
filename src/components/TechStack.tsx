import React from "react";
import Link from "next/link";
import { techSections } from "@/lib/data";
import { TechIcon } from "./TechIcon";

// Map section titles to code-syntax category tags
const categorySyntaxMap: Record<string, string> = {
  Frontend: "<frontend/>",
  Backend: "<backend/>",
  "Databases & Cloud": "<database-cloud/>",
};

// Home page shows the core primary stack (Frontend, Backend, Databases & Cloud)
const featuredCategoryTitles = ["Frontend", "Backend", "Databases & Cloud"];

export function TechStack() {
  const displayedSections = techSections.filter((sec) =>
    featuredCategoryTitles.includes(sec.title),
  );

  return (
    <section className="w-full space-y-5 select-none mb-14">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="font-caps text-xs text-muted-foreground uppercase tracking-wider font-mono font-semibold">
            &lt;tech-stack/&gt;
          </span>
        </div>

        <Link
          href="/tech-stack"
          className="font-mono text-xs text-muted-foreground hover:text-ink flex items-center gap-1 transition-colors duration-200 group"
        >
          <span>all technologies</span>
          <span className="text-muted-foreground/60 group-hover:text-ink transition-transform group-hover:translate-x-0.5">
            -&gt;
          </span>
        </Link>
      </div>

      {/* Core Categories with Code-Syntax Headings and Vector-Icon Pills */}
      <div className="space-y-5">
        {displayedSections.map((section) => {
          const syntaxTag =
            categorySyntaxMap[section.title] ||
            `<${section.title.toLowerCase().replace(/\s+/g, "-")}/>`;

          return (
            <div key={section.title} className="space-y-2.5">
              <div className="font-mono text-xs text-muted-foreground font-medium tracking-tight">
                {syntaxTag}
              </div>

              <div className="flex flex-wrap gap-2">
                {section.items.map((item) => (
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
    </section>
  );
}

export default TechStack;
