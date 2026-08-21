import React from "react";
import Link from "next/link";
import { certifications } from "@/lib/data";

export function Certifications() {
  const featuredCerts = certifications.slice(0, 3);

  return (
    <section className="w-full space-y-4 select-none mb-14">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="font-caps text-xs text-muted-foreground uppercase tracking-wider font-mono font-semibold">
            &lt;certifications/&gt;
          </span>
        </div>

        <Link
          href="/certifications"
          className="font-mono text-xs text-muted-foreground hover:text-ink flex items-center gap-1 transition-colors duration-200 group"
        >
          <span>all certifications</span>
          <span className="text-muted-foreground/60 group-hover:text-ink transition-transform group-hover:translate-x-0.5">
            -&gt;
          </span>
        </Link>
      </div>

      {/* Unboxed Certifications List */}
      <div className="space-y-3">
        {featuredCerts.map((cert) => (
          <a
            key={cert.name}
            href={cert.href}
            target={cert.href === "#" ? undefined : "_blank"}
            rel={cert.href === "#" ? undefined : "noopener noreferrer"}
            className="block py-2.5 px-2 rounded-md hover:bg-surface/50 transition-colors duration-150 group cursor-pointer border-b border-border-hairline/40 last:border-b-0"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-8 h-8 rounded-[6px] bg-surface border border-border-hairline flex items-center justify-center flex-shrink-0 text-muted-foreground group-hover:text-ink transition-colors mt-0.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>

                <div className="min-w-0 space-y-1">
                  <h3 className="font-sans text-sm font-semibold text-ink group-hover:text-brand transition-colors duration-150 leading-snug">
                    {cert.name}
                  </h3>
                  <div className="flex items-center flex-wrap gap-2 text-xs text-muted-foreground">
                    <span>{cert.issuer}</span>
                    {cert.code && (
                      <>
                        <span className="text-border-hairline">•</span>
                        <span className="font-mono text-[10px] bg-muted-subtle px-1.5 py-0.5 rounded border border-border-hairline">
                          ID: {cert.code}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {cert.href !== "#" && (
                <svg className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-ink flex-shrink-0 mt-1 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              )}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

export default Certifications;
