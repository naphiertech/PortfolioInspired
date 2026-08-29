"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Briefcase,
  FolderGit2,
  Cpu,
  Award,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useUISound } from "@/context/SoundContext";
import { useSnap } from "@/context/SnapContext";
import { dockSpring, magneticSpring } from "@/lib/motion";

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

interface NavItemLinkProps {
  item: NavItem;
  isActive: boolean;
  onHover: () => void;
  onClick: () => void;
  shouldReduceMotion: boolean | null;
  isDesktopPointer: boolean;
  isSnapping?: boolean;
  isRestoring?: boolean;
  isSnapActive?: boolean;
  onRegisterRef?: (el: HTMLElement | null) => void;
}

function NavItemLink({
  item,
  isActive,
  onHover,
  onClick,
  shouldReduceMotion,
  isDesktopPointer,
  isSnapping = false,
  isRestoring = false,
  isSnapActive = false,
  onRegisterRef,
}: NavItemLinkProps) {
  const [offset, setOffset] = useState({ x: 0, y: 0, scale: 1 });
  const itemRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (onRegisterRef) {
      onRegisterRef(itemRef.current);
      return () => {
        onRegisterRef(null);
      };
    }
  }, [onRegisterRef]);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isDesktopPointer || shouldReduceMotion || !itemRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    // Ultra-subtle 1-2.5px translation toward pointer
    const deltaX = (e.clientX - centerX) * 0.12;
    const deltaY = (e.clientY - centerY) * 0.12;
    const clampedX = Math.max(-2.5, Math.min(2.5, deltaX));
    const clampedY = Math.max(-2.5, Math.min(2.5, deltaY));
    setOffset({ x: clampedX, y: clampedY, scale: 1.03 });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0, scale: 1 });
  };

  return (
    <motion.div
      layout={isSnapActive ? "size" : false}
      id={`dock-item-${item.name.toLowerCase()}`}
      initial={
        isRestoring
          ? { opacity: 0, scale: 0.9, width: 0, filter: "blur(6px)" }
          : false
      }
      animate={
        isSnapping
          ? {
              opacity: 0,
              filter: "blur(2.5px) brightness(1.2)",
              scale: 0.95,
              transition: { duration: 1.0, ease: "easeOut" },
            }
          : isRestoring
          ? {
              opacity: 1,
              scale: 1,
              width: "auto",
              filter: "blur(0px)",
              transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
            }
          : undefined
      }
      exit={{
        opacity: 0,
        scale: 0.85,
        width: 0,
        transition: {
          width: shouldReduceMotion
            ? { duration: 0 }
            : { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
          opacity: { duration: 0.2 },
          scale: { duration: 0.2 },
        },
      }}
      transition={{
        layout: shouldReduceMotion
          ? { duration: 0 }
          : { type: "spring", stiffness: 380, damping: 32 },
      }}
      className="overflow-hidden flex-shrink-0"
    >
      <Link
        ref={itemRef}
        href={item.href}
        onMouseEnter={onHover}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        className={`flex flex-col items-center justify-center gap-1 px-3 py-1 cursor-pointer relative group select-none ${
          isActive
            ? "text-ink font-semibold"
            : "text-muted-foreground hover:text-ink"
        }`}
        aria-current={isActive ? "page" : undefined}
      >
        {/* Micro-Magnetic Content Wrapper */}
        <motion.div
          animate={
            shouldReduceMotion
              ? { x: 0, y: 0, scale: 1 }
              : { x: offset.x, y: offset.y, scale: offset.scale }
          }
          whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
          transition={magneticSpring}
          className="flex flex-col items-center justify-center gap-1 pointer-events-none"
        >
          {/* Icon with Active Dot Indicator */}
          <div className="relative">
            {item.icon}
            {isActive && (
              <motion.span
                layoutId="dock-active-dot"
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand"
                transition={shouldReduceMotion ? { duration: 0 } : dockSpring}
              />
            )}
          </div>

          {/* Label */}
          <span className="text-[10px] font-sans leading-none tracking-tight whitespace-nowrap">
            {item.name}
          </span>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export function NavigationDock() {
  const pathname = usePathname();
  const { playHover, playClick } = useUISound();
  const {
    isSnapped,
    isSnapping,
    isRestoring,
    snappingDockItems,
    snappedDockItems,
    registerDockItem,
  } = useSnap();
  const shouldReduceMotion = useReducedMotion();
  const [isDesktopPointer, setIsDesktopPointer] = useState(false);

  const isSnapActive =
    isSnapped ||
    isSnapping ||
    isRestoring ||
    snappedDockItems.length > 0 ||
    snappingDockItems.length > 0;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const media = window.matchMedia("(hover: hover) and (pointer: fine)");
      setIsDesktopPointer(media.matches);
      const listener = (e: MediaQueryListEvent) =>
        setIsDesktopPointer(e.matches);
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    }
  }, []);

  const navItems: NavItem[] = [
    {
      name: "Home",
      href: "/",
      icon: <Home className="w-[18px] h-[18px]" />,
    },
    {
      name: "Work",
      href: "/work",
      icon: <Briefcase className="w-[18px] h-[18px]" />,
    },
    {
      name: "Projects",
      href: "/projects",
      icon: <FolderGit2 className="w-[18px] h-[18px]" />,
    },
    {
      name: "Tech",
      href: "/tech-stack",
      icon: <Cpu className="w-[18px] h-[18px]" />,
    },
    {
      name: "Certs",
      href: "/certifications",
      icon: <Award className="w-[18px] h-[18px]" />,
    },
  ];

  return (
    <div className="fixed bottom-7 sm:bottom-7 left-0 right-0 flex justify-center z-50 pointer-events-none max-sm:bottom-4">
      <motion.nav
        layout={isSnapActive ? "size" : false}
        transition={{
          layout: shouldReduceMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 380, damping: 32 },
        }}
        className="nav-dock pointer-events-auto flex items-center justify-center gap-0.5 sm:gap-1"
        aria-label="Bottom Quick Navigation"
      >
        <AnimatePresence initial={false}>
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            const isHome = item.name === "Home";
            const isSnapping = !isHome && snappingDockItems.includes(item.name);
            const isSnapped = !isHome && snappedDockItems.includes(item.name);

            if (isSnapped) {
              return null;
            }

            return (
              <NavItemLink
                key={item.name}
                item={item}
                isActive={isActive}
                onHover={playHover}
                onClick={playClick}
                shouldReduceMotion={shouldReduceMotion}
                isDesktopPointer={isDesktopPointer}
                isSnapping={isSnapping}
                isRestoring={isRestoring}
                isSnapActive={isSnapActive}
                onRegisterRef={
                  !isHome
                    ? (el) => registerDockItem(item.name, el)
                    : undefined
                }
              />
            );
          })}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
}

export default NavigationDock;
