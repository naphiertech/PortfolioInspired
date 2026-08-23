"use client";

import React, { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useUISound } from "@/context/SoundContext";

export function SoundToggle() {
  const { isSoundEnabled, toggleSound, playClick } = useUISound();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-6 w-14 rounded-[5px] bg-surface/60 border border-border-hairline animate-pulse" />
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
      className={`h-6 px-2 rounded-[6px] bg-surface border border-border-hairline shadow-xs font-mono text-[10px] inline-flex items-center gap-1.5 transition-colors cursor-pointer select-none ${
        isSoundEnabled
          ? "text-muted-foreground hover:text-ink hover:border-muted-foreground/40"
          : "text-muted-foreground/50 hover:text-muted-foreground bg-surface/50"
      }`}
      aria-label={isSoundEnabled ? "Mute UI sounds" : "Enable UI sounds"}
      title={isSoundEnabled ? "UI sounds enabled (click to mute)" : "UI sounds muted (click to enable)"}
    >
      {isSoundEnabled ? (
        <>
          <Volume2 className="w-3 h-3 text-brand opacity-80" />
          <span className="hidden sm:inline">Sound</span>
        </>
      ) : (
        <>
          <VolumeX className="w-3 h-3 opacity-60" />
          <span className="hidden sm:inline">Muted</span>
        </>
      )}
    </button>
  );
}

export default SoundToggle;
