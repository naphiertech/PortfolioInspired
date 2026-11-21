"use client";

import React from "react";
import Image from "next/image";
import { Award, ExternalLink, FileText } from "lucide-react";
import { CertificationItem, isPdfCertificate } from "@/lib/data";

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

export function IssuerLogo({
  cert,
  className = "w-5 h-5",
}: {
  cert: CertificationItem;
  className?: string;
}) {
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

export function CertificationTagBadge({ cert }: { cert: CertificationItem }) {
  if (cert.tag === "CISCO" || cert.issuer.includes("Cisco")) {
    return (
      <span className="font-mono text-[9px] font-bold tracking-wider px-2 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
        CISCO
      </span>
    );
  }
  if (cert.tag === "HACKATHON") {
    return (
      <span className="font-mono text-[9px] font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
        HACKATHON
      </span>
    );
  }
  if (cert.tag === "GOOGLE" || cert.issuer.includes("Google")) {
    return (
      <span className="font-mono text-[9px] font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
        GOOGLE
      </span>
    );
  }
  if (
    cert.tag === "DICT" ||
    cert.issuer.includes("DICT") ||
    cert.issuer.includes("Information and Communications")
  ) {
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
}

/** Subtle capstone indicator for multi-course career path credentials. */
export function CareerPathBadge({
  label = "CAREER PATH",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center font-mono text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 ${className}`}
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
      <div className="relative w-full aspect-[4/3] min-h-[300px] bg-black/5 dark:bg-black/40">
        <object
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
    <div className="relative w-full aspect-[4/3] bg-black/40">
      <Image
        src={cert.href}
        alt={cert.name}
        fill
        sizes="(max-width: 768px) 95vw, 672px"
        className="object-contain p-3 sm:p-5"
      />
    </div>
  );
}
