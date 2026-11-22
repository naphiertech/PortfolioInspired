"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Calendar, ExternalLink, Loader2, X } from "lucide-react";
import { SOCIAL_PROFILES } from "@/lib/siteConfig";
import { useUISound } from "@/context/SoundContext";

interface CalBookingModalProps {
  open: boolean;
  onClose: () => void;
}

export function CalBookingModal({ open, onClose }: CalBookingModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const { playClick } = useUISound();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    setIsLoaded(false);
    setIsDark(document.documentElement.classList.contains("dark"));

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  const themeParam = isDark ? "dark" : "light";
  const embedUrl = `${SOCIAL_PROFILES.calCom}?embed=true&theme=${themeParam}&layout=month_view`;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Schedule a call via Cal.com"
      className="fixed inset-0 z-[130] flex items-center justify-center p-3 sm:p-6"
    >
      {/* Backdrop */}
      <div
        onClick={() => {
          playClick();
          onClose();
        }}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
        aria-hidden="true"
      />

      {/* Monochrome Modal Shell */}
      <div className="relative z-10 w-full max-w-4xl h-[min(86vh,760px)] bg-page border border-border-hairline rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header Bar */}
        <div className="px-4 py-3 border-b border-border-hairline bg-surface/80 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <Calendar className="w-4 h-4 text-ink shrink-0" aria-hidden="true" />
            <span className="font-mono text-xs font-semibold text-ink truncate">
              Schedule a Call
            </span>
            <span className="hidden sm:inline font-mono text-[11px] text-muted-foreground truncate">
              · cal.com/awalie-naphier-b-2iung0
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={SOCIAL_PROFILES.calCom}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-border-hairline bg-surface hover:bg-surface-hover font-mono text-[11px] text-muted-foreground hover:text-ink transition-colors"
            >
              <span>Open in Cal.com</span>
              <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </a>
            <button
              type="button"
              onClick={() => {
                playClick();
                onClose();
              }}
              aria-label="Close booking dialog"
              className="p-1.5 rounded-md text-muted-foreground hover:text-ink hover:bg-surface-hover transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Cal.com Iframe Viewport */}
        <div className="relative flex-1 w-full bg-page overflow-hidden">
          {!isLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 text-muted-foreground font-mono text-xs">
              <Loader2 className="w-5 h-5 animate-spin text-ink" aria-hidden="true" />
              <span>Loading availability...</span>
            </div>
          )}
          <iframe
            src={embedUrl}
            title="Schedule a call with Naphier Awalie on Cal.com"
            onLoad={() => setIsLoaded(true)}
            allow="camera; microphone; fullscreen; payment"
            className={`w-full h-full border-0 transition-opacity duration-200 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}

interface CalBookingTriggerProps {
  className?: string;
  children: React.ReactNode;
  "data-cursor-label"?: string;
  ariaLabel?: string;
}

export function CalBookingTrigger({
  className,
  children,
  "data-cursor-label": cursorLabel,
  ariaLabel,
}: CalBookingTriggerProps) {
  const [open, setOpen] = useState(false);
  const { playClick, playHover } = useUISound();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    e.preventDefault();
    playClick();
    setOpen(true);
  };

  return (
    <>
      <a
        href={SOCIAL_PROFILES.calCom}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        onMouseEnter={playHover}
        aria-label={ariaLabel}
        data-cursor-label={cursorLabel}
        className={className}
      >
        {children}
      </a>
      <CalBookingModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
