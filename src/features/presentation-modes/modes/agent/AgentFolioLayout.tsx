"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Send,
  RotateCcw,
  ArrowUpRight,
  ExternalLink,
  Bot,
  User,
  Loader2,
  ArrowRight,
  Compass,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useUISound } from "@/context/SoundContext";
import { useTheme } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PresentationModeSwitcher } from "@/features/presentation-modes/components/PresentationModeSwitcher";
import { AUTHOR_INFO, SOCIAL_PROFILES } from "@/lib/siteConfig";
import {
  extractAndValidateLinks,
  validatePortfolioLink,
  ValidatedLink,
} from "@/lib/portfolioContext";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_PROMPTS = [
  "What does Naphier build?",
  "Tell me about his experience.",
  "What technologies does he use?",
  "Show me his projects.",
];

/**
 * Formats assistant response text with bold parsing, bullet points, and validated links
 */
function FormattedMessageText({ content }: { content: string }) {
  const { playHover, playClick } = useUISound();
  const lines = content.split("\n");

  return (
    <div className="space-y-2 text-sm text-body leading-relaxed">
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={lineIdx} className="h-1" />;
        }

        const isBullet = trimmed.startsWith("- ") || trimmed.startsWith("* ");
        const lineContent = isBullet ? trimmed.slice(2) : trimmed;

        // Parse bold text and markdown links
        const parts: React.ReactNode[] = [];
        let lastIndex = 0;
        const combinedRegex = /(\*\*([^*]+)\*\*)|(\[([^\]]+)\]\(([^)]+)\))/g;
        let match: RegExpExecArray | null;

        while ((match = combinedRegex.exec(lineContent)) !== null) {
          if (match.index > lastIndex) {
            parts.push(lineContent.slice(lastIndex, match.index));
          }

          if (match[1]) {
            parts.push(
              <strong key={match.index} className="font-semibold text-ink">
                {match[2]}
              </strong>
            );
          } else if (match[3]) {
            const label = match[4];
            const rawHref = match[5];
            const { isValid, normalizedHref, isExternal } = validatePortfolioLink(rawHref);

            if (isValid) {
              parts.push(
                <Link
                  key={match.index}
                  href={normalizedHref}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  onMouseEnter={playHover}
                  onClick={playClick}
                  className="font-medium text-ink underline decoration-border-reticle hover:decoration-brand underline-offset-2 transition-colors inline-flex items-center gap-0.5"
                >
                  <span>{label}</span>
                  {isExternal ? (
                    <ExternalLink className="w-3 h-3 opacity-60 inline" />
                  ) : (
                    <ArrowUpRight className="w-3 h-3 opacity-60 inline" />
                  )}
                </Link>
              );
            } else {
              parts.push(label);
            }
          }

          lastIndex = combinedRegex.lastIndex;
        }

        if (lastIndex < lineContent.length) {
          parts.push(lineContent.slice(lastIndex));
        }

        if (isBullet) {
          return (
            <div key={lineIdx} className="flex items-start gap-2 ml-1">
              <span className="text-brand font-mono text-xs mt-1 select-none">•</span>
              <div className="flex-1">{parts}</div>
            </div>
          );
        }

        return <p key={lineIdx}>{parts}</p>;
      })}
    </div>
  );
}

/**
 * AgentFolioLayout
 *
 * 4th Presentation Mode: Minimal AI assistant workspace interface.
 * Allows visitors to talk with Naphier's portfolio through natural conversation
 * while strictly confined to the portfolio knowledge domain with defense in depth.
 */
export function AgentFolioLayout() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [animationFrame, setAnimationFrame] = useState(0);
  const currentFrameRef = useRef(0);
  const isInitialMount = useRef(true);

  // Sync ref with state
  useEffect(() => {
    currentFrameRef.current = animationFrame;
  }, [animationFrame]);

  // Set initial frame on mount based on active theme
  useEffect(() => {
    if (isInitialMount.current && resolvedTheme) {
      const initial = resolvedTheme === "dark" ? 240 : 0;
      setAnimationFrame(initial);
      currentFrameRef.current = initial;
      isInitialMount.current = false;
    }
  }, [resolvedTheme]);

  // Preload animation frames for smooth 60fps caching
  useEffect(() => {
    if (typeof window === "undefined") return;

    for (let i = 1; i <= 240; i++) {
      const img = document.createElement("img");
      img.src = `/profile/ezgif-frame-${String(i).padStart(3, "0")}.png`;
    }
  }, []);

  // Frame animation driven by dark/light theme switching (Butter-smooth 60fps)
  useEffect(() => {
    if (isInitialMount.current) return;

    let animationFrameId: number;
    let lastTime = performance.now();
    const fps = 60;
    const interval = 1000 / fps; // ~16.67ms per frame tick

    const animate = (time: number) => {
      const current = currentFrameRef.current;

      if (isDark && current >= 240) return;
      if (!isDark && current <= 0) return;

      const delta = time - lastTime;

      if (delta >= interval) {
        lastTime = time - (delta % interval);

        setAnimationFrame((prev) => {
          // Smooth 2-frame advancement per tick for continuous 60fps motion (~2 seconds)
          if (isDark) {
            const next = prev + 2;
            return next > 240 ? 240 : next;
          } else {
            const next = prev - 2;
            return next < 0 ? 0 : next;
          }
        });
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { playClick, playHover } = useUISound();
  const shouldReduceMotion = useReducedMotion();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  // Adjust textarea height dynamically
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  };

  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    playClick();
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    const updatedMessages: Message[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages,
          pageContext: {
            pathname: "/",
            pageType: "home",
            title: "Agent Folio",
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data.reply ||
            `I’m here to help you explore ${AUTHOR_INFO.shortName}’s portfolio. Feel free to ask about his projects, skills, experience, or certifications!`,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            `Sorry, I am having trouble connecting right now. Please feel free to email ${AUTHOR_INFO.shortName} directly at ${SOCIAL_PROFILES.email}!`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(input);
    }
  };

  const handleReset = () => {
    playClick();
    setMessages([]);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.focus();
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="w-full flex-1 flex flex-col justify-between max-w-3xl mx-auto h-[calc(100dvh-32px)] sm:h-[calc(100dvh-48px)] select-none sm:select-auto">
      {/* 1. TOP HEADER: Brand / View Switcher / Theme Toggle */}
      <header className="w-full flex items-center justify-between pb-3 sm:pb-4 border-b border-border-hairline flex-shrink-0 gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 flex-shrink">
          <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
            <span className="font-mono font-bold text-xs sm:text-sm text-ink tracking-tight truncate">
              naphiernode
            </span>
            <span className="text-muted-foreground/50 font-mono text-xs">/</span>
            <span className="font-mono text-[11px] text-muted-foreground tracking-wider uppercase hidden xs:inline">
              agent
            </span>
          </div>

          <div className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 dark:text-emerald-400 flex-shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
            <span className="font-mono text-[10px] font-medium leading-none">
              Online
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {hasMessages && (
            <button
              type="button"
              onClick={handleReset}
              onMouseEnter={playHover}
              title="Reset conversation"
              aria-label="Reset conversation"
              className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg bg-surface/80 hover:bg-surface border border-border-hairline text-muted-foreground hover:text-ink text-xs font-mono transition-colors cursor-pointer shadow-xs flex-shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="hidden sm:inline text-[11px]">New Chat</span>
            </button>
          )}

          <PresentationModeSwitcher variant="agent" />
          <ThemeToggle />
        </div>
      </header>

      {/* 2. MAIN CONTENT AREA: Empty Hero OR Message Stream */}
      {!hasMessages ? (
        /* HERO / EMPTY STATE */
        <div className="flex-1 flex flex-col items-center justify-center py-6 sm:py-10 px-2 text-center overflow-y-auto">
          {/* Identity Mark / Avatar */}
          <motion.div
            initial={{ scale: shouldReduceMotion ? 1 : 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative mb-4 group"
          >
            <div
              className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl ring-4 ring-page bg-surface border border-border-hairline overflow-hidden shadow-xl flex-shrink-0 cursor-pointer"
              title={`${AUTHOR_INFO.name} (${isDark ? "Dark theme sunglasses" : "Light theme"})`}
            >
              <Image
                src="/profile/ezgif-frame-001.png"
                alt={AUTHOR_INFO.name}
                fill
                sizes="80px"
                priority
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                style={{ objectPosition: "center 25%" }}
              />

              {/* Sunglasses animation frame overlay when dark theme active or transitioning */}
              {animationFrame > 0 && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={`/profile/ezgif-frame-${String(animationFrame).padStart(3, "0")}.png`}
                  alt="Profile Animation"
                  className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none"
                  style={{ objectPosition: "center 25%" }}
                />
              )}
            </div>
          </motion.div>

          {/* Name & Role */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="space-y-1"
          >
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-ink font-sans">
              {AUTHOR_INFO.name}
            </h1>
            <p className="font-mono text-xs text-brand uppercase tracking-wider font-medium">
              {AUTHOR_INFO.jobTitle}
            </p>
          </motion.div>

          {/* Welcoming Message */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="mt-3 max-w-md space-y-1.5"
          >
            <h2 className="text-base sm:text-lg font-sans font-medium text-ink">
              Ask me about Naphier.
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              An interactive interface to Naphier’s portfolio. Ask questions about his projects, tech stack, architecture, experience, or certifications.
            </p>
          </motion.div>

          {/* Suggested Prompts */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            className="w-full max-w-xl mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-2 text-left"
          >
            {SUGGESTED_PROMPTS.map((prompt, pIdx) => (
              <button
                key={pIdx}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                onMouseEnter={playHover}
                className="p-3 rounded-xl bg-surface/60 hover:bg-surface border border-border-hairline hover:border-border text-ink text-xs font-sans flex items-center justify-between gap-2.5 transition-all shadow-2xs hover:shadow-xs group cursor-pointer"
              >
                <span className="leading-snug">{prompt}</span>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-ink flex-shrink-0 transition-transform group-hover:translate-x-0.5" />
              </button>
            ))}
          </motion.div>
        </div>
      ) : (
        /* CONVERSATION MESSAGE STREAM */
        <div
          className="flex-1 overflow-y-auto py-4 space-y-4 px-1 pr-2 sm:pr-3"
          aria-live="polite"
          aria-relevant="additions"
        >
          {messages.map((msg, idx) => {
            const isAssistant = msg.role === "assistant";
            const links: ValidatedLink[] = isAssistant
              ? extractAndValidateLinks(msg.content)
              : [];

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className={`flex gap-3 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {isAssistant && (
                  <div className="w-7 h-7 rounded-lg bg-surface border border-border-hairline flex items-center justify-center flex-shrink-0 text-brand mt-0.5 shadow-2xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[90%] sm:max-w-[82%] p-3.5 sm:p-4 rounded-2xl leading-relaxed ${
                    msg.role === "user"
                      ? "bg-surface text-ink border border-border shadow-xs rounded-tr-xs"
                      : "bg-surface/50 text-body border border-border-hairline/80 shadow-2xs rounded-tl-xs"
                  }`}
                >
                  {isAssistant ? (
                    <div>
                      <FormattedMessageText content={msg.content} />

                      {/* Interactive Navigation Action Pills */}
                      {links.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-border-hairline/60 space-y-2">
                          <div className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                            <Compass className="w-3 h-3" />
                            <span>Suggested Navigation</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {links.map((link, lIdx) => (
                              <Link
                                key={lIdx}
                                href={link.href}
                                target={link.isExternal ? "_blank" : undefined}
                                rel={link.isExternal ? "noopener noreferrer" : undefined}
                                onMouseEnter={playHover}
                                onClick={playClick}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-hover border border-border-hairline hover:border-border text-ink text-xs font-sans transition-all group shadow-2xs cursor-pointer"
                              >
                                <span className="font-medium">{link.label}</span>
                                {link.isExternal ? (
                                  <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-ink flex-shrink-0" />
                                ) : (
                                  <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-ink flex-shrink-0 transition-transform group-hover:translate-x-0.5" />
                                )}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm font-sans text-ink whitespace-pre-wrap">{msg.content}</span>
                  )}
                </div>

                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-lg bg-surface border border-border-hairline flex items-center justify-center flex-shrink-0 text-muted-foreground mt-0.5 shadow-2xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </motion.div>
            );
          })}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3 justify-start"
            >
              <div className="w-7 h-7 rounded-lg bg-surface border border-border-hairline flex items-center justify-center flex-shrink-0 text-brand shadow-2xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 rounded-2xl bg-surface/50 border border-border-hairline/80 flex items-center gap-2.5 text-muted-foreground shadow-2xs">
                <Loader2 className="w-4 h-4 animate-spin text-brand" />
                <span className="font-mono text-xs">Consulting portfolio knowledge...</span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}

      {/* 3. INPUT AREA */}
      <div className="w-full pt-2 sm:pt-3 flex-shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(input);
          }}
          className="relative flex flex-col rounded-2xl bg-surface/90 border border-border shadow-md focus-within:border-ink/40 focus-within:ring-1 focus-within:ring-brand/30 transition-all overflow-hidden"
        >
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Ask about projects, experience, or tech..."
            aria-label="Ask Naphier's portfolio agent"
            className="w-full bg-transparent px-4 pt-3.5 pb-2 text-sm text-ink placeholder:text-muted-foreground/60 focus:outline-none resize-none min-h-[44px] max-h-[160px] leading-relaxed"
          />

          <div className="flex items-center justify-between px-3 pb-2.5 pt-1">
            <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground/70">
              <span className="hidden sm:inline">Press Enter to send, Shift+Enter for new line</span>
            </div>

            <div className="flex items-center gap-1.5">
              {hasMessages && (
                <button
                  type="button"
                  onClick={handleReset}
                  onMouseEnter={playHover}
                  aria-label="Clear chat"
                  title="Clear conversation"
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-ink hover:bg-surface-hover transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}

              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                onMouseEnter={playHover}
                aria-label="Send query"
                className="h-8 w-8 rounded-lg bg-ink text-page disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </form>

        <p className="font-mono text-[10px] text-muted-foreground/60 text-center mt-2 select-none">
          Portfolio Agent · Strictly grounded in verified portfolio data
        </p>
      </div>
    </div>
  );
}

export default AgentFolioLayout;
