/* eslint-disable @next/next/no-img-element */
"use client";

import { ArrowUpRight, ChevronRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { ResourceItem } from "../types/resources";
import { useUISound } from "@/context/SoundContext";
import styles from "./ResourcesDrawer.module.css";

interface ResourceRowProps {
  item: ResourceItem;
  expanded: boolean;
  onToggle: () => void;
}

// Official marks and creator portraits. Source URLs are recorded with the assets.
const RESOURCE_ASSETS: Record<string, { src: string; darkSrc?: string; treatment: "mark" | "avatar" | "brand" }> = {
  "claude-code": { src: "/resources/icons/claude-code.svg", treatment: "brand" },
  codex: { src: "/resources/icons/openai.svg", treatment: "mark" },
  opencode: { src: "/resources/icons/opencode-mark.svg", darkSrc: "/resources/icons/opencode-mark-dark.svg", treatment: "brand" },
  antigravity: { src: "/resources/icons/antigravity-color.png", treatment: "brand" },
  "matt-pocock-skills": { src: "/resources/icons/mattpocock.png", treatment: "avatar" },
  "karpathy-skills": { src: "/resources/icons/karpathy.png", treatment: "avatar" },
  impeccable: { src: "/resources/icons/impeccable.svg", treatment: "brand" },
  hyperframes: { src: "/resources/icons/hyperframes.svg", treatment: "brand" },
  "skills-sh": { src: "/resources/icons/skills-sh.ico", treatment: "brand" },
  "playwright-skill": { src: "/resources/icons/playwright.svg", treatment: "brand" },
  "codebase-memory": { src: "/resources/icons/codebase-memory.svg", treatment: "brand" },
  superpowers: { src: "/resources/icons/superpowers.svg", treatment: "mark" },
  "rules-sync": { src: "/resources/icons/rulessync.jpg", treatment: "brand" },
  "mcp-tooling": { src: "/resources/icons/mcp.svg", treatment: "mark" },
  gstack: { src: "/resources/icons/garrytan.png", treatment: "avatar" },
  github: { src: "/resources/icons/github.svg", treatment: "mark" },
  vercel: { src: "/resources/icons/vercel.svg", treatment: "mark" },
  supabase: { src: "/resources/icons/supabase.svg", treatment: "brand" },
  "chrome-devtools": { src: "/resources/icons/chrome.svg", treatment: "brand" },
};

const FALLBACK_INITIALS: Record<string, string> = {
  "polish-transitions": "PT",
  "clone-skill": "CL",
  "design-taste-frontend": "DT",
  "agent-rules": "AR",
  caveman: "CV",
  brag: "BR",
  "surgical-patch": "SP",
};

export function ResourceRow({ item, expanded, onToggle }: ResourceRowProps) {
  const { playHover, playClick } = useUISound();
  const reducedMotion = useReducedMotion();
  const asset = RESOURCE_ASSETS[item.id];
  const canExpand = Boolean(item.description.trim() || item.subItems?.length) && (!item.url || Boolean(item.subItems?.length));
  const detailId = `resource-detail-${item.id}`;

  return (
    <article className={styles.row} data-resource-id={item.id}>
      <div className={styles.rowHeader}>
        {asset && item.id === "rules-sync" ? (
          <svg viewBox="650 200 1500 800" width={24} height={24} className={styles.logo} aria-hidden="true">
            {/* Crop the official source to its symbol so the tiny wordmark stays out. */}
            <image href={asset.src} width={2752} height={1536} />
          </svg>
        ) : asset?.darkSrc ? (
          <picture className={styles.iconPair}>
            <img src={asset.src} alt="" width={24} height={24} loading="lazy" decoding="async" className={`${styles.logo} ${styles.lightLogo}`} />
            <img src={asset.darkSrc} alt="" width={24} height={24} loading="lazy" decoding="async" className={`${styles.logo} ${styles.darkLogo}`} />
          </picture>
        ) : asset ? (
          <img src={asset.src} alt="" width={24} height={24} loading="lazy" decoding="async" className={`${styles.logo} ${styles[asset.treatment]}`} />
        ) : (
          <span className={styles.fallback} aria-hidden="true">{FALLBACK_INITIALS[item.id] ?? item.name.slice(0, 2).toUpperCase()}</span>
        )}
        <div className="min-w-0">
          <h4 className={styles.name}>
            <span>{item.name}</span>
            {item.badge && <span className={styles.badge}>{item.badge}</span>}
          </h4>
          <p className={styles.role} title={item.role}>{item.role}</p>
        </div>
        <div className={styles.actions}>
          {canExpand && (
            <button type="button" onClick={() => { playClick(); onToggle(); }} onMouseEnter={playHover} className={styles.action} aria-label={`${expanded ? "Collapse" : "Expand"} ${item.name}`} aria-expanded={expanded} aria-controls={detailId}>
              <ChevronRight size={16} className={styles.chevron} aria-hidden="true" />
            </button>
          )}
          {item.url && (
            <a href={item.url} target="_blank" rel="noopener noreferrer" onClick={playClick} className={styles.action} aria-label={`Open ${item.name} website or docs (opens in a new tab)`} onMouseEnter={playHover}>
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
      <AnimatePresence initial={false}>
        {canExpand && expanded && (
          <motion.div id={detailId} role="region" aria-label={`${item.name} details`} initial={{ opacity: 0, y: reducedMotion ? 0 : 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reducedMotion ? 0 : -4 }} transition={{ duration: reducedMotion ? 0 : 0.18, ease: "easeOut" }}>
            <div className={styles.detail}>
              {item.description && <p>{item.description}</p>}
              {item.subItems?.length ? (
                <ul>
                  {item.subItems.map((sub, index) => (
                    <li key={index}>
                      {typeof sub === "string" ? sub : <><strong>{sub.name}</strong>{sub.detail ? ` — ${sub.detail}` : ""}</>}
                    </li>
                  ))}
                </ul>
              ) : null}
              {item.url && (
                <a href={item.url} target="_blank" rel="noopener noreferrer" onClick={playClick}>{item.linkLabel ?? "Website / docs"}<ArrowUpRight size={12} aria-hidden="true" /></a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}
