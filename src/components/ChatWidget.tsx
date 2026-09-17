"use client";

import React, { useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { usePathname, useSearchParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { useUISound } from "@/context/SoundContext";
import { useCreativeMode } from "@/features/creative-mode";
import { usePresentationMode } from "@/features/presentation-modes/context/PresentationModeContext";
import { AUTHOR_INFO, SOCIAL_PROFILES } from "@/lib/siteConfig";
import {
  getPortfolioPageContext,
  getSuggestedQuestions,
} from "@/lib/portfolioContext";
import type { Message } from "./ChatModal";

// Code-split heavy modal UI (markdown parser, message streams, textareas) so it is only loaded on interaction
const ChatModal = dynamic(() => import("./ChatModal").then((mod) => mod.ChatModal), {
  ssr: false,
});

function ChatWidgetContent() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { playHover, playOpen, playClose } = useUISound();
  const { mode } = usePresentationMode();
  const isFocus = mode === "focus";

  // Compute active route context and suggestions
  const pageContext = getPortfolioPageContext(pathname, searchParams);
  const suggestedQuestions = getSuggestedQuestions(pageContext);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        `Hello! I am ${AUTHOR_INFO.shortName}'s AI Assistant. Ask me anything about his technical projects, full-stack architecture, experience, or certifications!`,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleChat = () => {
    if (isOpen) {
      playClose();
      setIsOpen(false);
    } else {
      playOpen();
      setIsOpen(true);
    }
  };

  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    setInput("");
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
          pageContext: pageContext,
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
            `I could not generate a response right now. Please feel free to email ${AUTHOR_INFO.shortName} at ${SOCIAL_PROFILES.email}!`,
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

  const { active: creativeActive } = useCreativeMode();

  // Minimal exposes the shared launcher pair only during Creative; Agent stays excluded.
  if ((mode === "minimal" && !creativeActive) || mode === "agent") {
    return null;
  }

  return (
    <>
      {/* Floating Tactile Launcher Button */}
      <div
        className={`fixed z-50 transition-all duration-200 ${
          isFocus
            ? "bottom-4 right-3.5 sm:bottom-7 sm:right-8"
            : "bottom-[74px] right-3.5 sm:bottom-7 sm:right-8"
        }`}
      >
        <button
          onClick={toggleChat}
          data-ai-chat-launcher="true"
          onMouseEnter={() => {
            playHover();
            // Prefetch modal on hover intent
            import("./ChatModal");
          }}
          className="tactile-btn gap-1.5 sm:gap-2 h-8 sm:h-9 px-2.5 sm:px-3.5 rounded-full shadow-lg border border-border-hairline bg-surface/95 backdrop-blur-md cursor-pointer"
          aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <>
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-ink" />
              <span className="text-[11px] sm:text-xs font-mono font-medium">Close</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-brand/80" />
              <span className="text-[11px] sm:text-xs font-sans font-medium">AI Chat</span>
            </>
          )}
        </button>
      </div>

      {/* Floating Chat Modal Panel with Fluid AnimatePresence */}
      <AnimatePresence>
        {isOpen && (
          <ChatModal
            isOpen={isOpen}
            onClose={() => {
              playClose();
              setIsOpen(false);
            }}
            messages={messages}
            isLoading={isLoading}
            input={input}
            onInputChange={setInput}
            onSendMessage={handleSendMessage}
            pageContext={pageContext}
            suggestedQuestions={suggestedQuestions}
            isFocus={isFocus}
          />
        )}
      </AnimatePresence>
    </>
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
