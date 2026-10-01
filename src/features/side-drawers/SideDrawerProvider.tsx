"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useScrollLock } from "@/lib/scrollLock";
import { useUISound } from "@/context/SoundContext";
import styles from "./SideDrawerProvider.module.css";

type DrawerId = "music" | "resources";
type DrawerState = { active: DrawerId | null; closing: DrawerId | null; pending: DrawerId | null };
interface SideDrawerValue {
  activeDrawer: DrawerId | null;
  isMobile: boolean;
  openDrawer: (drawer: DrawerId) => void;
  toggleDrawer: (drawer: DrawerId) => void;
  closeDrawer: () => void;
  finishClose: (drawer: DrawerId) => void;
}

const SideDrawerContext = createContext<SideDrawerValue | null>(null);

/** One overlay owner; a replacement waits for the current drawer's exit. */
export function SideDrawerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DrawerState>({ active: null, closing: null, pending: null });
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const reducedMotion = useReducedMotion();
  const { playClose } = useUISound();
  const overlayVisible = state.active !== null || state.pending !== null;
  useScrollLock(overlayVisible);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 639px)");
    const updateSize = () => setIsMobile(media.matches);
    updateSize();
    media.addEventListener("change", updateSize);
    return () => media.removeEventListener("change", updateSize);
  }, []);
  useEffect(() => {
    if (overlayVisible) document.body.dataset.sideDrawerOpen = "true";
    else delete document.body.dataset.sideDrawerOpen;
    return () => { delete document.body.dataset.sideDrawerOpen; };
  }, [overlayVisible]);

  const rememberTrigger = useCallback((drawer: DrawerId) => {
    triggerRef.current = document.querySelector<HTMLButtonElement>(`[aria-controls="${drawer}-drawer-panel"]`);
  }, []);

  const openDrawer = useCallback((drawer: DrawerId) => {
    rememberTrigger(drawer);
    setState(previous => {
      if (previous.active === drawer) return previous;
      if (previous.closing) return { ...previous, pending: drawer };
      if (previous.active) return { active: null, closing: previous.active, pending: drawer };
      return { active: drawer, closing: null, pending: null };
    });
  }, [rememberTrigger]);

  const closeDrawer = useCallback(() => {
    playClose();
    setState(previous => ({ active: null, closing: previous.active ?? previous.closing, pending: null }));
    triggerRef.current?.focus({ preventScroll: true });
  }, [playClose]);

  const toggleDrawer = useCallback((drawer: DrawerId) => {
    if (state.active === drawer || state.pending === drawer) closeDrawer();
    else openDrawer(drawer);
  }, [state.active, state.pending, closeDrawer, openDrawer]);

  const finishClose = useCallback((drawer: DrawerId) => {
    setState(previous => previous.closing === drawer
      ? { active: previous.pending, closing: null, pending: null }
      : previous);
  }, []);

  useEffect(() => {
    if (!state.active) return;
    const panel = document.getElementById(`${state.active}-drawer-panel`);
    panel?.focus({ preventScroll: true });
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        closeDrawer();
      } else if (event.key === "Tab" && panel) {
        const controls = Array.from(panel.querySelectorAll<HTMLElement>('button, a[href], input, select, textarea, [tabindex="0"]'))
          .filter(element => element.tabIndex >= 0 && !element.hasAttribute("disabled") && element.getClientRects().length > 0);
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (!panel.contains(document.activeElement) || document.activeElement === panel || (event.shiftKey && document.activeElement === first) || (!event.shiftKey && document.activeElement === last)) {
          event.preventDefault();
          (event.shiftKey ? last : first)?.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown, true);
    return () => document.removeEventListener("keydown", handleKeyDown, true);
  }, [state.active, closeDrawer]);

  const value = useMemo(() => ({ activeDrawer: state.active, isMobile, openDrawer, toggleDrawer, closeDrawer, finishClose }), [state.active, isMobile, openDrawer, toggleDrawer, closeDrawer, finishClose]);
  return (
    <SideDrawerContext.Provider value={value}>
      {children}
      {mounted && createPortal(
        <AnimatePresence>
          {overlayVisible && (
            <motion.div
              key="side-drawer-backdrop"
              data-side-drawer-backdrop="true"
              aria-hidden="true"
              onClick={closeDrawer}
              initial={{ opacity: 0, backdropFilter: reducedMotion ? "blur(6px)" : "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(6px)" }}
              exit={{ opacity: 0, backdropFilter: reducedMotion ? "blur(6px)" : "blur(0px)", transition: { duration: reducedMotion ? 0 : 0.16 } }}
              transition={{ duration: reducedMotion ? 0 : 0.24, ease: "easeOut" }}
              className={styles.backdrop}
            />
          )}
        </AnimatePresence>, document.body
      )}
    </SideDrawerContext.Provider>
  );
}

export function useSideDrawers() {
  const context = useContext(SideDrawerContext);
  if (!context) throw new Error("Side drawers require SideDrawerProvider");
  return context;
}
