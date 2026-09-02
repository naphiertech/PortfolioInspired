"use client";

import React from "react";

/**
 * MinimalStack
 *
 * Concise, text-first summary of tools and technologies:
 * - Roman serif typography
 * - Clean editorial definition lines grouped by discipline
 * - No percentage bars, badge clouds, or icon grids
 */
export function MinimalStack() {
  // Key categories to showcase
  const selectedCategories = [
    {
      title: "Frontend",
      items: ["TypeScript", "React", "Next.js", "Tailwind CSS", "Vue.js", "Flutter"],
    },
    {
      title: "Backend",
      items: ["Node.js", "Express.js", "Python", "FastAPI", "PHP", "Laravel", "Prisma"],
    },
    {
      title: "Databases & Cloud",
      items: ["Supabase", "PostgreSQL", "MySQL", "MongoDB", "Firebase"],
    },
    {
      title: "Tools & AI",
      items: ["Git", "GitHub Actions", "Docker", "Postman", "Gemini", "Claude"],
    },
  ];

  return (
    <section className="space-y-4 pt-8 pb-10 border-b border-zinc-200/80 dark:border-white/[0.08]">
      <h2 className="font-serif italic text-lg sm:text-xl text-zinc-800 dark:text-[#dedad0] font-normal">
        What I Work With
      </h2>

      <div className="space-y-2.5 font-serif text-[15px] sm:text-[16px] text-zinc-700 dark:text-[#beb9ad] leading-relaxed">
        {selectedCategories.map((group) => (
          <p key={group.title}>
            <strong className="font-medium text-zinc-900 dark:text-[#eae6df]">{group.title}:</strong>{" "}
            {group.items.join(", ")}.
          </p>
        ))}
      </div>
    </section>
  );
}

export default MinimalStack;
