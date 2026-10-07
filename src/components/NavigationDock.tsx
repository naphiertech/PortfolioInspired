"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Briefcase,
  FolderGit2,
  Cpu,
  Award,
  LayoutTemplate,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useUISound } from "@/context/SoundContext";
import { useSnap } from "@/context/SnapContext";
import { usePresentationMode } from "@/features/presentation-modes/context/PresentationModeContext";
import dynamic from "next/dynamic";
import { dockSpring, magneticSpring } from "@/lib/motion";
import { NAV_CURSOR_LABELS } from "@/lib/cursorConfig";

const PresentationModeSwitcher = dynamic(
  () => import("@/features/presentation-modes/components/PresentationModeSwitcher").then(m => m.PresentationModeSwitcher),
  {
    ssr: false,
    loading: () => (
      <div className="h-[54px] w-[54px] rounded-full bg-dock backdrop-blur-[16px] border border-border-hairline shadow-nav-dock flex items-center justify-center" aria-hidden="true" />
    ),
  }
);

function DeferredPresentationModeSwitcher() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const trigger = () => setReady(true);
    const timerId = setTimeout(trigger, 6000);

    const onInteract = () => {
      trigger();
      clearTimeout(timerId);
      window.removeEventListener("pointerdown", onInteract);
      window.removeEventListener("touchstart", onInteract);
      window.removeEventListener("keydown", onInteract);
    };

    window.addEventListener("pointerdown", onInteract, { once: true, passive: true });
    window.addEventListener("touchstart", onInteract, { once: true, passive: true });
    window.addEventListener("keydown", onInteract, { once: true, passive: true });

    return () => {
      clearTimeout(timerId);
      window.removeEventListener("pointerdown", onInteract);
      window.removeEventListener("touchstart", onInteract);
      window.removeEventListener("keydown", onInteract);
    };
  }, []);

  if (!ready) {
    return (
      <button
        type="button"
        aria-label="Change presentation view"
        title="Change view"
        className="h-[54px] w-[54px] rounded-full bg-dock backdrop-blur-[16px] border border-border-hairline shadow-nav-dock flex items-center justify-center text-ink/80 opacity-90 transition-transform cursor-pointer"
      >
        <LayoutTemplate className="w-[18px] h-[18px] text-ink/80" />
      </button>
    );
  }

  return <PresentationModeSwitcher variant="dock" />;
}

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
  const itemRef = useRef<HTMLAnchorElement>(null);
  const rectRef = useRef<DOMRect | null>(null);

  const router = useRouter();

  // Pure GPU / RAF-driven motion values — zero React component re-renders on mousemove
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rawScale = useMotionValue(1);

  const springX = useSpring(rawX, magneticSpring);
  const springY = useSpring(rawY, magneticSpring);
  const springScale = useSpring(rawScale, magneticSpring);

  useEffect(() => {
    if (onRegisterRef) {
      onRegisterRef(itemRef.current);
      return () => {
        onRegisterRef(null);
      };
    }
  }, [onRegisterRef]);

  const handleMouseEnter = () => {
    router.prefetch(item.href);
    onHover();
    if (itemRef.current) {
      // Cache bounding box once on entry to avoid layout thrashing during mouse movements
      rectRef.current = itemRef.current.getBoundingClientRect();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isDesktopPointer || shouldReduceMotion) return;
    const rect =
      rectRef.current ||
      (itemRef.current ? (rectRef.current = itemRef.current.getBoundingClientRect()) : null);
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    // Ultra-subtle 1-2.5px translation toward pointer
    const deltaX = (e.clientX - centerX) * 0.12;
    const deltaY = (e.clientY - centerY) * 0.12;
    rawX.set(Math.max(-2.5, Math.min(2.5, deltaX)));
    rawY.set(Math.max(-2.5, Math.min(2.5, deltaY)));
    rawScale.set(1.035);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
    rawScale.set(1);
    rectRef.current = null;
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
        prefetch={false}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={() => router.prefetch(item.href)}
        onClick={onClick}
        data-cursor-label={NAV_CURSOR_LABELS[item.name]}
        className={`flex flex-col items-center justify-center gap-1 px-3 py-1 cursor-pointer relative group select-none transition-colors duration-150 ease-out ${
          isActive
            ? "text-ink font-semibold"
            : "text-muted-foreground hover:text-ink font-medium"
        }`}
        aria-current={isActive ? "page" : undefined}
      >
        {/* Micro-Magnetic Content Wrapper driven by hardware-accelerated motion values */}
        <motion.div
          style={
            shouldReduceMotion
              ? undefined
              : { x: springX, y: springY, scale: springScale }
          }
          whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
          transition={{ duration: 0.08 }}
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

const NAV_ITEMS: NavItem[] = [
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

export function NavigationDock() {
  const pathname = usePathname();
  const router = useRouter();
  const { mode, previousMode } = usePresentationMode();
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

  const isEnteringDefault =
    previousMode !== null && previousMode !== "default" && mode === "default";

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

  const isDefaultMode = mode === "default";
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  // Animate dock out cleanly when user scrolls down to the footer
  useEffect(() => {
    if (typeof window === "undefined" || !isDefaultMode) return;

    let observer: IntersectionObserver | null = null;
    let cancelled = false;

    const findAndObserve = () => {
      if (cancelled) return;
      const footer = document.querySelector("footer");
      if (!footer) {
        requestAnimationFrame(findAndObserve);
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            setIsFooterVisible(entry.isIntersecting);
          }
        },
        {
          root: null,
          threshold: 0.05,
          rootMargin: "0px 0px -40px 0px",
        }
      );

      observer.observe(footer);
    };

    findAndObserve();

    const handleScroll = () => {
      const footer = document.querySelector("footer");
      if (footer) {
        const rect = footer.getBoundingClientRect();
        setIsFooterVisible(rect.top <= window.innerHeight - 40);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      cancelled = true;
      if (observer) observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname, mode, isDefaultMode]);

  // Idle warmup of the router cache after initial render settles
  useEffect(() => {
    const warmup = () => {
      NAV_ITEMS.forEach((item) => {
        router.prefetch(item.href);
      });
    };
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const handle = (window as unknown as { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number; cancelIdleCallback: (id: number) => void }).requestIdleCallback(warmup, { timeout: 4000 });
      return () => (window as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(handle);
    } else {
      const timer = setTimeout(warmup, 4000);
      return () => clearTimeout(timer);
    }
  }, [router]);

  return (
    <AnimatePresence>
      {isDefaultMode && (
        <motion.div
          key="navigation-dock-root"
          initial={
            isEnteringDefault && !shouldReduceMotion
              ? { opacity: 0, y: 12 }
              : false
          }
          animate={
            isFooterVisible
              ? {
                  opacity: 0,
                  y: 42,
                  transition: shouldReduceMotion
                    ? { duration: 0.01 }
                    : { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
                }
              : {
                  opacity: 1,
                  y: 0,
                  transition: shouldReduceMotion
                    ? { duration: 0.01 }
                    : { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
                }
          }
          exit={
            !shouldReduceMotion
              ? {
                  opacity: 0,
                  y: 12,
                  transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
                }
              : { opacity: 0, transition: { duration: 0.05 } }
          }
          className={`fixed bottom-7 sm:bottom-7 left-0 right-0 flex items-center justify-center gap-2 sm:gap-2.5 z-[70] max-sm:bottom-4 px-3 will-change-[transform,opacity] ${
            isFooterVisible ? "!pointer-events-none" : "pointer-events-none"
          }`}
        >
      {/* Separate Circular Presentation Mode Switcher */}
      <div
        className={`flex-shrink-0 z-[70] ${
          isFooterVisible ? "!pointer-events-none" : "pointer-events-auto"
        }`}
      >
        <DeferredPresentationModeSwitcher />
      </div>

      {/* Main Navigation Dock */}
      <motion.nav
        data-guide="nav"
        layout={isSnapActive ? "size" : false}
        transition={{
          layout: shouldReduceMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 380, damping: 32 },
        }}
        className={`nav-dock flex items-center justify-center gap-0.5 sm:gap-1 z-40 ${
          isFooterVisible ? "!pointer-events-none" : "pointer-events-auto"
        }`}
        aria-label="Bottom Quick Navigation"
      >
        <AnimatePresence initial={false}>
          {NAV_ITEMS.map((item) => {
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
                onRegisterRef={(el) => registerDockItem(item.name, el)}
              />
            );
          })}
        </AnimatePresence>
      </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default NavigationDock;
