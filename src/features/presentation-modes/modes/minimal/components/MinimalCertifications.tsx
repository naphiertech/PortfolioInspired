"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, X } from "lucide-react";
import {
  CertificationItem,
  certifications,
  getFeaturedCertifications,
  hasPreviewableDocument,
  isPdfCertificate,
} from "@/lib/data";
import {
  CertificationDocumentPreview,
  IssuerLogo,
  getCertificationMetaText,
} from "@/components/CertificationShared";

const INITIAL_VISIBLE_COUNT = 4;
const CARD_TILTS = [
  "-rotate-[1.8deg]",
  "rotate-[1.5deg]",
  "rotate-[1.4deg]",
  "-rotate-[1.7deg]",
  "-rotate-[1.3deg]",
  "rotate-[1.6deg]",
  "-rotate-[1.5deg]",
];

interface MinimalCertCardProps {
  cert: CertificationItem;
  index: number;
  reducedMotion: boolean | null;
  onSelect: (cert: CertificationItem) => void;
}

function MinimalCertCard({
  cert,
  index,
  reducedMotion,
  onSelect,
}: MinimalCertCardProps) {
  const hasPreview = hasPreviewableDocument(cert);
  const tiltClass = reducedMotion ? "" : CARD_TILTS[index % CARD_TILTS.length];
  const interactiveTilt = reducedMotion
    ? ""
    : `${tiltClass} hover:rotate-0 focus-visible:rotate-0 hover:-translate-y-1 focus-visible:-translate-y-1 hover:z-10 focus-visible:z-10`;

  const cardInner = (
    <div
      className={`h-full rounded-[13px] border border-zinc-200/90 dark:border-white/[0.09] bg-white dark:bg-[#141514] px-4 py-5 flex flex-col items-center justify-between gap-3.5 text-center transition-colors duration-200 ${
        hasPreview
          ? "group-hover:border-zinc-300 dark:group-hover:border-white/[0.18]"
          : ""
      }`}
    >
      {/* Top-Centered Issuer Emblem */}
      <div className="w-9 h-9 rounded-lg border border-zinc-200/80 dark:border-white/[0.1] bg-zinc-50/90 dark:bg-white/[0.03] flex items-center justify-center shadow-2xs flex-shrink-0">
        <IssuerLogo cert={cert} className="w-5 h-5" />
      </div>

      {/* Title & Uppercase Issuer Tag */}
      <div className="space-y-1 w-full">
        <h3 className="font-serif text-[16px] sm:text-[17px] font-medium text-zinc-900 dark:text-[#eae6df] leading-snug tracking-tight min-h-[2.75rem] flex items-center justify-center">
          <span className="line-clamp-2">{cert.name}</span>
        </h3>
        <span className="block font-mono text-[10px] tracking-[0.18em] uppercase text-zinc-500 dark:text-[#827d73]">
          {cert.trackLabel || cert.tag || "VERIFIED"}
        </span>
      </div>

      {/* Bottom Verify Cue */}
      <div className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-400 dark:text-[#827d73] group-hover:text-zinc-900 dark:group-hover:text-[#eae6df] transition-colors pt-0.5">
        <span
          aria-hidden="true"
          className="text-zinc-300 dark:text-white/[0.18] group-hover:text-zinc-500 dark:group-hover:text-[#beb9ad] transition-colors"
        >
          &lt;
        </span>
        <span>{hasPreview ? "VERIFY" : "VERIFIED"}</span>
        <span
          aria-hidden="true"
          className="text-zinc-300 dark:text-white/[0.18] group-hover:text-zinc-500 dark:group-hover:text-[#beb9ad] transition-colors"
        >
          &gt;
        </span>
      </div>
    </div>
  );

  const shellClass = `group relative w-full rounded-[17px] p-1.5 border border-zinc-200/80 dark:border-white/[0.07] bg-zinc-50/70 dark:bg-white/[0.02] shadow-[0_6px_18px_-8px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_26px_-12px_rgba(0,0,0,0.75)] transition-all duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-800 dark:focus-visible:outline-[#eae6df] ${
    hasPreview
      ? `${interactiveTilt} hover:shadow-[0_14px_28px_-10px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_18px_32px_-12px_rgba(0,0,0,0.9)] cursor-pointer`
      : `${tiltClass} cursor-default opacity-90`
  }`;

  if (!hasPreview) {
    return (
      <div className={shellClass} aria-label={`${cert.name} (${cert.issuer})`}>
        {cardInner}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(cert)}
      className={shellClass}
      aria-label={`Inspect certificate: ${cert.name}`}
    >
      {cardInner}
    </button>
  );
}

/**
 * MinimalCertifications
 *
 * Tilted double-bordered credential deck styled in Minimal Mode's serif/mono tokens.
 * Displays 4 featured credentials initially with an inline View More reveal and PDF/Credly lightbox.
 */
export function MinimalCertifications() {
  const [expanded, setExpanded] = useState(false);
  const [selectedCert, setSelectedCert] = useState<CertificationItem | null>(null);
  const [mounted, setMounted] = useState(false);
  const reducedMotion = useReducedMotion();

  const featuredCerts = getFeaturedCertifications(INITIAL_VISIBLE_COUNT);
  const featuredNames = new Set(featuredCerts.map((c) => c.name));
  const extraCerts = certifications.filter((c) => !featuredNames.has(c.name));

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!selectedCert) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setSelectedCert(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedCert]);

  const selectedMeta = selectedCert ? getCertificationMetaText(selectedCert) : null;

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

        {/* Tilted Editorial Deck */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1.5 px-1">
            {featuredCerts.map((cert, idx) => (
              <MinimalCertCard
                key={cert.name}
                cert={cert}
                index={idx}
                reducedMotion={reducedMotion}
                onSelect={setSelectedCert}
              />
            ))}
          </div>

          <AnimatePresence initial={false}>
            {expanded && extraCerts.length > 0 && (
              <motion.div
                id="minimal-certifications-more"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{
                  duration: reducedMotion ? 0 : 0.25,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 pb-2.5 px-1">
                  {extraCerts.map((cert, idx) => (
                    <MinimalCertCard
                      key={cert.name}
                      cert={cert}
                      index={INITIAL_VISIBLE_COUNT + idx}
                      reducedMotion={reducedMotion}
                      onSelect={setSelectedCert}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {extraCerts.length > 0 && (
          <div>
            <button
              type="button"
              aria-expanded={expanded}
              aria-controls="minimal-certifications-more"
              onClick={() => setExpanded((prev) => !prev)}
              className="inline-flex items-center gap-1.5 min-h-[36px] font-serif italic text-[14px] sm:text-[15px] text-zinc-600 dark:text-[#9e998e] hover:text-zinc-900 hover:dark:text-[#eae6df] underline underline-offset-4 decoration-zinc-400/50 hover:decoration-current transition-colors cursor-pointer"
            >
              <span>
                {expanded ? "Show less" : `View more (${extraCerts.length})`}
              </span>
              <span aria-hidden="true" className="not-italic font-mono text-xs">
                {expanded ? "↑" : "↓"}
              </span>
            </button>
          </div>
        )}
      </section>

      {selectedCert && mounted &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Certificate preview: ${selectedCert.name}`}
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6"
          >
            <div
              onClick={() => setSelectedCert(null)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
              aria-hidden="true"
            />

            <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-zinc-200/90 dark:border-white/[0.1] bg-white dark:bg-[#141514] shadow-2xl overflow-hidden flex flex-col">
              <div className="px-5 py-3.5 border-b border-zinc-200/80 dark:border-white/[0.08] flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500 dark:text-[#827d73]">
                    <span>{selectedCert.tag || "VERIFIED"}</span>
                    {selectedMeta && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">{selectedMeta}</span>
                      </>
                    )}
                  </div>
                  <h4 className="font-serif text-lg sm:text-xl font-medium text-zinc-900 dark:text-[#eae6df] truncate mt-0.5">
                    {selectedCert.name}
                  </h4>
                  <p className="font-serif text-xs sm:text-sm text-zinc-600 dark:text-[#beb9ad] truncate">
                    {selectedCert.issuer}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedCert(null)}
                  className="p-1.5 rounded-lg text-zinc-500 dark:text-[#9e998e] hover:text-zinc-900 dark:hover:text-[#eae6df] hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer flex-shrink-0"
                  aria-label="Close certificate preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <CertificationDocumentPreview cert={selectedCert} />

              <div className="px-5 py-3 border-t border-zinc-200/80 dark:border-white/[0.08] flex flex-wrap items-center justify-between gap-3 font-mono text-xs bg-zinc-50/60 dark:bg-white/[0.02]">
                <span className="text-zinc-600 dark:text-[#9e998e] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Verified Credential
                </span>

                <div className="flex items-center gap-4">
                  {selectedCert.verifyUrl && (
                    <a
                      href={selectedCert.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-zinc-900 dark:text-[#eae6df] hover:underline underline-offset-4 font-medium"
                    >
                      <span>Verify on Credly</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {selectedCert.href && selectedCert.href !== "#" && (
                    <a
                      href={selectedCert.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-zinc-700 dark:text-[#beb9ad] hover:text-zinc-900 dark:hover:text-[#eae6df] hover:underline underline-offset-4 font-medium"
                    >
                      <span>{isPdfCertificate(selectedCert) ? "Open PDF" : "Open Full Size"}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
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

export default MinimalCertifications;
