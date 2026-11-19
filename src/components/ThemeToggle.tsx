"use client";

import React, { useState, useEffect, useId } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme, Theme } from "./ThemeProvider";
import { useUISound } from "@/context/SoundContext";

export interface ThemeToggleProps {
  variant?: "default" | "focus" | "minimal";
}

export function ThemeToggle({ variant = "default" }: ThemeToggleProps = {}) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { playTheme } = useUISound();
  const shouldReduceMotion = useReducedMotion();
  const indicatorId = useId();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    if (variant === "minimal") {
      return <div className="h-7 w-7 rounded-sm bg-zinc-200/40 dark:bg-white/[0.04] animate-pulse" />;
    }
    if (variant === "focus") {
      return (
        <div className="h-7 w-[80px] rounded-[5px] bg-surface/60 border border-border-hairline animate-pulse" />
      );
    }
    return <div className="h-[22px] w-[76px] rounded-[4px] bg-muted-subtle/50 animate-pulse" />;
  }

  if (variant === "minimal") {
    const isDark = resolvedTheme === "dark";
    return (
      <button
        type="button"
        onClick={(e) => {
          playTheme();
          setTheme(isDark ? "light" : "dark", e);
        }}
        className="h-7 w-7 rounded-sm border border-transparent bg-transparent inline-flex items-center justify-center text-zinc-500 dark:text-[#8e897f] hover:text-zinc-950 dark:hover:text-[#f0ede6] hover:bg-zinc-100/70 dark:hover:bg-white/[0.05] transition-colors duration-150 cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 dark:focus-visible:ring-white/30"
        title={isDark ? "Dark theme — switch to light" : "Light theme — switch to dark"}
        aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      >
        {isDark ? (
          <Moon className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
        ) : (
          <Sun className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
        )}
      </button>
    );
  }

  const themes: { key: Theme; label: string; icon: React.ReactNode }[] = [
    {
      key: "light",
      label: "Light theme",
      icon: <Sun className="w-3.5 h-3.5" strokeWidth={1.75} aria-hidden="true" />,
    },
    {
      key: "dark",
      label: "Dark theme",
      icon: <Moon className="w-3.5 h-3.5" strokeWidth={1.75} aria-hidden="true" />,
    },
    {
      key: "system",
      label: "System theme",
      icon: <Monitor className="w-3.5 h-3.5" strokeWidth={1.75} aria-hidden="true" />,
    },
  ];

  const isFocus = variant === "focus";

  return (
    <div
      className={
        isFocus
          ? "inline-flex items-center h-7 rounded-[5px] bg-surface p-[2px] border border-border-hairline relative gap-0.5"
          : "inline-flex items-center relative gap-0.5"
      }
      role="group"
      aria-label="Theme selector"
    >
      {themes.map((t) => {
        const isActive = theme === t.key;
        return (
          <button
            key={t.key}
            type="button"
            onClick={(e) => {
              playTheme();
              setTheme(t.key, e);
            }}
            className={`relative flex items-center justify-center h-[22px] w-[24px] cursor-pointer z-10 transition-colors duration-150 ${
              isFocus ? "rounded-[3px]" : "rounded-[4px]"
            } ${
              isActive
                ? "text-ink"
                : "text-muted-foreground/60 hover:text-ink hover:bg-surface-hover/50"
            }`}
            title={`${t.label}${isActive ? ` (Active: ${resolvedTheme})` : ""}`}
            aria-label={t.label}
            aria-pressed={isActive}
          >
            {isActive && (
              <motion.div
                layoutId={`theme-active-${indicatorId}`}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : {
                        type: "spring",
                        stiffness: 450,
                        damping: 32,
                      }
                }
                className={`absolute inset-0 bg-page border border-border-hairline -z-10 ${
                  isFocus
                    ? "rounded-[3px]"
                    : "rounded-[4px] shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
                }`}
              />
            )}
            {t.icon}
          </button>
        );
      })}
    </div>
  );
}

export default ThemeToggle;
