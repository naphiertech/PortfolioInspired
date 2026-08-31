"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Award } from "lucide-react";
import { certifications } from "@/lib/data";
import { EditorialDivider } from "@/components/EditorialDivider";
import { useUISound } from "@/context/SoundContext";
import { FocusNavigation } from "../components/FocusNavigation";

function GoogleLogo({ className = "w-4 h-4" }: { className?: string }) {
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

function DICTLogo({ className = "w-4 h-4" }: { className?: string }) {
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

/**
 * FocusCertificationsPage
 *
 * Focus Mode presentation for /certifications.
 * Verified credentials and certificates from Google and DICT.
 */
export function FocusCertificationsPage() {
  const { playHover, playClick } = useUISound();

  const getIssuerLogo = (cert: (typeof certifications)[0]) => {
    if (cert.tag === "GOOGLE" || cert.issuer.includes("Google")) {
      return <GoogleLogo />;
    }
    if (
      cert.tag === "DICT" ||
      cert.issuer.includes("DICT") ||
      cert.issuer.includes("Information and Communications")
    ) {
      return <DICTLogo />;
    }
    return <Award className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <div className="w-full select-none animate-in fade-in duration-200">
      {/* Focus Top Navigation */}
      <FocusNavigation />

      {/* Top Header & Breadcrumb */}
      <div className="space-y-3 mb-6">
        <Link
          href="/"
          onMouseEnter={playHover}
          onClick={playClick}
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-ink transition-colors duration-150 group cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>cd .. / home</span>
        </Link>

        <div className="flex items-center justify-between gap-2 font-mono text-xs text-muted-foreground/70 select-none">
          <span className="tracking-wider text-muted-foreground/80 font-medium">
            [ 05 // CERTIFICATIONS ]
          </span>
          <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-muted-foreground/50">
            CERTIFICATIONS ({certifications.length})
          </span>
        </div>

        <div className="flex items-start sm:items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-sans text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
              Certifications
            </h1>
            <p className="font-mono text-xs sm:text-[13px] text-muted-foreground mt-1">
              Technical credentials from Google and DICT.
            </p>
          </div>
        </div>
      </div>

      <EditorialDivider className="mb-6" />

      {/* Credential Ledger: 2-Column Desktop Grid / 1-Column Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certifications.map((cert, idx) => (
          <div
            key={`${cert.name}-${idx}`}
            className="p-4 rounded-md border border-border-hairline bg-surface/30 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="flex-shrink-0 mt-0.5">{getIssuerLogo(cert)}</div>
                  <div className="min-w-0">
                    <h2 className="font-sans font-bold text-xs sm:text-[13px] text-ink leading-snug">
                      {cert.name}
                    </h2>
                    <p className="font-mono text-xs text-muted-foreground/80 mt-0.5">
                      {cert.issuer}
                    </p>
                  </div>
                </div>

                {cert.href && cert.href !== "#" && (
                  <a
                    href={cert.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 text-muted-foreground/60 hover:text-ink transition-colors p-1"
                    title={`View certificate for ${cert.name}`}
                    aria-label={`View certificate for ${cert.name}`}
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                )}
              </div>
            </div>

            {cert.code && (
              <div className="mt-3 pt-2.5 border-t border-border-divider/80 font-mono text-[11px] text-muted-foreground/70 flex items-center justify-between">
                <span className="text-muted-foreground/50">VERIFICATION ID:</span>
                <span className="text-ink/85 font-medium tracking-wide">{cert.code}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FocusCertificationsPage;
