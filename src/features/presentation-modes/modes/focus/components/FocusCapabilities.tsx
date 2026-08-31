import React from "react";
import { Layers, Database, LayoutTemplate } from "lucide-react";

interface CapabilityPillar {
  id: string;
  domain: string;
  icon: React.ComponentType<{ className?: string }>;
  items: string[];
}

const capabilityPillars: CapabilityPillar[] = [
  {
    id: "01",
    domain: "Full-Stack Web Apps",
    icon: Layers,
    items: [
      "Next.js 15, React 19, and TypeScript for fast, modern web applications",
      "Clear state management, document workflows, and offline synchronization",
      "Full type safety across UI components, server routes, and APIs",
    ],
  },
  {
    id: "02",
    domain: "Backend & Databases",
    icon: Database,
    items: [
      "PostgreSQL and Supabase with clean relational schema modeling",
      "Row-Level Security (RLS) policies and secure data access rules",
      "Offline-first browser storage using IndexedDB and Dexie.js",
    ],
  },
  {
    id: "03",
    domain: "UI & Performance",
    icon: LayoutTemplate,
    items: [
      "Component systems built with clean design tokens and Tailwind CSS",
      "Responsive layouts with support for both light and dark themes",
      "Fast load times, smooth micro-interactions, and accessible interfaces",
    ],
  },
];

export function FocusCapabilities() {
  return (
    <section aria-label="Core skills overview" className="w-full">
      {/* Section Index */}
      <div className="flex items-center justify-between gap-2 font-mono text-xs text-muted-foreground/70 select-none mb-3.5">
        <span className="tracking-wider text-muted-foreground/80 font-medium">
          [ 01 // SKILLS ]
        </span>
        <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-muted-foreground/50">
          CORE AREAS
        </span>
      </div>

      {/* 3-Column Structural Grid on Desktop / Vertical Stack on Tablet & Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border-divider">
        {capabilityPillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.id}
              className="py-5 md:py-4 px-0 md:px-5 first:md:pl-0 last:md:pr-0 flex flex-col justify-between min-w-0"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground/60">
                    {pillar.id}.
                  </span>
                  <div className="flex items-center gap-2 font-sans font-bold text-sm sm:text-[15px] text-ink">
                    <Icon className="w-4 h-4 text-brand flex-shrink-0" aria-hidden="true" />
                    <span className="truncate">{pillar.domain}</span>
                  </div>
                </div>

                <ul className="mt-3 space-y-2">
                  {pillar.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-xs sm:text-[13px] text-ink/80 font-sans leading-relaxed flex items-start gap-2"
                    >
                      <span className="text-muted-foreground/40 font-mono text-xs select-none mt-0.5 flex-shrink-0">
                        -
                      </span>
                      <span className="min-w-0">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default FocusCapabilities;
