"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LuArrowUpRight, LuChevronDown, LuPlus } from "react-icons/lu";
import { RESOURCE_CATEGORIES } from "@/features/resources-drawer/data/resources";

const groupNames: Record<string, string> = {
  agents: "Coding helpers",
  skills: "Skills & guides",
  "rules-workflow": "How I work",
  "platform-tooling": "Tools & platforms",
};

function ResourceReveal({ open, id, labelledBy, children }: {
  open: boolean;
  id: string;
  labelledBy: string;
  children: ReactNode;
}) {
  const reduced = useReducedMotion();
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          id={id}
          aria-labelledby={labelledBy}
          role="region"
          initial={{ height: reduced ? "auto" : 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: reduced ? "auto" : 0, opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="overflow-hidden"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ArtisanResources() {
  const [openGroup, setOpenGroup] = useState<string | null>("agents");
  const [openResource, setOpenResource] = useState<string | null>(null);

  return (
    <section id="about-resources" aria-label="Useful tools and links" className="space-y-4 scroll-mt-20">
      <div className="space-y-1 border-b border-black/10 dark:border-white/10 pb-3">
        <h3 className="font-mono text-xl font-semibold tracking-wider text-foreground">Useful tools &amp; links</h3>
        <p className="font-sans text-sm leading-relaxed text-foreground/80">Tools, guides, and ideas that help me build. Explore a group to find something useful.</p>
      </div>
      <div className="divide-y divide-black/10 dark:divide-white/10">
        {RESOURCE_CATEGORIES.map(category => {
          const expanded = openGroup === category.id;
          const groupId = `artisan-resource-group-${category.id}`;
          return (
            <div key={category.id} className="py-4">
              <h4>
                <button
                  type="button"
                  id={`${groupId}-button`}
                  aria-expanded={expanded}
                  aria-controls={groupId}
                  onClick={() => { setOpenGroup(expanded ? null : category.id); setOpenResource(null); }}
                  className="w-full flex items-center justify-between gap-4 text-left font-mono text-base font-semibold text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
                >
                  <span>{groupNames[category.id] || category.title}</span>
                  <span className="flex items-center gap-2 font-sans text-xs font-normal text-muted-foreground">
                    {category.items.length} resources
                    <LuPlus className={`transition-transform duration-200 motion-reduce:transition-none ${expanded ? "rotate-45" : ""}`} aria-hidden="true" />
                  </span>
                </button>
              </h4>
              <ResourceReveal open={expanded} id={groupId} labelledBy={`${groupId}-button`}>
                <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 items-start gap-x-6 gap-y-4">
                  {category.items.map(item => {
                    const itemOpen = expanded && openResource === item.id;
                    const itemId = `artisan-resource-${item.id}`;
                    return (
                      <div key={item.id} className="rounded-xl border border-black/6 dark:border-white/10 p-4 space-y-2">
                        {item.url ? <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-foreground hover:underline underline-offset-4">{item.name}<LuArrowUpRight aria-hidden="true" /></a> : <h5 className="font-sans text-sm font-semibold text-foreground">{item.name}</h5>}
                        <p className="font-sans text-xs leading-relaxed text-muted-foreground">{item.role}</p>
                        <div className="pt-1">
                          <button type="button" id={`${itemId}-button`} aria-label={`About ${item.name}`} aria-expanded={itemOpen} aria-controls={itemId} onClick={() => setOpenResource(itemOpen ? null : item.id)} className="inline-flex items-center gap-1.5 font-sans text-xs text-foreground/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
                            <LuChevronDown className={`transition-transform duration-200 motion-reduce:transition-none ${itemOpen ? "rotate-180" : ""}`} aria-hidden="true" />About this resource
                          </button>
                          <ResourceReveal open={itemOpen} id={itemId} labelledBy={`${itemId}-button`}>
                            <p className="pt-2 font-sans text-xs leading-relaxed text-muted-foreground">{item.description}</p>
                            {item.subItems && <ul className="mt-2 space-y-1 pl-4 list-disc font-sans text-xs leading-relaxed text-muted-foreground">{item.subItems.map((sub, index) => <li key={index}>{typeof sub === "string" ? sub : <>{sub.name}{sub.detail && ` — ${sub.detail}`}</>}</li>)}</ul>}
                          </ResourceReveal>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ResourceReveal>
            </div>
          );
        })}
      </div>
    </section>
  );
}
