"use client";

import React, { useState, useEffect, useRef } from "react";
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

  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  const { playOpen, playClose, playClick } = useUISound();

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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-page/80 backdrop-blur-sm animate-in fade-in duration-200"
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
        className="w-full max-w-lg rounded-xl bg-surface border border-border-hairline shadow-2xl p-5 sm:p-6 space-y-5 relative max-h-[90vh] overflow-y-auto"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-border-hairline/40 pb-3.5">
          <div className="space-y-1">
            <span className="font-caps text-[11px] text-muted-foreground uppercase tracking-wider font-mono font-semibold block">
              &lt;RECOMMEND-NAPHIER/&gt;
            </span>
            <h2 id="recommend-modal-title" className="font-sans text-base font-semibold text-ink">
              Write a Recommendation
            </h2>
            <p className="font-sans text-xs text-muted-foreground leading-relaxed">
              Share your experience working, collaborating, or learning with Naphier. Submissions are moderated before publishing.
            </p>
          </div>

          <button
            type="button"
            onClick={handleResetAndClose}
            className="p-1.5 rounded-md text-muted-foreground hover:text-ink hover:bg-surface-hover transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success View */}
        {success ? (
          <div className="py-6 text-center space-y-4 animate-in fade-in duration-300">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1.5 max-w-sm mx-auto">
              <h3 className="font-sans text-sm font-semibold text-ink">
                Thank you for your recommendation!
              </h3>
              <p className="font-sans text-xs text-muted-foreground leading-relaxed">
                Your recommendation has been submitted. It will be reviewed and displayed on the portfolio once approved.
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="tactile-btn text-xs px-4 py-2 h-8"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          /* Form View */
          <form onSubmit={handleSubmit} className="space-y-4">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label htmlFor="rec-name" className="font-sans text-xs font-medium text-ink flex items-center gap-1">
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
                  className="w-full h-8 px-2.5 rounded-md bg-page/60 border border-border-hairline text-xs text-ink placeholder:text-muted-foreground/50 focus:outline-none focus:border-muted-foreground/60 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="rec-role" className="font-sans text-xs font-medium text-ink">
                  Role / Organization <span className="text-muted-foreground font-normal text-[11px]">(optional)</span>
                </label>
                <input
                  id="rec-role"
                  type="text"
                  maxLength={100}
                  placeholder="e.g. Software Engineer / Student"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-md bg-page/60 border border-border-hairline text-xs text-ink placeholder:text-muted-foreground/50 focus:outline-none focus:border-muted-foreground/60 transition-colors"
                />
              </div>
            </div>

            {/* Row 2: Relationship */}
            <div className="space-y-1.5">
              <label htmlFor="rec-relationship" className="font-sans text-xs font-medium text-ink flex items-center gap-1">
                <span>Relationship</span>
                <span className="text-red-500">*</span>
              </label>
              <select
                id="rec-relationship"
                required
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full h-8 px-2 rounded-md bg-page/60 border border-border-hairline text-xs text-ink focus:outline-none focus:border-muted-foreground/60 transition-colors cursor-pointer"
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
                <label htmlFor="rec-message" className="font-sans text-xs font-medium text-ink flex items-center gap-1">
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
                className="w-full p-2.5 rounded-md bg-page/60 border border-border-hairline text-xs text-ink placeholder:text-muted-foreground/50 focus:outline-none focus:border-muted-foreground/60 transition-colors resize-none leading-relaxed"
              />
            </div>

            {/* Row 4: LinkedIn & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label htmlFor="rec-url" className="font-sans text-xs font-medium text-ink">
                  LinkedIn / Profile <span className="text-muted-foreground font-normal text-[11px]">(optional)</span>
                </label>
                <input
                  id="rec-url"
                  type="url"
                  placeholder="https://linkedin.com/in/..."
                  value={profileUrl}
                  onChange={(e) => setProfileUrl(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-md bg-page/60 border border-border-hairline text-xs text-ink placeholder:text-muted-foreground/50 focus:outline-none focus:border-muted-foreground/60 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="rec-email" className="font-sans text-xs font-medium text-ink">
                  Email <span className="text-muted-foreground font-normal text-[11px]">(private)</span>
                </label>
                <input
                  id="rec-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-md bg-page/60 border border-border-hairline text-xs text-ink placeholder:text-muted-foreground/50 focus:outline-none focus:border-muted-foreground/60 transition-colors"
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
                  className="w-4 h-4 mt-0.5 rounded border border-border-hairline bg-page text-brand focus:ring-0 focus:outline-none cursor-pointer"
                />
                <span className="font-sans text-xs text-muted-foreground leading-snug">
                  I&rsquo;m okay with this recommendation being displayed publicly on Naphier&rsquo;s portfolio.
                </span>
              </label>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border-hairline/40">
              <button
                type="button"
                onClick={handleResetAndClose}
                disabled={loading}
                className="px-3 py-1.5 rounded-md text-xs font-sans text-muted-foreground hover:text-ink transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="tactile-btn gap-1.5 text-xs px-4 py-1.5 h-8 font-medium cursor-pointer"
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
}

export default RecommendModal;
