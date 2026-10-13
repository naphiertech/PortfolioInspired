"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X, Check } from "lucide-react";
import { RiOpenaiFill } from "react-icons/ri";
import { SiClaude, SiPerplexity } from "react-icons/si";
import { useUISound } from "@/context/SoundContext";
import { useCreativeMode } from "@/features/creative-mode";
import { usePresentationMode } from "@/features/presentation-modes/context/PresentationModeContext";

const PORTFOLIO_URL = "https://naphiernode.vercel.app";
const AI_PORTFOLIO_PROMPT = `Analyze the portfolio at ${PORTFOLIO_URL}. Give me an overview of Naphier Awalie, his background as a full-stack developer, core tech stack, and key projects (like MKBRiderTrack, Naphix Resume, and AssetLink).`;

interface AIService {
  name: string;
  url: string;
  bg: string;
  icon: React.ComponentType<{ className?: string }>;
}

const AI_SERVICES: AIService[] = [
  {
    name: "ChatGPT",
    url: `https://chatgpt.com/?q=${encodeURIComponent(AI_PORTFOLIO_PROMPT)}`,
    bg: "bg-[#10a37f]",
    icon: RiOpenaiFill,
  },
  {
    name: "Claude",
    url: `https://claude.ai/new?q=${encodeURIComponent(AI_PORTFOLIO_PROMPT)}`,
    bg: "bg-[#c25e38]",
    icon: SiClaude,
  },
  {
    name: "Perplexity",
    url: `https://www.perplexity.ai/search?q=${encodeURIComponent(AI_PORTFOLIO_PROMPT)}`,
    bg: "bg-[#20808d]",
    icon: SiPerplexity,
  },
];

function ChatWidgetContent() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { playHover, playOpen, playClose, playClick } = useUISound();
  const { mode } = usePresentationMode();
  const isFocus = mode === "focus";
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

  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  // Minimal exposes the launcher only during Creative mode; Agent stays excluded.
  if ((mode === "minimal" && !creativeActive) || mode === "agent" || pathname === "/artisan") {
    return null;
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
