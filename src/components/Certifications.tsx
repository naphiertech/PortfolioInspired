"use client";

import React from "react";
import { ExternalLink } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { getFeaturedCertifications, getTrackCourses, getVerifyHref } from "@/lib/data";
import {
  IssuerLogo,
  CertificationTagBadge,
  CareerPathBadge,
  getCertificationMetaText,
} from "./CertificationShared";
import { SectionHeader } from "./SectionHeader";
import {
  sectionContainerVariants,
  staggeredGridVariants,
  gridItemVariants,
  contentBlockVariants,
} from "@/lib/motion";

export function Certifications() {
  const featuredCerts = getFeaturedCertifications(3);
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView={shouldReduceMotion ? undefined : "visible"}
      viewport={{ once: true, amount: 0.15 }}
      variants={shouldReduceMotion ? undefined : sectionContainerVariants}
      className="w-full space-y-6 select-none mb-16"
      aria-label="Certifications"
    >
      {/* Consistent Section Header */}
      <SectionHeader
        label="CERTIFICATIONS"
        description="Programs and achievements that reflect my continued learning."
        actionHref="/experience#certifications"
        actionLabel="view all certifications"
        className="mb-6 pb-2 border-b border-border-hairline/40"
      />

      {/* 3-Column Card Grid */}
      <motion.div
        variants={shouldReduceMotion ? undefined : staggeredGridVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-4.5"
      >
        {featuredCerts.map((cert) => {
          const verifyHref = getVerifyHref(cert);
          const metaText = getCertificationMetaText(cert);

          return (
            <motion.div
              key={cert.name}
              variants={shouldReduceMotion ? undefined : gridItemVariants}
              className="relative p-4 sm:p-4.5 rounded-xl bg-surface/30 border border-border-hairline hover:bg-surface/60 hover:border-border-hairline transition-all duration-200 group flex flex-col justify-between overflow-hidden shadow-2xs"
            >
              {/* Subtle decorative curve in dark mode */}
              <svg
                className="absolute right-0 top-0 w-28 h-28 pointer-events-none opacity-5 dark:opacity-15 stroke-brand transition-opacity group-hover:opacity-20"
                viewBox="0 0 100 100"
                fill="none"
              >
                <path d="M100 0 C70 15 35 45 35 100" stroke="currentColor" strokeWidth="1" />
              </svg>

              <div className="space-y-3.5 relative z-10">
                {/* Issuer Logo + Tag Header */}
                <div className="flex items-center justify-between gap-2">
                  <div className="w-9 h-9 rounded-lg bg-surface border border-border-hairline flex items-center justify-center p-1.5 shadow-2xs group-hover:border-border-hairline transition-colors shrink-0">
                    <IssuerLogo cert={cert} />
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap justify-end">
                    {cert.trackId && (
                      <CareerPathBadge
                        label={`${getTrackCourses(cert.trackId).length}-COURSE PATH`}
                      />
                    )}
                    <CertificationTagBadge cert={cert} />
                  </div>
                </div>

                {/* Title & Organization */}
                <div className="space-y-1">
                  <h3 className="font-sans text-sm font-semibold text-ink group-hover:text-brand transition-colors line-clamp-2 leading-snug min-h-[2.5rem]">
                    {cert.name}
                  </h3>
                  <p className="font-sans text-xs text-muted-foreground line-clamp-2">
                    {cert.issuer}
                  </p>
                </div>
              </div>

              {/* Bottom Credential Meta & Action */}
              <div className="pt-3 mt-3 border-t border-border-hairline/40 flex items-center justify-between gap-2 relative z-10">
                {metaText ? (
                  <span className="font-mono text-[10px] text-muted-foreground bg-muted-subtle/80 px-2 py-0.5 rounded border border-border-hairline truncate max-w-[170px]">
                    {metaText}
                  </span>
                ) : (
                  <span className="font-mono text-[10px] text-muted-foreground/60 italic">
                    Verified
                  </span>
                )}

                {verifyHref ? (
                  <a
                    href={verifyHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={cert.verifyUrl ? "Verify on Credly" : "View certificate"}
                    aria-label={
                      cert.verifyUrl
                        ? `Verify ${cert.name} on Credly`
                        : `View certificate for ${cert.name}`
                    }
                    className="text-muted-foreground/40 group-hover:text-ink transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 p-1 -m-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/20" />
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Bottom Quote / Tagline */}
      <motion.div
        variants={shouldReduceMotion ? undefined : contentBlockVariants}
        className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground"
      >
        <div className="border-l-2 border-border-hairline pl-3 italic text-muted-foreground/90">
          “Certifications are milestones, but real learning never stops.”
        </div>
        <span className="font-mono text-[11px] text-muted-foreground/60 tracking-wider font-medium sm:text-right">
          Keep Building
        </span>
      </motion.div>
    </motion.section>
  );
}

export default Certifications;
