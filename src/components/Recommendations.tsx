"use client";

import React, { useState, useEffect, useCallback } from "react";
import { MessageSquarePlus, ExternalLink } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { recommendations } from "@/lib/data";
import { SectionHeader } from "./SectionHeader";
import { RecommendModal } from "./RecommendModal";
import { useUISound } from "@/context/SoundContext";
import { sectionContainerVariants, contentBlockVariants } from "@/lib/motion";

export function Recommendations() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { playHover, playClick, playOpen } = useUISound();
  const shouldReduceMotion = useReducedMotion();

  // Only consider approved recommendations (or active items if status is not explicitly rejected)
  const approvedRecs = recommendations.filter(
    (rec) => rec.status === "approved" || (!rec.status && rec.quote)
  );

  const hasMultiple = approvedRecs.length > 1;
  const isEmpty = approvedRecs.length === 0;

  const handleNext = useCallback(() => {
    if (hasMultiple) {
      setActiveIndex((prev) => (prev + 1) % approvedRecs.length);
    }
  }, [hasMultiple, approvedRecs.length]);

  // Auto advance slide every 8 seconds only if multiple items exist
  useEffect(() => {
    if (!hasMultiple) return;
    const timer = setInterval(handleNext, 8000);
    return () => clearInterval(timer);
  }, [hasMultiple, handleNext]);

  const currentRec = !isEmpty ? approvedRecs[activeIndex] : null;

  return (
    <motion.section
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView={shouldReduceMotion ? undefined : "visible"}
      viewport={{ once: true, amount: 0.2 }}
      variants={shouldReduceMotion ? undefined : sectionContainerVariants}
      className="w-full space-y-4 select-none mb-16"
      aria-label="Recommendations"
    >
      {/* Consistent Section Header */}
      <SectionHeader
        label="RECOMMENDATIONS"
        actionComponent={
          hasMultiple ? (
            <div className="flex items-center gap-1.5">
              {approvedRecs.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    playClick();
                    setActiveIndex(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                    idx === activeIndex
                      ? "w-4 bg-brand"
                      : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                  }`}
                  aria-label={`Go to recommendation ${idx + 1}`}
                />
              ))}
            </div>
          ) : !isEmpty ? (
            <button
              type="button"
              onMouseEnter={playHover}
              onClick={() => {
                playOpen();
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-ink transition-colors cursor-pointer"
            >
              <MessageSquarePlus className="w-3 h-3 opacity-70" />
              <span>add note</span>
            </button>
          ) : null
        }
        className="mb-4 pb-2 border-b border-border-hairline/40"
      />

      {/* Empty State vs. Published Recommendations */}
      <motion.div variants={shouldReduceMotion ? undefined : contentBlockVariants}>
        {isEmpty ? (
          <div className="p-5 sm:p-6 rounded-xl bg-surface/30 border border-border-hairline transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-md">
                <h3 className="font-sans text-sm font-semibold text-ink">
                  No recommendations yet.
                </h3>
                <p className="font-sans text-xs text-muted-foreground leading-relaxed">
                  Worked with me, studied with me, collaborated on a project, or know my work?
                </p>
              </div>

              <button
                type="button"
                onMouseEnter={playHover}
                onClick={() => {
                  playOpen();
                  setIsModalOpen(true);
                }}
                className="tactile-btn gap-1.5 text-xs font-medium px-3.5 py-1.5 h-8 rounded-md whitespace-nowrap self-start sm:self-auto cursor-pointer"
              >
                <MessageSquarePlus className="w-3.5 h-3.5 opacity-70" />
                <span>Recommend Naphier</span>
              </button>
            </div>
          </div>
        ) : currentRec ? (
          /* Published Recommendation Card */
          <div className="p-4 sm:p-5 rounded-xl bg-surface/30 border border-border-hairline min-h-[140px] flex flex-col justify-between transition-all duration-300">
            <blockquote className="font-sans text-xs sm:text-[13px] text-muted-foreground/90 italic leading-relaxed">
              &ldquo;{currentRec.quote}&rdquo;
            </blockquote>

            <div className="flex items-center justify-between pt-3 mt-2 border-t border-border-hairline/40">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-sans text-xs font-semibold text-ink">
                    {currentRec.author}
                  </span>
                  {currentRec.profileUrl && (
                    <a
                      href={currentRec.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground/50 hover:text-ink transition-colors p-0.5"
                      aria-label={`Profile link for ${currentRec.author}`}
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <div className="font-sans text-[11px] text-muted-foreground truncate">
                  {currentRec.title || currentRec.role || currentRec.organization}
                </div>
              </div>

              {hasMultiple && (
                <span className="font-mono text-[10px] text-muted-foreground/60 flex-shrink-0 ml-2">
                  {activeIndex + 1} of {approvedRecs.length}
                </span>
              )}
            </div>
          </div>
        ) : null}
      </motion.div>

      {/* Submission Modal */}
      <RecommendModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </motion.section>
  );
}

export default Recommendations;
