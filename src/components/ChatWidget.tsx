"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles, User, Bot, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I am Naphier's AI Assistant. Ask me anything about his technical projects, full-stack skills, experience, or certifications!",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || "Sorry, I could not generate a response." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I am having trouble connecting right now. Please feel free to email Naphier directly at naphiera@gmail.com!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Tactile Launcher Button */}
      <div className="fixed bottom-7 right-5 sm:right-8 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="tactile-btn gap-2 h-9 px-3.5 rounded-full shadow-lg border border-border-hairline"
          aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <>
              <X className="w-4 h-4 text-ink" />
              <span className="text-xs font-mono font-medium">Close</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs font-sans font-medium">Chat with AI</span>
            </>
          )}
        </button>
      </div>

      {/* Floating Chat Modal Panel */}
      {isOpen && (
        <div
          className="fixed bottom-20 right-4 sm:right-8 w-[calc(100vw-2rem)] sm:w-[380px] h-[480px] rounded-xl bg-page border border-border-hairline shadow-2xl z-50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
          role="dialog"
          aria-label="AI Assistant Chat"
        >
          {/* Header */}
          <div className="p-3.5 border-b border-border-hairline bg-surface/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-surface border border-border-hairline flex items-center justify-center text-ink">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="font-sans text-xs font-semibold text-ink leading-none">
                  Naphier AI
                </h3>
                <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
                  Gemini 2.5 Flash
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded text-muted-foreground hover:text-ink hover:bg-surface transition-colors cursor-pointer"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 font-sans text-xs">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="w-5 h-5 rounded bg-surface border border-border-hairline flex items-center justify-center flex-shrink-0 text-muted-foreground mt-0.5">
                    <Bot className="w-3 h-3" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] p-2.5 rounded-lg leading-relaxed ${
                    msg.role === "user"
                      ? "bg-surface text-ink border border-border-hairline"
                      : "bg-surface/30 text-body border border-border-hairline/50"
                  }`}
                >
                  {msg.content}
                </div>

                {msg.role === "user" && (
                  <div className="w-5 h-5 rounded bg-surface border border-border-hairline flex items-center justify-center flex-shrink-0 text-muted-foreground mt-0.5">
                    <User className="w-3 h-3" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-5 h-5 rounded bg-surface border border-border-hairline flex items-center justify-center flex-shrink-0 text-muted-foreground">
                  <Bot className="w-3 h-3" />
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
            className="p-3 border-t border-border-hairline bg-surface/20 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about projects, skills, background..."
              className="flex-1 bg-surface border border-border-hairline rounded-md px-3 py-1.5 text-xs text-ink placeholder:text-muted-foreground/60 focus:outline-none focus:border-border-reticle transition-colors"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="tactile-btn h-8 px-2.5 text-xs disabled:opacity-40 disabled:pointer-events-none"
              aria-label="Send message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default ChatWidget;
