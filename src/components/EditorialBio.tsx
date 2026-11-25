"use client";

import React from "react";
import { Code2, Monitor, Rocket, Smartphone, Sparkles } from "lucide-react";
import { SiClaude, SiCursor, SiGooglegemini } from "react-icons/si";
import { RiOpenaiFill } from "react-icons/ri";
import { useUISound } from "@/context/SoundContext";

interface EditorialBioProps {
  variant: "standard" | "minimal";
  className?: string;
}

const AI_STICKER_TILES = [
  {
    name: "Gemini",
    Icon: SiGooglegemini,
    restTilt: "-rotate-[8deg] translate-y-[0.5px]",
    fanClass: "group-hover/ai:-rotate-[4deg]",
  },
  {
    name: "Claude",
    Icon: SiClaude,
    restTilt: "rotate-[5deg] -translate-y-[0.5px]",
    fanClass: "group-hover/ai:rotate-[2deg]",
  },
  {
    name: "OpenAI",
    Icon: RiOpenaiFill,
    restTilt: "-rotate-[4deg] translate-y-[0.5px]",
    fanClass: "group-hover/ai:-rotate-[2deg]",
  },
  {
    name: "Cursor",
    Icon: SiCursor,
    restTilt: "rotate-[7deg] -translate-y-[0.5px]",
    fanClass: "group-hover/ai:rotate-[4deg]",
  },
] as const;

interface InlineChipProps {
  icon: React.ReactNode;
  children: React.ReactNode;
  variant: "standard" | "minimal";
  chipHoverClass: string;
  iconHoverClass: string;
  onHover?: () => void;
}

function InlineChip({
  icon,
  children,
  variant,
  chipHoverClass,
  iconHoverClass,
  onHover,
}: InlineChipProps) {
  const isMinimal = variant === "minimal";

  const surfaceClass = isMinimal
    ? "rounded-[4px] px-1.5 py-[0.5px] bg-zinc-100/85 dark:bg-white/[0.055] border border-zinc-200/90 dark:border-white/[0.11] text-zinc-900 dark:text-[#eeeae1] hover:bg-zinc-200/75 dark:hover:bg-white/[0.1] hover:border-zinc-400/70 dark:hover:border-white/[0.24] font-sans text-[12px] sm:text-[12.5px]"
    : "rounded-[6px] px-[7px] py-[1px] bg-surface border border-border-hairline text-ink shadow-[0_1.5px_0_var(--border-hairline)] hover:border-ink/40 hover:bg-page dark:hover:bg-surface-hover hover:shadow-[0_2.5px_0_var(--border-hairline)] font-sans text-[12px] sm:text-[12.5px]";

  return (
    <span
      onMouseEnter={onHover}
      className={`group/chip inline-flex items-center gap-1 font-medium leading-[1.3] align-baseline whitespace-nowrap cursor-default select-none transition-[transform,background-color,border-color,box-shadow] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:transform-none ${surfaceClass} ${chipHoverClass}`}
    >
      <span
        className={`inline-flex items-center justify-center opacity-75 group-hover/chip:opacity-100 shrink-0 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:transform-none ${iconHoverClass}`}
        aria-hidden="true"
      >
        {icon}
      </span>
      <span>{children}</span>
    </span>
  );
}

/**
 * EditorialBio
 *
 * Compact, tactile two-paragraph profile narrative with mode-native inline tags
 * (blueprint keycaps in Standard, slim hairline chips in Minimal), per-tag hover
 * micro-motion, and an interactive fanned monochrome AI sticker deck.
 */
export function EditorialBio({ variant, className = "" }: EditorialBioProps) {
  const { playHover } = useUISound();
  const isMinimal = variant === "minimal";

  const wrapperClass = isMinimal
    ? "w-full font-serif text-[15px] sm:text-[16px] text-zinc-700 dark:text-[#b4afa4] leading-[1.78] space-y-2.5 max-w-[68ch]"
    : "w-full font-sans text-[13.5px] sm:text-[14.5px] text-body leading-[1.74] space-y-2 max-w-[66ch] mx-auto sm:mx-0 px-2 sm:px-0";

  const emphasisClass = isMinimal
    ? "font-medium text-zinc-950 dark:text-[#eeeae1]"
    : "font-semibold text-ink";

  const tileSurfaceClass = isMinimal
    ? "bg-white dark:bg-[#1a1b1a] border border-zinc-200/95 dark:border-white/[0.13] text-zinc-900 dark:text-[#eeeae1] shadow-[0_1.5px_4px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.5)]"
    : "bg-page dark:bg-surface border border-border-hairline text-ink shadow-[0_1.5px_0_var(--border-hairline),0_2px_5px_rgba(0,0,0,0.06)] dark:shadow-[0_1.5px_0_var(--border-hairline),0_2px_6px_rgba(0,0,0,0.45)]";

  const tooltipClass = isMinimal
    ? "bg-zinc-900 dark:bg-[#eae6df] text-white dark:text-[#111211]"
    : "bg-ink text-page";

  return (
    <div data-creative-note="about" data-guide="about" className={`${wrapperClass} ${className}`}>
      <p>
        I&apos;m an IT student and{" "}
        <InlineChip
          variant={variant}
          icon={<Code2 className="w-3 h-3" />}
          chipHoverClass="hover:-translate-y-[1.5px] hover:-rotate-[1deg]"
          iconHoverClass="group-hover/chip:scale-110"
          onHover={playHover}
        >
          full-stack
        </InlineChip>{" "}
        developer. I turn ideas into practical{" "}
        <InlineChip
          variant={variant}
          icon={<Monitor className="w-3 h-3" />}
          chipHoverClass="hover:-translate-y-[1.5px] hover:rotate-[1deg]"
          iconHoverClass="group-hover/chip:-translate-y-[0.5px] group-hover/chip:scale-105"
          onHover={playHover}
        >
          web
        </InlineChip>{" "}
        &amp;{" "}
        <InlineChip
          variant={variant}
          icon={<Smartphone className="w-3 h-3" />}
          chipHoverClass="hover:-translate-y-[1.5px] hover:-rotate-[1deg]"
          iconHoverClass="group-hover/chip:rotate-[10deg]"
          onHover={playHover}
        >
          mobile apps
        </InlineChip>{" "}
        — from school systems and productivity tools to personal projects.
      </p>

      <p>
        I care about{" "}
        <InlineChip
          variant={variant}
          icon={<Sparkles className="w-3 h-3" />}
          chipHoverClass="hover:-translate-y-[1.5px] hover:rotate-[1deg]"
          iconHoverClass="group-hover/chip:rotate-[22deg] group-hover/chip:scale-110"
          onHover={playHover}
        >
          clean UI/UX
        </InlineChip>
        , web animation, and{" "}
        <span
          className="group/ai inline-flex items-center align-middle mr-1 -translate-y-[1px] select-none"
          aria-label="Gemini, Claude, OpenAI, and Cursor"
        >
          {AI_STICKER_TILES.map(({ name, Icon, restTilt, fanClass }, index) => (
            <span
              key={name}
              onMouseEnter={playHover}
              className={`group/tile relative inline-flex items-center justify-center w-[22px] h-[22px] sm:w-[23px] sm:h-[23px] rounded-[6px] cursor-default transition-[transform,margin] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:transform-none hover:!-translate-y-[5px] hover:!rotate-0 hover:scale-110 hover:z-30 ${
                index > 0 ? "-ml-1.5 group-hover/ai:ml-0.5" : ""
              } ${tileSurfaceClass} ${restTilt} ${fanClass}`}
              style={{ zIndex: index + 1 }}
            >
              <Icon className="w-3 h-3" aria-hidden="true" />
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 px-1.5 py-[1px] rounded font-mono text-[9.5px] leading-tight whitespace-nowrap opacity-0 translate-y-1 group-hover/tile:opacity-100 group-hover/tile:translate-y-0 transition-all duration-150 ${tooltipClass}`}
              >
                {name}
              </span>
            </span>
          ))}
        </span>
        <strong className={emphasisClass}>AI-assisted development</strong> — shipping{" "}
        <InlineChip
          variant={variant}
          icon={<Rocket className="w-3 h-3" />}
          chipHoverClass="hover:-translate-y-[1.5px] hover:-rotate-[1deg]"
          iconHoverClass="group-hover/chip:translate-x-[1.5px] group-hover/chip:-translate-y-[1.5px]"
          onHover={playHover}
        >
          working products
        </InlineChip>{" "}
        people actually use.
      </p>
    </div>
  );
}

export default EditorialBio;
