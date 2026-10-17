"use client";

import React, { useState } from "react";
import {
  Monitor,
  PhoneCall,
  Coffee,
  BookOpen,
} from "lucide-react";

export type HotspotId =
  | "monitors"
  | "smartphone"
  | "desk_corner"
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
      "518,208 650,245 652,222 830,315 830,460 725,548 545,480 492,365",
    tooltipPos: { top: "24%", left: "66%" },
    color: "#06b6d4",
    icon: Monitor,
  },
  {
    id: "smartphone",
    title: "Desk Phone",
    category: "VOICE CALL",
    hint: "Click to call or hang up",
    points: "728,518 790,515 822,538 765,578 728,556",
    tooltipPos: { top: "51%", left: "77%" },
    color: "#10b981",
    icon: PhoneCall,
  },
  {
    id: "desk_corner",
    title: "Left Desk Corner",
    category: "HARDWARE & GEAR",
    hint: "Click to view laptop specs & desk artifacts",
    points:
      "68,355 195,355 205,425 285,408 355,448 295,492 248,515 95,515 68,435",
    tooltipPos: { top: "38%", left: "21%" },
    color: "#38bdf8",
    icon: Coffee,
  },
  {
    id: "bookshelf",
    title: "Reading Shelf",
    category: "INSPIRATION",
    hint: "Click for engineering books & lore",
    points:
      "118,275 295,180 415,105 495,155 495,250 340,325 230,355 118,365",
    tooltipPos: { top: "16%", left: "36%" },
    color: "#facc15",
    icon: BookOpen,
  },
];

interface RoomHotspotsProps {
  onSelectHotspot: (id: HotspotId) => void;
  onTriggerPhoneCall?: () => void;
  isCallActive?: boolean;
  isTransitionLocked?: boolean;
  isDark: boolean;
  activeHotspot: HotspotId | null;
}

export function RoomHotspots({
  onSelectHotspot,
  onTriggerPhoneCall,
  isCallActive,
  isTransitionLocked = false,
}: RoomHotspotsProps) {
  const [hoveredId, setHoveredId] = useState<HotspotId | null>(null);

  const activeItem = HOTSPOTS.find((h) => h.id === hoveredId);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-20 select-none">
      {/* 1. Invisible SVG Hit-Testing Polygons */}
      <svg
        viewBox="0 0 988 1038"
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
            className={
              hotspot.id === "smartphone" && isTransitionLocked
                ? "cursor-not-allowed"
                : "cursor-pointer"
            }
            onMouseEnter={() => setHoveredId(hotspot.id)}
            onMouseLeave={() => setHoveredId(null)}
            onPointerEnter={() => setHoveredId(hotspot.id)}
            onPointerLeave={() => setHoveredId(null)}
            onClick={() => {
              if (hotspot.id === "smartphone" && onTriggerPhoneCall) {
                if (!isTransitionLocked) {
                  onTriggerPhoneCall();
                }
              } else {
                onSelectHotspot(hotspot.id);
              }
            }}
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
              <span
                className={`size-1.5 rounded-full animate-pulse ${
                  activeItem.id === "smartphone" && isCallActive
                    ? "bg-rose-500"
                    : "bg-emerald-500"
                }`}
              />
              <span className="font-sans text-[9px] font-semibold tracking-[0.16em] uppercase text-neutral-500 dark:text-neutral-400">
                {activeItem.category}
              </span>
            </div>
            <div
              className={`font-semibold tracking-tight text-[#0a0a0a] dark:text-[#fafafa] flex items-center gap-1.5 ${
                activeItem.id === "smartphone"
                  ? "font-prime text-sm"
                  : "font-mono text-base"
              }`}
            >
              <activeItem.icon className="size-3.5 text-neutral-600 dark:text-neutral-300" />
              <span>
                {activeItem.id === "smartphone"
                  ? isCallActive
                    ? "End Call"
                    : "Chat with NaphBot"
                  : activeItem.title}
              </span>
            </div>
            <div className="font-sans text-[11px] text-neutral-600 dark:text-neutral-400 pt-0.5 flex items-center gap-1">
              <span>
                {activeItem.id === "smartphone"
                  ? isTransitionLocked
                    ? "Wait for animation to finish..."
                    : isCallActive
                      ? "Click to hang up phone"
                      : "Click to pick up & chat"
                  : activeItem.hint}
              </span>
              <span className="text-[11px]">↗</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
