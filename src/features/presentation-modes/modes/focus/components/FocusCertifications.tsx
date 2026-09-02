import React from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { certifications } from "@/lib/data";

export function FocusCertifications() {
  const midpoint = Math.ceil(certifications.length / 2);
  const col1 = certifications.slice(0, midpoint);
  const col2 = certifications.slice(midpoint);

  return (
    <section aria-label="Certifications" className="w-full">
      {/* Section Index */}
      <div className="flex items-center justify-between gap-2 font-mono text-xs text-muted-foreground/60 select-none mb-3.5">
        <span className="tracking-wider font-medium">
          [ 05 // CERTIFICATIONS ]
        </span>
        <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-muted-foreground/50">
          CERTIFICATIONS ({certifications.length})
        </span>
      </div>

      {/* 2-Column Grid on Large Screens / 1-Column on Tablet & Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border-divider">
        {/* Left Column: First half */}
        <div className="divide-y divide-border-divider/60 lg:pr-6">
          {col1.map((cert, idx) => (
            <div key={`${cert.name}-${idx}`} className="py-3.5 first:pt-3.5 last:pb-3.5 flex flex-col justify-between">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-sans font-semibold text-[13.5px] sm:text-sm text-ink leading-snug">
                    {cert.name}
                  </h4>
                  <p className="font-mono text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {cert.issuer}
                  </p>
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

              {cert.code && (
                <div className="mt-2 font-mono text-[11px] sm:text-[11.5px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                  <span className="text-zinc-400 dark:text-zinc-500">ID:</span>
                  <span className="text-ink/80 tracking-wide">{cert.code}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right Column: Second half */}
        <div className="divide-y divide-border-divider/60 lg:pl-6">
          {col2.map((cert, idx) => (
            <div key={`${cert.name}-${idx}`} className="py-3.5 first:pt-3.5 last:pb-3.5 flex flex-col justify-between">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-sans font-semibold text-[13.5px] sm:text-sm text-ink leading-snug">
                    {cert.name}
                  </h4>
                  <p className="font-mono text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {cert.issuer}
                  </p>
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

              {cert.code && (
                <div className="mt-2 font-mono text-[11px] sm:text-[11.5px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                  <span className="text-zinc-400 dark:text-zinc-500">ID:</span>
                  <span className="text-ink/80 tracking-wide">{cert.code}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Full Certifications Route Link */}
      <div className="mt-3.5 flex justify-end">
        <Link
          href="/certifications"
          className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-brand transition-colors"
        >
          <span>View all certifications</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

export default FocusCertifications;
