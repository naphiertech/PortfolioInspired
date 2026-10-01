"use client";

import React, { useEffect, useRef, useState } from "react";
import { X, Boxes, Bot, Code2, Workflow } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { RESOURCE_CATEGORIES } from "../data/resources";
import { ResourceRow } from "./ResourceRow";
import { useUISound } from "@/context/SoundContext";
import styles from "./ResourcesDrawer.module.css";
import shellStyles from "@/features/side-drawers/SideDrawerShell.module.css";
import type { ResourceItem } from "../types/resources";
import { useSideDrawers } from "@/features/side-drawers/SideDrawerProvider";

type ResourceTabId = "agents" | "skills" | "workflow";

interface ResourcesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onExitComplete?: () => void;
  className?: string;
}

const TABS = [
  { id: "agents", label: "Agents", icon: Bot },
  { id: "skills", label: "Skills", icon: Code2 },
  { id: "workflow", label: "Workflow", icon: Workflow },
] as const;

/** Exclusive resource tabs inside the existing left drawer / mobile sheet. */
export function ResourcesDrawer({ isOpen, onClose, onExitComplete, className = "" }: ResourcesDrawerProps) {
  const tabListRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { playClick } = useUISound();
  const [activeTab, setActiveTab] = useState<ResourceTabId>("agents");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { isMobile } = useSideDrawers();

  useEffect(() => {
    if (!isOpen) setExpandedId(null);
  }, [isOpen]);

  const chooseTab = (tab: ResourceTabId) => {
    setActiveTab(tab);
    setExpandedId(null);
    playClick();
    document.getElementById("resources-drawer-scroll-area")?.scrollTo({ top: 0 });
  };

  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    let targetIndex = currentIndex;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") targetIndex = (currentIndex + 1) % TABS.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") targetIndex = (currentIndex - 1 + TABS.length) % TABS.length;
    else if (event.key === "Home") targetIndex = 0;
    else if (event.key === "End") targetIndex = TABS.length - 1;
    else return;
    event.preventDefault();
    chooseTab(TABS[targetIndex].id);
    tabListRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[targetIndex]?.focus();
  };

  const categoryIds = activeTab === "workflow" ? ["rules-workflow", "platform-tooling"] : [activeTab];
  const categories = RESOURCE_CATEGORIES.filter(category => categoryIds.includes(category.id));
  const hasExternalItems = categories.some(category => category.items.some(item => item.url));
  const localCategories = categories.filter(category => category.items.some(item => !item.url));
  const renderRow = (item: ResourceItem) => (
    <ResourceRow key={item.id} item={item} expanded={expandedId === item.id} onToggle={() => setExpandedId(previous => previous === item.id ? null : item.id)} />
  );

  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {isOpen && (
          <motion.section
            id="resources-drawer-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Development Resources & Toolbox Drawer"
            tabIndex={-1}
            initial={isMobile ? { y: reducedMotion ? 0 : "100%", opacity: 0 } : { x: reducedMotion ? 0 : -28, opacity: 0, scale: reducedMotion ? 1 : 0.98 }}
            animate={isMobile ? { y: 0, opacity: 1 } : { x: 0, opacity: 1, scale: 1 }}
            exit={isMobile ? { y: reducedMotion ? 0 : "100%", opacity: 0, pointerEvents: "none", transition: { duration: reducedMotion ? 0 : 0.16 } } : { x: reducedMotion ? 0 : -24, opacity: 0, scale: reducedMotion ? 1 : 0.98, pointerEvents: "none", transition: { duration: reducedMotion ? 0 : 0.16 } }}
            transition={{ duration: reducedMotion ? 0 : 0.24, ease: [0.16, 1, 0.3, 1] }}
            className={`${shellStyles.panel} ${styles.panel} ${className}`}
          >
            <div className="sm:hidden flex justify-center pb-2" aria-hidden="true"><div className="w-10 h-1 rounded-full bg-neutral-300 dark:bg-neutral-600" /></div>
            <header className={styles.header}>
              <div>
                <div className={styles.heading}>
                  <h2>&lt;RESOURCES/&gt;</h2>
                  <span className={styles.badge}>TOOLBOX</span>
                </div>
                <p className={styles.subtitle}>developer tools &amp; workflows</p>
              </div>
              <button type="button" onClick={onClose} aria-label="Close resources drawer" className={styles.action}><X size={18} aria-hidden="true" /></button>
            </header>
            <div ref={tabListRef} role="tablist" aria-label="Resource categories" className={styles.tabs}>
              {TABS.map((tab, index) => {
                const Icon = tab.icon;
                const selected = activeTab === tab.id;
                return (
                  <button key={tab.id} id={`tab-${tab.id}`} role="tab" type="button" aria-selected={selected} aria-controls={`panel-${tab.id}`} tabIndex={selected ? 0 : -1} onClick={() => chooseTab(tab.id)} onKeyDown={event => handleTabKeyDown(event, index)} className={styles.tab}>
                    <Icon size={14} aria-hidden="true" /><span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
            <div id="resources-drawer-scroll-area" className={styles.list}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={activeTab} id={`panel-${activeTab}`} role="tabpanel" aria-labelledby={`tab-${activeTab}`} initial={{ opacity: 0, y: reducedMotion ? 0 : 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reducedMotion ? 0 : -5 }} transition={{ duration: reducedMotion ? 0 : 0.18, ease: "easeOut" }}>
                  {categories.filter(category => category.items.some(item => item.url)).map(category => (
                    <section key={category.id} className={styles.category} aria-label={category.title}>
                      <div className={styles.categoryHeader}><h3>{category.number}{" // "}{category.title}</h3><span className={styles.count}>[{category.items.length}]</span></div>
                      {category.items.filter(item => item.url).map(renderRow)}
                    </section>
                  ))}
                  {localCategories.length > 0 && (
                    <div className={hasExternalItems ? styles.localGroup : undefined}>
                      {localCategories.map(category => (
                        <section key={category.id} className={styles.category} aria-label={`Local ${category.title.toLowerCase()}`}>
                          {!category.items.some(item => item.url) && (
                            <div className={styles.categoryHeader}><h3>{category.number}{" // "}{category.title}</h3><span className={styles.count}>[{category.items.length}]</span></div>
                          )}
                          {category.items.filter(item => !item.url).map(renderRow)}
                        </section>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
            <footer className={styles.footer}><Boxes size={14} aria-hidden="true" /><span>Tools shape the systems we ship.</span></footer>
          </motion.section>
      )}
    </AnimatePresence>
  );
}
