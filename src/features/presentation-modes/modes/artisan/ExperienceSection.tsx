"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { IconType } from "react-icons";
import WindowShutter from "./WindowShutter";
import { CertificationBadgeCard, CertificationPreviewModal } from "./CertificationCard";
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
        <div id="work" className="space-y-12 sm:space-y-16 pb-2 scroll-mt-20">
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
          <div id="tech-stack" className="space-y-6 pt-4 border-t border-black/10 dark:border-white/10 scroll-mt-20">
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
          <div id="certifications" className="space-y-5 pt-4 border-t border-black/10 dark:border-white/10 scroll-mt-20">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-mono text-xl font-semibold tracking-wider text-foreground">
                Certifications
              </h3>
              <span className="font-sans text-xs text-muted-foreground">
                {certifications.length} Verified
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {certifications.map((cert) => (
                <CertificationBadgeCard
                  key={cert.name}
                  cert={cert}
                  onSelect={setSelectedCert}
                />
              ))}
            </div>
          </div>

          {/* Education */}
          <div id="education" className="scroll-mt-20">
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
      </div>

      {/* Certificate Lightbox Modal */}
      <CertificationPreviewModal
        selectedCert={selectedCert}
        onClose={() => setSelectedCert(null)}
      />
    </div>
  );
}

export default ExperienceSection;
