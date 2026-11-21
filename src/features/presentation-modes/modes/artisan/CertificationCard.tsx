"use client";

import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LuArrowUpRight, LuX } from "react-icons/lu";
import {
  CertificationItem,
  hasPreviewableDocument,
  isPdfCertificate,
} from "@/lib/data";
import {
  IssuerLogo,
  CertificationDocumentPreview,
  getCertificationMetaText,
} from "@/components/CertificationShared";

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
      <path d="M5.2 5.5C3.2 5 2 3.5 2.2 2C3.8 2.2 5 3.5 5.2 5.5Z" fill="currentColor" />
      <path d="M5.3 9.8C3 9.5 1.5 8 1.5 6.2C3.3 6.3 4.8 7.8 5.3 9.8Z" fill="currentColor" />
      <path d="M6.8 14C4.4 14.2 2.6 13 2.3 11.2C4.2 11 5.9 12.2 6.8 14Z" fill="currentColor" />
      <path d="M5.5 6.2C7.3 5.4 8.5 3.8 8.2 2.2C6.6 2.6 5.5 4.2 5.5 6.2Z" fill="currentColor" />
      <path d="M5.8 10.5C7.8 9.9 9.1 8.4 8.9 6.7C7.2 7 6 8.5 5.8 10.5Z" fill="currentColor" />
    </svg>
  );
}

interface CertificationBadgeCardProps {
  cert: CertificationItem;
  onSelect: (cert: CertificationItem) => void;
}

/** Framed credential badge reusing the editorial double-border and laurel motif. */
export function CertificationBadgeCard({ cert, onSelect }: CertificationBadgeCardProps) {
  const hasPreview = hasPreviewableDocument(cert);

  return (
    <button
      type="button"
      onClick={() => {
        if (hasPreview) onSelect(cert);
      }}
      className={`group rounded-2xl p-1.5 border border-black/[0.07] dark:border-white/[0.07] bg-black/[0.015] dark:bg-white/[0.02] transition-all duration-300 text-center ${
        hasPreview
          ? "hover:border-black/15 dark:hover:border-white/15 cursor-pointer"
          : "cursor-default"
      }`}
    >
      <div className="h-full rounded-xl border border-black/10 dark:border-white/10 bg-background px-4 py-5 flex flex-col items-center justify-between gap-4 transition-colors group-hover:border-black/20 dark:group-hover:border-white/20">
        <div className="size-11 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] flex items-center justify-center shadow-2xs shrink-0">
          <IssuerLogo cert={cert} className="size-5" />
        </div>

        <div className="space-y-1.5">
          <h4 className="font-mono text-base sm:text-lg font-semibold tracking-tight text-foreground leading-snug line-clamp-2">
            {cert.name}
          </h4>
          <span className="block font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {cert.tag || "VERIFIED"}
            {cert.issuedAt ? ` · ${cert.issuedAt}` : ""}
          </span>
          {cert.trackLabel && (
            <span className="inline-block font-mono text-[9px] font-medium uppercase tracking-[0.14em] px-2 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-foreground/80 border border-black/10 dark:border-white/10">
              {cert.trackLabel}
            </span>
          )}
        </div>

        <div className="inline-flex items-center gap-1.5 pt-0.5">
          <LaurelBranch />
          <span className="font-sans text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground group-hover:text-foreground transition-colors">
            {hasPreview ? "Inspect" : "Verified"}
          </span>
          <LaurelBranch flip />
        </div>
      </div>
    </button>
  );
}

interface CertificationPreviewModalProps {
  selectedCert: CertificationItem | null;
  onClose: () => void;
}

/** Shared certificate lightbox with Escape dismissal, PDF support, and Credly/document links. */
export function CertificationPreviewModal({
  selectedCert,
  onClose,
}: CertificationPreviewModalProps) {
  useEffect(() => {
    if (!selectedCert) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopImmediatePropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [selectedCert, onClose]);

  const metaText = selectedCert ? getCertificationMetaText(selectedCert) : null;

  return (
    <AnimatePresence>
      {selectedCert && (
        <motion.div
          key="cert-preview-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
        >
          <div
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-md cursor-pointer"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={selectedCert.name}
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.16 }}
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
                  {metaText && (
                    <span className="text-[11px] font-sans text-muted-foreground truncate">
                      {metaText}
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
                onClick={onClose}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer shrink-0"
                aria-label="Close certificate preview"
              >
                <LuX className="size-5" aria-hidden="true" />
              </button>
            </div>

            <div className="bg-muted/30">
              <CertificationDocumentPreview cert={selectedCert} />
            </div>

            <div className="px-4 py-3 border-t border-black/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-2 bg-muted/10">
              <span className="text-xs font-sans text-muted-foreground">
                Verified Credential
              </span>
              <div className="flex items-center gap-4">
                {selectedCert.verifyUrl && (
                  <a
                    href={selectedCert.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-sans font-medium text-foreground hover:underline"
                  >
                    <span>Verify on Credly</span>
                    <LuArrowUpRight className="size-3.5" aria-hidden="true" />
                  </a>
                )}
                <a
                  href={selectedCert.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-sans font-medium text-foreground hover:underline"
                >
                  <span>
                    {isPdfCertificate(selectedCert) ? "Open PDF" : "Open Full Image"}
                  </span>
                  <LuArrowUpRight className="size-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
