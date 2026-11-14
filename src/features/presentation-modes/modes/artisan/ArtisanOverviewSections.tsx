"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { LuArrowUpRight } from "./ArtisanIcons";
import { CertificationBadgeCard } from "./CertificationCard";
import {
  certifications,
  CertificationItem,
  fullProjects,
} from "@/lib/data";
import { fieldNotes } from "@/lib/fieldNotes";
import { EXPERIENCE_DATA, EDUCATION_DATA } from "./data";

export interface ArtisanSkillBadge {
  name: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
}

interface ArtisanOverviewSectionsProps {
  skills: ArtisanSkillBadge[];
  onTabLinkClick: (e: React.MouseEvent<HTMLAnchorElement>, tab: string) => void;
  onSelectCert: (cert: CertificationItem) => void;
}

const SECTION_HEADING_CLASS =
  "font-mono text-xl font-semibold tracking-wider text-foreground flex items-baseline gap-2.5";

const SECTION_INDEX_CLASS =
  "font-mono text-sm font-normal text-foreground/35 tabular-nums select-none";

const SECTION_LINK_CLASS =
  "font-sans inline-flex items-center gap-0.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:underline transition-colors shrink-0";

export function ArtisanOverviewSections({
  skills,
  onTabLinkClick,
  onSelectCert,
}: ArtisanOverviewSectionsProps) {
  const deckProjects = fullProjects.slice(0, 3);
  const [activeIdx, setActiveIdx] = useState(deckProjects.length >= 2 ? 1 : 0);

  const featuredNotes = fieldNotes.slice(0, 3);
  const featuredCerts = [
    certifications[0],
    certifications[2],
    certifications[3],
  ].filter((c): c is CertificationItem => Boolean(c));

  const handlePrevProject = () => {
    if (deckProjects.length === 0) return;
    setActiveIdx((prev) => (prev - 1 + deckProjects.length) % deckProjects.length);
  };

  const handleNextProject = () => {
    if (deckProjects.length === 0) return;
    setActiveIdx((prev) => (prev + 1) % deckProjects.length);
  };

  const getDeckSlot = (idx: number): -1 | 0 | 1 => {
    const total = deckProjects.length;
    if (total <= 1 || idx === activeIdx) return 0;
    const prevIdx = (activeIdx - 1 + total) % total;
    return idx === prevIdx ? -1 : 1;
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-12 pt-8 pb-8 pointer-events-auto">
      {/* 01 — Field Notes */}
      <section aria-labelledby="overview-notes-heading" className="space-y-4">
        <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-black/10 dark:border-white/10">
          <h2 id="overview-notes-heading" className={SECTION_HEADING_CLASS}>
            <span className={SECTION_INDEX_CLASS}>01</span>
            <span>Field Notes</span>
          </h2>
          <Link
            href="/notes"
            onClick={(e) => onTabLinkClick(e, "notes")}
            className={SECTION_LINK_CLASS}
          >
            All {fieldNotes.length} notes
            <LuArrowUpRight className="size-3" aria-hidden={true} />
          </Link>
        </div>

        <div className="divide-y divide-black/10 dark:divide-white/10">
          {featuredNotes.map((note) => (
            <Link
              key={note.slug}
              href={`/notes/${note.slug}`}
              className="group flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1.5 sm:gap-6 py-3.5 px-2 -mx-2 rounded-xl hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors"
            >
              <div className="min-w-0 space-y-1">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-base sm:text-lg font-normal text-foreground/35 group-hover:text-foreground transition-colors tabular-nums select-none shrink-0">
                    {note.number}
                  </span>
                  <h3 className="font-mono text-lg sm:text-xl font-semibold tracking-tight leading-snug text-foreground group-hover:underline decoration-foreground/40 underline-offset-4 truncate">
                    {note.title}
                  </h3>
                </div>
                <p className="font-sans font-normal text-xs sm:text-sm text-foreground/80 leading-relaxed line-clamp-1 pl-7">
                  {note.excerpt}
                </p>
              </div>
              <div className="font-sans shrink-0 flex items-center gap-2 text-xs text-muted-foreground pl-7 sm:pl-0 tabular-nums">
                <span>{note.formattedDate || note.date}</span>
                <span aria-hidden={true}>•</span>
                <span>{note.readTime}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 02 — Projects */}
      <section aria-labelledby="overview-projects-heading" className="space-y-4">
        <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-black/10 dark:border-white/10">
          <h2 id="overview-projects-heading" className={SECTION_HEADING_CLASS}>
            <span className={SECTION_INDEX_CLASS}>02</span>
            <span>Projects</span>
          </h2>
          <Link
            href="/projects"
            onClick={(e) => onTabLinkClick(e, "projects")}
            className={SECTION_LINK_CLASS}
          >
            All {fullProjects.length} projects
            <LuArrowUpRight className="size-3" aria-hidden={true} />
          </Link>
        </div>

        <div className="relative mx-auto w-full h-[360px] sm:h-[400px] flex items-center justify-center overflow-x-clip">
          {deckProjects.map((project, idx) => {
            const slot = getDeckSlot(idx);
            const isFront = slot === 0;

            const slotPositionClass = isFront
              ? "z-20 opacity-100 translate-x-0 translate-y-0 rotate-0 scale-100"
              : slot === -1
                ? "z-10 opacity-85 hover:opacity-100 -translate-x-11 sm:-translate-x-28 md:-translate-x-36 translate-y-4 -rotate-3 sm:-rotate-6 scale-[0.9] sm:scale-[0.92]"
                : "z-10 opacity-85 hover:opacity-100 translate-x-11 sm:translate-x-28 md:translate-x-36 translate-y-4 rotate-3 sm:rotate-6 scale-[0.9] sm:scale-[0.92]";

            const cardFrameClass =
              "w-full rounded-2xl border border-black/12 dark:border-white/10 bg-background overflow-hidden text-left shadow-[0_14px_34px_-12px_rgba(0,0,0,0.14)] dark:shadow-[0_20px_45px_-14px_rgba(0,0,0,0.75)] transition-colors hover:border-black/20 dark:hover:border-white/20";

            const cardInner = (
              <>
                <div className="relative h-36 sm:h-44 w-full bg-black/[0.03] dark:bg-white/[0.03] border-b border-black/10 dark:border-white/10 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={`${project.title} preview`}
                    fill
                    sizes="(max-width: 640px) 265px, 330px"
                    className="object-cover object-top"
                  />
                </div>
                <div className="p-4 pb-3 space-y-2">
                  <div className="flex items-center justify-between gap-2 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    <span className="truncate">{project.category}</span>
                    <span className="tabular-nums shrink-0">{project.year}</span>
                  </div>
                  <h3 className="font-mono text-xl font-semibold tracking-tight leading-tight text-foreground truncate">
                    {project.title}
                  </h3>
                  <p className="font-sans font-normal text-xs leading-relaxed text-foreground/80 line-clamp-2 min-h-[2.45rem]">
                    {project.overview}
                  </p>
                </div>
              </>
            );

            if (!isFront) {
              return (
                <button
                  key={project.slug}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  aria-label={`Focus project ${project.title}`}
                  className={`absolute w-[258px] sm:w-[325px] cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 rounded-2xl ${slotPositionClass}`}
                >
                  <div className={cardFrameClass}>
                    {cardInner}
                    <div className="px-4 pb-3.5 pt-2 flex items-center justify-between border-t border-black/10 dark:border-white/10 font-sans text-xs text-muted-foreground">
                      <span>{project.techStack[0] ?? "Web App"}</span>
                      <span>Focus card</span>
                    </div>
                  </div>
                </button>
              );
            }

            return (
              <div
                key={project.slug}
                data-guide="overview-active-project"
                className={`absolute w-[258px] sm:w-[325px] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${slotPositionClass}`}
              >
                <div className={cardFrameClass}>
                  {cardInner}
                  <div className="px-4 pb-3.5 pt-2 flex items-center justify-between gap-2 border-t border-black/10 dark:border-white/10">
                    <span className="font-sans text-xs text-muted-foreground truncate">
                      {project.techStack[0] ?? "Next.js"}
                    </span>
                    <div className="flex items-center gap-3 shrink-0 font-sans text-xs font-medium">
                      {project.live && project.live !== "#" && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-0.5 text-foreground/80 hover:text-foreground transition-colors"
                        >
                          Live
                          <LuArrowUpRight className="size-3" aria-hidden={true} />
                        </a>
                      )}
                      <Link
                        href={`/projects/${project.slug}`}
                        className="inline-flex items-center gap-0.5 text-foreground hover:underline underline-offset-4"
                      >
                        Read
                        <LuArrowUpRight className="size-3" aria-hidden={true} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Deck Controls */}
        <div className="flex items-center justify-center gap-3 pt-1">
          <button
            type="button"
            onClick={handlePrevProject}
            aria-label="Previous project card"
            className="size-7 rounded-full border border-black/12 dark:border-white/10 bg-background flex items-center justify-center text-foreground/80 hover:text-foreground hover:border-black/20 dark:hover:border-white/20 hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors cursor-pointer"
          >
            <LuChevronLeft className="size-3.5" aria-hidden={true} />
          </button>

          <div
            className="flex items-center gap-1.5"
            role="tablist"
            aria-label="Featured project selector"
          >
            {deckProjects.map((project, idx) => {
              const selected = idx === activeIdx;
              return (
                <button
                  key={project.slug}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-label={`Select ${project.title}`}
                  onClick={() => setActiveIdx(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    selected
                      ? "w-5 bg-foreground"
                      : "w-1.5 bg-foreground/20 hover:bg-foreground/45"
                  }`}
                />
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleNextProject}
            aria-label="Next project card"
            className="size-7 rounded-full border border-black/12 dark:border-white/10 bg-background flex items-center justify-center text-foreground/80 hover:text-foreground hover:border-black/20 dark:hover:border-white/20 hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors cursor-pointer"
          >
            <LuChevronRight className="size-3.5" aria-hidden={true} />
          </button>
        </div>
      </section>

      {/* 03 — Experience & Core Stack */}
      <section aria-labelledby="overview-experience-heading" className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-black/10 dark:border-white/10">
            <h2 id="overview-experience-heading" className={SECTION_HEADING_CLASS}>
              <span className={SECTION_INDEX_CLASS}>03</span>
              <span>Experience</span>
            </h2>
            <Link
              href="/experience"
              onClick={(e) => onTabLinkClick(e, "experience")}
              className={SECTION_LINK_CLASS}
            >
              Full history
              <LuArrowUpRight className="size-3" aria-hidden={true} />
            </Link>
          </div>

          <div className="divide-y divide-black/10 dark:divide-white/10">
            {EXPERIENCE_DATA.map((item) => (
              <div
                key={`${item.title}-${item.timeline}`}
                className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-4 py-3"
              >
                <div className="flex items-baseline gap-3 min-w-0">
                  <span className="font-sans text-xs text-muted-foreground tabular-nums w-24 shrink-0">
                    {item.timeline}
                  </span>
                  <span className="font-mono text-lg font-semibold tracking-wider leading-snug text-foreground">
                    {item.title}
                  </span>
                </div>
                <span className="font-sans text-xs sm:text-sm font-medium leading-snug text-foreground/80 sm:text-right pl-[6.75rem] sm:pl-0">
                  {item.company}
                </span>
              </div>
            ))}
            {EDUCATION_DATA.map((edu) => (
              <div
                key={edu.degree}
                className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-4 py-3"
              >
                <div className="flex items-baseline gap-3 min-w-0">
                  <span className="font-sans text-xs text-muted-foreground tabular-nums w-24 shrink-0">
                    {edu.timeline}
                  </span>
                  <span className="font-mono text-lg font-semibold tracking-wider leading-snug text-foreground">
                    {edu.degree}
                  </span>
                </div>
                <span className="font-sans text-xs sm:text-sm font-medium leading-snug text-foreground/80 sm:text-right pl-[6.75rem] sm:pl-0">
                  {edu.institution}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Core Stack strip */}
        <div className="space-y-3 pt-2 border-t border-black/10 dark:border-white/10">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-mono text-lg font-semibold tracking-wider text-foreground">
              Core Stack
            </h3>
            <Link
              href="/tech-stack"
              onClick={(e) => onTabLinkClick(e, "experience#tech-stack")}
              className={SECTION_LINK_CLASS}
            >
              All skills
              <LuArrowUpRight className="size-3" aria-hidden={true} />
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => {
              const Icon = skill.icon;
              return (
                <Link
                  key={skill.name}
                  href="/tech-stack"
                  onClick={(e) => onTabLinkClick(e, "experience#tech-stack")}
                  className="inline-flex items-center gap-1.5 rounded-full font-sans font-normal border border-black/12 dark:border-white/10 bg-background/75 hover:bg-black/[0.03] dark:hover:bg-white/[0.04] hover:border-black/20 dark:hover:border-white/20 text-foreground/90 transition-colors px-3 py-1.5 text-xs"
                >
                  <Icon
                    className="size-3.5 text-foreground/90 shrink-0"
                    aria-hidden={true}
                  />
                  <span>{skill.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 04 — Certifications */}
      <section aria-labelledby="overview-certs-heading" className="space-y-4">
        <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-black/10 dark:border-white/10">
          <h2 id="overview-certs-heading" className={SECTION_HEADING_CLASS}>
            <span className={SECTION_INDEX_CLASS}>04</span>
            <span>Certifications</span>
          </h2>
          <Link
            href="/certifications"
            onClick={(e) => onTabLinkClick(e, "experience#certifications")}
            className={SECTION_LINK_CLASS}
          >
            {certifications.length} Verified
            <LuArrowUpRight className="size-3" aria-hidden={true} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {featuredCerts.map((cert) => (
            <CertificationBadgeCard
              key={cert.name}
              cert={cert}
              onSelect={onSelectCert}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
