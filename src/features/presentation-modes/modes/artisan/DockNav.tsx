"use client";

import React, { useState } from "react";
import {
  HiOutlineHome,
  PiChairLight,
  PiNotePencilLight,
  BsFolder2,
  LuSun,
  LuMoon,
} from "./ArtisanIcons";

interface DockNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onHoverTab?: (tab: string) => void;
  isDark: boolean;
  onToggleTheme: (event?: React.MouseEvent) => void;
}

export function DockNav({
  activeTab,
  onSelectTab,
  onHoverTab,
  isDark,
  onToggleTheme,
}: DockNavProps) {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  const items = [
    {
      id: "home",
      label: "Home",
      icon: <HiOutlineHome aria-hidden="true" className="size-5 transition-transform duration-200 ease-out group-hover:scale-125" />,
    },
    { type: "divider" },
    {
      id: "experience",
      label: "Experience",
      icon: <PiChairLight aria-hidden="true" className="size-5 transition-transform duration-200 ease-out group-hover:scale-125" />,
    },
    {
      id: "projects",
      label: "Projects",
      icon: <BsFolder2 aria-hidden="true" className="size-5 transition-transform duration-200 ease-out group-hover:scale-125" />,
    },
    {
      id: "notes",
      label: "Notes",
      icon: <PiNotePencilLight aria-hidden="true" className="size-5 transition-transform duration-200 ease-out group-hover:scale-125" />,
    },
    { type: "divider" },
    {
      id: "theme",
      label: isDark ? "Light Mode" : "Dark Mode",
      isTheme: true,
      icon: isDark ? (
        <LuSun aria-hidden="true" className="size-5 transition-transform duration-200 ease-out group-hover:scale-125 text-amber-400" />
      ) : (
        <LuMoon aria-hidden="true" className="size-5 transition-transform duration-200 ease-out group-hover:scale-125 text-foreground" />
      ),
    },
  ];

  return (
    <div className="fixed inset-x-0 bottom-0 z-[70] pointer-events-none flex justify-center">
      <nav
        data-guide="artisan-dock"
        className="relative flex h-14 w-fit items-center justify-center gap-1.5 sm:gap-2 overflow-visible rounded-t-[32px] bg-white/95 dark:bg-[#0a0a0a]/95 text-foreground px-3.5 py-2 border-t border-x border-black/10 dark:border-white/10 shadow-[0_-4px_24px_rgba(0,0,0,0.12)] backdrop-blur-3xl pointer-events-auto transition-all duration-300 ease-out"
      >
        {items.map((item, idx) => {
          if (item.type === "divider") {
            return (
              <div
                key={`divider-${idx}`}
                className="my-auto h-6 w-px shrink-0 bg-neutral-300 dark:bg-neutral-700 transition-all duration-300"
              />
            );
          }

          const isCurrent = activeTab === item.id;
          const isHovered = hoveredTab === item.id;

          return (
            <div
              key={item.id}
              className="relative group flex items-center justify-center"
              onMouseEnter={() => {
                setHoveredTab(item.id || null);
                if (item.id && !item.isTheme) {
                  onHoverTab?.(item.id);
                }
              }}
              onMouseLeave={() => setHoveredTab(null)}
            >
              {/* Tooltip */}
              <div
                className={`absolute -top-14 left-1/2 -translate-x-1/2 pointer-events-none z-50 transition-all duration-200 ease-out flex flex-col items-center ${
                  isHovered
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-2 scale-90"
                }`}
              >
                <div className="rounded-full bg-white dark:bg-neutral-800 px-3 py-1.5 font-semibold tracking-wider text-neutral-900 dark:text-white text-xs sm:text-sm shadow-xl border border-neutral-200 dark:border-neutral-700 backdrop-blur-md whitespace-nowrap font-mono">
                  {item.label}
                </div>
                <div className="-mt-1 h-2 w-2 rotate-45 bg-white dark:bg-neutral-800 border-r border-b border-neutral-200 dark:border-neutral-700" />
              </div>

              {/* Icon Button */}
              {item.isTheme ? (
                <button
                  type="button"
                  onClick={(e) => onToggleTheme(e)}
                  aria-label="Toggle theme"
                  className="relative flex size-10 hover:size-12 items-center cursor-pointer justify-center rounded-full text-neutral-600 dark:text-neutral-400 transition-all duration-200 ease-out hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white active:scale-95"
                >
                  {item.icon}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onSelectTab(item.id!)}
                  aria-label={item.label}
                  className={`flex size-10 hover:size-12 items-center justify-center rounded-full transition-all duration-200 ease-out active:scale-95 cursor-pointer ${
                    isCurrent
                      ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-bold shadow-xs scale-105"
                      : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                >
                  {item.icon}
                </button>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}

export default DockNav;
