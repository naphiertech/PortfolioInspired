"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Award } from "lucide-react";
import { certifications } from "@/lib/data";

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

export function CertificationsClient() {
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
    <div className="w-full select-none space-y-10">
      {/* Page Header */}
      <div className="space-y-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-ink transition-colors duration-150 mb-2 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>cd .. / home</span>
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
              Certifications
            </h1>
            <p className="font-mono text-xs text-muted-foreground mt-1">
              {"// Professional achievements, hackathons, and technical credentials"}
            </p>
          </div>
          <span className="font-mono text-xs text-muted-foreground bg-muted-subtle px-2.5 py-1 rounded border border-border-hairline">
            {certifications.length} credentials
          </span>
        </div>
      </div>

      {/* Certifications Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {certifications.map((cert) => (
          <div
            key={cert.name}
            className="p-4 sm:p-5 rounded-xl bg-surface/30 border border-border-hairline hover:bg-surface/60 hover:border-border-hairline transition-all duration-200 flex flex-col justify-between group shadow-2xs relative overflow-hidden"
          >
            <div className="space-y-3.5">
              <div className="flex items-center justify-between gap-2">
                <div className="w-9 h-9 rounded-lg bg-surface border border-border-hairline flex items-center justify-center p-1.5 shadow-2xs group-hover:border-border-hairline transition-colors">
                  {getIssuerLogo(cert)}
                </div>
                {getTagBadge(cert)}
              </div>

              <div className="space-y-1">
                <h2 className="font-sans text-sm font-semibold text-ink group-hover:text-brand transition-colors line-clamp-2 leading-snug">
                  {cert.name}
                </h2>
                <p className="font-sans text-xs text-muted-foreground line-clamp-2">
                  Issued by <span className="text-body font-medium">{cert.issuer}</span>
                </p>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-border-hairline/40 flex items-center justify-between gap-2">
              {cert.code ? (
                <span className="font-mono text-[10px] text-muted-foreground bg-muted-subtle/80 px-2 py-0.5 rounded border border-border-hairline truncate max-w-[170px]">
                  ID: {cert.code}
                </span>
              ) : (
                <span className="font-mono text-[10px] text-muted-foreground/60 italic">
                  Verified
                </span>
              )}

              {cert.href && cert.href !== "#" ? (
                <a
                  href={cert.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tactile-btn gap-1.5 text-xs flex-shrink-0"
                >
                  <ExternalLink className="w-3 h-3 opacity-70" />
                  <span>Verify</span>
                </a>
              ) : (
                <span className="font-mono text-[11px] text-muted-foreground/60 bg-muted-subtle px-2 py-0.5 rounded border border-border-hairline flex-shrink-0">
                  Verified
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CertificationsClient;
