"use client";

import React from "react";
import { Music2 } from "lucide-react";
import { MusicTrack } from "../types/music";
import { SpotifyIcon, YouTubeMusicIcon } from "./MusicServiceIcons";

interface MusicPlaylistProps {
  tracks: MusicTrack[];
  currentTrack: MusicTrack;
  onSelectTrack: (track: MusicTrack) => void;
  className?: string;
}

/**
 * MusicPlaylist
 *
 * "MY ROTATION" scrollable playlist section:
 * - Dynamic track counter derived from tracks.length
 * - Musical note, song title, artist, duration
 * - Direct Spotify & YouTube Music service launch buttons on the right
 * - Active row highlight corresponding to featured song
 * - Strict propagation isolation between row selection and external link clicks
 */
export function MusicPlaylist({
  tracks,
  currentTrack,
  onSelectTrack,
  className = "",
}: MusicPlaylistProps) {
  return (
    <div
      className={`flex-1 min-h-0 flex flex-col gap-1 w-full mt-2 pt-2 border-t border-zinc-200/70 dark:border-[#22252a] ${className}`}
    >
      {/* Playlist Header Row: // MY ROTATION & Count */}
      <div className="flex-shrink-0 flex items-center justify-between text-xs font-mono tracking-wider text-zinc-500 dark:text-zinc-400 uppercase select-none pb-1.5 px-1">
        <span>{"// MY ROTATION"}</span>
        <span>{tracks.length} TRACKS</span>
      </div>

      {/* Scrollable Playlist Items (only scrollable container in drawer) */}
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain custom-scrollbar space-y-0.5 pr-0.5">
        {tracks.map((track) => {
          const isActive = track.id === currentTrack.id;

          return (
            <div
              key={track.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelectTrack(track)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectTrack(track);
                }
              }}
              aria-current={isActive ? "true" : undefined}
              aria-label={`Select ${track.title} by ${track.artist}`}
              className={`group flex items-center justify-between w-full py-1.5 px-2 rounded-lg text-left cursor-pointer transition-colors duration-150 select-none focus:outline-none focus-visible:ring-1 focus-visible:ring-zinc-700 dark:focus-visible:ring-zinc-200 ${
                isActive
                  ? "bg-zinc-100/95 dark:bg-[#1c1f26] border border-zinc-300/80 dark:border-zinc-700/80 text-zinc-900 dark:text-[#eceeed]"
                  : "bg-transparent hover:bg-zinc-100/70 dark:hover:bg-zinc-800/40 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-[#eceeed]"
              }`}
            >
              {/* Left Column: Music Note Icon + Title & Artist */}
              <div className="flex items-center gap-2.5 min-w-0 pr-2 flex-1">
                <Music2
                  className={`w-4 h-4 flex-shrink-0 transition-colors ${
                    isActive
                      ? "text-zinc-800 dark:text-zinc-200"
                      : "text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300"
                  }`}
                  aria-hidden="true"
                />

                <div className="min-w-0 flex-1">
                  <p
                    className={`text-[14px] truncate leading-snug ${
                      isActive
                        ? "text-zinc-900 dark:text-[#eceeed] font-medium"
                        : "text-zinc-800 dark:text-[#d1d5db] font-normal group-hover:text-zinc-950 dark:group-hover:text-white"
                    }`}
                  >
                    {track.title}
                  </p>
                  <p
                    className={`text-[12.5px] truncate leading-snug mt-0.5 ${
                      isActive
                        ? "text-zinc-600 dark:text-zinc-300"
                        : "text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300"
                    }`}
                  >
                    {track.artist}
                  </p>
                </div>
              </div>

              {/* Right Column: Duration + Service Buttons */}
              <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                {/* Duration */}
                <span
                  className={`font-mono text-xs tabular-nums mr-1 ${
                    isActive
                      ? "text-zinc-600 dark:text-zinc-300 font-medium"
                      : "text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300"
                  }`}
                >
                  {track.duration}
                </span>

                {/* Spotify Launch Button */}
                {track.spotifyUrl ? (
                  <a
                    href={track.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Listen to ${track.title} on Spotify`}
                    title="Listen on Spotify"
                    className="w-7 h-7 rounded-md flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/80 dark:hover:bg-zinc-700/60 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-zinc-700 dark:focus-visible:ring-zinc-200"
                  >
                    <SpotifyIcon className="w-4 h-4 flex-shrink-0" />
                  </a>
                ) : (
                  <span
                    title="Link unavailable"
                    aria-label="Spotify link unavailable"
                    className="w-7 h-7 rounded-md flex items-center justify-center text-zinc-300 dark:text-zinc-700 opacity-40 cursor-not-allowed"
                  >
                    <SpotifyIcon className="w-4 h-4 flex-shrink-0" />
                  </span>
                )}

                {/* YouTube Music Launch Button */}
                {track.youtubeMusicUrl ? (
                  <a
                    href={track.youtubeMusicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Listen to ${track.title} on YouTube Music`}
                    title="Listen on YouTube Music"
                    className="w-7 h-7 rounded-md flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/80 dark:hover:bg-zinc-700/60 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-zinc-700 dark:focus-visible:ring-zinc-200"
                  >
                    <YouTubeMusicIcon className="w-4 h-4 flex-shrink-0" />
                  </a>
                ) : (
                  <span
                    title="Link unavailable"
                    aria-label="YouTube Music link unavailable"
                    className="w-7 h-7 rounded-md flex items-center justify-center text-zinc-300 dark:text-zinc-700 opacity-40 cursor-not-allowed"
                  >
                    <YouTubeMusicIcon className="w-4 h-4 flex-shrink-0" />
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
