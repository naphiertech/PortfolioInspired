"use client";

import React, { useState, useEffect } from "react";
import { useTheme, Theme } from "./ThemeProvider";
import { useUISound } from "@/context/SoundContext";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { playTheme } = useUISound();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-6 w-16 rounded-[5px] bg-surface/60 border border-border-hairline animate-pulse" />
    );
  }

  const themes: { key: Theme; label: string; icon: React.ReactNode }[] = [
    {
      key: "light",
      label: "Light theme",
      icon: (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      key: "dark",
      label: "Dark theme",
      icon: (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ),
    },
    {
      key: "system",
      label: "System theme",
      icon: (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div
      className="inline-flex items-center rounded-[6px] bg-surface p-0.5 border border-border-hairline shadow-sm"
      role="group"
      aria-label="Theme selector"
    >
      {themes.map((t) => {
        const isActive = theme === t.key;
        return (
          <button
            key={t.key}
            onClick={(e) => {
              playTheme();
              setTheme(t.key, e);
            }}
            className={`flex items-center justify-center h-5 w-5 rounded-[4px] transition-all duration-150 cursor-pointer ${
              isActive
                ? "bg-page text-ink shadow-[0_1px_2px_rgba(0,0,0,0.1)] border border-border-hairline"
                : "text-muted-foreground/60 hover:text-ink hover:bg-surface-hover"
            }`}
            title={`${t.label}${isActive ? ` (Active: ${resolvedTheme})` : ""}`}
            aria-label={t.label}
            aria-pressed={isActive}
          >
            {t.icon}
          </button>
        );
      })}
    </div>
  );
}

export default ThemeToggle;
