import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { certifications } from "@/lib/data";

export function Certifications() {
  return (
    <div className="gsap-certs-section bento-card p-4 col-span-1 md:col-span-3 space-y-2 group">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-text-primary dark:text-dark-text-primary">
          Recent Certifications
        </h2>
        <Link
          href="/certifications"
          className="text-xs text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary flex items-center gap-1 transition-colors cursor-pointer group"
        >
          <span>View All</span>
          <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* List */}
      <div className="space-y-1.5 pt-2">
        {certifications.map((cert) => (
          <a
            key={cert.name}
            href={cert.href}
            target="_blank"
            rel="noopener noreferrer"
            className="gsap-cert-row block p-2 rounded-md bg-gray-100 dark:bg-zinc-900/60 hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer group/cert"
          >
            <h3 className="text-xs font-semibold text-text-primary dark:text-dark-text-primary group-hover/cert:text-blue-600 dark:group-hover/cert:text-blue-400 transition-colors">
              {cert.name}
            </h3>
            <p className="text-[11px] text-text-muted dark:text-dark-text-muted mt-0.5 flex items-center justify-between gap-2 flex-wrap">
              <span>{cert.issuer}</span>
              {cert.code && (
                <span className="font-mono text-[9px] px-1.5 py-0.5 bg-gray-200/80 dark:bg-zinc-800/80 rounded text-foreground/80">
                  {cert.code}
                </span>
              )}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
export default Certifications;
