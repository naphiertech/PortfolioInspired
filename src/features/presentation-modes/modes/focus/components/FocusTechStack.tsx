import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TechIcon } from "@/components/TechIcon";

interface TechGroup {
  domain: string;
  items: string[];
}

const techGroups: TechGroup[] = [
  {
    domain: "Frontend & UI",
    items: ["TypeScript", "JavaScript", "React", "Next.js", "Tailwind CSS", "Vue.js", "Flutter"],
  },
  {
    domain: "Backend & APIs",
    items: ["Node.js", "Express.js", "Python", "FastAPI", "PHP", "Laravel", "Prisma"],
  },
  {
    domain: "Databases & Storage",
    items: ["PostgreSQL", "Supabase", "MySQL", "MongoDB", "Firebase"],
  },
  {
    domain: "DevOps & Tools",
    items: ["Docker", "Git", "GitHub Actions", "Vercel", "Gemini", "Claude", "VS Code"],
  },
];

export function FocusTechStack() {
  return (
    <section aria-label="Technologies used" className="w-full">
      {/* Section Index */}
      <div className="flex items-center justify-between gap-2 font-mono text-xs text-muted-foreground/70 select-none mb-3.5">
        <span className="tracking-wider text-muted-foreground/80 font-medium">
          [ 03 // TECH STACK ]
        </span>
        <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-muted-foreground/50">
          CORE TECHNOLOGIES
        </span>
      </div>

      {/* Domain Rows: 180px Label + Left-Aligned Wrapped Badges */}
      <div className="divide-y divide-border-divider border-y border-border-divider">
        {techGroups.map((group) => (
          <div
            key={group.domain}
            className="py-3.5 sm:py-4 grid grid-cols-1 sm:grid-cols-[180px_minmax(0,1fr)] gap-2 sm:gap-5 items-start"
          >
            {/* Left Category Label */}
            <div className="min-w-0 pt-0.5">
              <span className="font-mono text-xs sm:text-[13px] font-semibold text-ink">
                {group.domain}
              </span>
            </div>

            {/* Right Technologies: Left-aligned and wrapped naturally */}
            <div className="min-w-0 flex flex-wrap items-center gap-1.5 sm:gap-2">
              {group.items.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface/50 border border-border-hairline text-xs font-mono text-ink/90 hover:border-border transition-colors select-none"
                >
                  <TechIcon name={tech} className="w-3.5 h-3.5 text-muted-foreground/80 flex-shrink-0" />
                  <span>{tech}</span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Catalog Link Footer */}
      <div className="mt-3.5 flex justify-end">
        <Link
          href="/tech-stack"
          className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-brand transition-colors"
        >
          <span>View all technologies</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

export default FocusTechStack;
