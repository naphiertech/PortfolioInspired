"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "@/components/ThemeProvider";
import { EditorialDivider } from "@/components/EditorialDivider";
import { SITE_NAME } from "@/lib/siteConfig";
import { BUILD_INFO } from "@/lib/buildInfo";
import styles from "./DefaultLandscapeFooter.module.css";

export function DefaultLandscapeFooter() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <EditorialDivider className="mt-16 mb-6" />
        <div className={styles.metadata}>
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
            src={resolvedTheme === "dark" ? "/footer/footer_dark.png" : "/footer/footer_light.png"}
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
