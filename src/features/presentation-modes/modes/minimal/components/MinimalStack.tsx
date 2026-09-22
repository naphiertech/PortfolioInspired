"use client";

import React, { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { TechIcon } from "@/components/TechIcon";
import { techSections } from "@/lib/data";
import styles from "./MinimalStack.module.css";

const languages = new Set(["HTML5", "CSS3", "JavaScript", "TypeScript", "Dart", "PHP", "Python"]);
const platforms = new Set(["Docker", "Jenkins", "GitHub Actions", "Vercel"]);
const catalog = new Set(techSections.flatMap(group => group.items));
const itemsIn = (title: string) => techSections.find(group => group.title === title)?.items ?? [];
const stackGroups = [
  { title: "Languages", items: [...catalog].filter(name => languages.has(name)) },
  { title: "Frontend", items: [...itemsIn("Frontend").filter(name => !languages.has(name)), ...itemsIn("Animation & Design").filter(name => name !== "Figma")] },
  { title: "Backend & APIs", items: itemsIn("Backend").filter(name => !languages.has(name)) },
  { title: "Databases & Cloud", items: itemsIn("Databases & Cloud") },
  { title: "Platforms / Deployment", items: itemsIn("DevOps & Tools").filter(name => platforms.has(name)) },
  { title: "Developer Tools", items: [...itemsIn("DevOps & Tools").filter(name => !platforms.has(name)), ...itemsIn("Animation & Design").filter(name => name === "Figma")] },
  { title: "AI / Productivity", items: itemsIn("AI & Machine Learning") },
].filter(group => group.items.length > 0);

function TechPill({ name }: { name: string }) {
  if (!catalog.has(name)) return <>{name}</>;
  return (
    <span className={styles.pill}>
      <TechIcon name={name} className="w-3.5 h-3.5 flex-shrink-0 !text-current" />
      <span>{name}</span>
    </span>
  );
}

export function MinimalStack() {
  const [expanded, setExpanded] = useState(false);
  const reducedMotion = useReducedMotion();
  const sectionId = useId();

  return (
    <section className="space-y-4 pt-8 pb-10 border-b border-zinc-200/80 dark:border-white/[0.08]">
      <h2 id={sectionId + "-heading"} className="font-serif italic text-lg sm:text-xl text-zinc-800 dark:text-[#dedad0] font-normal">
        Tools I use? See below
      </h2>
      <p className={styles.intro}>
        I build web interfaces with <TechPill name="React" /> and <TechPill name="Next.js" />,
        style them with <TechPill name="Tailwind CSS" />, and work with <TechPill name="Supabase" /> and <TechPill name="PostgreSQL" /> for data.
      </p>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="stack-details"
            id={sectionId + "-details"}
            role="region"
            aria-labelledby={sectionId + "-heading"}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
            className={styles.reveal}
          >
            <div className={styles.details}>
              <p className={styles.helper}>Here’s more of what I use.</p>
              {stackGroups.map(group => (
                <div key={group.title} className={styles.category}>
                  <h3>{group.title}</h3>
                  <div className={styles.pills}>
                    {group.items.map(name => <TechPill key={name} name={name} />)}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        className={styles.toggle}
        aria-expanded={expanded}
        aria-controls={sectionId + "-details"}
        onClick={() => setExpanded(value => !value)}
      >
        {expanded ? "Show Less" : "Show All"}
      </button>
    </section>
  );
}

export default MinimalStack;
