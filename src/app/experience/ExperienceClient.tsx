"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Calendar,
  FolderGit2,
  FileText,
  GraduationCap,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  experiences,
  workCapabilities,
} from "@/lib/data";
import {
  AUTHOR_INFO,
  AVAILABILITY,
  EDUCATION,
  SOCIAL_PROFILES,
} from "@/lib/siteConfig";
import { EditorialDivider } from "@/components/EditorialDivider";
import { TechIcon } from "@/components/TechIcon";
import { StatusBadge } from "@/components/ProjectStatusBadge";
import { useUISound } from "@/context/SoundContext";
import { TechStackSection, CertificationsSection } from "./ExperienceSections";

export function ExperienceClient() {
  const { playHover, playClick } = useUISound();
  const shouldReduceMotion = useReducedMotion();
  const [expandedExperiences, setExpandedExperiences] = useState<Set<number>>(new Set());

  // Smooth scroll to target anchor when page loads with a hash or hash changes
  useEffect(() => {
    const handleHashScroll = () => {
      if (typeof window === "undefined") return;
      const hash = window.location.hash.replace("#", "");
      if (!hash) return;

      let attempts = 0;
      const maxAttempts = 15;

      const tryScroll = () => {
        const target = document.getElementById(hash);
        if (target) {
          requestAnimationFrame(() => {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
          });
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(tryScroll, 60);
        }
      };

      setTimeout(tryScroll, 40);
    };

    handleHashScroll();
    window.addEventListener("hashchange", handleHashScroll);
    return () => window.removeEventListener("hashchange", handleHashScroll);
  }, []);

  const toggleExperience = (idx: number) => {
    playClick();
    setExpandedExperiences((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  return (
    <div className="animate-in fade-in duration-300">
      {/* Top Header & Context Row */}
      <div className="mb-8 space-y-4 pt-4 sm:pt-5">
        <Link
          href="/"
          onMouseEnter={playHover}
          onClick={playClick}
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-ink transition-colors duration-150 group cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-150 group-hover:-translate-x-1" />
          <span>cd .. / home</span>
        </Link>

        <div className="flex items-start sm:items-center justify-between flex-wrap gap-3 pt-1">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
              Experience & Background
            </h1>
            <p className="font-mono text-xs text-muted-foreground mt-1">
              {"// work history, skills & certificates"}
            </p>
          </div>

          <StatusBadge
            status="available"
            label={AVAILABILITY.label}
            size="sm"
            className="self-start sm:self-auto"
          />
        </div>
      </div>

      <div className="space-y-6">
        <p className="max-w-2xl font-sans text-[15px] leading-[26px] text-muted-foreground">
          I build thoughtful web applications with a focus on{" "}
          <span className="font-medium text-ink">web development and easy-to-use interfaces</span>.
          I&apos;m looking for my first professional opportunity and am open to junior roles,
          internships, freelance work, and team projects.
        </p>

        <dl className="grid grid-cols-1 gap-5 border-y border-border-hairline py-5 sm:grid-cols-3 sm:gap-6">
          <div className="min-w-0 space-y-2">
            <dt className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Location</dt>
            <dd className="font-sans text-sm leading-relaxed text-ink">{AUTHOR_INFO.location}</dd>
          </div>
          <div className="min-w-0 space-y-2">
            <dt className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Looking for</dt>
            <dd className="font-sans text-sm leading-relaxed text-ink">{AVAILABILITY.lookingFor}</dd>
          </div>
          <div className="min-w-0 space-y-2">
            <dt className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Work preference</dt>
            <dd className="font-sans text-sm leading-relaxed text-ink">{AVAILABILITY.workPreference}</dd>
          </div>
        </dl>
      </div>

      {/* Divider before Act 1 */}
      <EditorialDivider className="my-8 sm:my-10" />

      {/* ACT 1: <WORK-HISTORY/> */}
      <section id="work" className="scroll-mt-20 sm:scroll-mt-24 space-y-6">
        <div className="flex items-center justify-between">
          <span className="font-caps text-xs text-muted-foreground uppercase tracking-wider font-mono font-semibold">
            &lt;work-history/&gt;
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            {experiences.length} steps
          </span>
        </div>

        <div className="divide-y divide-border-divider border-y border-border-divider">
          {experiences.map((exp, index) => {
            const isOpen = expandedExperiences.has(index);

            return (
              <div
                key={`${exp.year}-${index}`}
                className="py-3.5 sm:py-4 transition-colors"
              >
                {/* Clickable Summary Row / Accordion Trigger */}
                <button
                  type="button"
                  onClick={() => toggleExperience(index)}
                  onMouseEnter={playHover}
                  aria-expanded={isOpen}
                  aria-controls={`exp-detail-${index}`}
                  className="w-full text-left flex items-start justify-between gap-3 p-2 -m-2 rounded-lg hover:bg-surface/40 transition-colors group/row cursor-pointer"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-[160px_minmax(0,1fr)] gap-2 sm:gap-6 items-start flex-1 min-w-0">
                    {/* Date Column */}
                    <div className="min-w-0 flex items-center gap-2 pt-0.5">
                      <span className="font-mono text-xs sm:text-[13px] font-semibold text-ink">
                        {exp.year}
                      </span>
                      {exp.isCurrent && (
                        <StatusBadge status="active" size="sm" />
                      )}
                    </div>

                    {/* Role & Company & Brief Summary */}
                    <div className="min-w-0 pr-2">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <h3 className="font-sans font-semibold text-sm sm:text-base text-ink group-hover/row:text-brand transition-colors">
                          {exp.role}
                        </h3>
                        <span className="text-muted-foreground/60 font-mono text-xs select-none">·</span>
                        <span className="font-mono text-xs sm:text-[13px] text-muted-foreground">
                          {exp.company}
                        </span>
                      </div>

                      {exp.description && (
                        <p className="mt-1 text-[13.5px] sm:text-sm text-body font-sans leading-relaxed line-clamp-2">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Dropdown Chevron Indicator */}
                  <div className="flex items-center gap-1.5 flex-shrink-0 pt-1 text-muted-foreground/60 group-hover/row:text-ink transition-colors">
                    <span className="font-mono text-[10.5px] hidden sm:inline text-muted-foreground/50">
                      {isOpen ? "less" : "details"}
                    </span>
                    <div className="w-5 h-5 rounded flex items-center justify-center">
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-brand" : ""
                        }`}
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </button>

                {/* Collapsible Details Region */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`exp-detail-${index}`}
                      role="region"
                      aria-label={`${exp.role} details`}
                      initial={shouldReduceMotion ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={shouldReduceMotion ? { opacity: 0, height: 0 } : { opacity: 0, height: 0 }}
                      transition={{
                        height: { duration: shouldReduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] },
                        opacity: { duration: shouldReduceMotion ? 0 : 0.18, ease: "easeOut" },
                      }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3 pb-1 pl-0 sm:pl-[176px] space-y-3">
                        {exp.details && exp.details.length > 0 && (
                          <ul className="space-y-1.5 list-disc list-inside text-xs sm:text-[13px] text-muted-foreground font-sans">
                            {exp.details.map((bullet, idx) => (
                              <li key={idx} className="leading-relaxed">
                                {bullet}
                              </li>
                            ))}
                          </ul>
                        )}

                        {exp.technologies && exp.technologies.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5 pt-1">
                            {exp.technologies.map((tech) => (
                              <span key={tech} className="skill-pill">
                                <TechIcon name={tech} className="w-3.5 h-3.5" />
                                <span>{tech}</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Academic Foundation Card */}
        <div className="pt-2">
          <span className="font-caps text-xs text-muted-foreground uppercase tracking-wider font-mono font-semibold block mb-3">
            &lt;education/&gt;
          </span>
          <div className="p-4 sm:p-5 rounded-lg bg-surface/30 border border-border-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0">
              <GraduationCap className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h3 className="font-sans font-semibold text-sm sm:text-base text-ink">
                  {EDUCATION.degree}
                </h3>
                <p className="font-mono text-xs text-muted-foreground mt-0.5">
                  {EDUCATION.institution} · {EDUCATION.department}
                </p>
              </div>
            </div>
            <span className="font-mono text-xs text-muted-foreground flex-shrink-0 sm:text-right">
              {EDUCATION.period}
            </span>
          </div>
        </div>

        {/* Capabilities Section */}
        <div className="pt-3 space-y-3">
          <span className="font-caps text-xs text-muted-foreground uppercase tracking-wider font-mono font-semibold block">
            &lt;what-i-can-help-with/&gt;
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {workCapabilities.map((area) => (
              <div
                key={area}
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-surface/30 border border-border-hairline font-sans text-xs sm:text-[13px] text-ink"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 flex-shrink-0" />
                <span>{area}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider before Act 2 */}
      <EditorialDivider className="my-8 sm:my-10" />

      {/* ACT 2: <TECHNICAL-STACK/> */}
      <TechStackSection />

      {/* Divider before Act 3 */}
      <EditorialDivider className="my-8 sm:my-10" />

      {/* ACT 3: <VERIFIED-CERTIFICATIONS/> */}
      <CertificationsSection />

      {/* Divider before Act 4 */}
      <EditorialDivider className="my-8 sm:my-10" />

      {/* ACT 4: <LET'S-WORK-TOGETHER/> */}
      <section id="contact" className="scroll-mt-20 sm:scroll-mt-24 space-y-5">
        <div className="flex items-center gap-2 pt-2">
          <span className="font-caps text-xs text-muted-foreground uppercase tracking-wider font-mono font-semibold">
            &lt;let&apos;s-work-together/&gt;
          </span>
        </div>

        <div className="font-sans text-[15px] text-muted-foreground leading-[26px] space-y-3">
          <p>
            If you&apos;re working on something and think I might be a good fit, I&apos;d be happy to hear about it.
          </p>
          <p>
            Whether it&apos;s a junior role, internship, freelance project, collaboration, or simply a conversation about an idea, feel free to reach out.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-3 pt-2">
          <a
            href={`mailto:${SOCIAL_PROFILES.email}`}
            className="tactile-btn gap-2 h-9 px-4 rounded-md"
          >
            <Mail className="w-3.5 h-3.5 opacity-70" />
            <span>Send Email</span>
          </a>

          <a
            href={`mailto:${SOCIAL_PROFILES.email}?subject=Let's%20Schedule%20a%20Call`}
            className="tactile-btn gap-2 h-9 px-4 rounded-md"
          >
            <Calendar className="w-3.5 h-3.5 opacity-70" />
            <span>Schedule a Call</span>
          </a>

          <Link
            href="/projects"
            className="tactile-btn gap-2 h-9 px-4 rounded-md"
          >
            <FolderGit2 className="w-3.5 h-3.5 opacity-70" />
            <span>View Projects</span>
          </Link>

          <a
            href="/resume/naphier_awalie_resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="tactile-btn gap-2 h-9 px-4 rounded-md"
          >
            <FileText className="w-3.5 h-3.5 opacity-70" />
            <span>Download Résumé</span>
          </a>
        </div>
      </section>
    </div>
  );
}

export default ExperienceClient;
