"use client";

import React, { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useUISound } from "@/context/SoundContext";

export interface SoundToggleProps {
  variant?: "standalone" | "embedded";
}

export function SoundToggle({ variant = "standalone" }: SoundToggleProps = {}) {
  const { isSoundEnabled, toggleSound, playClick } = useUISound();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isEmbedded = variant === "embedded";

  if (!mounted) {
    return isEmbedded ? (
      <div className="h-[22px] w-[26px] rounded-[4px] bg-muted-subtle/50 animate-pulse" />
    ) : (
      <div className="h-7 w-7 rounded-[6px] bg-surface/60 border border-border-hairline animate-pulse" />
    );
  }

  const handleClick = () => {
    playClick();
    toggleSound();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={
        isEmbedded
          ? `h-[22px] w-[26px] justify-center rounded-[4px] inline-flex items-center transition-colors duration-150 cursor-pointer select-none ${
              isSoundEnabled
                ? "text-ink/80 hover:text-ink hover:bg-surface-hover/50"
                : "text-muted-foreground/45 hover:text-muted-foreground hover:bg-surface-hover/40"
            }`
          : `h-7 w-7 justify-center rounded-[6px] bg-surface border border-border-hairline inline-flex items-center transition-colors duration-150 cursor-pointer select-none ${
              isSoundEnabled
                ? "text-muted-foreground hover:text-ink hover:border-border"
                : "text-muted-foreground/50 hover:text-muted-foreground bg-surface/50"
            }`
      }
      aria-label={isSoundEnabled ? "Mute UI sounds" : "Enable UI sounds"}
      aria-pressed={isSoundEnabled}
      title={isSoundEnabled ? "UI sounds enabled (click to mute)" : "UI sounds muted (click to enable)"}
    >
      {isSoundEnabled ? (
        <Volume2 className="w-3.5 h-3.5" strokeWidth={1.75} aria-hidden="true" />
      ) : (
        <VolumeX className="w-3.5 h-3.5 opacity-75" strokeWidth={1.75} aria-hidden="true" />
      )}
    </button>
  );
}

export default SoundToggle;
