"use client";

import React, { useState } from "react";
import {
  Monitor,
  Cpu,
  Headphones,
  Gamepad2,
  Lamp,
  BookOpen,
} from "lucide-react";

export type HotspotId =
  | "monitors"
  | "pc_rig"
  | "headphones"
  | "gamepad"
  | "smart_lamp"
  | "bookshelf";

export interface HotspotItem {
  id: HotspotId;
  title: string;
  category: string;
  hint: string;
  points: string;
  tooltipPos: { top: string; left: string }; // CSS percentages
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const HOTSPOTS: HotspotItem[] = [
  {
    id: "monitors",
    title: "Dev Workstation",
    category: "WORKSPACE",
    hint: "Click to inspect tech stack & terminals",
    points:
      "165,365 268,300 275,235 415,228 625,222 625,265 525,265 525,435 460,445 415,470 270,475 165,520",
    tooltipPos: { top: "22%", left: "42%" },
    color: "#06b6d4",
    icon: Monitor,
  },
  {
    id: "pc_rig",
    title: "Battle Station",
    category: "HARDWARE",
    hint: "Click to view PC specs & diagnostics",
    points: "96,575 218,622 268,665 268,785 225,795 96,755",
    tooltipPos: { top: "68%", left: "24%" },
    color: "#38bdf8",
    icon: Cpu,
  },
  {
    id: "headphones",
    title: "Now Playing",
    category: "MUSIC",
    hint: "Click to see what I'm listening to",
    points: "835,140 925,140 940,365 835,365",
    tooltipPos: { top: "25%", left: "75%" },
    color: "#fb923c",
    icon: Headphones,
  },
  {
    id: "gamepad",
    title: "Side Quests",
    category: "GAMING",
    hint: "Click for games & mini arcade",
    points: "115,185 215,185 215,265 115,265",
    tooltipPos: { top: "18%", left: "16%" },
    color: "#f472b6",
    icon: Gamepad2,
  },
  {
    id: "smart_lamp",
    title: "Ambient Light",
    category: "ATMOSPHERE",
    hint: "Click to adjust room RGB mood",
    points: "82,455 148,435 148,515 82,515",
    tooltipPos: { top: "45%", left: "12%" },
    color: "#34d399",
    icon: Lamp,
  },
  {
    id: "bookshelf",
    title: "Reading Shelf",
    category: "INSPIRATION",
    hint: "Click for engineering books & lore",
    points: "645,85 765,85 828,155 828,215 645,215",
    tooltipPos: { top: "12%", left: "68%" },
    color: "#facc15",
    icon: BookOpen,
  },
];

interface RoomHotspotsProps {
  onSelectHotspot: (id: HotspotId) => void;
  isDark: boolean;
  activeHotspot: HotspotId | null;
}

export function RoomHotspots({
  onSelectHotspot,
}: RoomHotspotsProps) {
  const [hoveredId, setHoveredId] = useState<HotspotId | null>(null);

  const activeItem = HOTSPOTS.find((h) => h.id === hoveredId);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-20 select-none">
      {/* 1. Invisible SVG Hit-Testing Polygons */}
      <svg
        viewBox="0 0 1032 880"
        preserveAspectRatio="none"
        className="w-full h-full overflow-visible"
        aria-label="Interactive Workspace Objects"
      >
        {HOTSPOTS.map((hotspot) => (
          <polygon
            key={hotspot.id}
            points={hotspot.points}
            fill="rgba(0,0,0,0.001)"
            style={{ pointerEvents: "all" }}
            className="cursor-pointer"
            onMouseEnter={() => setHoveredId(hotspot.id)}
            onMouseLeave={() => setHoveredId(null)}
            onPointerEnter={() => setHoveredId(hotspot.id)}
            onPointerLeave={() => setHoveredId(null)}
            onClick={() => onSelectHotspot(hotspot.id)}
          />
        ))}
      </svg>

      {/* 3. Sleek Floating Hover Tooltip */}
      {activeItem && (
        <div
          key={activeItem.id}
          style={{
            top: activeItem.tooltipPos.top,
            left: activeItem.tooltipPos.left,
          }}
          className="absolute -translate-x-1/2 -translate-y-full mb-3 pointer-events-none z-30 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="px-3.5 py-2.5 rounded-2xl bg-white/95 dark:bg-[#111111]/95 backdrop-blur-md shadow-[0_12px_32px_rgba(0,0,0,0.18)] dark:shadow-[0_12px_32px_rgba(0,0,0,0.65)] border border-black/10 dark:border-white/15 text-[#0a0a0a] dark:text-[#fafafa] whitespace-nowrap flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-sans text-[9px] font-semibold tracking-[0.16em] uppercase text-neutral-500 dark:text-neutral-400">
                {activeItem.category}
              </span>
            </div>
            <div className="font-mono text-base font-semibold tracking-tight text-[#0a0a0a] dark:text-[#fafafa] flex items-center gap-1.5">
              <activeItem.icon className="size-3.5 text-neutral-600 dark:text-neutral-300" />
              <span>{activeItem.title}</span>
            </div>
            <div className="font-sans text-[11px] text-neutral-600 dark:text-neutral-400 pt-0.5 flex items-center gap-1">
              <span>{activeItem.hint}</span>
              <span className="text-[11px]">↗</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
