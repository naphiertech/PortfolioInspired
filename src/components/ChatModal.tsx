"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  X,
  Send,
  User,
  Bot,
  Loader2,
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  Compass,
} from "lucide-react";
import { useUISound } from "@/context/SoundContext";
import { AUTHOR_INFO } from "@/lib/siteConfig";
import {
  PortfolioPageContext,
  extractAndValidateLinks,
  validatePortfolioLink,
  ValidatedLink,
} from "@/lib/portfolioContext";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  isLoading: boolean;
  input: string;
  onInputChange: (val: string) => void;
  onSendMessage: (text: string) => void;
  pageContext: PortfolioPageContext;
  suggestedQuestions: string[];
  isFocus: boolean;
}

function FormattedAssistantText({ content }: { content: string }) {
  const { playHover, playClick } = useUISound();
  const lines = content.split("\n");

  return (
    <div className="space-y-1.5 text-xs text-body leading-relaxed">
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={lineIdx} className="h-1" />;
        }

        const isBullet = trimmed.startsWith("- ") || trimmed.startsWith("* ");
        const lineContent = isBullet ? trimmed.slice(2) : trimmed;

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
                    <ExternalLink className="w-2.5 h-2.5 opacity-60 inline" />
                  ) : (
                    <ArrowUpRight className="w-2.5 h-2.5 opacity-60 inline" />
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
            <div key={lineIdx} className="flex items-start gap-1.5 ml-1">
              <span className="text-muted-foreground font-mono select-none">•</span>
              <div className="flex-1">{parts}</div>
            </div>
          );
        }

        return <p key={lineIdx}>{parts}</p>;
      })}
    </div>
  );
}

export function ChatModal({
  isOpen,
  onClose,
  messages,
  isLoading,
  input,
  onInputChange,
  onSendMessage,
  pageContext,
  suggestedQuestions,
  isFocus,
}: ChatModalProps) {
  const { playHover, playClick } = useUISound();
  const shouldReduceMotion = useReducedMotion();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [messages, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSendMessage(input);
  };

  const isConversationEmpty = messages.length <= 1;

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.96, y: shouldReduceMotion ? 0 : 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{
        opacity: 0,
        scale: shouldReduceMotion ? 1 : 0.96,
        y: shouldReduceMotion ? 0 : 6,
        transition: { duration: shouldReduceMotion ? 0.08 : 0.15, ease: [0.22, 1, 0.36, 1] },
      }}
      transition={{
        duration: shouldReduceMotion ? 0.08 : 0.25,
        ease: [0.22, 1, 0.36, 1] as const,
      }}
      style={{ transformOrigin: "bottom right" }}
      className={`fixed right-3 left-3 sm:left-auto sm:right-8 sm:w-[390px] h-[calc(100dvh-130px)] max-h-[520px] rounded-xl bg-page border border-border-hairline shadow-2xl z-50 flex flex-col overflow-hidden will-change-[transform,opacity] ${
        isFocus ? "bottom-14 sm:bottom-20" : "bottom-[120px] sm:bottom-20"
      }`}
      role="dialog"
      aria-label="AI Assistant Chat"
    >
      {/* Header */}
      <div className="p-3.5 border-b border-border-hairline bg-surface/40 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-surface border border-border-hairline flex items-center justify-center text-ink">
            <Bot className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-sans text-xs font-semibold text-ink leading-none">
                {AUTHOR_INFO.shortName} AI
              </h3>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-surface border border-border-hairline text-muted-foreground">
                {pageContext.pageType === "project_detail"
                  ? "Project Context"
                  : pageContext.pageType === "tech_stack" && pageContext.selectedTech
                  ? `${pageContext.selectedTech}`
                  : "Portfolio Context"}
              </span>
            </div>
            <p className="font-mono text-[10px] text-emerald-500 dark:text-emerald-400 mt-1 flex items-center gap-1 leading-none">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Online
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          onMouseEnter={playHover}
          className="p-1 rounded text-muted-foreground hover:text-ink hover:bg-surface transition-colors cursor-pointer"
          aria-label="Close chat"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3 font-sans text-xs">
        {messages.map((msg, idx) => {
          const isAssistant = msg.role === "assistant";
          const links: ValidatedLink[] = isAssistant ? extractAndValidateLinks(msg.content) : [];

          return (
            <div
              key={idx}
              className={`flex gap-2.5 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {isAssistant && (
                <div className="w-5 h-5 rounded bg-surface border border-border-hairline flex items-center justify-center flex-shrink-0 text-muted-foreground mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[85%] p-3 rounded-lg leading-relaxed ${
                  msg.role === "user"
                    ? "bg-surface text-ink border border-border-hairline"
                    : "bg-surface/30 text-body border border-border-hairline/50"
                }`}
              >
                {isAssistant ? (
                  <div>
                    <FormattedAssistantText content={msg.content} />

                    {/* Validated Deep Links Action Rows */}
                    {links.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-border-hairline/40 space-y-1.5">
                        <div className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                          <Compass className="w-3 h-3" />
                          <span>Explore Links</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          {links.map((link, lIdx) => (
                            <Link
                              key={lIdx}
                              href={link.href}
                              target={link.isExternal ? "_blank" : undefined}
                              rel={link.isExternal ? "noopener noreferrer" : undefined}
                              onMouseEnter={playHover}
                              onClick={playClick}
                              className="flex items-center justify-between px-2.5 py-1.5 rounded-md bg-surface/80 hover:bg-surface border border-border-hairline hover:border-border-reticle text-ink text-[11px] font-sans transition-colors group"
                            >
                              <span className="font-medium truncate">{link.label}</span>
                              {link.isExternal ? (
                                <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-ink flex-shrink-0 ml-1.5" />
                              ) : (
                                <ArrowUpRight className="w-3 h-3 text-muted-foreground group-hover:text-ink flex-shrink-0 ml-1.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <span>{msg.content}</span>
                )}
              </div>

              {msg.role === "user" && (
                <div className="w-5 h-5 rounded bg-surface border border-border-hairline flex items-center justify-center flex-shrink-0 text-muted-foreground mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}

        {/* Contextual Suggested Questions */}
        {isConversationEmpty && suggestedQuestions.length > 0 && (
          <div className="pt-2 pb-1 space-y-1.5">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground px-1">
              Suggested Questions
            </p>
            <div className="flex flex-col gap-1.5">
              {suggestedQuestions.map((q, qIdx) => (
                <button
                  key={qIdx}
                  type="button"
                  onClick={() => onSendMessage(q)}
                  onMouseEnter={playHover}
                  disabled={isLoading}
                  className="w-full text-left p-2.5 rounded-lg bg-surface/60 hover:bg-surface border border-border-hairline hover:border-border-reticle text-ink text-[11px] font-sans flex items-center justify-between gap-2 group transition-all cursor-pointer select-none"
                >
                  <span className="leading-snug">{q}</span>
                  <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-ink flex-shrink-0 transition-transform group-hover:translate-x-0.5" />
                </button>
              ))}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex gap-2.5 justify-start">
            <div className="w-5 h-5 rounded bg-surface border border-border-hairline flex items-center justify-center flex-shrink-0 text-muted-foreground">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="p-2.5 rounded-lg bg-surface/30 border border-border-hairline/50 flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span className="font-mono text-[11px]">Thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="p-3 border-t border-border-hairline bg-surface/20 flex items-center gap-2 flex-shrink-0"
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={
            pageContext.pageType === "project_detail"
              ? `Ask about ${pageContext.title}...`
              : pageContext.selectedTech
              ? `Ask about ${pageContext.selectedTech}...`
              : "Ask about projects, skills, background..."
          }
          className="flex-1 bg-surface border border-border-hairline rounded-md px-3 py-1.5 text-xs text-ink placeholder:text-muted-foreground/60 focus:outline-none focus:border-border-reticle transition-colors"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          onMouseEnter={playHover}
          className="tactile-btn h-8 px-2.5 text-xs disabled:opacity-40 disabled:pointer-events-none"
          aria-label="Send message"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </motion.div>
  );
}

export default ChatModal;
