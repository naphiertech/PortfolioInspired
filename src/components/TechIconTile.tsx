"use client";

import React from "react";
import Link from "next/link";
import { TechIcon } from "./TechIcon";
import circuitStyles from "./CircuitPlatform.module.css";

export const TILE_ANGLES = [-5, 4, -3.5, 5.5, -4, 3.5, -5.5, 4.5, -3, 5, -4.5] as const;

/**
 * Computes a deterministic organic tilt angle for an icon tile in a category grid.
 */
export function getTileTiltAngle(index: number, groupIndex = 0): number {
  return TILE_ANGLES[(index + groupIndex * 3) % TILE_ANGLES.length];
}

interface TechIconTileProps {
  name: string;
  tiltAngle: number;
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
 * Full-color tilted icon-only tile with an unrotated hover/focus floating name tooltip.
 * Renders as a navigation Link when `href` is provided, or as a filter button otherwise.
 */
export function TechIconTile({
  name,
  tiltAngle,
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
  const tileStyle = {
    "--tile-tilt": isSelected ? "0deg" : `${tiltAngle}deg`,
  } as React.CSSProperties;

  const tileClassName = `relative inline-flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 ${circuitStyles.iconTile} ${
    isSelected ? "outline outline-2 -outline-offset-2 outline-emerald-500/75" : ""
  }`;

  const iconEl = (
    <>
      {isSelected && (
        <span
          className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 pointer-events-none"
          aria-hidden="true"
        />
      )}
      <TechIcon
        name={name}
        className="w-5 h-5 sm:w-[22px] sm:h-[22px] flex-shrink-0"
      />
    </>
  );

  return (
    <div className="relative group/tile hover:z-20 focus-within:z-20">
      {href !== undefined ? (
        <Link
          href={href}
          prefetch={false}
          style={tileStyle}
          className={tileClassName}
          aria-label={ariaLabel ?? `View projects built with ${name}`}
          data-connected={dataConnected}
          data-muted={dataMuted}
          onMouseEnter={onMouseEnter}
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
          onFocus={onFocus}
          onBlur={onBlur}
          onClick={onClick}
        >
          {iconEl}
        </Link>
      ) : (
        <button
          type="button"
          style={tileStyle}
          className={tileClassName}
          aria-pressed={ariaPressed}
          aria-label={
            ariaLabel ??
            (isSelected ? `Clear ${name} filter` : `Filter projects using ${name}`)
          }
          onMouseEnter={onMouseEnter}
          onClick={onClick}
        >
          {iconEl}
        </button>
      )}

      <span
        role="tooltip"
        aria-hidden="true"
        className="pointer-events-none select-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 z-30 whitespace-nowrap rounded-md px-2.5 py-1 text-[11px] font-sans font-medium leading-none bg-ink text-background opacity-0 scale-95 translate-y-1 transition-[opacity,transform] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-opacity group-hover/tile:opacity-100 group-hover/tile:scale-100 group-hover/tile:translate-y-0 group-focus-within/tile:opacity-100 group-focus-within/tile:scale-100 group-focus-within/tile:translate-y-0"
      >
        {name}
      </span>
    </div>
  );
}
