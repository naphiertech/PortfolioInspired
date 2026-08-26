"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Target, Layers, Workflow, Terminal } from "lucide-react";
import { profileInfo } from "@/lib/data";
import {
  staggeredGridVariants,
  gridItemVariants,
  contentBlockVariants,
  easeOutCubic,
} from "@/lib/motion";

const CARD_INDICATORS = [
  { tag: "CURRENT FOCUS", num: "1 / 3" },
  { tag: "WHAT I BUILD", num: "2 / 3" },
  { tag: "HOW I WORK", num: "3 / 3" },
];

export function ProfileInfoBlock() {
  const shouldReduceMotion = useReducedMotion();
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const carouselRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Rotating capability pairs for "What I Build" (~3.5s interval, pauses on hover)
  useEffect(() => {
    if (shouldReduceMotion || isPaused) return;

    const interval = setInterval(() => {
      setActiveGroupIndex(
        (prev) => (prev + 1) % profileInfo.whatIBuild.groups.length
      );
    }, 3500);

    return () => clearInterval(interval);
  }, [shouldReduceMotion, isPaused]);

  // Track active snapped slide in mobile carousel via lightweight IntersectionObserver
  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;

    const handleIntersection: IntersectionObserverCallback = (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const index = slideRefs.current.indexOf(entry.target as HTMLDivElement);
          if (index !== -1) {
            setActiveCardIndex(index);
          }
        }
      }
    };

    const observer = new IntersectionObserver(handleIntersection, {
      root: container,
      threshold: 0.6,
    });

    slideRefs.current.forEach((slide) => {
      if (slide) observer.observe(slide);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSlide = (index: number) => {
    const slide = slideRefs.current[index];
    if (slide) {
      slide.scrollIntoView({
        behavior: shouldReduceMotion ? "auto" : "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  };

  const currentGroup = shouldReduceMotion
    ? profileInfo.whatIBuild.groups[0]
    : profileInfo.whatIBuild.groups[activeGroupIndex];

  return (
    <div
      className="w-full space-y-2.5 sm:space-y-3 select-none my-4 sm:my-5"
      aria-label="Profile Highlights"
    >
      {/* Top Row: 3 Equal Cards on Desktop, Native 1-Card Swipe Carousel on Mobile */}
      <motion.div
        initial={shouldReduceMotion ? false : "hidden"}
        whileInView={shouldReduceMotion ? undefined : "visible"}
        viewport={{ once: true, amount: 0.15 }}
        variants={shouldReduceMotion ? undefined : staggeredGridVariants}
        ref={carouselRef}
        className="flex md:grid md:grid-cols-3 gap-0 md:gap-2.5 lg:gap-3 items-stretch overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none overscroll-x-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden w-full"
      >
        {/* Card 1 — Current Focus */}
        <div
          ref={(el) => {
            slideRefs.current[0] = el;
          }}
          className="w-full min-w-full md:min-w-0 md:w-auto flex-shrink-0 md:flex-shrink snap-center md:snap-none"
        >
          <motion.article
            variants={shouldReduceMotion ? undefined : gridItemVariants}
            className="flex flex-col justify-between h-full min-h-[165px] sm:min-h-[175px] p-3 sm:p-3.5 rounded-md bg-surface/30 border border-border-hairline hover:border-border-muted transition-colors duration-200 group"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <Target
                  className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 flex-shrink-0"
                  aria-hidden="true"
                />
                <span className="font-mono text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  &lt;CURRENT-FOCUS/&gt;
                </span>
              </div>
              <p className="font-sans text-xs text-muted-foreground leading-relaxed">
                {profileInfo.currentFocus.description}
              </p>
            </div>

            <div className="mt-2.5 pt-2 border-t border-border-hairline/40">
              <span className="font-mono text-[11px] text-muted-foreground/90 dark:text-emerald-400/90 select-text">
                {profileInfo.currentFocus.terminalLine}
              </span>
            </div>
          </motion.article>
        </div>

        {/* Card 2 — What I Build (Fixed-Height with Rotating Pairs) */}
        <div
          ref={(el) => {
            slideRefs.current[1] = el;
          }}
          className="w-full min-w-full md:min-w-0 md:w-auto flex-shrink-0 md:flex-shrink snap-center md:snap-none"
        >
          <motion.article
            variants={shouldReduceMotion ? undefined : gridItemVariants}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="flex flex-col justify-between h-full min-h-[165px] sm:min-h-[175px] p-3 sm:p-3.5 rounded-md bg-surface/30 border border-border-hairline hover:border-border-muted transition-colors duration-200 group"
          >
            <div className="space-y-2.5">
              <div className="flex items-center gap-1.5">
                <Layers
                  className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 flex-shrink-0"
                  aria-hidden="true"
                />
                <span className="font-mono text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  &lt;WHAT-I-BUILD/&gt;
                </span>
              </div>

              {/* Rotating Capabilities Container with Fixed Height */}
              <div className="h-[62px] flex items-center">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={currentGroup.id}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={shouldReduceMotion ? undefined : { opacity: 0, y: -3 }}
                    transition={{ duration: 0.2, ease: easeOutCubic }}
                    className="flex flex-col gap-1.5 w-full"
                  >
                    {currentGroup.items.map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center px-2 py-0.5 rounded-[4px] bg-muted-subtle border border-border-hairline text-[11px] font-sans font-medium text-ink/90 group-hover:text-ink transition-colors w-fit"
                      >
                        {item}
                      </span>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Inner Capability Indicator */}
            <div className="mt-2.5 pt-2 border-t border-border-hairline/40 flex items-center justify-between font-mono text-[10px] text-muted-foreground/60">
              <span className="text-muted-foreground/50">capability</span>
              <span>{`${currentGroup.id} / 0${profileInfo.whatIBuild.groups.length}`}</span>
            </div>
          </motion.article>
        </div>

        {/* Card 3 — How I Work (3 Concise Principles) */}
        <div
          ref={(el) => {
            slideRefs.current[2] = el;
          }}
          className="w-full min-w-full md:min-w-0 md:w-auto flex-shrink-0 md:flex-shrink snap-center md:snap-none"
        >
          <motion.article
            variants={shouldReduceMotion ? undefined : gridItemVariants}
            className="flex flex-col justify-between h-full min-h-[165px] sm:min-h-[175px] p-3 sm:p-3.5 rounded-md bg-surface/30 border border-border-hairline hover:border-border-muted transition-colors duration-200 group"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <Workflow
                  className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 flex-shrink-0"
                  aria-hidden="true"
                />
                <span className="font-mono text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  &lt;HOW-I-WORK/&gt;
                </span>
              </div>

              <ul className="space-y-1.5 pt-0.5">
                {profileInfo.howIWork.principles.map((principle) => (
                  <li
                    key={principle}
                    className="flex items-start gap-1.5 text-xs text-muted-foreground leading-snug"
                  >
                    <span
                      className="font-mono text-emerald-500/80 dark:text-emerald-400/80 text-[10px] select-none mt-0.5"
                      aria-hidden="true"
                    >
                      ›
                    </span>
                    <span>{principle}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-2.5 pt-2 border-t border-border-hairline/40 flex items-center justify-between font-mono text-[10px] text-muted-foreground/60">
              <span className="text-muted-foreground/50">principles</span>
              <span>03 focus</span>
            </div>
          </motion.article>
        </div>
      </motion.div>

      {/* Mobile Active Carousel Indicator (Hidden on Desktop) */}
      <div
        className="flex md:hidden items-center justify-between px-1 py-0.5 font-mono text-[10px] text-muted-foreground/70"
        aria-label="Carousel navigation"
      >
        <span className="tracking-wider uppercase">
          {`${CARD_INDICATORS[activeCardIndex].tag} · ${CARD_INDICATORS[activeCardIndex].num}`}
        </span>

        {/* Interactive Step Dots */}
        <div className="flex items-center gap-1.5" role="tablist">
          {CARD_INDICATORS.map((indicator, idx) => (
            <button
              key={indicator.tag}
              type="button"
              role="tab"
              aria-selected={activeCardIndex === idx}
              aria-label={`Go to ${indicator.tag}`}
              onClick={() => scrollToSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                activeCardIndex === idx
                  ? "w-4 bg-emerald-500 dark:bg-emerald-400"
                  : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Row: Compact Quick Facts Strip with Clean Responsive Grid & Desktop Dividers */}
      <motion.aside
        initial={shouldReduceMotion ? false : "hidden"}
        whileInView={shouldReduceMotion ? undefined : "visible"}
        viewport={{ once: true, amount: 0.15 }}
        variants={shouldReduceMotion ? undefined : contentBlockVariants}
        className="p-2.5 sm:p-3 rounded-md bg-surface/30 border border-border-hairline"
        aria-label="Quick Facts"
      >
        <div className="flex items-center gap-1.5 mb-2 pb-1 border-b border-border-hairline/40">
          <Terminal
            className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 flex-shrink-0"
            aria-hidden="true"
          />
          <span className="font-mono text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            &lt;QUICK-FACTS/&gt;
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-0 lg:divide-x lg:divide-border-hairline/40">
          {profileInfo.quickFacts.map((fact, idx) => (
            <div
              key={fact.label}
              className={`space-y-0.5 min-w-0 ${
                idx === profileInfo.quickFacts.length - 1
                  ? "col-span-2 lg:col-span-1"
                  : ""
              } ${idx > 0 ? "lg:pl-3" : ""} ${
                idx < profileInfo.quickFacts.length - 1 ? "lg:pr-3" : ""
              }`}
            >
              <span className="block font-mono text-[9px] text-muted-foreground/70 tracking-wider">
                {fact.label}
              </span>
              <span className="block font-sans text-[11px] sm:text-xs font-medium text-ink leading-snug break-words">
                {fact.value}
              </span>
            </div>
          ))}
        </div>
      </motion.aside>
    </div>
  );
}

export default ProfileInfoBlock;
