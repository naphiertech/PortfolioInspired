"use client";

import React from "react";
import { Music2 } from "lucide-react";
import { Track } from "../types/music";

interface MusicPlaylistProps {
  tracks: Track[];
  currentTrack: Track;
  isPlaying: boolean;
  onSelectTrack: (track: Track) => void;
  className?: string;
}

/**
 * MusicPlaylist
 *
 * Polished, clean playlist without three-dot menus:
 * - Clear title and artist alignment.
 * - Cleanly right-aligned tabular track durations.
 * - Selected-track indicator with animated equalizer bars.
 * - Balanced row padding and spacing.
 */
export function MusicPlaylist({
  tracks,
  currentTrack,
  isPlaying,
  onSelectTrack,
  className = "",
}: MusicPlaylistProps) {
  return (
    <div
      className={`flex flex-col gap-1 w-full mt-2 pt-2 border-t border-zinc-200/70 dark:border-[#22252a] ${className}`}
    >
      {/* Playlist Header Row */}
      <div className="flex items-center justify-between text-[10.5px] font-mono tracking-wider text-zinc-400 dark:text-[#71767f] uppercase select-none pb-0.5 px-0.5">
        <span>{"// PLAYLIST"}</span>
        <span>{tracks.length} TRACKS</span>
      </div>

      {/* Playlist Items */}
      <div className="flex flex-col gap-0.5">
        {tracks.map((track) => {
          const isActive = track.id === currentTrack.id;

          return (
            <button
              key={track.id}
              type="button"
              onClick={() => onSelectTrack(track)}
              aria-current={isActive ? "true" : undefined}
              className={`group flex items-center justify-between w-full py-1.5 px-2.5 rounded-lg text-left transition-all duration-150 focus:outline-none focus-visible:ring-1 focus-visible:ring-zinc-700 dark:focus-visible:ring-zinc-200 ${
                isActive
                  ? "bg-zinc-100 border border-zinc-300/80 text-zinc-900 dark:bg-zinc-800 dark:border-zinc-600/70 dark:text-[#eceeed] shadow-xs"
                  : "hover:bg-zinc-100/60 dark:hover:bg-[#1a1d22]/80 text-zinc-600 dark:text-[#8d929a] hover:text-zinc-900 dark:hover:text-[#eceeed] border border-transparent"
              }`}
            >
              {/* Left Column: Track Indicator & Metadata */}
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                {/* Active Equalizer or Music Note Icon */}
                <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                  {isActive ? (
                    <div
                      className="flex items-end gap-[1.5px] h-3.5"
                      aria-label="Playing track indicator"
                    >
                      <span
                        className={`w-[2px] bg-zinc-900 dark:bg-zinc-100 rounded-xs ${
                          isPlaying ? "animate-pulse" : "h-1"
                        }`}
                        style={{
                          height: isPlaying ? "85%" : "30%",
                          animationDuration: "0.6s",
                        }}
                      />
                      <span
                        className={`w-[2px] bg-zinc-900 dark:bg-zinc-100 rounded-xs ${
                          isPlaying ? "animate-pulse" : "h-3"
                        }`}
                        style={{
                          height: isPlaying ? "100%" : "60%",
                          animationDuration: "0.9s",
                          animationDelay: "0.15s",
                        }}
                      />
                      <span
                        className={`w-[2px] bg-zinc-900 dark:bg-zinc-100 rounded-xs ${
                          isPlaying ? "animate-pulse" : "h-2"
                        }`}
                        style={{
                          height: isPlaying ? "70%" : "40%",
                          animationDuration: "0.75s",
                          animationDelay: "0.3s",
                        }}
                      />
                    </div>
                  ) : (
                    <Music2 className="w-3.5 h-3.5 text-zinc-400 dark:text-[#656a73] group-hover:text-zinc-600 dark:group-hover:text-[#8d929a]" />
                  )}
                </div>

                {/* Song Title & Artist */}
                <div className="min-w-0">
                  <p
                    className={`text-xs truncate leading-tight ${
                      isActive
                        ? "text-zinc-900 dark:text-[#eceeed] font-medium"
                        : "text-zinc-700 dark:text-[#c9ced6] font-normal group-hover:text-zinc-900 dark:group-hover:text-[#eceeed]"
                    }`}
                  >
                    {track.title}
                  </p>
                  <p
                    className={`text-[10px] truncate leading-tight mt-0.5 ${
                      isActive
                        ? "text-zinc-500 dark:text-zinc-400"
                        : "text-zinc-400 dark:text-[#71767f]"
                    }`}
                  >
                    {track.artist}
                  </p>
                </div>
              </div>

              {/* Right Column: Track Duration (Clean, right-anchored, no dots) */}
              <span
                className={`font-mono text-[10.5px] tabular-nums flex-shrink-0 ${
                  isActive
                    ? "text-zinc-700 dark:text-zinc-200 font-medium"
                    : "text-zinc-400 dark:text-[#71767f] group-hover:text-zinc-500 dark:group-hover:text-[#9ba1a6]"
                }`}
              >
                {track.formattedDuration || "3:00"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
