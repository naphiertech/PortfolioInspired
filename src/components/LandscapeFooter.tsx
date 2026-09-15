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

export function LandscapeFooter({ mode }: { mode: keyof typeof FOOTER_ART }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <footer className={styles.footer} data-footer-mode={mode}>
      <div className={styles.content}>
        <EditorialDivider className="mt-16 mb-6" />
        <div className={styles.metadata}>
          {mode === "minimal" && <p className={styles.modeLabel}>Minimal presentation</p>}
          <p>&copy; 2026 {SITE_NAME}. Designed with precision &amp; craft.</p>
          <p className={styles.build}>
            <span>Portfolio build ·</span>
            <time dateTime={BUILD_INFO.isoDate}>{BUILD_INFO.formattedDate}</time>
          </p>
        </div>
      </div>
      <div className={styles.scene} aria-hidden="true">
        {mounted && (
          <Image
            src={FOOTER_ART[mode][resolvedTheme]}
            alt=""
            width={2172}
            height={724}
            sizes="100vw"
            className={styles.landscape}
          />
        )}
      </div>
    </footer>
  );
}
