"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi there! 👋 Thanks for visiting my website. Feel free to ask me anything about my programming, web development, or my experiences in tech. Let me know how I can help!",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, isOpen, isTyping]);

  const renderMessageContent = (content: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = content.split(urlRegex);
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        // Strip trailing punctuation at the end of a sentence
        const cleanUrl = part.replace(/[\.\,\;\:\?\!]+$/, "");
        const trailingPunctuation = part.slice(cleanUrl.length);
        return (
          <span key={index} className="inline break-all">
            <a
              href={cleanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline font-medium break-all"
            >
              {cleanUrl}
            </a>
            {trailingPunctuation}
          </span>
        );
      }
      return <span key={index} className="break-words">{part}</span>;
    });
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping || inputValue.length > 1000) return;

    const userMessage: Message = { role: "user", content: inputValue.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      if (data.reply) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        throw new Error("Invalid response received from server.");
      }
    } catch (err: unknown) {
      console.error("Chat error:", err);
      setError(err instanceof Error ? err.message : "Failed to send message. Please try again.");
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 select-none flex flex-col items-end">
      {/* Main Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <div className="allow-rounded mb-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="w-[360px] md:w-[400px] h-[550px] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-[0_15px_40px_rgba(0,0,0,0.12)] rounded-2xl overflow-hidden flex flex-col"
            >
              {/* Header section with profile */}
              <div className="px-4 py-3.5 border-b border-zinc-200/60 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Profile photo with live indicator ring */}
                  <div className="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-700 relative overflow-hidden flex-shrink-0">
                    <Image
                      src="/profile/ezgif-frame-001.png"
                      alt="Naphier Awalie"
                      fill
                      sizes="40px"
                      className="object-cover"
                      style={{ objectPosition: "center 25%" }}
                    />
                  </div>

                  <div className="flex flex-col text-left">
                    <span className="text-sm font-bold text-zinc-900 dark:text-white leading-tight">
                      Chat with Naphier
                    </span>
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 font-medium mt-0.5">
                      <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full inline-block animate-pulse" />
                      Online
                    </span>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 p-1 rounded-full transition-all duration-200 cursor-pointer"
                  aria-label="Close chat"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Messages body scrolling thread */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
                {messages.map((msg, index) => {
                  const isUser = msg.role === "user";
                  return (
                    <div
                      key={index}
                      className={`flex items-start gap-2.5 ${isUser ? "flex-row-reverse text-right" : "text-left"}`}
                    >
                      {/* Bot avatar element on incoming messages */}
                      {!isUser && (
                        <div className="w-7 h-7 rounded-full border border-zinc-200 dark:border-zinc-700 relative overflow-hidden flex-shrink-0 mt-0.5">
                          <Image
                            src="/profile/ezgif-frame-001.png"
                            alt="Naphier Awalie"
                            fill
                            sizes="28px"
                            className="object-cover"
                            style={{ objectPosition: "center 25%" }}
                          />
                        </div>
                      )}

                      {/* Bubble Message text */}
                      <div
                        className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-xs md:text-sm leading-relaxed border break-words ${
                          isUser
                            ? "bg-accent border-accent text-white rounded-tr-none shadow-[0_2px_10px_rgba(37,99,235,0.15)]"
                            : "bg-zinc-100/90 dark:bg-zinc-900/90 border-zinc-200/50 dark:border-zinc-800/80 text-zinc-800 dark:text-zinc-200 rounded-tl-none shadow-sm"
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words">{renderMessageContent(msg.content)}</p>
                      </div>
                    </div>
                  );
                })}

                {/* Bot active typing feedback animation */}
                {isTyping && (
                  <div className="flex items-start gap-2.5 text-left">
                    <div className="w-7 h-7 rounded-full border border-zinc-200 dark:border-zinc-700 relative overflow-hidden flex-shrink-0 mt-0.5">
                      <Image
                        src="/profile/ezgif-frame-001.png"
                        alt="Naphier Awalie"
                        fill
                        sizes="28px"
                        className="object-cover"
                        style={{ objectPosition: "center 25%" }}
                      />
                    </div>
                    <div className="bg-zinc-100/90 dark:bg-zinc-900/90 border border-zinc-200/50 dark:border-zinc-800/80 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}

                {/* Secure API Key Missing / Config Error Notice */}
                {error && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-900/30 rounded-xl text-center text-xs text-rose-600 dark:text-rose-400 shadow-sm leading-normal">
                    <svg className="w-4 h-4 mx-auto mb-1 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    {error}
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input area panel form with character limit validation */}
              <div className="p-4 border-t border-zinc-200/60 dark:border-zinc-800/80 bg-white dark:bg-zinc-950">
                <form onSubmit={handleSend} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type a message..."
                    maxLength={1000}
                    className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3.5 py-2.5 text-xs md:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-all duration-200"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isTyping || inputValue.length > 1000}
                    className={`w-10 h-10 bg-[#707070] dark:bg-zinc-800 hover:bg-[#505050] dark:hover:bg-zinc-700 text-white flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer ${
                      !inputValue.trim() || isTyping ? "opacity-50 pointer-events-none" : ""
                    }`}
                    aria-label="Send message"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </form>
                {/* Character validation text and helper exactly matching Bryl Lim */}
                <div className="flex justify-between items-center text-[10px] text-zinc-500 dark:text-zinc-400 mt-2.5 font-sans leading-none px-0.5">
                  <span>Ask me about programming, web dev, or tech!</span>
                  <span className={inputValue.length >= 1000 ? "text-rose-500 font-semibold animate-pulse" : ""}>
                    {inputValue.length}/1000
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Brutalist Rectangular Toggle Button (sits below chat window, perfectly overlapping / stacking) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-black text-white dark:bg-white dark:text-black px-6 py-3 border border-zinc-800 dark:border-zinc-200 hover:bg-zinc-900 dark:hover:bg-zinc-100 transition-all duration-200 flex items-center gap-2 group z-50 cursor-pointer shadow-lg"
        aria-label={isOpen ? "Close chat" : "Chat with Naphier"}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
        <span className="text-sm font-semibold tracking-wide">Chat with Naphier</span>
      </button>
    </div>
  );
}
