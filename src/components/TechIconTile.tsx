"use client";

import React from "react";
import Link from "next/link";
import { TechIcon } from "./TechIcon";
import circuitStyles from "./CircuitPlatform.module.css";

interface TechIconTileProps {
  name: string;
  href?: string;
  onClick?: () => void;
  ariaPressed?: boolean;
  isSelected?: boolean;
  ariaLabel?: string;
  onMouseEnter?: () => void;
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  dataConnected?: boolean;
  dataMuted?: boolean;
}

/**
 * Orthogonal CAD-aligned technology chip pairing a softly muted icon with a
 * readable monospace label. Renders as a Link when `href` is provided, or as
 * a filter button otherwise.
 */
export function TechIconTile({
  name,
  href,
  onClick,
  ariaPressed,
  isSelected = false,
  ariaLabel,
  onMouseEnter,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  dataConnected,
  dataMuted,
}: TechIconTileProps) {
  const chipClassName = `inline-flex items-center gap-2 h-8 px-2.5 rounded-[6px] border font-mono text-xs leading-none cursor-pointer select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand ${circuitStyles.chip} ${
    isSelected
      ? "bg-surface border-ink/60 text-ink"
      : "bg-surface/55 border-border-hairline text-ink/85 hover:bg-surface-hover hover:border-border hover:text-ink"
  }`;

  const content = (
    <>
      <span className={circuitStyles.chipIcon} aria-hidden="true">
        <TechIcon name={name} className="w-3.5 h-3.5 flex-shrink-0" />
      </span>
      <span className="whitespace-nowrap">{name}</span>
      {isSelected && (
        <span
          className="w-1.5 h-1.5 rounded-full bg-ink flex-shrink-0"
          aria-hidden="true"
        />
      )}
    </>
  );

  if (href !== undefined) {
    return (
      <Link
        href={href}
        prefetch={false}
        className={chipClassName}
        aria-label={ariaLabel ?? `View projects built with ${name}`}
        data-connected={dataConnected}
        data-muted={dataMuted}
        data-selected={isSelected || undefined}
        onMouseEnter={onMouseEnter}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onFocus={onFocus}
        onBlur={onBlur}
        onClick={onClick}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={chipClassName}
      aria-pressed={ariaPressed}
      aria-label={
        ariaLabel ??
        (isSelected ? `Clear ${name} filter` : `Filter projects using ${name}`)
      }
      data-selected={isSelected || undefined}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      {content}
    </button>
  );
}
