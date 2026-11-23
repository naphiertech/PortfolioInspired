"use client";

import React, { useMemo, useState } from "react";
import {
  CertificationCategory,
  CertificationItem,
  certifications,
  getTopLevelCertificationGroups,
  getTopLevelCertifications,
} from "@/lib/data";
import {
  CertificationBoxCard,
  CertificationInspectorModal,
} from "@/components/CertificationShared";

/**
 * MinimalCertifications
 *
 * Calm, straight (zero-tilt) warm-monochrome 2-column box grid with compact
 * category filters and split-pane Career Path document inspection modal.
 */
export function MinimalCertifications() {
  const [activeFilter, setActiveFilter] = useState<"all" | CertificationCategory>("all");
  const [selectedCert, setSelectedCert] = useState<CertificationItem | null>(null);

  const topLevelCerts = useMemo(() => getTopLevelCertifications(certifications), []);
  const certGroups = useMemo(() => getTopLevelCertificationGroups(certifications), []);
  const visibleCerts = useMemo(
    () =>
      activeFilter === "all"
        ? topLevelCerts
        : topLevelCerts.filter((c) => c.category === activeFilter),
    [activeFilter, topLevelCerts]
  );

  return (
    <>
      <section
        id="minimal-certifications"
        data-guide="certifications"
        data-creative-note="certifications"
        className="space-y-5 pt-8 pb-10 border-b border-zinc-200/80 dark:border-white/[0.08]"
      >
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-serif italic text-lg sm:text-xl text-zinc-800 dark:text-[#dedad0] font-normal">
            Certifications
          </h2>
          <span className="font-mono text-xs text-zinc-500 dark:text-[#827d73] tabular-nums">
            {certifications.length} verified
          </span>
        </div>

        {/* Quiet Editorial Category Filter */}
        <div
          role="group"
          aria-label="Filter certifications by category"
          className="inline-flex flex-wrap items-center gap-1 p-1 rounded-full border border-zinc-200/85 dark:border-white/[0.1] bg-zinc-50/80 dark:bg-white/[0.02]"
        >
          <button
            type="button"
            aria-pressed={activeFilter === "all"}
            onClick={() => setActiveFilter("all")}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[11px] transition-colors cursor-pointer ${
              activeFilter === "all"
                ? "bg-zinc-900 dark:bg-[#eae6df] text-white dark:text-[#111211] font-semibold"
                : "text-zinc-600 dark:text-[#9e998e] hover:text-zinc-900 dark:hover:text-[#eae6df]"
            }`}
          >
            <span>All</span>
            <span className="text-[10px] tabular-nums opacity-75">{topLevelCerts.length}</span>
          </button>

          {certGroups.map((group) => {
            const isActive = activeFilter === group.id;
            return (
              <button
                key={group.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveFilter(group.id)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[11px] transition-colors cursor-pointer ${
                  isActive
                    ? "bg-zinc-900 dark:bg-[#eae6df] text-white dark:text-[#111211] font-semibold"
                    : "text-zinc-600 dark:text-[#9e998e] hover:text-zinc-900 dark:hover:text-[#eae6df]"
                }`}
              >
                <span>{group.shortLabel}</span>
                <span className="text-[10px] tabular-nums opacity-75">{group.items.length}</span>
              </button>
            );
          })}
        </div>

        {/* Straight 2-Column Double-Bordered Credential Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {visibleCerts.map((cert) => (
            <CertificationBoxCard
              key={cert.name}
              cert={cert}
              variant="minimal"
              onSelect={setSelectedCert}
            />
          ))}
        </div>
      </section>

      <CertificationInspectorModal
        selectedCert={selectedCert}
        onClose={() => setSelectedCert(null)}
        variant="minimal"
      />
    </>
  );
}

export default MinimalCertifications;
