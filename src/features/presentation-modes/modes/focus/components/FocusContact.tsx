"use client";

import React, { useState } from "react";
import { Mail, FileText, ArrowUpRight, Copy, Check } from "lucide-react";
import { AUTHOR_INFO, AVAILABILITY, SOCIAL_PROFILES } from "@/lib/siteConfig";

export function FocusContact() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SOCIAL_PROFILES.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard error
    }
  };

  return (
    <section aria-label="Contact and availability" className="w-full">
      {/* Section Index */}
      <div className="flex items-center justify-between gap-2 font-mono text-xs text-muted-foreground/60 select-none mb-3.5">
        <span className="tracking-wider font-medium">
          [ 05 // CONTACT ]
        </span>
        <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-muted-foreground/50">
          CONTACT & AVAILABILITY
        </span>
      </div>

      {/* Main Structural Contact Row */}
      <div className="py-2 sm:py-3 flex flex-col md:flex-row md:items-center justify-between gap-5">
        {/* Left Side: Headline & Availability Details */}
        <div className="flex-1 min-w-0">
          <h3 className="font-sans font-semibold text-base sm:text-lg text-ink tracking-tight">
            Available for work and collaboration.
          </h3>
          <p className="mt-1.5 text-sm sm:text-[14.5px] text-zinc-700 dark:text-zinc-300 font-sans leading-[1.6] max-w-xl">
            Open to {AVAILABILITY.openTo} ({AVAILABILITY.workSetup}). Based in {AUTHOR_INFO.location}.
          </p>
        </div>

        {/* Right Side: Fast Action Channels */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Primary Mail Button */}
          <a
            href={`mailto:${SOCIAL_PROFILES.email}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-ink text-page font-medium font-sans text-xs hover:opacity-90 active:scale-[0.98] transition-all"
          >
            <Mail className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Send Email</span>
          </a>

          {/* Copy Email Helper */}
          <button
            type="button"
            onClick={handleCopyEmail}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-surface/50 border border-border-hairline text-zinc-600 dark:text-zinc-400 hover:text-ink hover:border-border text-xs font-mono transition-colors"
            title="Copy email address"
            aria-label="Copy email address"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
                <span className="text-emerald-500 font-sans text-xs font-medium">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Copy</span>
              </>
            )}
          </button>

          {/* Resume PDF */}
          <a
            href="/resume/naphier_awalie_resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-surface/50 border border-border-hairline text-ink font-medium font-sans text-xs hover:bg-surface hover:border-border transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" aria-hidden="true" />
            <span>Resume</span>
            <ArrowUpRight className="w-3 h-3 text-zinc-400 dark:text-zinc-500" aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* Secondary Social Channels Row */}
      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-zinc-500 dark:text-zinc-400">
        <div className="flex items-center gap-3.5">
          <a
            href={SOCIAL_PROFILES.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ink transition-colors inline-flex items-center gap-1"
          >
            <span>GitHub</span>
            <ArrowUpRight className="w-3 h-3 opacity-60" aria-hidden="true" />
          </a>
          <span className="text-border">/</span>
          <a
            href={SOCIAL_PROFILES.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ink transition-colors inline-flex items-center gap-1"
          >
            <span>LinkedIn</span>
            <ArrowUpRight className="w-3 h-3 opacity-60" aria-hidden="true" />
          </a>
        </div>

        <span className="text-zinc-500 dark:text-zinc-400 text-[11px]">
          {AUTHOR_INFO.location}
        </span>
      </div>
    </section>
  );
}

export default FocusContact;
