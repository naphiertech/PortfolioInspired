"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { usePresentationMode } from "../context/PresentationModeContext";
import { ArtisanPortfolioLayout } from "../modes/artisan/ArtisanPortfolioLayout";
import {
  CertificationBadgeCard,
  CertificationPreviewModal,
} from "../modes/artisan/CertificationCard";
import {
  certifications,
  CertificationCategory,
  CertificationItem,
  getCertificationGroups,
  getTopLevelCertifications,
  getTopLevelCertificationGroups,
} from "@/lib/data";

function ArtisanCertificationsStandalone() {
  const [selectedCert, setSelectedCert] = useState<CertificationItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<"all" | CertificationCategory>("all");

  const topLevelCerts = useMemo(() => getTopLevelCertifications(certifications), []);
  const certGroups = useMemo(() => getTopLevelCertificationGroups(certifications), []);
  const allGroups = useMemo(() => getCertificationGroups(), []);
  const visibleCerts = useMemo(
    () =>
      activeFilter === "all"
        ? topLevelCerts
        : topLevelCerts.filter((c) => c.category === activeFilter),
    [activeFilter, topLevelCerts]
  );

  return (
    <div className="w-full max-w-3xl mx-auto pt-10 sm:pt-12 pb-6 px-5 sm:px-6 space-y-8">
      <div className="space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-sans text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          <span>Home</span>
        </Link>

        <div className="flex flex-wrap items-end justify-between gap-4 pb-5 border-b border-black/10 dark:border-white/10">
          <div className="space-y-1.5">
            <h1 className="font-mono text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
              Certifications
            </h1>
            <p className="font-sans text-xs sm:text-sm text-foreground/75 leading-relaxed max-w-xl">
              Verified technical courses, Cisco Networking Academy career paths, and community credentials across AI, cybersecurity, and networking.
            </p>
          </div>
          <span className="font-sans text-xs text-muted-foreground tabular-nums px-3 py-1 rounded-full border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03]">
            {certifications.length} Verified
          </span>
        </div>
      </div>

      {/* Category Filters */}
      <div
        role="group"
        aria-label="Filter certifications by category"
        className="inline-flex flex-wrap items-center gap-1 p-1 rounded-full border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02]"
      >
        <button
          type="button"
          aria-pressed={activeFilter === "all"}
          onClick={() => setActiveFilter("all")}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-sans text-xs font-medium transition-colors cursor-pointer ${
            activeFilter === "all"
              ? "bg-foreground text-background shadow-2xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <span>All</span>
          <span className="font-mono text-[10.5px] tabular-nums opacity-75">
            {topLevelCerts.length}
          </span>
        </button>

        {certGroups.map((group) => {
          const isActive = activeFilter === group.id;
          return (
            <button
              key={group.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActiveFilter(group.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-sans text-xs font-medium transition-colors cursor-pointer ${
                isActive
                  ? "bg-foreground text-background shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>{group.shortLabel}</span>
              <span className="font-mono text-[10.5px] tabular-nums opacity-75">
                {group.items.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Credential Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
        {visibleCerts.map((cert) => (
          <CertificationBadgeCard
            key={cert.name}
            cert={cert}
            onSelect={setSelectedCert}
          />
        ))}
      </div>

      {/* Verification Context */}
      <section
        aria-label="Credential focus and verification"
        className="p-5 rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] space-y-2"
      >
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
            Verification Notes
          </h2>
          <span className="font-sans text-[11px] text-muted-foreground">
            {allGroups.length} categories
          </span>
        </div>
        <p className="font-sans text-xs sm:text-sm text-foreground/75 leading-relaxed">
          Credentials span {allGroups.map((g) => `${g.label} (${g.items.length})`).join(", ")}.
          Led by the Neo4j &amp; Generative AI Certification verified live on Neo4j GraphAcademy alongside two Credly-verified Cisco Networking Academy career paths (6-course Junior Cybersecurity Analyst and 4-course Network Technician), plus Google Developer Groups and DICT credentials with inspectable source documents.
        </p>
      </section>

      <nav
        aria-label="Related portfolio pages"
        className="pt-5 border-t border-black/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-4 font-sans text-xs"
      >
        <Link
          href="/experience"
          className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>Full Experience &amp; Background</span>
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
        <Link
          href="/tech-stack"
          className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>Explore Tech Stack</span>
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </nav>

      <CertificationPreviewModal
        selectedCert={selectedCert}
        onClose={() => setSelectedCert(null)}
      />
    </div>
  );
}

export function CertificationsPresentationRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  const { mode } = usePresentationMode();

  if (mode === "agent") {
    return (
      <ArtisanPortfolioLayout
        defaultTab="experience"
        initialSectionNode={<ArtisanCertificationsStandalone />}
      />
    );
  }

  return <>{children}</>;
}

export default CertificationsPresentationRoot;
