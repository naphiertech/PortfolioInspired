"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import { MusicTrack } from "../types/music";
import { MusicDisc } from "./MusicDisc";
import { SpotifyIcon, YouTubeMusicIcon } from "./MusicServiceIcons";

interface MusicFeaturedSongProps {
  track: MusicTrack;
  className?: string;
}

/**
 * MusicFeaturedSong
 *
 * Featured showcase section representing the currently selected song:
 * - Decorative rotating Compact Disc (CD)
 * - Prominent song title and monospace artist
 * - "Music that inspires my work." editorial tagline
 * - Dual monochrome external action buttons for Spotify and YouTube Music
 */
export function MusicFeaturedSong({
  track,
  className = "",
}: MusicFeaturedSongProps) {
  const hasSpotify = Boolean(track.spotifyUrl);
  const hasYouTubeMusic = Boolean(track.youtubeMusicUrl);

  return (
    <div className={`flex flex-col items-center text-center w-full my-1 ${className}`}>
      {/* 1. Large Decorative Rotating CD Artwork */}
      <MusicDisc track={track} />

      {/* 2. Track Title & Artist */}
      <div className="w-full text-left pt-1.5 px-0.5">
        <h3 className="font-semibold text-[17px] sm:text-[18px] leading-tight text-zinc-900 dark:text-[#eceeed] tracking-tight truncate">
          {track.title}
        </h3>
        <p className="font-mono text-[13px] text-zinc-600 dark:text-[#a0a5b2] mt-0.5 truncate">
          {track.artist}
        </p>
        <p className="font-mono text-[12.5px] text-zinc-500 dark:text-[#8f94a0] mt-1 tracking-tight">
          Music that inspires my work.
        </p>
      </div>

      {/* 3. Featured Action Buttons */}
      <div className="flex flex-col gap-1.5 w-full mt-2.5">
        {/* Spotify Action Button */}
        {hasSpotify ? (
          <a
            href={track.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Listen to ${track.title} on Spotify`}
            className="group/btn flex items-center justify-between gap-2 h-10 sm:h-9 px-3 rounded-xl bg-zinc-100/90 hover:bg-zinc-200/80 dark:bg-[#1c1f26] dark:hover:bg-[#252932] border border-zinc-200 dark:border-[#2a2e36] text-zinc-800 dark:text-[#eceeed] transition-[color,background-color,border-color,transform] duration-150 active:scale-[0.98] focus:outline-none focus-visible:ring-1 focus-visible:ring-zinc-700 dark:focus-visible:ring-zinc-200 min-w-0"
          >
            <div className="flex items-center gap-2 min-w-0">
              <SpotifyIcon className="w-4 h-4 text-zinc-900 dark:text-white flex-shrink-0" />
              <span className="text-[13px] font-medium tracking-tight whitespace-nowrap">
                Listen on Spotify
              </span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 dark:text-[#71767f] group-hover/btn:text-zinc-700 dark:group-hover/btn:text-[#eceeed] flex-shrink-0 transition-colors" />
          </a>
        ) : (
          <button
            type="button"
            disabled
            title="Link unavailable"
            aria-label="Spotify link unavailable"
            className="flex items-center justify-center gap-1.5 h-10 sm:h-9 px-3 rounded-xl bg-zinc-100/40 dark:bg-[#1c1f26]/40 border border-zinc-200/50 dark:border-[#2a2e36]/50 text-zinc-400 dark:text-zinc-600 cursor-not-allowed opacity-60 min-w-0"
          >
            <SpotifyIcon className="w-4 h-4 flex-shrink-0" />
            <span className="text-[13px] font-medium">Unavailable</span>
          </button>
        )}

        {/* YouTube Music Action Button */}
        {hasYouTubeMusic ? (
          <a
            href={track.youtubeMusicUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Listen to ${track.title} on YouTube Music`}
            className="group/btn flex items-center justify-between gap-2 h-10 sm:h-9 px-3 rounded-xl bg-zinc-100/90 hover:bg-zinc-200/80 dark:bg-[#1c1f26] dark:hover:bg-[#252932] border border-zinc-200 dark:border-[#2a2e36] text-zinc-800 dark:text-[#eceeed] transition-[color,background-color,border-color,transform] duration-150 active:scale-[0.98] focus:outline-none focus-visible:ring-1 focus-visible:ring-zinc-700 dark:focus-visible:ring-zinc-200 min-w-0"
          >
            <div className="flex items-center gap-2 min-w-0">
              <YouTubeMusicIcon className="w-4 h-4 text-zinc-900 dark:text-white flex-shrink-0" />
              <span className="text-[13px] font-medium tracking-tight whitespace-nowrap">
                Listen on YouTube Music
              </span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 dark:text-[#71767f] group-hover/btn:text-zinc-700 dark:group-hover/btn:text-[#eceeed] flex-shrink-0 transition-colors" />
          </a>
        ) : (
          <button
            type="button"
            disabled
            title="Link unavailable"
            aria-label="YouTube Music link unavailable"
            className="flex items-center justify-center gap-1.5 h-10 sm:h-9 px-3 rounded-xl bg-zinc-100/40 dark:bg-[#1c1f26]/40 border border-zinc-200/50 dark:border-[#2a2e36]/50 text-zinc-400 dark:text-zinc-600 cursor-not-allowed opacity-60 min-w-0"
          >
            <YouTubeMusicIcon className="w-4 h-4 flex-shrink-0" />
            <span className="text-[13px] font-medium">Unavailable</span>
          </button>
        )}
      </div>
    </div>
  );
}
