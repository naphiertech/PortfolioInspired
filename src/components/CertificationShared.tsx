"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  ArrowUpRight,
  Award,
  CheckCircle2,
  ExternalLink,
  FileText,
  Layers,
  X,
} from "lucide-react";
import {
  CertificationItem,
  getTrackCourses,
  getVerifyPlatformLabel,
  hasPreviewableDocument,
  isPdfCertificate,
} from "@/lib/data";

export type CertificationSurfaceVariant = "standard" | "focus" | "minimal" | "artisan";

export function GoogleLogo({ className = "w-5 h-5" }: { className?: string }) {
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

export function DICTLogo({ className = "w-5 h-5" }: { className?: string }) {
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

export function CiscoLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="10.5" width="1.6" height="4" rx="0.8" fill="#049FD9" />
      <rect x="5" y="7.5" width="1.6" height="7" rx="0.8" fill="#049FD9" />
      <rect x="8" y="4.5" width="1.6" height="10" rx="0.8" fill="#00BCEB" />
      <rect x="11" y="7.5" width="1.6" height="7" rx="0.8" fill="#049FD9" />
      <rect x="14" y="4.5" width="1.6" height="10" rx="0.8" fill="#00BCEB" />
      <rect x="17" y="7.5" width="1.6" height="7" rx="0.8" fill="#049FD9" />
      <rect x="20" y="10.5" width="1.6" height="4" rx="0.8" fill="#049FD9" />
      <path
        d="M3.5 18.2H20.5"
        stroke="#049FD9"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  );
}

export function Neo4jLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <line x1="8.2" y1="8.4" x2="15.4" y2="6.8" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.45" />
      <line x1="8.2" y1="8.4" x2="14.5" y2="16.2" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.45" />
      <line x1="15.4" y1="6.8" x2="16.2" y2="15.8" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.45" />
      <line x1="7.4" y1="15.6" x2="14.5" y2="16.2" stroke="currentColor" strokeWidth="1.3" strokeOpacity="0.35" />
      <circle cx="8" cy="8.5" r="3.4" fill="#018BFF" />
      <circle cx="16.2" cy="6.6" r="2.7" fill="#0A6190" />
      <circle cx="15.6" cy="16.5" r="3.1" fill="#018BFF" />
      <circle cx="6.8" cy="16" r="1.9" fill="#38BDF8" />
    </svg>
  );
}

export function IssuerLogo({
  cert,
  className = "w-5 h-5",
}: {
  cert: CertificationItem;
  className?: string;
}) {
  if (cert.tag === "NEO4J" || cert.issuer.includes("Neo4j")) {
    return <Neo4jLogo className={className} />;
  }
  if (cert.tag === "CISCO" || cert.issuer.includes("Cisco")) {
    return <CiscoLogo className={className} />;
  }
  if (cert.tag === "GOOGLE" || cert.issuer.includes("Google")) {
    return <GoogleLogo className={className} />;
  }
  if (
    cert.tag === "DICT" ||
    cert.issuer.includes("DICT") ||
    cert.issuer.includes("Information and Communications")
  ) {
    return <DICTLogo className={className} />;
  }
  return <Award className={`${className} text-muted-foreground`} aria-hidden="true" />;
}

export function LaurelBranch({
  flip = false,
  className = "",
}: {
  flip?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 16 20"
      fill="none"
      aria-hidden="true"
      className={`w-3 h-3.5 transition-colors ${flip ? "-scale-x-100" : ""} ${className}`}
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

/** Monochrome issuer tag badge compliant with Standard & Focus B&W rules. */
export function CertificationTagBadge({ cert }: { cert: CertificationItem }) {
  const label =
    cert.tag ||
    (cert.issuer.includes("Neo4j")
      ? "NEO4J"
      : cert.issuer.includes("Cisco")
      ? "CISCO"
      : cert.issuer.includes("Google")
      ? "GOOGLE"
      : cert.issuer.includes("DICT") || cert.issuer.includes("Information and Communications")
      ? "DICT"
      : "CREDENTIAL");

  return (
    <span className="font-mono text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-muted-subtle text-muted-foreground border border-border-hairline shrink-0">
      {label}
    </span>
  );
}

/** High-contrast monochrome badge for Professional Certifications and multi-course Career Paths. */
export function CareerPathBadge({
  label = "CAREER PATH",
  variant = "subtle",
  className = "",
}: {
  label?: string;
  variant?: "solid" | "subtle";
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center font-mono text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border shrink-0 ${
        variant === "solid"
          ? "bg-ink text-page border-ink"
          : "bg-muted-subtle text-ink border-border-hairline"
      } ${className}`}
    >
      {label}
    </span>
  );
}

/** Formats certificate code or issued date consistently across cards and modals. */
export function getCertificationMetaText(cert: CertificationItem): string | null {
  if (cert.code) return `ID: ${cert.code}`;
  if (cert.issuedAt) return `Issued ${cert.issuedAt}`;
  return null;
}

/** Renders either a native inline PDF viewer or responsive raster image inside preview modals. */
export function CertificationDocumentPreview({ cert }: { cert: CertificationItem }) {
  if (!cert.href || cert.href === "#") return null;

  if (isPdfCertificate(cert)) {
    return (
      <div className="relative w-full aspect-[4/3] min-h-[300px] sm:min-h-[380px] bg-black/5 dark:bg-black/40">
        <object
          key={cert.href}
          data={`${cert.href}#view=FitH&navpanes=0`}
          type="application/pdf"
          aria-label={`${cert.name} certificate PDF`}
          className="w-full h-full block"
        >
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-6 text-center">
            <FileText className="w-8 h-8 text-muted-foreground" aria-hidden="true" />
            <p className="font-mono text-xs text-muted-foreground max-w-xs">
              Inline PDF preview is unavailable in this browser.
            </p>
            <a
              href={cert.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border-hairline bg-surface text-xs font-mono font-medium text-ink hover:bg-surface-hover transition-colors"
            >
              <span>Open Certificate PDF</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
        </object>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-[4/3] min-h-[280px] sm:min-h-[360px] bg-black/5 dark:bg-black/40">
      <Image
        key={cert.href}
        src={cert.href}
        alt={cert.name}
        fill
        sizes="(max-width: 768px) 95vw, 720px"
        className="object-contain p-3 sm:p-5"
      />
    </div>
  );
}

interface CertificationBoxCardProps {
  cert: CertificationItem;
  variant?: CertificationSurfaceVariant;
  onSelect: (cert: CertificationItem) => void;
  onHover?: () => void;
}

/**
 * Compact double-bordered credential box shared across Standard, Focus, Minimal, and Artisan.
 * Keeps every top-level credential scannable in a compact grid while adapting typography,
 * radii, and monochrome rules to each presentation mode.
 */
export function CertificationBoxCard({
  cert,
  variant = "standard",
  onSelect,
  onHover,
}: CertificationBoxCardProps) {
  const hasPreview = hasPreviewableDocument(cert);
  const subCourseCount = cert.trackId ? getTrackCourses(cert.trackId).length : 0;
  const isProfessional = cert.category === "professional";
  const displayName = cert.name.replace(/\s+Career Path$/i, "");
  const isMinimal = variant === "minimal";
  const isFocus = variant === "focus";
  const isArtisan = variant === "artisan";

  const outerRadius = isFocus ? "rounded-lg" : "rounded-2xl";
  const innerRadius = isFocus ? "rounded-md" : "rounded-xl";

  const outerClass = isMinimal
    ? `group ${outerRadius} p-1.5 border border-zinc-200/85 dark:border-white/[0.08] bg-zinc-50/75 dark:bg-white/[0.02] transition-colors duration-200 text-center ${
        hasPreview
          ? "hover:border-zinc-300 dark:hover:border-white/[0.18] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-800 dark:focus-visible:outline-[#eae6df]"
          : "cursor-default opacity-90"
      }`
    : isArtisan
    ? `group ${outerRadius} p-1.5 border border-black/[0.07] dark:border-white/[0.07] bg-black/[0.015] dark:bg-white/[0.02] transition-all duration-200 text-center ${
        hasPreview
          ? "hover:border-black/15 dark:hover:border-white/15 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/40"
          : "cursor-default"
      }`
    : `group ${outerRadius} p-1.5 border border-border-hairline bg-surface/25 transition-colors duration-200 text-center ${
        hasPreview
          ? "hover:border-border hover:bg-surface/45 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          : "cursor-default opacity-85"
      }`;

  const innerClass = isMinimal
    ? `h-full ${innerRadius} border border-zinc-200/90 dark:border-white/[0.09] bg-white dark:bg-[#141514] px-4 py-5 flex flex-col items-center justify-between gap-3.5 transition-colors ${
        hasPreview ? "group-hover:border-zinc-300 dark:group-hover:border-white/[0.18]" : ""
      }`
    : isArtisan
    ? `h-full ${innerRadius} border border-black/10 dark:border-white/10 bg-background px-4 py-5 flex flex-col items-center justify-between gap-3.5 transition-colors ${
        hasPreview ? "group-hover:border-black/20 dark:group-hover:border-white/20" : ""
      }`
    : `h-full ${innerRadius} border border-border-hairline bg-page/80 dark:bg-surface/45 px-4 py-5 flex flex-col items-center justify-between gap-3.5 transition-colors ${
        hasPreview ? "group-hover:border-ink/25 group-hover:bg-surface/65" : ""
      }`;

  const logoBoxClass = isMinimal
    ? "size-11 rounded-xl border border-zinc-200/80 dark:border-white/[0.1] bg-zinc-50/90 dark:bg-white/[0.03] flex items-center justify-center shadow-2xs shrink-0"
    : isArtisan
    ? "size-11 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] flex items-center justify-center shadow-2xs shrink-0"
    : `size-11 ${isFocus ? "rounded-md" : "rounded-xl"} border border-border-hairline bg-surface flex items-center justify-center shadow-2xs shrink-0`;

  const titleClass = isMinimal
    ? "font-serif text-[16px] sm:text-[17px] font-medium tracking-tight text-zinc-900 dark:text-[#eae6df] leading-snug line-clamp-2 min-h-[2.65rem] flex items-center justify-center"
    : isArtisan
    ? "font-mono text-[20px] sm:text-[21px] font-normal tracking-[0.01em] text-foreground leading-snug line-clamp-2 min-h-[2.75rem] flex items-center justify-center"
    : "font-sans text-sm sm:text-[15px] font-semibold tracking-tight text-ink leading-snug line-clamp-2 min-h-[2.5rem] flex items-center justify-center";

  const tagClass = isMinimal
    ? "block font-mono text-[10.5px] font-medium uppercase tracking-[0.16em] text-zinc-600 dark:text-[#a6a095]"
    : isArtisan
    ? "block font-sans text-[10.5px] font-medium uppercase tracking-[0.16em] text-foreground/65"
    : "block font-mono text-[10.5px] font-medium uppercase tracking-[0.15em] text-muted-foreground";

  const tierPillClass = isProfessional
    ? isMinimal
      ? "inline-block font-mono text-[10px] font-semibold uppercase tracking-[0.1em] px-2.5 py-0.5 rounded-full bg-zinc-900 text-white dark:bg-[#eae6df] dark:text-[#181816]"
      : isArtisan
      ? "inline-block font-sans text-[10px] font-semibold uppercase tracking-[0.1em] px-2.5 py-1 rounded-full bg-foreground text-background"
      : "inline-block font-mono text-[10px] font-semibold uppercase tracking-[0.1em] px-2.5 py-0.5 rounded bg-ink text-page"
    : isMinimal
    ? "inline-block font-mono text-[10px] font-medium uppercase tracking-[0.08em] px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-white/[0.08] text-zinc-800 dark:text-[#dedad0] border border-zinc-200/90 dark:border-white/[0.12]"
    : isArtisan
    ? "inline-block font-sans text-[10px] font-semibold uppercase tracking-[0.08em] px-2.5 py-1 rounded-full bg-black/[0.05] dark:bg-white/[0.08] text-foreground/90 border border-black/15 dark:border-white/15"
    : "inline-block font-mono text-[10px] font-medium uppercase tracking-[0.08em] px-2.5 py-0.5 rounded bg-muted-subtle text-ink border border-border-hairline";

  const cueTextClass = isMinimal
    ? "font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-600 dark:text-[#a6a095] group-hover:text-zinc-900 dark:group-hover:text-[#eae6df] transition-colors"
    : isArtisan
    ? "font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-foreground/70 group-hover:text-foreground transition-colors"
    : "font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground group-hover:text-ink transition-colors";

  const laurelClass = isMinimal
    ? "text-zinc-500 dark:text-[#827d73] group-hover:text-zinc-900 dark:group-hover:text-[#eae6df]"
    : isArtisan
    ? "text-foreground/55 group-hover:text-foreground"
    : "text-muted-foreground/70 group-hover:text-ink";

  const innerContent = (
    <div className={innerClass}>
      <div className={logoBoxClass}>
        <IssuerLogo cert={cert} className="size-5" />
      </div>

      <div className="space-y-2 w-full">
        <h3 className={titleClass}>
          <span>{displayName}</span>
        </h3>

        <span className={tagClass}>
          {cert.tag || "VERIFIED"}
          {cert.issuedAt ? ` · ${cert.issuedAt}` : ""}
        </span>

        {(isProfessional || subCourseCount > 0) && (
          <div className="pt-0.5">
            <span className={tierPillClass}>
              {isProfessional
                ? "Professional Cert"
                : `${subCourseCount} Included Courses`}
            </span>
          </div>
        )}
      </div>

      <div className="inline-flex items-center gap-1.5 pt-0.5">
        <LaurelBranch className={laurelClass} />
        <span className={cueTextClass}>
          {hasPreview ? "Inspect" : "Verified"}
        </span>
        <LaurelBranch flip className={laurelClass} />
      </div>
    </div>
  );

  if (!hasPreview) {
    return (
      <div className={outerClass} aria-label={`${cert.name} (${cert.issuer})`}>
        {innerContent}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(cert)}
      onMouseEnter={onHover}
      aria-label={`Inspect ${cert.name}`}
      className={outerClass}
    >
      {innerContent}
    </button>
  );
}

interface CertificationInspectorModalProps {
  selectedCert: CertificationItem | null;
  onClose: () => void;
  variant?: CertificationSurfaceVariant;
  onSelectCourse?: () => void;
}

/**
 * Shared Portal-mounted certificate inspector modal:
 * - Single-pane (`max-w-2xl`) for standalone certificates (e.g. Neo4j, GDG, DICT)
 * - Split-pane (`max-w-5xl`) for Career Paths: left document preview + right interactive
 *   included-courses sidebar that swaps the preview and verification link live.
 */
export function CertificationInspectorModal({
  selectedCert,
  onClose,
  variant = "standard",
  onSelectCourse,
}: CertificationInspectorModalProps) {
  const [mounted, setMounted] = useState(false);
  const [activeCert, setActiveCert] = useState<CertificationItem | null>(selectedCert);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setActiveCert(selectedCert);
  }, [selectedCert]);

  useEffect(() => {
    if (!selectedCert) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedCert, onClose]);

  const subCourses = useMemo(
    () => (selectedCert?.trackId ? getTrackCourses(selectedCert.trackId) : []),
    [selectedCert]
  );

  if (!mounted || !selectedCert || !activeCert) return null;

  const isCareerPath = subCourses.length > 0;
  const isMinimal = variant === "minimal";
  const isArtisan = variant === "artisan";
  const activeMeta = getCertificationMetaText(activeCert);
  const activePlatform = getVerifyPlatformLabel(activeCert);
  const isViewingCapstone = activeCert.name === selectedCert.name;

  const shellClass = isMinimal
    ? "relative z-10 w-full rounded-2xl border border-zinc-200/90 dark:border-white/[0.1] bg-white dark:bg-[#141514] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
    : isArtisan
    ? "relative z-10 w-full rounded-2xl border border-black/15 dark:border-white/15 bg-background shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
    : "relative z-10 w-full rounded-xl border border-border-hairline bg-surface shadow-2xl overflow-hidden flex flex-col max-h-[92vh]";

  const headerBorder = isMinimal
    ? "border-b border-zinc-200/80 dark:border-white/[0.08]"
    : isArtisan
    ? "border-b border-black/10 dark:border-white/10"
    : "border-b border-border-hairline bg-surface/90";

  const footerBorder = isMinimal
    ? "border-t border-zinc-200/80 dark:border-white/[0.08] bg-zinc-50/60 dark:bg-white/[0.02]"
    : isArtisan
    ? "border-t border-black/10 dark:border-white/10 bg-black/[0.015] dark:bg-white/[0.02]"
    : "border-t border-border-hairline bg-surface/50";

  const sidebarBorder = isMinimal
    ? "border-t lg:border-t-0 lg:border-l border-zinc-200/80 dark:border-white/[0.08] bg-zinc-50/50 dark:bg-white/[0.015]"
    : isArtisan
    ? "border-t lg:border-t-0 lg:border-l border-black/10 dark:border-white/10 bg-black/[0.015] dark:bg-white/[0.015]"
    : "border-t lg:border-t-0 lg:border-l border-border-hairline bg-page/60 dark:bg-page/40";

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Certificate preview: ${activeCert.name}`}
      className="fixed inset-0 z-[130] flex items-center justify-center p-3 sm:p-6"
    >
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
        aria-hidden="true"
      />

      <div
        className={`${shellClass} ${
          isCareerPath ? "max-w-5xl" : "max-w-2xl"
        } animate-in fade-in zoom-in-95 duration-150`}
      >
        {/* Header */}
        <div className={`px-4 sm:px-5 py-3.5 ${headerBorder} flex items-center justify-between gap-3 shrink-0`}>
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg border border-border-hairline bg-page/80 dark:bg-white/[0.03] flex items-center justify-center shrink-0 mt-0.5">
              <IssuerLogo cert={activeCert} className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center flex-wrap gap-1.5">
                {activeCert.category === "professional" && (
                  <CareerPathBadge label="PROFESSIONAL CERT" variant="solid" />
                )}
                {isCareerPath && isViewingCapstone && (
                  <CareerPathBadge label="CAREER PATH CAPSTONE" variant="solid" />
                )}
                {isCareerPath && !isViewingCapstone && (
                  <CareerPathBadge label="INCLUDED COURSE" />
                )}
                <CertificationTagBadge cert={activeCert} />
                {activeMeta && (
                  <span className="font-mono text-[11px] text-muted-foreground truncate">
                    {activeMeta}
                  </span>
                )}
              </div>
              <h4
                className={
                  isMinimal
                    ? "font-serif text-lg sm:text-xl font-medium text-zinc-900 dark:text-[#eae6df] truncate mt-0.5"
                    : isArtisan
                    ? "font-mono text-sm sm:text-base font-semibold text-foreground truncate mt-1"
                    : "font-sans text-sm sm:text-base font-semibold text-ink truncate mt-1"
                }
              >
                {activeCert.name}
              </h4>
              <p className="font-mono text-[11px] text-muted-foreground truncate">
                {activeCert.issuer}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close certificate preview"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-ink hover:bg-surface-hover transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Body: Split-Pane for Career Paths, Single-Pane for Standalone */}
        <div
          className={`flex-1 min-h-0 overflow-y-auto ${
            isCareerPath
              ? "grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_310px] lg:overflow-hidden"
              : "flex flex-col"
          }`}
        >
          {/* Left / Primary Document Viewport */}
          <div className="flex flex-col min-w-0 lg:overflow-y-auto">
            <CertificationDocumentPreview cert={activeCert} />

            {/* Concise Exam Summary & Skills Strip (e.g. Professional Certs) */}
            {!isCareerPath && (activeCert.summary || (activeCert.skills && activeCert.skills.length > 0)) && (
              <div className={`px-4 sm:px-5 py-3.5 ${headerBorder} space-y-2.5`}>
                {activeCert.summary && (
                  <p
                    className={
                      isMinimal
                        ? "font-serif text-sm text-zinc-600 dark:text-[#beb9ad] leading-relaxed"
                        : "font-sans text-xs sm:text-[13px] text-muted-foreground leading-relaxed"
                    }
                  >
                    {activeCert.summary}
                  </p>
                )}
                {activeCert.skills && activeCert.skills.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {activeCert.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded bg-muted-subtle border border-border-hairline font-mono text-[10.5px] text-ink/85"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Pane: Included Resources / Courses Selector for Career Paths */}
          {isCareerPath && (
            <aside
              aria-label="Included career path courses"
              className={`${sidebarBorder} flex flex-col min-h-0 lg:overflow-hidden`}
            >
              <div className={`px-4 py-3 ${headerBorder} flex items-center justify-between gap-2 shrink-0`}>
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-ink">
                  <Layers className="w-3.5 h-3.5 opacity-75" aria-hidden="true" />
                  <span>Included Courses</span>
                </span>
                <span className="font-mono text-[10.5px] text-muted-foreground tabular-nums">
                  {String(subCourses.length).padStart(2, "0")}
                </span>
              </div>

              <div className="p-2.5 space-y-1.5 overflow-y-auto max-h-[250px] lg:max-h-none flex-1">
                {/* Capstone Certificate Button */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectCourse?.();
                    setActiveCert(selectedCert);
                  }}
                  aria-current={isViewingCapstone ? "true" : undefined}
                  className={`w-full text-left px-3 py-2.5 rounded-lg border transition-colors cursor-pointer flex items-start gap-2.5 ${
                    isViewingCapstone
                      ? isMinimal
                        ? "bg-zinc-900 text-white border-zinc-900 dark:bg-[#eae6df] dark:text-[#141514] dark:border-[#eae6df]"
                        : "bg-ink text-page border-ink"
                      : "border-border-hairline bg-surface/40 hover:bg-surface-hover text-ink"
                  }`}
                >
                  <span
                    className={`font-mono text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0 mt-0.5 ${
                      isViewingCapstone
                        ? isMinimal
                          ? "bg-white/15 text-white dark:bg-black/15 dark:text-[#141514]"
                          : "bg-page/15 text-page"
                        : "bg-muted-subtle text-muted-foreground"
                    }`}
                  >
                    PATH
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="block font-sans text-xs font-semibold leading-snug">
                      {selectedCert.name}
                    </span>
                    <span
                      className={`block font-mono text-[10px] mt-0.5 ${
                        isViewingCapstone ? "opacity-75" : "text-muted-foreground"
                      }`}
                    >
                      Capstone · {selectedCert.issuedAt || "Verified"}
                    </span>
                  </div>
                </button>

                <div className="pt-1 pb-0.5 px-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">
                  Course Certificates
                </div>

                {/* Course Items */}
                {subCourses.map((course, idx) => {
                  const isActive = activeCert.name === course.name;
                  return (
                    <button
                      key={course.name}
                      type="button"
                      onClick={() => {
                        onSelectCourse?.();
                        setActiveCert(course);
                      }}
                      aria-current={isActive ? "true" : undefined}
                      className={`w-full text-left px-3 py-2.5 rounded-lg border transition-colors cursor-pointer flex items-start gap-2.5 ${
                        isActive
                          ? isMinimal
                            ? "bg-zinc-900 text-white border-zinc-900 dark:bg-[#eae6df] dark:text-[#141514] dark:border-[#eae6df]"
                            : "bg-ink text-page border-ink"
                          : "border-transparent hover:border-border-hairline hover:bg-surface/60 text-ink"
                      }`}
                    >
                      <span
                        className={`font-mono text-[11px] font-semibold tabular-nums shrink-0 w-5 pt-0.5 ${
                          isActive ? "opacity-80" : "text-muted-foreground"
                        }`}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0 flex-1">
                        <span className="block font-sans text-xs font-medium leading-snug">
                          {course.name}
                        </span>
                        {course.issuedAt && (
                          <span
                            className={`block font-mono text-[10px] mt-0.5 ${
                              isActive ? "opacity-75" : "text-muted-foreground"
                            }`}
                          >
                            Issued {course.issuedAt}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </aside>
          )}
        </div>

        {/* Footer */}
        <div
          className={`px-4 sm:px-5 py-3 ${footerBorder} flex flex-wrap items-center justify-between gap-2 font-mono text-xs shrink-0`}
        >
          <span className="text-muted-foreground flex items-center gap-1.5">
            <CheckCircle2
              className={`w-3.5 h-3.5 ${
                isMinimal ? "text-zinc-900 dark:text-[#eae6df]" : "text-ink"
              }`}
              aria-hidden="true"
            />
            <span>Verified Credential Document</span>
          </span>

          <div className="flex items-center gap-4">
            {activeCert.verifyUrl && (
              <a
                href={activeCert.verifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1 font-medium hover:underline underline-offset-4 transition-colors ${
                  isMinimal ? "text-zinc-900 dark:text-[#eae6df]" : "text-ink"
                }`}
              >
                <span>Verify on {activePlatform}</span>
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            )}
            {activeCert.href && activeCert.href !== "#" && (
              <a
                href={activeCert.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-muted-foreground hover:text-ink font-medium hover:underline underline-offset-4 transition-colors"
              >
                <span>{isPdfCertificate(activeCert) ? "Open PDF" : "Open Full Size"}</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
