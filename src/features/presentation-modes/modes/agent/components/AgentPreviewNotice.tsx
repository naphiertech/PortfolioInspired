"use client";

import { useEffect, useId, useRef, useState, type RefObject } from "react";
import { motion, useReducedMotion } from "framer-motion";

const DISMISSAL_KEY = "naphier_agent_preview_notice_v1";
// Preserve dismissal across mode switches even if browser storage is unavailable.
let dismissedInMemory = false;

interface AgentPreviewNoticeProps {
  suggestedPromptsRef: RefObject<HTMLDivElement | null>;
  inputRef: RefObject<HTMLTextAreaElement | null>;
  hasMessages: boolean;
}

export function AgentPreviewNotice({
  suggestedPromptsRef,
  inputRef,
  hasMessages,
}: AgentPreviewNoticeProps) {
  const [visible, setVisible] = useState(false);
  const [availableHeight, setAvailableHeight] = useState(0);
  const anchorRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (dismissedInMemory) return;
    try {
      setVisible(sessionStorage.getItem(DISMISSAL_KEY) !== "dismissed");
    } catch {
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    if (!visible) return;
    const anchor = anchorRef.current;
    if (!anchor) return;
    let frame = 0;

    // Keep the floating card above protected controls, including when the
    // mobile keyboard opens or the empty-state suggestions are scrolled.
    const measure = () => {
      const top = anchor.getBoundingClientRect().top + 8;
      const viewport = window.visualViewport;
      let bottom = viewport
        ? viewport.offsetTop + viewport.height
        : window.innerHeight;
      for (const element of [suggestedPromptsRef.current, inputRef.current]) {
        if (!element) continue;
        const rect = element.getBoundingClientRect();
        if (rect.bottom > top) bottom = Math.min(bottom, rect.top);
      }
      setAvailableHeight(Math.max(0, Math.floor(bottom - top - 12)));
    };
    const scheduleMeasure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    measure();
    const observer = new ResizeObserver(scheduleMeasure);
    for (const element of [
      anchor.parentElement,
      anchor.parentElement?.parentElement,
      suggestedPromptsRef.current,
      inputRef.current,
    ]) {
      if (element) observer.observe(element);
    }
    window.addEventListener("resize", scheduleMeasure);
    document.addEventListener("scroll", scheduleMeasure, true);
    window.visualViewport?.addEventListener("resize", scheduleMeasure);
    window.visualViewport?.addEventListener("scroll", scheduleMeasure);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", scheduleMeasure);
      document.removeEventListener("scroll", scheduleMeasure, true);
      window.visualViewport?.removeEventListener("resize", scheduleMeasure);
      window.visualViewport?.removeEventListener("scroll", scheduleMeasure);
    };
  }, [visible, hasMessages, suggestedPromptsRef, inputRef]);

  const dismiss = () => {
    dismissedInMemory = true;
    setVisible(false);
    try {
      sessionStorage.setItem(DISMISSAL_KEY, "dismissed");
    } catch {
      // The in-memory fallback still dismisses the notice for this page session.
    }
  };

  if (!visible) return null;

  return (
    <div
      ref={anchorRef}
      className="pointer-events-none absolute inset-x-0 top-full z-30 flex justify-center pt-2"
    >
      {availableHeight > 0 && (
        <motion.section
          aria-labelledby={titleId}
          initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.22, ease: "easeOut" }}
          style={{ maxHeight: availableHeight }}
          className="pointer-events-auto w-full max-w-md overflow-y-auto rounded-xl border border-zinc-300 bg-zinc-50 p-3.5 text-left text-zinc-700 shadow-[0_4px_16px_rgba(0,0,0,0.12)] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 sm:p-4 select-text"
        >
          <div role="status" aria-live="polite" aria-atomic="true">
            <h2 id={titleId} className="font-mono text-[10px] font-medium tracking-[0.12em] text-zinc-600 dark:text-zinc-400">
              AGENT FOLIO / PREVIEW
            </h2>
            <p className="mt-2 text-xs leading-relaxed sm:text-sm">
              Agent Folio is still under construction.
              <br />
              You can try it now, but its conversational understanding and follow-up handling are still being improved.
            </p>
          </div>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Got it, dismiss Agent Folio preview notice"
            className="mt-3 rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-800 transition-colors hover:bg-zinc-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-700 dark:border-zinc-600 dark:text-zinc-100 dark:hover:bg-zinc-800 dark:focus-visible:outline-zinc-200 motion-reduce:transition-none"
          >
            Got it
          </button>
        </motion.section>
      )}
    </div>
  );
}
