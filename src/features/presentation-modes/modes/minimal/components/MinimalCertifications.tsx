"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import {
  CertificationItem,
  certifications,
  getTopLevelCertifications,
  getTrackCourses,
  hasPreviewableDocument,
  isPdfCertificate,
} from "@/lib/data";
import {
  CertificationInspectorModal,
  IssuerLogo,
} from "@/components/CertificationShared";

function getDisplayCertTitle(name: string): string {
  return name.replace(/\s+Career Path$/i, "");
}

function getIssuerMetaDomain(cert: CertificationItem): string {
  const issuer = cert.issuer.toLowerCase();
  if (issuer.includes("neo4j")) return "graphacademy.neo4j.com";
  if (issuer.includes("cisco")) return "netacad.com";
  if (issuer.includes("dict")) return "dict.gov.ph";
  if (issuer.includes("google")) return "gdg.community";
  return cert.issuer;
}

function getCertYear(cert: CertificationItem): string {
  if (cert.issuedAt) return cert.issuedAt;
  const match = cert.name.match(/\b(20\d{2})\b/);
  return match ? match[1] : "2026";
}

interface TiltedHoverPreviewProps {
  cert: CertificationItem;
  displayName: string;
  trackCourseCount: number;
  isRightColumn: boolean;
}

function TiltedHoverPreview({
  cert,
  displayName,
  trackCourseCount,
  isRightColumn,
}: TiltedHoverPreviewProps) {
  const hasImage = hasPreviewableDocument(cert) && !isPdfCertificate(cert);
  const isPdf = hasPreviewableDocument(cert) && isPdfCertificate(cert);

  return (
    <div
      aria-hidden="true"
      className={`hidden sm:block pointer-events-none absolute bottom-[calc(100%-4px)] z-30 w-[228px] transition-all duration-200 ease-out opacity-0 translate-y-2 scale-95 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 group-focus-visible:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:scale-100 motion-reduce:transition-none ${
        isRightColumn
          ? "right-3 rotate-[3.5deg]"
          : "left-3 -rotate-[3.5deg]"
      }`}
    >
      <div className="p-1.5 rounded-lg bg-white dark:bg-[#1a1b1a] border border-zinc-200/95 dark:border-white/[0.14] shadow-[0_14px_34px_rgba(0,0,0,0.16)] dark:shadow-[0_18px_42px_rgba(0,0,0,0.62)]">
        {hasImage ? (
          <div className="relative w-full aspect-[16/11] rounded-[5px] overflow-hidden bg-zinc-100 dark:bg-black/40 border border-zinc-200/70 dark:border-white/[0.08]">
            <Image
              src={cert.href}
              alt=""
              fill
              sizes="220px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="relative w-full aspect-[16/11] rounded-[5px] overflow-hidden bg-zinc-50 dark:bg-[#121312] border border-zinc-200/85 dark:border-white/[0.1] p-2.5 flex flex-col justify-between">
            <div className="pointer-events-none absolute inset-1 rounded-[3px] border border-zinc-200/70 dark:border-white/[0.06]" />
            <div className="relative flex items-center justify-between gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-white dark:bg-[#1d1e1d] border border-zinc-200/90 dark:border-white/[0.1]">
                <IssuerLogo cert={cert} className="w-3.5 h-3.5" />
              </span>
              <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-500 dark:text-[#8e897e]">
                {isPdf ? "PDF Credential" : "Certificate"}
              </span>
            </div>

            <div className="relative space-y-0.5">
              <p className="font-sans text-[11px] font-semibold text-zinc-900 dark:text-[#eae6df] leading-tight line-clamp-2">
                {displayName}
              </p>
              <p className="font-mono text-[9.5px] text-zinc-500 dark:text-[#868176]">
                {trackCourseCount > 0
                  ? `${trackCourseCount} included courses · Click to view`
                  : `${getIssuerMetaDomain(cert)} · ${getCertYear(cert)}`}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * MinimalCertifications
 *
 * Compact 2-column hairline-divided editorial certificate grid with a slight-tilt
 * floating certificate preview on desktop hover and full modal inspection on click.
 */
export function MinimalCertifications() {
  const [selectedCert, setSelectedCert] = useState<CertificationItem | null>(
    null
  );

  const topLevelCerts = useMemo(
    () => getTopLevelCertifications(certifications),
    []
  );

  return (
    <>
      <section
        id="minimal-certifications"
        data-guide="certifications"
        data-creative-note="certifications"
        className="pt-8 pb-10 border-b border-zinc-200/80 dark:border-white/[0.08]"
      >
        <div className="flex items-baseline justify-between gap-3 pb-3.5 border-b border-dashed border-zinc-200/90 dark:border-white/[0.1]">
          <h2 className="font-serif italic text-lg sm:text-xl text-zinc-800 dark:text-[#dedad0] font-normal">
            Certificates
          </h2>
          <span className="font-mono text-xs text-zinc-500 dark:text-[#827d73] tabular-nums">
            {certifications.length} verified
          </span>
        </div>

        {/* 2-Column Hairline-Divided Compact Certificate Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 border-b border-zinc-200/75 dark:border-white/[0.08]">
          {topLevelCerts.map((cert, index) => {
            const displayName = getDisplayCertTitle(cert.name);
            const trackCourses = cert.trackId
              ? getTrackCourses(cert.trackId, certifications)
              : [];
            const isRightColumn = index % 2 === 1;
            const metaLine =
              trackCourses.length > 0
                ? `${getIssuerMetaDomain(cert)} · ${trackCourses.length} courses`
                : `${getIssuerMetaDomain(cert)} · ${getCertYear(cert)}`;

            return (
              <button
                key={cert.name}
                type="button"
                onClick={() => setSelectedCert(cert)}
                aria-label={`Inspect ${cert.name}`}
                className={`group relative flex items-center gap-3.5 px-3 sm:px-4 py-4 text-left transition-colors duration-150 hover:bg-zinc-100/60 dark:hover:bg-white/[0.025] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-zinc-900 dark:focus-visible:ring-[#eae6df] cursor-pointer ${
                  index > 0
                    ? "border-t border-zinc-200/75 dark:border-white/[0.08]"
                    : ""
                } ${
                  index === 1 ? "sm:border-t-0" : ""
                } ${
                  !isRightColumn
                    ? "sm:border-r sm:border-zinc-200/75 sm:dark:border-white/[0.08]"
                    : ""
                }`}
              >
                {/* Slight-degree floating certificate preview on desktop hover */}
                <TiltedHoverPreview
                  cert={cert}
                  displayName={displayName}
                  trackCourseCount={trackCourses.length}
                  isRightColumn={isRightColumn}
                />

                {/* Quiet Square Logo Tile */}
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-white dark:bg-[#161716] border border-zinc-200/90 dark:border-white/[0.09] shrink-0 shadow-[0_1px_0_rgba(0,0,0,0.03)] dark:shadow-none">
                  <IssuerLogo cert={cert} className="w-[18px] h-[18px]" />
                </span>

                {/* Title + Monospace Issuer/Year Meta */}
                <span className="min-w-0 flex-1">
                  <span className="block font-sans text-[13.5px] sm:text-[14px] font-medium text-zinc-900 dark:text-[#eae6df] leading-snug truncate">
                    {displayName}
                  </span>
                  <span className="block font-mono text-[11px] text-zinc-500 dark:text-[#868176] mt-0.5 truncate">
                    {metaLine}
                  </span>
                </span>

                {/* Subtle Diagonal Inspect Arrow */}
                <ArrowUpRight
                  className="w-3.5 h-3.5 text-zinc-400 dark:text-[#6f6b62] group-hover:text-zinc-900 dark:group-hover:text-[#eae6df] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-150 shrink-0"
                  aria-hidden="true"
                />
              </button>
            );
          })}
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
