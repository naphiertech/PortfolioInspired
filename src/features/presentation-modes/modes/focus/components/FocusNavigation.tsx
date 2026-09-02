"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";
import { PresentationModeSwitcher } from "../../../components/PresentationModeSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useUISound } from "@/context/SoundContext";

interface FocusNavItem {
  name: string;
  href: string;
  code: string;
}

const focusNavItems: FocusNavItem[] = [
  { name: "Home", href: "/", code: "00" },
  { name: "Work", href: "/work", code: "01" },
  { name: "Projects", href: "/projects", code: "02" },
  { name: "Tech", href: "/tech-stack", code: "03" },
  { name: "Certifications", href: "/certifications", code: "04" },
];

/**
 * FocusNavigation
 *
 * Dedicated top technical navigation for Focus Presentation Mode.
 * - Desktop (≥640px): High-density inline route links + PresentationModeSwitcher + ThemeToggle
 * - Mobile (<640px): Compact utility bar with active section badge + View/Theme controls + Menu Popover
 */
export function FocusNavigation() {
  const pathname = usePathname();
  const { playHover, playClick } = useUISound();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close mobile popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    }
    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Close mobile popover on escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Determine current active item for mobile badge
  const currentActiveItem =
    focusNavItems.find((item) =>
      item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
    ) || focusNavItems[0];

  return (
    <nav
      aria-label="Focus mode navigation"
      className="w-full relative pb-3.5 mb-5 sm:mb-8 border-b border-border-divider select-none z-[70]"
    >
      <div className="w-full flex items-center justify-between gap-2">
        {/* --- DESKTOP ROUTE LINKS (≥ sm) --- */}
        <div className="hidden sm:flex items-center gap-x-6 font-mono text-xs sm:text-[12.5px]">
          {focusNavItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                onMouseEnter={playHover}
                onClick={playClick}
                className={`relative py-1 uppercase tracking-wider transition-colors ${
                  isActive
                    ? "text-ink font-semibold"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-ink"
                }`}
              >
                <span>{item.name}</span>
                {isActive && (
                  <span
                    className="absolute inset-x-0 -bottom-1.5 h-0.5 bg-brand rounded-full"
                    aria-hidden="true"
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* --- MOBILE ACTIVE SECTION BADGE (< sm) --- */}
        <div className="flex sm:hidden items-center gap-1.5 font-mono text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-brand animate-status-breathe" />
          <span className="font-semibold text-ink text-xs tracking-wider uppercase">
            FOCUS // {currentActiveItem.name}
          </span>
        </div>

        {/* --- UTILITIES: Mode Switcher, Theme Toggle, and Mobile Menu --- */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
          <PresentationModeSwitcher variant="focus-nav" />
          <ThemeToggle />

          {/* Mobile Menu Trigger Button (< sm) */}
          <div className="relative sm:hidden" ref={menuRef}>
            <button
              type="button"
              onClick={() => {
                playClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              onMouseEnter={playHover}
              className="w-8 h-8 rounded-md bg-surface border border-border-hairline flex items-center justify-center text-ink hover:bg-surface-hover active:scale-95 transition-all cursor-pointer shadow-2xs"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4 text-ink" />
              ) : (
                <Menu className="w-4 h-4 text-ink" />
              )}
            </button>

            {/* Mobile Navigation Popover */}
            {mobileMenuOpen && (
              <div
                className="absolute right-0 top-10 w-48 py-1.5 rounded-xl bg-surface/95 backdrop-blur-md border border-border-hairline shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 flex flex-col"
                role="menu"
              >
                <div className="px-3 py-1.5 text-[9px] font-mono uppercase tracking-widest text-muted-foreground/60 border-b border-border-hairline/40">
                  Navigation
                </div>
                {focusNavItems.map((item) => {
                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      role="menuitem"
                      onClick={() => {
                        playClick();
                        setMobileMenuOpen(false);
                      }}
                      onMouseEnter={playHover}
                      className={`flex items-center justify-between px-3 py-2 text-xs font-mono transition-colors ${
                        isActive
                          ? "bg-brand/10 text-brand font-bold"
                          : "text-ink/80 hover:bg-surface-hover hover:text-ink"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground/50">
                          {item.code}
                        </span>
                        <span>{item.name}</span>
                      </span>
                      {isActive && <ArrowRight className="w-3 h-3 text-brand" />}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default FocusNavigation;
