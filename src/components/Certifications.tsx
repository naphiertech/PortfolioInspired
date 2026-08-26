"use client";

import React from "react";
import { ExternalLink, Award } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { certifications } from "@/lib/data";
import { SectionHeader } from "./SectionHeader";
import {
  sectionContainerVariants,
  staggeredGridVariants,
  gridItemVariants,
  contentBlockVariants,
} from "@/lib/motion";

function GoogleLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
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

function DICTLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none">
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

export function Certifications() {
  const featuredCerts = certifications.slice(0, 3);
  const shouldReduceMotion = useReducedMotion();

  const getIssuerLogo = (cert: (typeof certifications)[0]) => {
    if (cert.tag === "GOOGLE" || cert.issuer.includes("Google")) {
      return <GoogleLogo />;
    }
    if (cert.tag === "DICT" || cert.issuer.includes("DICT") || cert.issuer.includes("Information and Communications")) {
      return <DICTLogo />;
    }
    return <Award className="w-5 h-5 text-muted-foreground" />;
  };

  const getTagBadge = (cert: (typeof certifications)[0]) => {
    if (cert.tag === "GOOGLE" || cert.issuer.includes("Google")) {
      return (
        <span className="font-mono text-[9px] font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
          GOOGLE
        </span>
      );
    }
    if (cert.tag === "DICT" || cert.issuer.includes("DICT") || cert.issuer.includes("Information and Communications")) {
      return (
        <span className="font-mono text-[9px] font-bold tracking-wider px-2 py-0.5 rounded bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
          DICT
        </span>
      );
    }
    return (
      <span className="font-mono text-[9px] font-bold tracking-wider px-2 py-0.5 rounded bg-muted-subtle text-muted-foreground border border-border-hairline">
        CREDENTIAL
      </span>
    );
  };

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
        actionHref="/certifications"
        actionLabel="all certifications"
        className="mb-6 pb-2 border-b border-border-hairline/40"
      />

      {/* 3-Column Card Grid */}
      <motion.div
        variants={shouldReduceMotion ? undefined : staggeredGridVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-4.5"
      >
        {featuredCerts.map((cert) => {
          const isInteractive = cert.href && cert.href !== "#";

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
                  <div className="w-9 h-9 rounded-lg bg-surface border border-border-hairline flex items-center justify-center p-1.5 shadow-2xs group-hover:border-border-hairline transition-colors">
                    {getIssuerLogo(cert)}
                  </div>
                  {getTagBadge(cert)}
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

              {/* Bottom Credential ID & Action */}
              <div className="pt-3 mt-3 border-t border-border-hairline/40 flex items-center justify-between gap-2 relative z-10">
                {cert.code ? (
                  <span className="font-mono text-[10px] text-muted-foreground bg-muted-subtle/80 px-2 py-0.5 rounded border border-border-hairline truncate max-w-[170px]">
                    ID: {cert.code}
                  </span>
                ) : (
                  <span className="font-mono text-[10px] text-muted-foreground/60 italic">
                    Verified
                  </span>
                )}

                {isInteractive ? (
                  <a
                    href={cert.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground/40 group-hover:text-ink transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 p-1 -m-1"
                    aria-label={`View certificate for ${cert.name}`}
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
