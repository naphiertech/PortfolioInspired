"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { IconType } from "react-icons";
import WindowShutter from "./WindowShutter";
import { IoBookSharp } from "react-icons/io5";
import {
  LuCode,
  LuWrench,
  LuSparkles,
  LuFolder,
  LuServer,
  LuDatabase,
  LuPalette,
  LuChevronDown,
  LuAward,
  LuArrowUpRight,
  LuX,
} from "react-icons/lu";
import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiTypescript,
  SiNextdotjs,
  SiVuedotjs,
  SiTailwindcss,
  SiFlutter,
  SiDart,
  SiCapacitor,
  SiNodedotjs,
  SiExpress,
  SiPhp,
  SiLaravel,
  SiPython,
  SiFastapi,
  SiGraphql,
  SiPrisma,
  SiMysql,
  SiPostgresql,
  SiMongodb,
  SiFirebase,
  SiTensorflow,
  SiPytorch,
  SiGooglegemini,
  SiClaude,
  SiOllama,
  SiFigma,
  SiGsap,
  SiFramer,
  SiLottiefiles,
  SiJenkins,
  SiGithubactions,
  SiGit,
  SiGithub,
  SiPostman,
  SiVercel,
} from "react-icons/si";
import { FaReact, FaDocker } from "react-icons/fa6";
import { RiSupabaseFill, RiOpenaiFill } from "react-icons/ri";
import { VscVscode } from "react-icons/vsc";
import { techSections, certifications, CertificationItem } from "@/lib/data";
import { EXPERIENCE_DATA, EDUCATION_DATA } from "./data";

interface ExperienceSectionProps {
  isDark: boolean;
  onNavigateProjects?: () => void;
}

function GoogleLogo({ className = "size-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );
}

function DICTLogo({ className = "size-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="22" className="fill-slate-900 stroke-blue-500/40" strokeWidth="1.5" />
      <circle cx="24" cy="24" r="17" stroke="#38BDF8" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.8" />
      <circle cx="24" cy="24" r="8.5" fill="#1E3A8A" />
      <path d="M24 16 L31 24 L24 32 Z" fill="#DC2626" opacity="0.9" />
      <path d="M24 16 L17 24 L24 32 Z" fill="#2563EB" opacity="0.9" />
      <circle cx="24" cy="24" r="3.2" fill="#FBBF24" />
      <path d="M14 18 A14 14 0 0 1 34 18" stroke="#FBBF24" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M17 20 A10 10 0 0 1 31 20" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function LaurelBranch({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 16 20"
      fill="none"
      aria-hidden="true"
      className={`w-3 h-3.5 text-muted-foreground/60 group-hover:text-foreground/80 transition-colors ${
        flip ? "-scale-x-100" : ""
      }`}
    >
      <path
        d="M12 18C7.5 15.5 5 11.5 5 6.5C5 4.5 5.5 2.8 6.5 1.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M5.2 5.5C3.2 5 2 3.5 2.2 2C3.8 2.2 5 3.5 5.2 5.5Z"
        fill="currentColor"
      />
      <path
        d="M5.3 9.8C3 9.5 1.5 8 1.5 6.2C3.3 6.3 4.8 7.8 5.3 9.8Z"
        fill="currentColor"
      />
      <path
        d="M6.8 14C4.4 14.2 2.6 13 2.3 11.2C4.2 11 5.9 12.2 6.8 14Z"
        fill="currentColor"
      />
      <path
        d="M5.5 6.2C7.3 5.4 8.5 3.8 8.2 2.2C6.6 2.6 5.5 4.2 5.5 6.2Z"
        fill="currentColor"
      />
      <path
        d="M5.8 10.5C7.8 9.9 9.1 8.4 8.9 6.7C7.2 7 6 8.5 5.8 10.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

const CATEGORY_ICONS: Record<string, IconType> = {
  Frontend: LuCode,
  Backend: LuServer,
  "Databases & Cloud": LuDatabase,
  "AI & Machine Learning": LuSparkles,
  "Animation & Design": LuPalette,
  "DevOps & Tools": LuWrench,
};

const SKILL_ICONS: Record<string, IconType> = {
  HTML5: SiHtml5,
  CSS3: SiCss,
  JavaScript: SiJavascript,
  TypeScript: SiTypescript,
  React: FaReact,
  "Next.js": SiNextdotjs,
  "Vue.js": SiVuedotjs,
  "Tailwind CSS": SiTailwindcss,
  Flutter: SiFlutter,
  Dart: SiDart,
  Capacitor: SiCapacitor,
  "Node.js": SiNodedotjs,
  "Express.js": SiExpress,
  PHP: SiPhp,
  Laravel: SiLaravel,
  Python: SiPython,
  FastAPI: SiFastapi,
  GraphQL: SiGraphql,
  Prisma: SiPrisma,
  Supabase: RiSupabaseFill,
  MySQL: SiMysql,
  PostgreSQL: SiPostgresql,
  MongoDB: SiMongodb,
  Firebase: SiFirebase,
  TensorFlow: SiTensorflow,
  PyTorch: SiPytorch,
  Codex: RiOpenaiFill,
  Gemini: SiGooglegemini,
  Claude: SiClaude,
  Ollama: SiOllama,
  Figma: SiFigma,
  GSAP: SiGsap,
  "Framer Motion": SiFramer,
  Lottie: SiLottiefiles,
  Docker: FaDocker,
  Jenkins: SiJenkins,
  "GitHub Actions": SiGithubactions,
  Git: SiGit,
  GitHub: SiGithub,
  "VS Code": VscVscode,
  Postman: SiPostman,
  Vercel: SiVercel,
};

const LEARNING_MARKERS = new Set([
  "Flutter",
  "Dart",
  "FastAPI",
  "GraphQL",
  "Supabase",
  "PostgreSQL",
  "TensorFlow",
  "PyTorch",
  "Gemini",
  "Ollama",
  "GSAP",
  "Docker",
]);

const INITIAL_VISIBLE_CATEGORIES = 3;

export function ExperienceSection({ isDark, onNavigateProjects }: ExperienceSectionProps) {
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [selectedCert, setSelectedCert] = useState<CertificationItem | null>(null);
  const experiences = EXPERIENCE_DATA;

  useEffect(() => {
    if (!selectedCert) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedCert(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedCert]);

  const skillCategories = techSections.map((section) => ({
    name: section.title,
    icon: CATEGORY_ICONS[section.title] || LuCode,
    skills: section.items.map((item) => ({
      name: item,
      icon: SKILL_ICONS[item] || LuCode,
      hasMarker: LEARNING_MARKERS.has(item),
    })),
  }));

  const primaryCategories = skillCategories.slice(0, INITIAL_VISIBLE_CATEGORIES);
  const extraCategories = skillCategories.slice(INITIAL_VISIBLE_CATEGORIES);

  const renderCategory = (cat: (typeof skillCategories)[number]) => (
    <div key={cat.name} className="p-2 space-y-3.5">
      <div className="flex items-center gap-2.5 text-foreground">
        <cat.icon className="size-5 text-muted-foreground" />
        <h3 className="text-sm text-foreground/80 font-medium">
          {cat.name}
        </h3>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {cat.skills.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.name}
              className="inline-flex cursor-default relative items-center gap-2 px-3.5 py-1.5 rounded-full text-xs border border-black/12 dark:border-white/10 hover:bg-black/[0.03] dark:hover:bg-white/[0.04] hover:border-black/20 dark:hover:border-white/20 text-foreground/90 transition-colors"
            >
              <div className="absolute -top-1 right-1 z-1">
                {s.hasMarker && <IoBookSharp className="size-3 text-foreground" />}
              </div>
              <Icon className="size-4 text-foreground/95" />
              <span>{s.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  const getCertIcon = (cert: CertificationItem) => {
    if (cert.tag === "GOOGLE" || cert.issuer.includes("Google")) {
      return <GoogleLogo className="size-5" />;
    }
    if (
      cert.tag === "DICT" ||
      cert.issuer.includes("DICT") ||
      cert.issuer.includes("Information and Communications")
    ) {
      return <DICTLogo className="size-5" />;
    }
    return <LuAward className="size-5 text-foreground/80" />;
  };

  return (
    <div className="w-full flex flex-col items-center pt-8 pb-4 px-4 sm:px-6">
      {/* 1. Interactive Authentic Train Window */}
      <WindowShutter isDark={isDark} className="mb-6" />

      {/* 2. Heading */}
      <div className="space-y-3 text-center max-w-xl px-4 pt-2 pb-10">
        <h2 className="text-2xl sm:text-3xl font-mono font-semibold tracking-tight text-foreground">
          The Journey So Far
        </h2>
        <p className="font-sans font-medium text-sm md:text-base text-foreground/80 leading-relaxed">
          Full-stack and UI/UX journey. <br />
          Building practical applications, experimenting, and picking up new skills at every stop.
        </p>
      </div>

      {/* 3. Timeline */}
      <div className="w-full max-w-2xl px-2 sm:px-4 pt-4">
        <div className="space-y-12 sm:space-y-16 pb-2">
          {/* Work Experiences */}
          {experiences.map((exp, idx) => (
            <div key={idx} className="space-y-3 relative group">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h3 className="font-mono text-lg font-semibold tracking-wider text-foreground">
                  {exp.title}
                </h3>
                <span className="text-xs text-muted-foreground">
                  {exp.timeline}
                </span>
              </div>

              <div>
                <span className="font-sans font-medium text-sm sm:text-base text-foreground/90">
                  {exp.company}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed font-sans font-normal">
                {exp.description}
              </p>

              {exp.hasProjectLink && onNavigateProjects && (
                <button
                  type="button"
                  onClick={onNavigateProjects}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground/90 hover:text-foreground hover:underline cursor-pointer pt-1"
                >
                  <LuFolder className="size-3.5" />
                  <span>View projects</span>
                </button>
              )}
            </div>
          ))}

          {/* Skills Section */}
          <div className="space-y-6 pt-4 border-t border-black/10 dark:border-white/10">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-mono text-xl font-semibold tracking-wider text-foreground">
                Skills
              </h3>
              <div className="flex gap-2 items-center text-xs md:text-sm text-muted-foreground">
                <IoBookSharp className="size-3" />
                <span>Learning & Exploring</span>
              </div>
            </div>

            <div className="space-y-6">
              {primaryCategories.map(renderCategory)}

              <AnimatePresence initial={false}>
                {showAllSkills && extraCategories.length > 0 && (
                  <motion.div
                    key="extra-skill-categories"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden space-y-6"
                  >
                    {extraCategories.map(renderCategory)}
                  </motion.div>
                )}
              </AnimatePresence>

              {extraCategories.length > 0 && (
                <div className="px-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAllSkills((prev) => !prev)}
                    aria-expanded={showAllSkills}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-sans font-medium border border-black/12 dark:border-white/10 text-muted-foreground hover:text-foreground hover:border-black/20 dark:hover:border-white/20 hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors cursor-pointer"
                  >
                    <span>
                      {showAllSkills ? "Show less" : "View more"}
                    </span>
                    <LuChevronDown
                      className={`size-3.5 transition-transform duration-200 ${
                        showAllSkills ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Certifications Section */}
          <div className="space-y-5 pt-4 border-t border-black/10 dark:border-white/10">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-mono text-xl font-semibold tracking-wider text-foreground">
                Certifications
              </h3>
              <span className="font-sans text-xs text-muted-foreground">
                {certifications.length} Verified
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {certifications.map((cert) => {
                const hasPreview = cert.href && cert.href !== "#";
                return (
                  <button
                    key={cert.name}
                    type="button"
                    onClick={() => {
                      if (hasPreview) setSelectedCert(cert);
                    }}
                    className={`group rounded-2xl p-1.5 border border-black/[0.07] dark:border-white/[0.07] bg-black/[0.015] dark:bg-white/[0.02] transition-all duration-300 text-center ${
                      hasPreview
                        ? "hover:border-black/15 dark:hover:border-white/15 cursor-pointer"
                        : "cursor-default"
                    }`}
                  >
                    <div className="h-full rounded-xl border border-black/10 dark:border-white/10 bg-background px-4 py-5 flex flex-col items-center justify-between gap-4 transition-colors group-hover:border-black/20 dark:group-hover:border-white/20">
                      {/* Top Issuer Logo Box */}
                      <div className="size-11 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] flex items-center justify-center shadow-2xs shrink-0">
                        {getCertIcon(cert)}
                      </div>

                      {/* Middle Certificate Name & Issuer Tag */}
                      <div className="space-y-1.5">
                        <h4 className="font-mono text-base sm:text-lg font-semibold tracking-tight text-foreground leading-snug line-clamp-2">
                          {cert.name}
                        </h4>
                        <span className="block font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                          {cert.tag || "VERIFIED"}
                        </span>
                      </div>

                      {/* Bottom Laurel Wreath VERIFY Badge */}
                      <div className="inline-flex items-center gap-1.5 pt-0.5">
                        <LaurelBranch />
                        <span className="font-sans text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground group-hover:text-foreground transition-colors">
                          {hasPreview ? "Verify" : "Verified"}
                        </span>
                        <LaurelBranch flip />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Education */}
          {EDUCATION_DATA.map((edu, idx) => (
            <div key={idx} className="space-y-3 pt-4 border-t border-black/10 dark:border-white/10">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h3 className="font-mono text-lg font-semibold tracking-wider text-foreground">
                  {edu.degree}
                </h3>
                <span className="text-xs text-muted-foreground">
                  {edu.timeline}
                </span>
              </div>

              <div>
                <span className="font-sans font-medium text-sm text-foreground/90">
                  {edu.institution}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed font-sans font-normal">
                {edu.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Certificate Lightbox Modal */}
      <AnimatePresence>
        {selectedCert && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCert(null)}
              className="fixed inset-0 bg-background/80 backdrop-blur-md cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 w-full max-w-2xl bg-background border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between gap-3 px-4 py-3.5 border-b border-black/10 dark:border-white/10">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {selectedCert.tag && (
                      <span className="text-[9px] font-sans font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-foreground/80 border border-black/10 dark:border-white/10">
                        {selectedCert.tag}
                      </span>
                    )}
                    {selectedCert.code && (
                      <span className="text-[11px] font-sans text-muted-foreground truncate">
                        ID: {selectedCert.code}
                      </span>
                    )}
                  </div>
                  <h4 className="font-mono text-lg font-semibold text-foreground truncate mt-0.5">
                    {selectedCert.name}
                  </h4>
                  <p className="text-xs font-sans text-muted-foreground truncate">
                    {selectedCert.issuer}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedCert(null)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer shrink-0"
                  aria-label="Close certificate preview"
                >
                  <LuX className="size-5" />
                </button>
              </div>

              <div className="relative w-full aspect-[4/3] bg-muted/30">
                <Image
                  src={selectedCert.href}
                  alt={selectedCert.name}
                  fill
                  sizes="(max-width: 768px) 95vw, 672px"
                  className="object-contain p-3 sm:p-5"
                />
              </div>

              <div className="px-4 py-3 border-t border-black/10 dark:border-white/10 flex items-center justify-between gap-2 bg-muted/10">
                <span className="text-xs font-sans text-muted-foreground">
                  Verified Credential
                </span>
                <a
                  href={selectedCert.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-sans font-medium text-foreground hover:underline"
                >
                  <span>Open Full Image</span>
                  <LuArrowUpRight className="size-3.5" />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ExperienceSection;
