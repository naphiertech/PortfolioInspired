"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Sparkles, X } from "lucide-react";
import { RiOpenaiFill } from "react-icons/ri";
import { SiClaude, SiPerplexity } from "react-icons/si";

export interface AICompanionWidgetProps {
  variant?: "artisan" | "standard";
  prompt?: string;
  contained?: boolean;
  defaultOpen?: boolean;
}

const SERVICES = [
  {
    name: "ChatGPT",
    buildUrl: (prompt: string) =>
      `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`,
    bg: "bg-[#10a37f]",
    hoverBg:
      "hover:bg-[#10a37f] hover:border-[#10a37f] hover:text-white dark:hover:bg-[#10a37f] dark:hover:border-[#10a37f] dark:hover:text-white",
    offset: { x: -56, y: -56 },
    icon: RiOpenaiFill,
  },
  {
    name: "Claude",
    buildUrl: (prompt: string) =>
      `https://claude.ai/new?q=${encodeURIComponent(prompt)}`,
    bg: "bg-[#c25e38]",
    hoverBg:
      "hover:bg-[#c25e38] hover:border-[#c25e38] hover:text-white dark:hover:bg-[#c25e38] dark:hover:border-[#c25e38] dark:hover:text-white",
    offset: { x: 0, y: -56 },
    icon: SiClaude,
  },
  {
    name: "Perplexity",
    buildUrl: (prompt: string) =>
      `https://www.perplexity.ai/search?q=${encodeURIComponent(prompt)}`,
    bg: "bg-[#20808d]",
    hoverBg:
      "hover:bg-[#20808d] hover:border-[#20808d] hover:text-white dark:hover:bg-[#20808d] dark:hover:border-[#20808d] dark:hover:text-white",
    offset: { x: -56, y: 0 },
    icon: SiPerplexity,
  },
];

const DEFAULT_PROMPT =
  "Analyze this developer portfolio and summarize core engineering work, stack, and notable projects.";

export function AICompanionWidget({
  variant = "artisan",
  prompt = DEFAULT_PROMPT,
  contained = false,
  defaultOpen = false,
}: AICompanionWidgetProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [copied, setCopied] = useState(false);
  const [hoveredName, setHoveredName] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsOpen(defaultOpen);
  }, [defaultOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (service: (typeof SERVICES)[number]) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(prompt).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
    if (typeof window !== "undefined") {
      window.open(service.buildUrl(prompt), "_blank", "noopener,noreferrer");
    }
    setIsOpen(false);
  };

  const positionClass = contained
    ? "relative select-none"
    : "fixed bottom-5 right-5 z-50 select-none";

  if (variant === "artisan") {
    return (
      <div ref={rootRef} className={positionClass}>
        <div className="relative flex items-center justify-center">
          <AnimatePresence>
            {copied && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.9 }}
                className="absolute -top-24 right-0 whitespace-nowrap rounded-full bg-white/95 dark:bg-[#0a0a0a]/95 px-3 py-1 text-[10px] font-mono font-medium text-ink border border-black/10 dark:border-white/10 shadow-lg backdrop-blur-2xl flex items-center gap-1"
              >
                <Check className="w-3 h-3" />
                <span>Prompt copied</span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isOpen &&
              SERVICES.map((service, idx) => {
                const Icon = service.icon;
                const isHovered = hoveredName === service.name;
                return (
                  <motion.div
                    key={service.name}
                    initial={{ opacity: 0, scale: 0.2, x: 0, y: 0 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      x: service.offset.x,
                      y: service.offset.y,
                    }}
                    exit={{ opacity: 0, scale: 0.2, x: 0, y: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 420,
                      damping: 25,
                      delay: idx * 0.035,
                    }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  >
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: 4, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 4, scale: 0.9 }}
                          transition={{ duration: 0.14 }}
                          className="absolute -top-9 inset-x-0 pointer-events-none z-50 flex flex-col items-center"
                        >
                          <div className="rounded-full bg-white dark:bg-neutral-800 px-2.5 py-1 font-mono font-semibold tracking-wider text-neutral-900 dark:text-white text-[10px] shadow-xl border border-neutral-200 dark:border-neutral-700 whitespace-nowrap">
                            {service.name}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button
                      type="button"
                      onClick={() => handleSelect(service)}
                      onMouseEnter={() => setHoveredName(service.name)}
                      onMouseLeave={() => setHoveredName(null)}
                      aria-label={`Analyze with ${service.name}`}
                      className={`pointer-events-auto size-11 rounded-full flex items-center justify-center bg-white/95 dark:bg-[#0a0a0a]/95 text-neutral-800 dark:text-neutral-100 border border-black/12 dark:border-white/15 shadow-[0_4px_20px_rgba(0,0,0,0.12)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.55)] backdrop-blur-3xl transition-all duration-200 ease-out hover:scale-110 active:scale-95 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 ${service.hoverBg}`}
                    >
                      <Icon className="size-5" />
                    </button>
                  </motion.div>
                );
              })}
          </AnimatePresence>

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? "Close AI companion" : "Open AI companion"}
            aria-expanded={isOpen}
            className={`group relative z-10 size-11 rounded-full flex items-center justify-center bg-white/95 dark:bg-[#0a0a0a]/95 text-neutral-900 dark:text-white border transition-all duration-300 ease-out cursor-pointer shadow-[0_4px_24px_rgba(0,0,0,0.14)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.6)] backdrop-blur-3xl hover:scale-105 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 ${
              isOpen
                ? "border-neutral-900/35 dark:border-white/35 ring-2 ring-black/5 dark:ring-white/10"
                : "border-black/12 dark:border-white/15 hover:border-black/25 dark:hover:border-white/30"
            }`}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-[2px] rounded-full border border-black/[0.04] dark:border-white/[0.05]"
            />
            <motion.div
              animate={
                isOpen
                  ? { x: -2, y: -2 }
                  : {
                      x: [0, 0, 1.4, 1.4, 0, -1.4, -1.4, 0],
                      y: [0, 0, -0.6, -0.6, 0, -0.4, -0.4, 0],
                    }
              }
              transition={
                isOpen
                  ? { type: "spring", stiffness: 300, damping: 22 }
                  : {
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut",
                      times: [0, 0.25, 0.32, 0.5, 0.58, 0.72, 0.88, 1],
                    }
              }
              className="flex items-center justify-center gap-[5px]"
            >
              {[0, 1].map((eyeIdx) => (
                <motion.span
                  key={eyeIdx}
                  animate={{
                    scaleY: [1, 1, 0.08, 1, 1, 0.08, 0.95, 0.08, 1],
                  }}
                  transition={{
                    duration: 6.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    times: [0, 0.36, 0.41, 0.46, 0.78, 0.82, 0.85, 0.88, 0.93],
                  }}
                  className="relative w-[4px] h-[10px] rounded-full bg-neutral-900 dark:bg-white origin-center"
                >
                  <span
                    aria-hidden="true"
                    className="absolute top-[1.5px] right-[0.8px] w-[1.5px] h-[1.5px] rounded-full bg-white/90 dark:bg-neutral-900/90"
                  />
                </motion.span>
              ))}
            </motion.div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={rootRef} className={positionClass}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 8 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="absolute bottom-full right-0 mb-3 origin-bottom-right"
            role="dialog"
            aria-label="Ask AI"
          >
            <div className="relative rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl shadow-xl p-3">
              <div
                className="absolute -bottom-1.5 right-4 w-3 h-3 rotate-45 bg-white dark:bg-zinc-900 border-r border-b border-zinc-200/90 dark:border-zinc-800"
                aria-hidden="true"
              />
              <div className="flex items-center gap-3">
                {SERVICES.map((service) => {
                  const Icon = service.icon;
                  return (
                    <button
                      key={service.name}
                      type="button"
                      onClick={() => handleSelect(service)}
                      className="group flex flex-col items-center gap-1.5 p-1 rounded-xl cursor-pointer"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${service.bg} shadow-md transition-transform group-hover:scale-105`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-sans text-[11px] font-medium text-ink/80 group-hover:text-ink">
                        {service.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close AI menu" : "Ask AI"}
        aria-expanded={isOpen}
        className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg border border-zinc-200/90 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 cursor-pointer transition-transform active:scale-95"
      >
        {isOpen ? (
          <X className="w-4 h-4 text-ink" />
        ) : (
          <Sparkles className="w-4 h-4 text-brand" />
        )}
      </button>
    </div>
  );
}

export default AICompanionWidget;
