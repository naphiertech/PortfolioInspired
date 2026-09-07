"use client";

import React, { useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Heart } from "lucide-react";
import { Track } from "../types/music";

interface MusicPlayerControlsProps {
  track: Track;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  progress: number;
  formattedCurrentTime: string;
  formattedTotalDuration: string;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (seconds: number) => void;
  className?: string;
}

/**
 * MusicPlayerControls
 *
 * Polished, theme-adaptive controls with mathematically & optically centered playback:
 * - Equal spacing between Previous / Play / Next.
 * - Symmetrical button dimensions so the center button sits at exact 50% width.
 * - Tight, balanced vertical rhythm connecting song info, scrubber, and playback.
 */
export function MusicPlayerControls({
  track,
  isPlaying,
  currentTime,
  duration,
  progress,
  formattedCurrentTime,
  formattedTotalDuration,
  onTogglePlay,
  onNext,
  onPrevious,
  onSeek,
  className = "",
}: MusicPlayerControlsProps) {
  const [isLiked, setIsLiked] = useState<boolean>(true);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (duration > 0) {
      onSeek((val / 100) * duration);
    }
  };

  return (
    <div className={`flex flex-col gap-2 w-full my-0.5 ${className}`}>
      {/* Track Info Row */}
      <div className="flex items-center justify-between pt-0.5">
        <div className="min-w-0 pr-2">
          <h3 className="font-semibold text-sm text-zinc-900 dark:text-[#eceeed] truncate tracking-tight">
            {track.title}
          </h3>
          <p className="font-mono text-xs text-zinc-500 dark:text-[#8d929a] truncate mt-0.5">
            {track.artist}
          </p>
        </div>

        {/* Favorite Heart Toggle */}
        <button
          type="button"
          onClick={() => setIsLiked((prev) => !prev)}
          aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
          className="p-1.5 rounded-md text-zinc-700 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-zinc-700 dark:focus-visible:ring-zinc-200 flex-shrink-0"
        >
          <Heart
            className={`w-4 h-4 transition-transform active:scale-125 ${
              isLiked
                ? "fill-current"
                : "text-zinc-400 dark:text-[#636873]"
            }`}
          />
        </button>
      </div>

      {/* Scrubber Progress Bar */}
      <div className="flex flex-col gap-1 w-full mt-0.5">
        <div className="relative flex items-center w-full group py-1 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-zinc-700 dark:has-[:focus-visible]:outline-zinc-200">
          {/* Visual Track Background */}
          <div className="h-1 w-full bg-zinc-200/90 dark:bg-[#25282f] rounded-full overflow-hidden relative">
            {/* Active Progress Bar */}
            <div
              className="h-full bg-zinc-900 dark:bg-zinc-100 transition-all duration-100 ease-out"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>

          {/* Draggable Range Input Overlay */}
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={isNaN(progress) ? 0 : Math.round(progress * 1000) / 10}
            onChange={handleSliderChange}
            aria-label="Seek track position"
            aria-valuemin={0}
            aria-valuemax={Math.round(duration)}
            aria-valuenow={Math.round(currentTime)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />

          {/* Scrubber Thumb Handle */}
          <div
            className="absolute w-2.5 h-2.5 bg-zinc-900 dark:bg-zinc-100 rounded-full shadow-xs pointer-events-none transition-all duration-100 ease-out transform -translate-x-1/2 group-hover:scale-125"
            style={{ left: `${Math.round(progress * 100)}%` }}
          />
        </div>

        {/* Timestamps Row */}
        <div className="flex items-center justify-between text-[10.5px] font-mono text-zinc-400 dark:text-[#8d929a] select-none">
          <span>{formattedCurrentTime}</span>
          <span>{formattedTotalDuration}</span>
        </div>
      </div>

      {/* Playback Control Buttons: Exactly centered with equal spacing */}
      <div className="w-full flex items-center justify-center gap-6 mt-1.5 mb-0.5">
        {/* Previous Track */}
        <button
          type="button"
          onClick={onPrevious}
          aria-label="Previous track"
          className="w-8 h-8 flex items-center justify-center rounded-full text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 dark:text-[#8d929a] dark:hover:text-[#eceeed] dark:hover:bg-[#1f2228] transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-zinc-700 dark:focus-visible:ring-zinc-200 active:scale-95"
        >
          <SkipBack className="w-4 h-4 fill-current" />
        </button>

        {/* Play / Pause Toggle - Sits exactly at center */}
        <button
          type="button"
          onClick={onTogglePlay}
          aria-label={isPlaying ? "Pause music" : "Play music"}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200/80 border border-zinc-200/90 text-zinc-800 hover:text-zinc-950 dark:bg-[#1f2228] dark:hover:bg-[#272b33] dark:border-[#2f333c] dark:text-[#eceeed] dark:hover:text-white transition-all shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-700 dark:focus-visible:ring-zinc-200 active:scale-95"
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5 fill-current" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current" />
          )}
        </button>

        {/* Next Track */}
        <button
          type="button"
          onClick={onNext}
          aria-label="Next track"
          className="w-8 h-8 flex items-center justify-center rounded-full text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 dark:text-[#8d929a] dark:hover:text-[#eceeed] dark:hover:bg-[#1f2228] transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-zinc-700 dark:focus-visible:ring-zinc-200 active:scale-95"
        >
          <SkipForward className="w-4 h-4 fill-current" />
        </button>
      </div>
    </div>
  );
}
