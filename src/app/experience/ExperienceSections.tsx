"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  ArrowRight,
  ExternalLink,
  X,
  Eye,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import {
  techSections,
  certifications,
  CertificationItem,
  getCertificationGroups,
  hasPreviewableDocument,
  isPdfCertificate,
  getVerifyHref,
  getProjectsUsingTech,
  getCanonicalTechName,
  normalizeTechName,
} from "@/lib/data";
import {
  IssuerLogo,
  CertificationTagBadge,
  getCertificationMetaText,
  CertificationDocumentPreview,
} from "@/components/CertificationShared";
import { TechIconTile, getTileTiltAngle } from "@/components/TechIconTile";
import { ProjectStatusBadge } from "@/components/ProjectStatusBadge";
import { useUISound } from "@/context/SoundContext";

const categorySyntaxMap: Record<string, string> = {
  Frontend: "<FRONTEND/>",
  Backend: "<BACKEND/>",
  "Databases & Cloud": "<DATABASES-CLOUD/>",
  "AI & Machine Learning": "<AI-ML/>",
  "Animation & Design": "<DESIGN-ANIMATION/>",
  "DevOps & Tools": "<DEVOPS-TOOLS/>",
};

/**
 * Shared interactive Technical Stack & Tools section used by /experience and /tech-stack.
 */
export function TechStackSection({ defaultShowAll = false }: { defaultShowAll?: boolean }) {
  const { playHover, playClick } = useUISound();
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [showAllSkills, setShowAllSkills] = useState(defaultShowAll);
  const usedInProjectsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlTech = new URLSearchParams(window.location.search).get("tech");
      if (urlTech) {
        setSelectedTech(urlTech);
        setShowAllSkills(true);
      }
    }
  }, []);

  useEffect(() => {
    if (selectedTech && usedInProjectsRef.current) {
      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const timer = setTimeout(() => {
        usedInProjectsRef.current?.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "nearest",
        });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [selectedTech]);

  const matchingProjects = useMemo(() => {
    if (!selectedTech) return [];
    const canonical = getCanonicalTechName(selectedTech);
    return canonical ? getProjectsUsingTech(canonical) : [];
  }, [selectedTech]);

  const handleTechClick = (tech: string) => {
    playClick();
    const normalizedClicked = normalizeTechName(tech);
    const normalizedCurrent = selectedTech ? normalizeTechName(selectedTech) : null;
    setSelectedTech(normalizedCurrent === normalizedClicked ? null : tech);
  };

  const totalSkills = techSections.reduce((acc, cat) => acc + cat.items.length, 0);

  return (
    <section id="tech-stack" className="scroll-mt-20 sm:scroll-mt-24 space-y-6">
      <div className="flex items-center justify-between">
        <span className="font-caps text-xs text-muted-foreground uppercase tracking-wider font-mono font-semibold">
          &lt;skills-and-tools/&gt;
        </span>
        <span className="font-mono text-xs text-muted-foreground">
          {totalSkills} tools in {techSections.length} groups
        </span>
      </div>

      <p className="max-w-2xl font-sans text-sm leading-relaxed text-muted-foreground">
        Tools I use to build websites and apps. Choose a tool to see projects that use it.
      </p>

      <div id="experience-skills-list" className="divide-y divide-black/[0.05] dark:divide-white/[0.05] border-y border-black/[0.06] dark:border-white/[0.06]">
        {techSections.slice(0, showAllSkills ? undefined : 3).map((category, index) => {
          const categoryNumber = String(index + 1).padStart(2, "0");
          const syntaxTag =
            categorySyntaxMap[category.title] ||
            `<${category.title.toUpperCase().replace(/[\s&]+/g, "-")}/>`;

          return (
            <div
              key={category.title}
              className="relative py-5 sm:py-6 flex flex-col md:flex-row md:items-start gap-3 md:gap-6 hover:z-10 focus-within:z-10"
            >
              <div className="md:w-40 lg:w-44 flex-shrink-0 flex md:flex-col justify-between md:justify-start items-baseline md:items-start gap-1 pb-1 md:pb-0 border-b md:border-b-0 border-black/[0.04] dark:border-white/[0.04]">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-xs font-semibold text-emerald-500/70 dark:text-emerald-400/70 select-none">
                    {categoryNumber}
                  </span>
                  <span className="font-mono text-xs font-semibold text-ink/85 tracking-tight">
                    {syntaxTag}
                  </span>
                </div>
                <span className="font-mono text-[11px] text-muted-foreground/50">
                  {category.items.length} tools
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 sm:gap-3.5 py-1.5">
                  {category.items.map((item, itemIdx) => {
                    const isSelected =
                      selectedTech !== null &&
                      normalizeTechName(selectedTech) === normalizeTechName(item);

                    return (
                      <TechIconTile
                        key={item}
                        name={item}
                        tiltAngle={getTileTiltAngle(itemIdx, index)}
                        ariaPressed={isSelected}
                        isSelected={isSelected}
                        onClick={() => handleTechClick(item)}
                        onMouseEnter={playHover}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!defaultShowAll && (
        <button
          type="button"
          onClick={() => { playClick(); setShowAllSkills((shown) => !shown); }}
          onMouseEnter={playHover}
          aria-expanded={showAllSkills}
          aria-controls="experience-skills-list"
          className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-muted-foreground hover:text-ink transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
        >
          {showAllSkills ? "Show fewer groups" : `View all ${techSections.length} groups`}
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showAllSkills ? "rotate-180" : ""}`} aria-hidden="true" />
        </button>
      )}

      {selectedTech && (
        <section
          ref={usedInProjectsRef}
          id="used-in-projects"
          aria-label={`Projects built with ${selectedTech}`}
          className="p-4 sm:p-5 rounded-lg border border-black/[0.08] dark:border-white/[0.07] bg-black/[0.01] dark:bg-white/[0.01] space-y-4 shadow-xs animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-black/[0.05] dark:border-white/[0.05]">
            <div className="flex items-center gap-2 flex-wrap font-mono text-xs">
              <span className="text-muted-foreground/60 uppercase">
                &lt;USED-IN-PROJECTS/&gt;
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
                {selectedTech}
              </span>
              <span className="text-muted-foreground/60">
                ({matchingProjects.length}{" "}
                {matchingProjects.length === 1 ? "project" : "projects"})
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                playClick();
                setSelectedTech(null);
              }}
              className="font-mono text-xs text-muted-foreground hover:text-ink transition-colors flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear filter</span>
            </button>
          </div>

          {matchingProjects.length > 0 ? (
            <div className="divide-y divide-black/[0.05] dark:divide-white/[0.05]">
              {matchingProjects.map((project) => (
                <div
                  key={project.slug}
                  className="py-3 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Link
                      href={`/projects/${project.slug}`}
                      onMouseEnter={playHover}
                      onClick={playClick}
                      className="font-sans font-bold text-xs sm:text-sm text-ink hover:text-brand transition-colors truncate"
                    >
                      {project.title}
                    </Link>
                    {project.status && (
                      <ProjectStatusBadge status={project.status} size="sm" />
                    )}
                  </div>

                  <Link
                    href={`/projects/${project.slug}`}
                    onMouseEnter={playHover}
                    onClick={playClick}
                    className="font-mono text-xs text-muted-foreground hover:text-brand transition-colors inline-flex items-center gap-1 flex-shrink-0"
                  >
                    <span>View project</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs font-mono text-muted-foreground italic py-1">
              No projects listed for {selectedTech} yet.
            </p>
          )}
        </section>
      )}
    </section>
  );
}

/**
 * Shared Verified Certifications section & modal preview used by /experience and /certifications.
 */
export function CertificationsSection() {
  const { playHover, playClick } = useUISound();
  const [previewCert, setPreviewCert] = useState<CertificationItem | null>(null);
  const [mounted, setMounted] = useState(false);
  const certGroups = useMemo(() => getCertificationGroups(), []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setPreviewCert(null);
      }
    }
    if (previewCert) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [previewCert]);

  return (
    <>
      <section id="certifications" className="scroll-mt-20 sm:scroll-mt-24 space-y-6">
        <div className="flex items-center justify-between">
          <span className="font-caps text-xs text-muted-foreground uppercase tracking-wider font-mono font-semibold">
            &lt;certificates/&gt;
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            {certifications.length} certificates
          </span>
        </div>

        <div className="space-y-8">
          {certGroups.map((group) => (
            <div key={group.id} className="space-y-3.5">
              <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-border-hairline/50">
                <div className="flex items-center gap-2 min-w-0">
                  <h3 className="font-sans text-xs font-semibold text-ink tracking-wide uppercase">
                    {group.label}
                  </h3>
                  <span className="font-mono text-[10px] text-muted-foreground/70 hidden sm:inline">
                    {group.syntaxLabel}
                  </span>
                </div>
                <span className="font-mono text-[11px] text-muted-foreground tabular-nums shrink-0">
                  {String(group.items.length).padStart(2, "0")}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {group.items.map((cert) => {
                  const hasPreview = hasPreviewableDocument(cert);
                  const verifyHref = getVerifyHref(cert);
                  const metaText = getCertificationMetaText(cert);

                  return (
                    <div
                      key={cert.name}
                      className="p-4 sm:p-5 rounded-xl bg-surface/30 border border-border-hairline hover:bg-surface/60 transition-all duration-200 flex flex-col justify-between group shadow-2xs relative overflow-hidden"
                    >
                      <div className="space-y-3.5">
                        <div className="flex items-center justify-between gap-2">
                          <div className="w-9 h-9 rounded-lg bg-surface border border-border-hairline flex items-center justify-center p-1.5 shadow-2xs">
                            <IssuerLogo cert={cert} />
                          </div>
                          <CertificationTagBadge cert={cert} />
                        </div>

                        <div className="space-y-1">
                          <h4 className="font-sans text-sm font-semibold text-ink group-hover:text-brand transition-colors line-clamp-2 leading-snug">
                            {cert.name}
                          </h4>
                          <p className="font-sans text-xs text-muted-foreground line-clamp-2">
                            Issued by <span className="text-body font-medium">{cert.issuer}</span>
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 mt-3 border-t border-border-hairline/40 flex items-center justify-between gap-2">
                        {metaText ? (
                          <span className="font-mono text-[10px] text-muted-foreground bg-muted-subtle/80 px-2 py-0.5 rounded border border-border-hairline truncate max-w-[170px]">
                            {metaText}
                          </span>
                        ) : (
                          <span className="font-mono text-[10px] text-muted-foreground/60 italic">
                            Verified
                          </span>
                        )}

                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {hasPreview && (
                            <button
                              type="button"
                              onClick={() => {
                                playClick();
                                setPreviewCert(cert);
                              }}
                              onMouseEnter={playHover}
                              className="tactile-btn gap-1 text-xs px-2.5 py-1"
                              title={`Inspect certificate for ${cert.name}`}
                            >
                              <Eye className="w-3 h-3 opacity-70" />
                              <span>Inspect</span>
                            </button>
                          )}

                          {verifyHref && (
                            <a
                              href={verifyHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={cert.verifyUrl ? "Verify badge on Credly" : `Verify ${cert.name}`}
                              className="tactile-btn gap-1 text-xs px-2.5 py-1"
                            >
                              <ExternalLink className="w-3 h-3 opacity-70" />
                              <span>Verify</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="border-l-2 border-border-hairline pl-3 italic text-muted-foreground/90">
            “Certifications are milestones, but real learning never stops.”
          </div>
          <span className="font-mono text-[11px] text-muted-foreground/60 tracking-wider font-medium sm:text-right">
            Keep Building
          </span>
        </div>
      </section>

      {previewCert && mounted && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Certificate preview: ${previewCert.name}`}
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6"
        >
          <div
            onClick={() => setPreviewCert(null)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            aria-hidden="true"
          />

          <div className="relative z-10 w-full max-w-2xl bg-surface border border-border-hairline rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="px-4 py-3 border-b border-border-hairline flex items-center justify-between gap-3 bg-surface/90">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <CertificationTagBadge cert={previewCert} />
                  {getCertificationMetaText(previewCert) && (
                    <span className="text-xs font-mono text-muted-foreground truncate">
                      {getCertificationMetaText(previewCert)}
                    </span>
                  )}
                </div>
                <h4 className="font-sans text-sm sm:text-base font-semibold text-ink truncate mt-1">
                  {previewCert.name}
                </h4>
                <p className="text-xs font-mono text-muted-foreground truncate">
                  {previewCert.issuer}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setPreviewCert(null)}
                className="p-1.5 rounded-md text-muted-foreground hover:text-ink hover:bg-surface-hover transition-colors cursor-pointer flex-shrink-0"
                aria-label="Close certificate preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <CertificationDocumentPreview cert={previewCert} />

            <div className="px-4 py-2.5 border-t border-border-hairline flex flex-wrap items-center justify-between gap-2 bg-surface/50 font-mono text-xs">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Verified Credential Document
              </span>
              <div className="flex items-center gap-3">
                {previewCert.verifyUrl && (
                  <a
                    href={previewCert.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-brand hover:underline font-medium transition-colors"
                  >
                    <span>Verify on Credly</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {previewCert.href && previewCert.href !== "#" && (
                  <a
                    href={previewCert.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-ink hover:text-brand font-medium transition-colors"
                  >
                    <span>{isPdfCertificate(previewCert) ? "Open PDF" : "Open Full Size"}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
