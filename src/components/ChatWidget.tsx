"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X, Check } from "lucide-react";
import { RiOpenaiFill } from "react-icons/ri";
import { SiClaude, SiPerplexity } from "react-icons/si";
import { useUISound } from "@/context/SoundContext";
import { useCreativeMode } from "@/features/creative-mode";
import { usePresentationMode } from "@/features/presentation-modes/context/PresentationModeContext";
import { SITE_URL } from "@/lib/siteConfig";

const PORTFOLIO_URL = SITE_URL;
const AI_PORTFOLIO_PROMPT = `Analyze the portfolio at ${PORTFOLIO_URL}. Give me an overview of Naphier Awalie, his background as a full-stack developer, core tech stack, and key projects (like MKBRiderTrack, Naphix Resume, and AssetLink).`;

interface AIService {
  name: string;
  url: string;
  bg: string;
  hoverBg: string;
  artisanOffset: { x: number; y: number };
  icon: React.ComponentType<{ className?: string }>;
}

const AI_SERVICES: AIService[] = [
  {
    name: "ChatGPT",
    url: `https://chatgpt.com/?q=${encodeURIComponent(AI_PORTFOLIO_PROMPT)}`,
    bg: "bg-[#10a37f]",
    hoverBg: "hover:bg-[#10a37f] hover:border-[#10a37f] hover:text-white dark:hover:bg-[#10a37f] dark:hover:border-[#10a37f] dark:hover:text-white",
    artisanOffset: { x: -56, y: -56 },
    icon: RiOpenaiFill,
  },
  {
    name: "Claude",
    url: `https://claude.ai/new?q=${encodeURIComponent(AI_PORTFOLIO_PROMPT)}`,
    bg: "bg-[#c25e38]",
    hoverBg: "hover:bg-[#c25e38] hover:border-[#c25e38] hover:text-white dark:hover:bg-[#c25e38] dark:hover:border-[#c25e38] dark:hover:text-white",
    artisanOffset: { x: 0, y: -56 },
    icon: SiClaude,
  },
  {
    name: "Perplexity",
    url: `https://www.perplexity.ai/search?q=${encodeURIComponent(AI_PORTFOLIO_PROMPT)}`,
    bg: "bg-[#20808d]",
    hoverBg: "hover:bg-[#20808d] hover:border-[#20808d] hover:text-white dark:hover:bg-[#20808d] dark:hover:border-[#20808d] dark:hover:text-white",
    artisanOffset: { x: -56, y: 0 },
    icon: SiPerplexity,
  },
];

function ChatWidgetContent() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hoveredService, setHoveredService] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { playHover, playOpen, playClose, playClick } = useUISound();
  const { mode } = usePresentationMode();
  const isFocus = mode === "focus";
  const isArtisan = mode === "agent" || pathname === "/artisan";
  const { active: creativeActive } = useCreativeMode();

  // Close on outside click or Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        playClose();
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        playClose();
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, playClose]);

  const toggleLauncher = () => {
    if (isOpen) {
      playClose();
      setIsOpen(false);
    } else {
      playOpen();
      setIsOpen(true);
    }
  };

  const handleSelectAI = async (service: AIService) => {
    playClick();
    // Copy prompt to clipboard for user convenience
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(AI_PORTFOLIO_PROMPT);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Ignore clipboard write error
    }

    // Open the service with the prompt pre-filled in a new tab
    window.open(service.url, "_blank", "noopener,noreferrer");

    // Close the popover after selection
    setIsOpen(false);
  };

  // Minimal exposes the launcher only during Creative mode
  if (mode === "minimal" && !creativeActive && !isArtisan) {
    return null;
  }

  if (isArtisan) {
    return (
      <div
        ref={containerRef}
        className="fixed bottom-16 right-4 sm:bottom-5 sm:right-6 z-[65] select-none"
      >
        <div className="relative flex items-center justify-center">
          {/* Copied Feedback Pill */}
          <AnimatePresence>
            {copied && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.9 }}
                className="absolute -top-24 right-0 whitespace-nowrap rounded-full bg-white/95 dark:bg-[#0a0a0a]/95 px-3 py-1 text-[10px] font-mono font-medium text-emerald-600 dark:text-emerald-400 border border-black/10 dark:border-white/10 shadow-lg backdrop-blur-2xl flex items-center gap-1"
              >
                <Check className="w-3 h-3" />
                <span>Prompt copied</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 3 AI Circles arranged in the 2x2 corner cluster around the launcher */}
          <AnimatePresence>
            {isOpen &&
              AI_SERVICES.map((service, idx) => {
                const Icon = service.icon;
                const isHovered = hoveredService === service.name;
                return (
                  <motion.div
                    key={service.name}
                    initial={{ opacity: 0, scale: 0.2, x: 0, y: 0 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      x: service.artisanOffset.x,
                      y: service.artisanOffset.y,
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
                    {/* Artisan Tooltip */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: 4, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 4, scale: 0.9 }}
                          transition={{ duration: 0.14 }}
                          className="absolute -top-9 inset-x-0 pointer-events-none z-50 flex flex-col items-center"
                        >
                          <div className="rounded-full bg-white dark:bg-neutral-800 px-2.5 py-1 font-semibold tracking-wider text-neutral-900 dark:text-white text-[10px] shadow-xl border border-neutral-200 dark:border-neutral-700 backdrop-blur-md whitespace-nowrap font-mono">
                            {service.name}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button
                      type="button"
                      onClick={() => handleSelectAI(service)}
                      onMouseEnter={() => {
                        setHoveredService(service.name);
                        playHover();
                      }}
                      onMouseLeave={() => setHoveredService(null)}
                      title={`Analyze portfolio with ${service.name}`}
                      aria-label={`Analyze portfolio with ${service.name}`}
                      className={`pointer-events-auto size-11 sm:size-12 rounded-full flex items-center justify-center bg-white/95 dark:bg-[#0a0a0a]/95 text-neutral-800 dark:text-neutral-100 border border-black/12 dark:border-white/15 shadow-[0_4px_20px_rgba(0,0,0,0.12)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.55)] backdrop-blur-3xl transition-all duration-200 ease-out hover:scale-110 active:scale-95 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 ${service.hoverBg}`}
                    >
                      <Icon className="size-5 transition-transform duration-200" />
                    </button>
                  </motion.div>
                );
              })}
          </AnimatePresence>

          {/* Main Bottom-Right Circle with Gradually Blinking Eyes */}
          <button
            type="button"
            onClick={toggleLauncher}
            onMouseEnter={playHover}
            data-ai-chat-launcher="true"
            aria-label={isOpen ? "Close AI companion" : "Ask AI about this portfolio"}
            aria-expanded={isOpen}
            className={`group relative z-10 size-11 sm:size-12 rounded-full flex items-center justify-center bg-white/95 dark:bg-[#0a0a0a]/95 text-neutral-900 dark:text-white border transition-all duration-300 ease-out cursor-pointer shadow-[0_4px_24px_rgba(0,0,0,0.14)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.6)] backdrop-blur-3xl hover:scale-105 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 ${
              isOpen
                ? "border-neutral-900/35 dark:border-white/35 ring-2 ring-black/5 dark:ring-white/10"
                : "border-black/12 dark:border-white/15 hover:border-black/25 dark:hover:border-white/30"
            }`}
          >
            {/* Subtle inner ambient rim */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-[2px] rounded-full border border-black/[0.04] dark:border-white/[0.05]"
            />

            {/* Two Expressive Eyes that Blink Gradually */}
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
              className="flex items-center justify-center gap-[5px] sm:gap-[6px]"
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
                  className="relative w-[4px] h-[10px] sm:w-[4.5px] sm:h-[11px] rounded-full bg-neutral-900 dark:bg-white origin-center transition-transform duration-200 group-hover:scale-y-110"
                >
                  {/* Eye specular highlight */}
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
    <div
      ref={containerRef}
      className={`fixed z-50 transition-all duration-200 ${
        isFocus
          ? "bottom-4 right-3.5 sm:bottom-7 sm:right-8"
          : "bottom-[74px] right-3.5 sm:bottom-7 sm:right-8"
      }`}
    >
      {/* Popover Bubble */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 8 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="absolute bottom-full right-0 mb-3 origin-bottom-right"
            role="dialog"
            aria-label="Ask AI about this portfolio"
          >
            <div className="relative rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl shadow-xl shadow-black/10 dark:shadow-black/50 p-3 sm:p-3.5 select-none">
              {/* Caret pointing down at the trigger button */}
              <div
                className="absolute -bottom-1.5 right-3.5 sm:right-4 w-3 h-3 rotate-45 bg-white dark:bg-zinc-900 border-r border-b border-zinc-200/90 dark:border-zinc-800"
                aria-hidden="true"
              />

              {/* 3 AI Service Options */}
              <div className="flex items-center gap-3 sm:gap-4">
                {AI_SERVICES.map((service) => {
                  const Icon = service.icon;
                  return (
                    <button
                      key={service.name}
                      onClick={() => handleSelectAI(service)}
                      onMouseEnter={playHover}
                      className="group flex flex-col items-center gap-1.5 p-1 rounded-xl transition-all outline-none focus-visible:ring-2 focus-visible:ring-brand cursor-pointer"
                      title={`Open ${service.name} to analyze this portfolio`}
                      aria-label={`Open ${service.name}`}
                    >
                      {/* Brand Circle Badge */}
                      <div
                        className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white ${service.bg} shadow-md transition-transform duration-150 group-hover:scale-105 group-hover:shadow-lg active:scale-95`}
                      >
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>

                      {/* Brand Label */}
                      <span className="font-sans text-[11px] sm:text-xs font-medium text-ink/80 group-hover:text-ink transition-colors">
                        {service.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Copied Feedback Toast */}
              {copied && (
                <div className="mt-2 pt-2 border-t border-border-hairline flex items-center justify-center gap-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                  <Check className="w-3 h-3" />
                  <span>Prompt copied to clipboard</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Tactile Icon-Only Launcher Button */}
      <button
        onClick={toggleLauncher}
        onMouseEnter={playHover}
        data-ai-chat-launcher="true"
        className="tactile-btn w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-lg border border-zinc-200/90 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-700 transition-transform active:scale-95"
        aria-label={isOpen ? "Close AI menu" : "Ask AI about this portfolio"}
        aria-expanded={isOpen}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-4 h-4 text-ink" />
            </motion.div>
          ) : (
            <motion.div
              key="sparkles"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Sparkles className="w-4 h-4 text-brand" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}

export function ChatWidget() {
  return (
    <Suspense fallback={null}>
      <ChatWidgetContent />
    </Suspense>
  );
}

export default ChatWidget;
