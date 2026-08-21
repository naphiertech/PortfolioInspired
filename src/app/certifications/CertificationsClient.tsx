"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Award } from "lucide-react";
import { certifications } from "@/lib/data";

export function CertificationsClient() {
  return (
    <div className="w-full select-none">
      {/* Page Header */}
      <div className="mb-10 space-y-2">
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

      {/* Certifications List */}
      <div className="space-y-3">
        {certifications.map((cert) => (
          <div
            key={cert.name}
            className="p-4 rounded-lg bg-surface/30 border border-border-hairline/60 hover:border-border-hairline transition-colors duration-150 space-y-2 group"
          >
            <div className="flex items-start justify-between gap-4 flex-wrap sm:flex-nowrap">
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="w-9 h-9 rounded-[6px] bg-surface border border-border-hairline flex items-center justify-center flex-shrink-0 text-muted-foreground group-hover:text-ink transition-colors mt-0.5">
                  <Award className="w-4 h-4" />
                </div>

                <div className="min-w-0 space-y-1">
                  <h2 className="font-sans text-sm sm:text-[15px] font-semibold text-ink leading-snug">
                    {cert.name}
                  </h2>
                  <p className="font-sans text-xs text-muted-foreground">
                    Issued by <span className="text-body font-medium">{cert.issuer}</span>
                  </p>
                  {cert.code && (
                    <div className="font-mono text-[11px] text-muted-foreground pt-0.5">
                      Credential ID: <span className="text-ink">{cert.code}</span>
                    </div>
                  )}
                </div>
              </div>

              {cert.href && cert.href !== "#" ? (
                <a
                  href={cert.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tactile-btn gap-1.5 text-xs flex-shrink-0 self-start"
                >
                  <ExternalLink className="w-3 h-3 opacity-70" />
                  <span>Verify</span>
                </a>
              ) : (
                <span className="font-mono text-[11px] text-muted-foreground/60 bg-muted-subtle px-2 py-1 rounded border border-border-hairline flex-shrink-0 self-start">
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
