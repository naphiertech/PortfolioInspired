"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PresentationModeSwitcher } from "../../../components/PresentationModeSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useUISound } from "@/context/SoundContext";

interface FocusNavItem {
  name: string;
  href: string;
}

const focusNavItems: FocusNavItem[] = [
  { name: "Home", href: "/" },
  { name: "Work", href: "/work" },
  { name: "Projects", href: "/projects" },
  { name: "Tech", href: "/tech-stack" },
  { name: "Certifications", href: "/certifications" },
];

/**
 * FocusNavigation
 *
 * Dedicated top technical navigation for Focus Presentation Mode.
 * Replaces the Default floating bottom dock with a calm, high-density top header.
 *
 * Includes:
 * - Route navigation links with active indicators
 * - Presentation mode switcher (variant="focus-nav")
 * - Site-wide ThemeToggle
 */
export function FocusNavigation() {
  const pathname = usePathname();
  const { playHover, playClick } = useUISound();

  return (
    <nav
      aria-label="Focus mode navigation"
      className="w-full flex flex-wrap items-center justify-between gap-x-4 gap-y-3 pb-3.5 mb-6 sm:mb-8 border-b border-border-divider select-none"
    >
      {/* Route Links */}
      <div className="flex items-center flex-wrap gap-x-4 sm:gap-x-5 gap-y-1.5 font-mono text-xs">
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
              className={`relative py-1 uppercase tracking-wider text-[11px] sm:text-xs transition-colors ${
                isActive
                  ? "text-ink font-bold"
                  : "text-muted-foreground hover:text-ink"
              }`}
            >
              <span>{item.name}</span>
              {isActive && (
                <span
                  className="absolute inset-x-0 -bottom-1 h-0.5 bg-brand rounded-full"
                  aria-hidden="true"
                />
              )}
            </Link>
          );
        })}
      </div>

      {/* Utilities: Mode Switcher & Theme Toggle */}
      <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
        <PresentationModeSwitcher variant="focus-nav" />
        <ThemeToggle />
      </div>
    </nav>
  );
}

export default FocusNavigation;
