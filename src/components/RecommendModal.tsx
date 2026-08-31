"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useScrollLock } from "@/lib/scrollLock";
import { useUISound } from "@/context/SoundContext";

interface RecommendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RELATIONSHIP_OPTIONS = [
  "Worked together",
  "Studied together",
  "Project collaboration",
  "Mentor / Teacher",
  "Community / Organization",
  "Other",
];

/**
 * RecommendModal
 *
 * Application-level viewport-safe recommendation submission dialog.
 * Rendered directly into `document.body` via React Portal to eliminate all
 * parent stacking context trapping (Framer Motion, transforms, technical grid).
 *
 * Features:
 * - Wide, generous 700px desktop measure matching portfolio container
 * - High-contrast theme-calibrated inputs (no washed-out white visibility)
 * - Deep backdrop scrim completely de-emphasizing background page
 * - Sticky header & footer with internally scrollable form body
 */
export function RecommendModal({ isOpen, onClose }: RecommendModalProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [relationship, setRelationship] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [websiteHp, setWebsiteHp] = useState(""); // Honeypot field

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  const { playOpen, playClose, playClick } = useUISound();

  // Mount state check for safe SSR client portal rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  // Robust scroll lock with zero layout shift
  useScrollLock(isOpen);

  // Play modal open sound
  useEffect(() => {
    if (isOpen) {
      playOpen();
    }
  }, [isOpen, playOpen]);

  // Close on Escape key & manage focus
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        playClose();
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Auto-focus first input
    const timer = setTimeout(() => {
      firstInputRef.current?.focus();
    }, 100);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, onClose, playClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    setError(null);

    // Client-side quick checks
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!relationship) {
      setError("Please select how you know Naphier.");
      return;
    }
    if (recommendation.trim().length < 20) {
      setError("Please write at least 20 characters for the recommendation.");
      return;
    }
    if (!consent) {
      setError("Please agree to the consent checkbox.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          role,
          relationship,
          recommendation,
          profileUrl,
          email,
          consent,
          website_hp: websiteHp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit recommendation.");
      }

      setSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    playClose();
    setName("");
    setRole("");
    setRelationship("");
    setRecommendation("");
    setProfileUrl("");
    setEmail("");
    setConsent(false);
    setWebsiteHp("");
    setError(null);
    setSuccess(false);
    onClose();
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3.5 sm:p-5 md:p-6 bg-black/75 dark:bg-black/85 backdrop-blur-sm animate-in fade-in duration-200 select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleResetAndClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="recommend-modal-title"
    >
      <div
        ref={modalRef}
        className="w-full max-w-[700px] max-h-[calc(100dvh-32px)] sm:max-h-[calc(100dvh-48px)] rounded-2xl bg-surface border border-border-hairline shadow-2xl flex flex-col overflow-hidden relative animate-in zoom-in-95 fade-in duration-150"
      >
        {/* --- STICKY / FIXED HEADER --- */}
        <div className="p-5 sm:p-6 pb-3.5 sm:pb-4 border-b border-border-hairline/70 bg-surface/98 backdrop-blur-md flex items-start justify-between gap-4 flex-shrink-0 z-10">
          <div className="space-y-1 min-w-0">
            <span className="text-[10px] sm:text-[11px] text-muted-foreground uppercase tracking-wider font-mono font-semibold block">
              &lt;RECOMMEND-NAPHIER/&gt;
            </span>
            <h2 id="recommend-modal-title" className="font-sans text-lg sm:text-xl font-bold text-ink leading-tight">
              Write a Recommendation
            </h2>
            <p className="font-sans text-xs sm:text-[13px] text-muted-foreground leading-relaxed mt-0.5">
              Share your experience working or collaborating with Naphier. Submissions are moderated before publishing.
            </p>
          </div>

          <button
            type="button"
            onClick={handleResetAndClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-ink hover:bg-surface-hover transition-colors cursor-pointer flex-shrink-0"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* --- SUCCESS VIEW --- */}
        {success ? (
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 text-center space-y-4 animate-in fade-in duration-300 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1.5 max-w-sm">
              <h3 className="font-sans text-base font-semibold text-ink">
                Thank you for your recommendation!
              </h3>
              <p className="font-sans text-xs sm:text-[13px] text-muted-foreground leading-relaxed">
                Your submission has been received and will appear on the portfolio once verified.
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="tactile-btn text-xs px-5 py-2 h-9 font-medium cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          /* --- FORM VIEW (SCROLLABLE BODY + STICKY ACTION FOOTER) --- */
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto min-h-0 p-5 sm:p-6 space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Honeypot Spam Trap (Hidden) */}
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  name="website_hp"
                  value={websiteHp}
                  onChange={(e) => setWebsiteHp(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {/* Row 1: Name & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="rec-name" className="font-sans text-xs font-semibold text-ink flex items-center gap-1">
                    <span>Your Name</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="rec-name"
                    ref={firstInputRef}
                    type="text"
                    required
                    maxLength={100}
                    placeholder="e.g. Alex Santos"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/90 border border-zinc-300/80 dark:border-white/10 text-xs sm:text-[13px] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-zinc-900 dark:focus:border-white focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="rec-role" className="font-sans text-xs font-semibold text-ink">
                    Role / Organization <span className="text-muted-foreground font-normal text-[11px]">(optional)</span>
                  </label>
                  <input
                    id="rec-role"
                    type="text"
                    maxLength={100}
                    placeholder="e.g. Software Engineer / Student"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/90 border border-zinc-300/80 dark:border-white/10 text-xs sm:text-[13px] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-zinc-900 dark:focus:border-white focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10 transition-all"
                  />
                </div>
              </div>

              {/* Row 2: Relationship */}
              <div className="space-y-1.5">
                <label htmlFor="rec-relationship" className="font-sans text-xs font-semibold text-ink flex items-center gap-1">
                  <span>Relationship</span>
                  <span className="text-red-500">*</span>
                </label>
                <select
                  id="rec-relationship"
                  required
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-300/80 dark:border-white/10 text-xs sm:text-[13px] text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-900 dark:focus:border-white focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10 transition-all cursor-pointer"
                >
                  <option value="" disabled>
                    Select your relationship with Naphier
                  </option>
                  {RELATIONSHIP_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} className="bg-surface text-ink">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Row 3: Recommendation Message */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="rec-message" className="font-sans text-xs font-semibold text-ink flex items-center gap-1">
                    <span>Recommendation</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {recommendation.length} / 1000
                  </span>
                </div>
                <textarea
                  id="rec-message"
                  required
                  minLength={20}
                  maxLength={1000}
                  rows={4}
                  placeholder="What was your experience working with Naphier? (min 20 characters)"
                  value={recommendation}
                  onChange={(e) => setRecommendation(e.target.value)}
                  className="w-full p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/90 border border-zinc-300/80 dark:border-white/10 text-xs sm:text-[13px] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-zinc-900 dark:focus:border-white focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10 transition-all resize-none leading-relaxed"
                />
              </div>

              {/* Row 4: LinkedIn & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="rec-url" className="font-sans text-xs font-semibold text-ink">
                    LinkedIn / Profile <span className="text-muted-foreground font-normal text-[11px]">(optional)</span>
                  </label>
                  <input
                    id="rec-url"
                    type="url"
                    placeholder="https://linkedin.com/in/..."
                    value={profileUrl}
                    onChange={(e) => setProfileUrl(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/90 border border-zinc-300/80 dark:border-white/10 text-xs sm:text-[13px] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-zinc-900 dark:focus:border-white focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="rec-email" className="font-sans text-xs font-semibold text-ink">
                    Email <span className="text-muted-foreground font-normal text-[11px]">(private)</span>
                  </label>
                  <input
                    id="rec-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/90 border border-zinc-300/80 dark:border-white/10 text-xs sm:text-[13px] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-zinc-900 dark:focus:border-white focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10 transition-all"
                  />
                </div>
              </div>

              {/* Consent Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    required
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border border-zinc-300 dark:border-white/20 bg-zinc-50 dark:bg-zinc-900 text-brand focus:ring-0 focus:outline-none cursor-pointer"
                  />
                  <span className="font-sans text-xs text-muted-foreground leading-snug">
                    I&rsquo;m okay with this recommendation being displayed publicly on Naphier&rsquo;s portfolio.
                  </span>
                </label>
              </div>
            </div>

            {/* --- STICKY ACTION FOOTER --- */}
            <div className="p-4 sm:p-5 px-5 sm:px-6 border-t border-border-hairline/70 bg-surface/98 backdrop-blur-md flex items-center justify-end gap-3 flex-shrink-0 z-10">
              <button
                type="button"
                onClick={handleResetAndClose}
                disabled={loading}
                className="px-4 py-2 rounded-lg text-xs font-sans text-muted-foreground hover:text-ink transition-colors cursor-pointer font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="tactile-btn gap-1.5 text-xs px-5 py-2 h-9 font-semibold cursor-pointer shadow-xs"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 opacity-80" />
                    <span>Submit Recommendation</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

export default RecommendModal;
