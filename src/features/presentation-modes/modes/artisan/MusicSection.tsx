"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Search,
  Shuffle,
  X,
} from "lucide-react";
import {
  DEFAULT_TRACK,
  FAVORITE_TRACKS,
  MusicDisc,
  MusicTrack,
} from "@/features/music-drawer";
import { useUISound } from "@/context/SoundContext";

interface MusicSectionProps {
  standalone?: boolean;
}

export function MusicSection({ standalone = false }: MusicSectionProps) {
  const { playClick, playHover } = useUISound();
  const [selectedTrack, setSelectedTrack] = useState<MusicTrack>(
    FAVORITE_TRACKS[0] ?? DEFAULT_TRACK
  );
  const [query, setQuery] = useState("");
  const [selectedArtist, setSelectedArtist] = useState<string>("All");

  // Top recurring artists computed strictly from FAVORITE_TRACKS
  const artistFilters = useMemo(() => {
    const counts = new Map<string, number>();
    for (const track of FAVORITE_TRACKS) {
      counts.set(track.artist, (counts.get(track.artist) ?? 0) + 1);
    }
    const topArtists = Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([artist]) => artist);
    return ["All", ...topArtists];
  }, []);

  const filteredTracks = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAVORITE_TRACKS.filter((track) => {
      const matchesArtist =
        selectedArtist === "All" || track.artist === selectedArtist;
      if (!matchesArtist) return false;
      if (!q) return true;
      return (
        track.title.toLowerCase().includes(q) ||
        track.artist.toLowerCase().includes(q)
      );
    });
  }, [query, selectedArtist]);

  const activeIndex = FAVORITE_TRACKS.findIndex(
    (t) => t.id === selectedTrack.id
  );
  const resolvedIndex = activeIndex >= 0 ? activeIndex : 0;

  const selectByOffset = (offset: number) => {
    playClick();
    const len = FAVORITE_TRACKS.length;
    const nextIdx = (resolvedIndex + offset + len) % len;
    setSelectedTrack(FAVORITE_TRACKS[nextIdx]);
  };

  const selectRandomTrack = () => {
    if (FAVORITE_TRACKS.length <= 1) return;
    playClick();
    let nextIdx = resolvedIndex;
    while (nextIdx === resolvedIndex) {
      nextIdx = Math.floor(Math.random() * FAVORITE_TRACKS.length);
    }
    setSelectedTrack(FAVORITE_TRACKS[nextIdx]);
  };

  const formatTrackNumber = (index: number) =>
    String(index + 1).padStart(2, "0");

  return (
    <div className="w-full flex flex-col items-center pt-8 sm:pt-10 pb-4 px-4 sm:px-6">
      {standalone && (
        <div className="w-full max-w-2xl pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-sans text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            <span>Back to Portfolio</span>
          </Link>
        </div>
      )}

      {/* 1. Centered Editorial Header (Matches Selected Projects & Experience) */}
      <div className="space-y-3 text-center max-w-xl px-4 pb-6">
        <h1
          id="music-page-heading"
          className="text-2xl sm:text-3xl font-mono font-semibold tracking-tight text-foreground"
        >
          Music &amp; Rotation
        </h1>
        <p className="font-sans font-medium text-sm md:text-base text-foreground/80 leading-relaxed">
          The OPM, R&amp;B, and late-night records keeping build sessions
          moving. Select any track below to cue it on the platter and launch
          on Spotify or YouTube Music.
        </p>
      </div>

      {/* 2. Centered Platter Stage (Mirrors MacBook Stage in Selected Projects) */}
      <div
        id="music-stage"
        className="w-full max-w-2xl flex flex-col items-center scroll-mt-20"
      >
        <div className="py-3 sm:py-4 flex flex-col items-center">
          <MusicDisc
            track={selectedTrack}
            className="w-[210px] sm:w-[240px]"
          />
        </div>

        {/* Active Track Caption & Platform Controls under Platter */}
        <div className="w-full pt-4 pb-6 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                TRACK {formatTrackNumber(resolvedIndex)} OF{" "}
                {String(FAVORITE_TRACKS.length).padStart(2, "0")} •{" "}
                {selectedTrack.duration}
              </span>
            </div>
            <h2 className="font-mono text-xl sm:text-2xl font-semibold tracking-tight text-foreground truncate">
              {selectedTrack.title}
            </h2>
            <p className="font-sans font-normal text-xs sm:text-sm text-foreground/80 leading-relaxed">
              {selectedTrack.artist}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => selectByOffset(-1)}
              onMouseEnter={playHover}
              aria-label="Previous track"
              className="inline-flex items-center justify-center size-8 rounded-full border border-black/12 dark:border-white/10 text-foreground/80 hover:text-foreground hover:border-black/20 dark:hover:border-white/20 hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors cursor-pointer"
            >
              <ChevronLeft className="size-3.5" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={selectRandomTrack}
              onMouseEnter={playHover}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-sans font-medium border border-black/12 dark:border-white/10 text-foreground/85 hover:text-foreground hover:border-black/20 dark:hover:border-white/20 hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors cursor-pointer"
            >
              <Shuffle className="size-3" aria-hidden="true" />
              <span>Shuffle</span>
            </button>

            <button
              type="button"
              onClick={() => selectByOffset(1)}
              onMouseEnter={playHover}
              aria-label="Next track"
              className="inline-flex items-center justify-center size-8 rounded-full border border-black/12 dark:border-white/10 text-foreground/80 hover:text-foreground hover:border-black/20 dark:hover:border-white/20 hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors cursor-pointer"
            >
              <ChevronRight className="size-3.5" aria-hidden="true" />
            </button>

            <a
              href={selectedTrack.youtubeMusicUrl}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={playHover}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-sans font-medium border border-black/12 dark:border-white/10 text-foreground/85 hover:text-foreground hover:border-black/20 dark:hover:border-white/20 hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors"
            >
              <span>YT Music</span>
              <ArrowUpRight className="size-3" aria-hidden="true" />
            </a>

            <a
              href={selectedTrack.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={playHover}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-sans font-medium bg-foreground text-background hover:opacity-90 transition-opacity"
            >
              <span>Spotify</span>
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      {/* 3. Filterable Track Index Below Platter (Mirrors Project Index & Field Notes) */}
      <section
        id="music-index"
        className="w-full max-w-2xl px-2 pt-2 space-y-4 scroll-mt-20"
      >
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-mono text-xl font-semibold tracking-wider text-foreground">
            Track Index
          </h3>
          <span className="font-sans text-xs text-muted-foreground tabular-nums">
            {filteredTracks.length}{" "}
            {filteredTracks.length === 1 ? "Track" : "Tracks"}
          </span>
        </div>

        {/* Search & Artist Filter Controls */}
        <div className="space-y-3 pb-1">
          <div className="relative">
            <Search
              className="size-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by song title or artist..."
              aria-label="Filter music tracks"
              className="w-full h-9 pl-10 pr-9 rounded-full border border-black/12 dark:border-white/10 bg-background font-sans text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-foreground/20"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search query"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {artistFilters.map((artist) => {
              const isActive = selectedArtist === artist;
              return (
                <button
                  key={artist}
                  type="button"
                  onClick={() => {
                    playClick();
                    setSelectedArtist(artist);
                  }}
                  className={`px-3 py-1 rounded-full font-sans text-xs transition-colors cursor-pointer border ${
                    isActive
                      ? "bg-foreground text-background border-foreground font-medium"
                      : "bg-transparent text-foreground/80 border-black/12 dark:border-white/10 hover:text-foreground hover:border-black/20 dark:hover:border-white/20 hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
                  }`}
                >
                  {artist}
                </button>
              );
            })}
          </div>
        </div>

        {filteredTracks.length === 0 ? (
          <div className="border-t border-b border-black/10 dark:border-white/10 px-4 py-10 text-center space-y-2.5">
            <p className="font-sans text-sm text-foreground/80">
              No tracks match &ldquo;{query}&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSelectedArtist("All");
              }}
              className="px-3.5 py-1.5 rounded-full border border-black/12 dark:border-white/10 font-sans text-xs font-medium text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="divide-y divide-black/10 dark:divide-white/10 border-t border-b border-black/10 dark:border-white/10">
            {filteredTracks.map((track) => {
              const globalIndex = FAVORITE_TRACKS.findIndex(
                (t) => t.id === track.id
              );
              const isSelected = track.id === selectedTrack.id;
              const indexStr = formatTrackNumber(
                globalIndex >= 0 ? globalIndex : 0
              );

              return (
                <div
                  key={track.id}
                  onMouseEnter={playHover}
                  onClick={() => {
                    playClick();
                    setSelectedTrack(track);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      playClick();
                      setSelectedTrack(track);
                    }
                  }}
                  className={`group flex items-center justify-between gap-4 py-3.5 px-3 transition-colors cursor-pointer select-none ${
                    isSelected
                      ? "bg-black/[0.03] dark:bg-white/[0.04]"
                      : "hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span
                      className={`font-mono text-base sm:text-lg tabular-nums transition-colors ${
                        isSelected
                          ? "text-foreground font-semibold"
                          : "text-foreground/35 group-hover:text-foreground/70"
                      }`}
                    >
                      {indexStr}
                    </span>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono text-lg sm:text-xl tracking-tight truncate transition-colors ${
                            isSelected
                              ? "text-foreground font-semibold"
                              : "text-foreground/80 group-hover:text-foreground"
                          }`}
                        >
                          {track.title}
                        </span>
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        )}
                      </div>
                      <p className="sm:hidden font-sans text-xs text-muted-foreground truncate">
                        {track.artist}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="hidden sm:inline-block font-sans text-xs text-muted-foreground truncate max-w-[160px]">
                      {track.artist}
                    </span>
                    <span className="font-sans text-xs text-muted-foreground/70 tabular-nums">
                      {track.duration}
                    </span>
                    <a
                      href={track.spotifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Listen to ${track.title} on Spotify`}
                      title="Open in Spotify"
                      className="inline-flex items-center gap-0.5 font-sans text-xs font-medium text-foreground/70 hover:text-foreground transition-colors pl-1"
                    >
                      <span className="hidden md:inline">Spotify</span>
                      <ArrowUpRight
                        className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden="true"
                      />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default MusicSection;
