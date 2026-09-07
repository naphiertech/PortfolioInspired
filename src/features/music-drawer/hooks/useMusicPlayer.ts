"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Track, MusicPlayerState, MusicPlayerActions } from "../types/music";
import { FAVORITE_TRACKS, DEFAULT_TRACK } from "../data/tracks";

export interface UseMusicPlayerReturn extends MusicPlayerState, MusicPlayerActions {
  tracks: Track[];
  formattedCurrentTime: string;
  formattedTotalDuration: string;
}

/**
 * Format raw seconds into standard MM:SS display
 */
export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/**
 * useMusicPlayer
 *
 * Dedicated audio playback hook for the Music Drawer.
 * Operates strictly via native browser HTMLAudioElement.
 * Completely independent of the portfolio's mechanical UI click sound system.
 *
 * Guaranteed:
 * - NO autoplay on initial load.
 * - Explicit user gestures required to start audio.
 * - Smooth track progression when the current song completes.
 */
export function useMusicPlayer(tracks: Track[] = FAVORITE_TRACKS): UseMusicPlayerReturn {
  const [currentTrack, setCurrentTrack] = useState<Track>(DEFAULT_TRACK);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(DEFAULT_TRACK.duration || 0);
  const [volume, setVolumeState] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const nextTrackRef = useRef<(() => void) | null>(null);

  // Initialize audio element only on the client
  useEffect(() => {
    if (typeof window === "undefined") return;

    const audio = new Audio();
    audio.preload = "metadata";
    audio.volume = 0.85;
    audio.src = DEFAULT_TRACK.src;
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
      setIsLoading(false);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      setIsLoading(false);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleWaiting = () => {
      setIsLoading(true);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    // Auto-advance to next track when finished
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      nextTrackRef.current?.();
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  const play = useCallback(async () => {
    if (!audioRef.current) return;
    try {
      setIsLoading(true);
      await audioRef.current.play();
      setIsPlaying(true);
      setIsLoading(false);
    } catch {
      // Audio playback interrupted or blocked by browser policy
      setIsPlaying(false);
      setIsLoading(false);
    }
  }, []);

  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, pause, play]);

  const selectTrack = useCallback(
    (track: Track, autoPlay: boolean = true) => {
      setCurrentTrack(track);
      setCurrentTime(0);
      if (track.duration) {
        setDuration(track.duration);
      }

      if (audioRef.current) {
        audioRef.current.src = track.src;
        audioRef.current.currentTime = 0;
        if (autoPlay) {
          audioRef.current
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));
        } else {
          setIsPlaying(false);
        }
      }
    },
    []
  );

  const handleNextTrack = useCallback(() => {
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    selectTrack(tracks[nextIndex], true);
  }, [tracks, currentTrack, selectTrack]);

  nextTrackRef.current = handleNextTrack;

  const handlePreviousTrack = useCallback(() => {
    // If playing past 3 seconds, reset to beginning of current track
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      return;
    }

    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    selectTrack(tracks[prevIndex], true);
  }, [tracks, currentTrack, selectTrack]);

  const seek = useCallback((timeInSeconds: number) => {
    if (!audioRef.current) return;
    const clamped = Math.max(0, Math.min(timeInSeconds, audioRef.current.duration || 0));
    audioRef.current.currentTime = clamped;
    setCurrentTime(clamped);
  }, []);

  const setVolume = useCallback((vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setVolumeState(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
      audioRef.current.muted = clamped === 0;
    }
    setIsMuted(clamped === 0);
  }, []);

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;
    const nextMuted = !isMuted;
    audioRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  }, [isMuted]);

  // Calculate progress ratio (0 to 1)
  const progress = duration > 0 ? Math.min(1, Math.max(0, currentTime / duration)) : 0;

  return {
    tracks,
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    progress,
    volume,
    isMuted,
    isLoading,
    formattedCurrentTime: formatTime(currentTime),
    formattedTotalDuration: currentTrack.formattedDuration || formatTime(duration),
    play,
    pause,
    togglePlay,
    selectTrack,
    nextTrack: handleNextTrack,
    previousTrack: handlePreviousTrack,
    seek,
    setVolume,
    toggleMute,
  };
}
