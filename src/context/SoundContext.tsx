"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { usePathname } from "next/navigation";
import { soundEngine } from "@/lib/sound";

interface SoundContextType {
  isSoundEnabled: boolean;
  toggleSound: () => void;
  playHover: () => void;
  playClick: () => void;
  playNavigate: () => void;
  playTheme: () => void;
  playOpen: () => void;
  playClose: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

const STORAGE_KEY = "naphier_sound_enabled";

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  // Initialize sound settings & unlock listener
  useEffect(() => {
    soundEngine.initUnlockListener();

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        setIsSoundEnabled(stored === "true");
      }
    } catch {
      // Ignore localStorage read errors
    }
  }, []);

  const toggleSound = useCallback(() => {
    setIsSoundEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        // Ignore localStorage write errors
      }
      return next;
    });
  }, []);

  const playHover = useCallback(() => {
    if (!isSoundEnabled) return;
    // Don't trigger hover on touch devices
    if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) {
      return;
    }
    soundEngine.playHover();
  }, [isSoundEnabled]);

  const playClick = useCallback(() => {
    if (!isSoundEnabled) return;
    soundEngine.playClick();
  }, [isSoundEnabled]);

  const playNavigate = useCallback(() => {
    if (!isSoundEnabled) return;
    soundEngine.playNavigate();
  }, [isSoundEnabled]);

  const playTheme = useCallback(() => {
    if (!isSoundEnabled) return;
    soundEngine.playTheme();
  }, [isSoundEnabled]);

  const playOpen = useCallback(() => {
    if (!isSoundEnabled) return;
    soundEngine.playOpen();
  }, [isSoundEnabled]);

  const playClose = useCallback(() => {
    if (!isSoundEnabled) return;
    soundEngine.playClose();
  }, [isSoundEnabled]);

  // Route change sound
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    playNavigate();
  }, [pathname, playNavigate]);

  return (
    <SoundContext.Provider
      value={{
        isSoundEnabled,
        toggleSound,
        playHover,
        playClick,
        playNavigate,
        playTheme,
        playOpen,
        playClose,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}

export function useUISound() {
  const context = useContext(SoundContext);
  if (!context) {
    // Fallback safe no-op object if used outside provider
    return {
      isSoundEnabled: false,
      toggleSound: () => {},
      playHover: () => {},
      playClick: () => {},
      playNavigate: () => {},
      playTheme: () => {},
      playOpen: () => {},
      playClose: () => {},
    };
  }
  return context;
}
