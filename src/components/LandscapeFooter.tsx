"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "@/components/ThemeProvider";
import { EditorialDivider } from "@/components/EditorialDivider";
import { SITE_NAME } from "@/lib/siteConfig";
import { BUILD_INFO } from "@/lib/buildInfo";
import styles from "./LandscapeFooter.module.css";

const FOOTER_ART = {
  default: { dark: "/footer/footer_dark.png", light: "/footer/footer_light.png" },
  focus: { dark: "/footer/footer_dark_focus.png", light: "/footer/footer_light_focus.png" },
  minimal: { dark: "/footer/footer_dark_minimal.png", light: "/footer/footer_light_minimal.png" },
} as const;

const FOOTER_QUOTES = {
  default: {
    quote: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
  },
  focus: {
    quote: "Simplicity is prerequisite for reliability.",
    author: "Edsger W. Dijkstra",
  },
  minimal: {
    quote: "Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away.",
    author: "Antoine de Saint-Exupéry",
  },
} as const;

export function LandscapeFooter({ mode }: { mode: keyof typeof FOOTER_ART }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const quoteData = FOOTER_QUOTES[mode];

  return (
    <footer className={styles.footer} data-footer-mode={mode}>
      <div className={styles.content}>
        <EditorialDivider className={mode === "default" ? "mt-8 sm:mt-10 mb-4 sm:mb-5" : "mt-12 sm:mt-14 mb-6"} />
        <div className={styles.metadata}>
          {mode === "minimal" && <p className={styles.modeLabel}>Minimal presentation</p>}
          <p>&copy; 2026 {SITE_NAME}. Designed with precision &amp; craft.</p>
          <p className={styles.build}>
            <span>Portfolio build ·</span>
            <time dateTime={BUILD_INFO.isoDate}>{BUILD_INFO.formattedDate}</time>
          </p>
        </div>
      </div>

      <div className={styles.scenicWrapper}>
        <div className={styles.quoteBlock}>
          <svg
            className={styles.quoteIcon}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          <blockquote className={styles.quoteText}>
            &ldquo;{quoteData.quote}&rdquo;
          </blockquote>
          <div className={styles.quoteAuthor}>
            <span className={styles.quoteLine} aria-hidden="true" />
            <span>{quoteData.author}</span>
            <span className={styles.quoteLine} aria-hidden="true" />
          </div>
        </div>

        <div className={styles.scene} aria-hidden="true">
          {mounted && (
            <Image
              src={FOOTER_ART[mode][resolvedTheme]}
              alt=""
              width={2172}
              height={724}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 1020px, 1020px"
              className={styles.landscape}
            />
          )}
        </div>
      </div>
    </footer>
  );
}
