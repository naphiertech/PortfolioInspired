"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Captions,
  PhoneOff,
} from "lucide-react";
import { RoomHotspots, HotspotId } from "./RoomHotspots";
import { useTheme } from "@/components/ThemeProvider";
import { useNaphBotVoice } from "@/features/voice-agent/useNaphBotVoice";

const RoomObjectModal = dynamic(
  () => import("./RoomObjectModal").then((m) => m.RoomObjectModal),
  { ssr: false }
);

interface Hero3DBackgroundProps {
  isDark: boolean;
  isHomeActive?: boolean;
  onNavigate?: (tab: string) => void;
}

export type DeskClipState =
  | "typing"
  | "stretch"
  | "answer-phone"
  | "talking"
  | "hang-up";

/**
 * Exact mathematical isometric hexagon clipping path for the 988x1038 cropped room box.
 * Clips away 100% of the surrounding video background, leaving ONLY the 3D room walls
 * and concrete floor slab visible.
 */
const ISOMETRIC_BOX_CLIP =
  "polygon(50.00% 0.29%, 99.70% 25.14%, 99.70% 74.86%, 50.00% 99.71%, 0.20% 74.86%, 0.20% 25.14%)";

function formatCallDuration(totalSeconds: number): string {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  return [hrs, mins, secs].map((n) => String(n).padStart(2, "0")).join(":");
}

export function Hero3DBackground({
  isDark,
  isHomeActive = true,
  onNavigate,
}: Hero3DBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const slotARef = useRef<HTMLVideoElement>(null);
  const slotBRef = useRef<HTMLVideoElement>(null);
  const { setTheme } = useTheme();

  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVideoMounted, setIsVideoMounted] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [activeSlot, setActiveSlot] = useState<0 | 1>(0);
  const [clipState, setClipState] = useState<DeskClipState>("typing");
  const [isCallActive, setIsCallActive] = useState(false);
  const [callSeconds, setCallSeconds] = useState(0);
  const [captionsEnabled, setCaptionsEnabled] = useState(true);
  const [micMuted, setMicMuted] = useState(false);
  const [speakerMuted, setSpeakerMuted] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<HotspotId | null>(null);

  const handleVoiceThemeToggle = useCallback(
    (mode?: "dark" | "light" | "toggle") => {
      if (mode === "dark") {
        setTheme("dark");
      } else if (mode === "light") {
        setTheme("light");
      } else {
        setTheme(isDark ? "light" : "dark");
      }
    },
    [isDark, setTheme]
  );

  const {
    status: voiceStatus,
    captionText,
    captionRole,
    audioLevel,
    startVoiceCall,
    stopVoiceCall,
    notifyPhonePickedUp,
  } = useNaphBotVoice({
    micMuted,
    speakerMuted,
    onNavigateTab: onNavigate,
    onOpenHotspot: (id) => setActiveHotspot(id),
    onToggleTheme: handleVoiceThemeToggle,
  });

  const activeSlotRef = useRef<0 | 1>(0);
  const clipStateRef = useRef<DeskClipState>("typing");
  const callDesiredRef = useRef(false);
  const voiceStatusRef = useRef(voiceStatus);
  const speakerMutedRef = useRef(speakerMuted);
  const stretchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const extRef = useRef<"webm" | "mp4">("webm");

  clipStateRef.current = clipState;
  activeSlotRef.current = activeSlot;
  voiceStatusRef.current = voiceStatus;
  speakerMutedRef.current = speakerMuted;

  // Mount videos after critical LCP settle or on first user interaction (unless prefers-reduced-motion)
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const probe = document.createElement("video");
    const canWebm =
      probe.canPlayType('video/webm; codecs="vp9"') ||
      probe.canPlayType("video/webm");
    extRef.current = canWebm ? "webm" : "mp4";

    const enableVideo = () => setIsVideoMounted(true);
    const timer = setTimeout(enableVideo, 1800);

    const onInteract = () => {
      enableVideo();
      clearTimeout(timer);
    };

    window.addEventListener("pointermove", onInteract, { once: true, passive: true });
    window.addEventListener("pointerdown", onInteract, { once: true, passive: true });
    window.addEventListener("touchstart", onInteract, { once: true, passive: true });
    window.addEventListener("keydown", onInteract, { once: true, passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("pointermove", onInteract);
      window.removeEventListener("pointerdown", onInteract);
      window.removeEventListener("touchstart", onInteract);
      window.removeEventListener("keydown", onInteract);
    };
  }, []);

  // Increment call timer only once answer-phone finishes and talking begins
  useEffect(() => {
    if (!isCallActive) {
      setCallSeconds(0);
      return;
    }
    if (clipState !== "talking") {
      return;
    }
    setCallSeconds(1);
    const interval = setInterval(() => {
      setCallSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isCallActive, clipState]);

  const clearStretchTimer = useCallback(() => {
    if (stretchTimerRef.current) {
      clearTimeout(stretchTimerRef.current);
      stretchTimerRef.current = null;
    }
  }, []);

  // Double-buffered transition to a target clip without flashing blank
  const transitionToClip = useCallback((nextClip: DeskClipState) => {
    clipStateRef.current = nextClip;
    setClipState(nextClip);

    const currentSlot = activeSlotRef.current;
    const nextSlot: 0 | 1 = currentSlot === 0 ? 1 : 0;
    const incoming = nextSlot === 0 ? slotARef.current : slotBRef.current;
    const outgoing = currentSlot === 0 ? slotARef.current : slotBRef.current;

    if (!incoming) return;

    const targetSrc = `/artisan-bg/${nextClip}.${extRef.current}`;
    const shouldLoop = nextClip === "typing" || nextClip === "talking";
    incoming.loop = shouldLoop;
    incoming.muted = true;

    const commitSwap = () => {
      activeSlotRef.current = nextSlot;
      setActiveSlot(nextSlot);
      setIsVideoReady(true);
      // If entering the talking clip while NaphBot isn't speaking yet, hold on frame 0 (calm phone-at-ear pose matching answer-phone end)
      if (
        nextClip === "talking" &&
        (voiceStatusRef.current !== "speaking" || speakerMutedRef.current)
      ) {
        incoming.pause();
        incoming.currentTime = 0;
      }
      setTimeout(() => {
        if (outgoing && activeSlotRef.current === nextSlot) {
          if (!outgoing.paused) {
            outgoing.pause();
          }
          // Preload the next logical clip in the state machine into the standby slot for 0ms seamless transitions
          const preloadClip: DeskClipState =
            nextClip === "answer-phone"
              ? "talking"
              : nextClip === "talking"
              ? "hang-up"
              : nextClip === "hang-up"
              ? "typing"
              : "answer-phone";
          const preloadSrc = `/artisan-bg/${preloadClip}.${extRef.current}`;
          if (!outgoing.src.endsWith(preloadSrc)) {
            outgoing.src = preloadSrc;
            outgoing.preload = "auto";
            outgoing.load();
          }
        }
      }, 240);
    };

    const startPlayback = () => {
      incoming.currentTime = 0;
      const p = incoming.play();
      if (p !== undefined) {
        p.then(commitSwap).catch(() => {
          commitSwap();
        });
      } else {
        commitSwap();
      }
    };

    if (!incoming.src.endsWith(targetSrc)) {
      incoming.src = targetSrc;
      incoming.load();
    }

    if (incoming.readyState >= 3) {
      startPlayback();
    } else {
      const onCanPlay = () => {
        incoming.removeEventListener("canplay", onCanPlay);
        startPlayback();
      };
      incoming.addEventListener("canplay", onCanPlay, { once: true });
    }
  }, []);

  // Wait calmly on frame 0.0s (phone at ear) while user speaks or during silence; ONLY animate talking gestures when NaphBot is actively speaking
  useEffect(() => {
    if (!isVideoMounted || clipState !== "talking") return;
    const activeVideo =
      activeSlot === 0 ? slotARef.current : slotBRef.current;
    if (!activeVideo) return;

    if (voiceStatus === "speaking" && !speakerMuted) {
      const p = activeVideo.play();
      if (p !== undefined) {
        p.catch(() => {});
      }
    } else {
      activeVideo.pause();
      try {
        activeVideo.currentTime = 0;
      } catch {
        // Ignore seek if metadata not ready
      }
    }
  }, [isVideoMounted, clipState, activeSlot, voiceStatus, speakerMuted]);

  // Schedule randomized 40–70s idle stretch while typing
  const scheduleNextStretch = useCallback(() => {
    clearStretchTimer();
    if (callDesiredRef.current || clipStateRef.current !== "typing") return;
    const delayMs = 40_000 + Math.floor(Math.random() * 30_000);
    stretchTimerRef.current = setTimeout(() => {
      if (!callDesiredRef.current && clipStateRef.current === "typing") {
        transitionToClip("stretch");
      }
    }, delayMs);
  }, [clearStretchTimer, transitionToClip]);

  // Boot initial typing loop on Slot A once video is mounted
  useEffect(() => {
    if (!isVideoMounted) return;
    const firstVideo = slotARef.current;
    if (!firstVideo) return;

    const ext = extRef.current;
    firstVideo.src = `/artisan-bg/typing.${ext}`;
    firstVideo.loop = true;
    firstVideo.muted = true;
    firstVideo.load();

    const onReady = () => {
      const p = firstVideo.play();
      if (p !== undefined) {
        p.then(() => setIsVideoReady(true)).catch(() => setIsVideoReady(true));
      } else {
        setIsVideoReady(true);
      }
    };

    if (firstVideo.readyState >= 3) {
      onReady();
    } else {
      firstVideo.addEventListener("canplay", onReady, { once: true });
    }

    // Preload answer-phone into Slot B for instant call pickup
    const secondVideo = slotBRef.current;
    if (secondVideo) {
      secondVideo.src = `/artisan-bg/answer-phone.${ext}`;
      secondVideo.preload = "auto";
    }

    scheduleNextStretch();
    return () => clearStretchTimer();
  }, [isVideoMounted, scheduleNextStretch, clearStretchTimer]);

  // Handle non-looping clip completion (stretch, answer-phone, hang-up)
  const handleSlotEnded = useCallback(
    (slotIndex: 0 | 1) => {
      if (slotIndex !== activeSlotRef.current) return;
      const current = clipStateRef.current;

      if (current === "stretch") {
        if (callDesiredRef.current) {
          transitionToClip("answer-phone");
        } else {
          transitionToClip("typing");
          scheduleNextStretch();
        }
      } else if (current === "answer-phone") {
        // Pickup finished -> transition into talking state and notify voice hook that phone is at ear
        transitionToClip("talking");
        notifyPhonePickedUp();
      } else if (current === "hang-up") {
        // Hang-up finished -> return to idle typing loop
        transitionToClip("typing");
        scheduleNextStretch();
      }
    },
    [transitionToClip, scheduleNextStretch, notifyPhonePickedUp]
  );

  // Start or end the phone call state machine (locked during answer-phone and hang-up transitions)
  const handleToggleCall = useCallback(() => {
    const current = clipStateRef.current;
    // Prevent interrupting pickup (answer-phone) or hang-up animations mid-clip
    if (current === "answer-phone" || current === "hang-up") {
      return;
    }

    clearStretchTimer();

    if (!callDesiredRef.current) {
      // Start call: only allowed from typing or stretch
      callDesiredRef.current = true;
      setIsCallActive(true);
      void startVoiceCall();
      if (isVideoMounted) {
        transitionToClip("answer-phone");
      } else {
        clipStateRef.current = "talking";
        setClipState("talking");
        notifyPhonePickedUp();
      }
    } else if (current === "talking") {
      // End call: only allowed once answer-phone has finished and talking is active
      callDesiredRef.current = false;
      setIsCallActive(false);
      stopVoiceCall();
      if (isVideoMounted && isHomeActive) {
        transitionToClip("hang-up");
      } else if (isVideoMounted) {
        transitionToClip("typing");
        scheduleNextStretch();
      } else {
        clipStateRef.current = "typing";
        setClipState("typing");
      }
    }
  }, [
    clearStretchTimer,
    isHomeActive,
    isVideoMounted,
    notifyPhonePickedUp,
    scheduleNextStretch,
    startVoiceCall,
    stopVoiceCall,
    transitionToClip,
  ]);

  // 5-minute safety auto-hangup cap (matching RyBot's 300s call duration guard)
  useEffect(() => {
    if (isCallActive && callSeconds >= 300 && clipStateRef.current === "talking") {
      handleToggleCall();
    }
  }, [isCallActive, callSeconds, handleToggleCall]);

  // Subtle interactive 3D perspective tilt on mouse move
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (activeHotspot) return;
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      setTilt({
        x: -ny * 6.5,
        y: nx * 8.5,
      });
    },
    [activeHotspot]
  );

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const isPickupInProgress = clipState === "answer-phone";
  const isHangupInProgress = clipState === "hang-up";

  const statusLabel = micMuted
    ? "Muted"
    : isPickupInProgress || voiceStatus === "connecting"
    ? "Connecting..."
    : voiceStatus === "speaking"
    ? "Speaking"
    : voiceStatus === "thinking"
    ? "Thinking..."
    : "Listening";

  const isVoiceAnimating =
    !isPickupInProgress &&
    audioLevel > 0.02 &&
    ((voiceStatus === "speaking" && !speakerMuted) ||
      (voiceStatus === "listening" && !micMuted));

  const voiceControlsElement = (
    <div
      className={
        isHomeActive
          ? "mt-2 sm:mt-3 relative z-30 flex flex-col items-center justify-center min-h-[54px]"
          : "fixed bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-[45] flex flex-col items-center justify-center pointer-events-auto"
      }
    >
      {/* Live Captions (CC) Floating Overlay — anchored above the Call Bar so it never shifts the Call Bar down into the bottom Dock */}
      <AnimatePresence>
        {isCallActive && captionsEnabled && captionText && (
          <motion.div
            key="live-captions-pill"
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 z-40 w-[88vw] max-w-[360px] sm:max-w-[440px] rounded-2xl border border-[#e5e5e5] dark:border-[#2a2a2a] bg-[#fafaf9]/95 dark:bg-[#161616]/95 backdrop-blur-md px-4 py-2.5 shadow-[0_8px_28px_rgba(0,0,0,0.08)] dark:shadow-[0_10px_32px_rgba(0,0,0,0.65)] text-center pointer-events-none"
          >
            <span className="font-caveat text-sm sm:text-base text-neutral-500 dark:text-neutral-400 mr-1.5 font-semibold">
              {captionRole === "user" ? "You:" : "Naphier:"}
            </span>
            <span className="font-prime text-[11px] sm:text-xs text-[#1a1a1a] dark:text-[#e0e0e0] leading-relaxed line-clamp-2">
              {captionText}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!isCallActive ? (
          <motion.button
            key="idle-chat-button"
            type="button"
            disabled={isHangupInProgress}
            onClick={handleToggleCall}
            initial={{ opacity: 0, scale: 0.94, filter: "blur(2px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.94, filter: "blur(2px)" }}
            whileHover={isHangupInProgress ? {} : { scale: 1.03, y: -1 }}
            whileTap={isHangupInProgress ? {} : { scale: 0.96 }}
            transition={{
              duration: 0.28,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={`group relative inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-[50px] bg-black text-white dark:bg-white dark:text-black font-prime text-xs sm:text-[13px] font-semibold tracking-wide shadow-[0_4px_16px_rgba(0,0,0,0.14)] dark:shadow-[0_4px_20px_rgba(255,255,255,0.12)] transition-colors duration-200 ${
              isHangupInProgress
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-[#222222] dark:hover:bg-[#f0f0f0] cursor-pointer"
            }`}
          >
            {/* Live Mic with subtle pulse animation */}
            <motion.span
              animate={{ scale: [1, 1.14, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex items-center justify-center shrink-0"
            >
              <Mic className="size-4 shrink-0" aria-hidden="true" />
            </motion.span>

            <span className="relative z-10 select-none">Chat with NaphBot</span>
          </motion.button>
        ) : (
          <motion.div
            key="active-call-bar"
            initial={{ opacity: 0, scale: 0.94, filter: "blur(3px)", y: 4 }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)", y: 0 }}
            exit={{ opacity: 0, scale: 0.94, filter: "blur(3px)", y: 4 }}
            transition={{
              duration: 0.32,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="inline-flex items-center justify-between sm:justify-center gap-1.5 sm:gap-5 bg-white dark:bg-[#161616] border border-[#e5e5e5] dark:border-[#2a2a2a] rounded-[50px] px-2.5 sm:px-6 py-1.5 sm:py-2.5 shadow-[0_4px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_6px_30px_rgba(0,0,0,0.6)] max-w-[95vw]"
          >
            {/* 1. Call Timer */}
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.22, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-1.5 sm:gap-2 shrink-0 sm:min-w-[76px]"
            >
              <span className="size-1.5 sm:size-2 rounded-full bg-[#1a1a1a] dark:bg-[#e0e0e0] animate-pulse shrink-0" />
              <span className="font-prime text-[10px] sm:text-[13px] font-semibold tracking-wider text-[#1a1a1a] dark:text-[#e0e0e0] tabular-nums">
                {formatCallDuration(callSeconds)}
              </span>
            </motion.div>

            {/* 2. Center Live Voice Status & Reactive Audio Waveform */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.24, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-center gap-1.5 sm:gap-2.5 shrink-0 sm:min-w-[150px] px-1 sm:px-2"
            >
              <div className="flex items-center gap-0.5 sm:gap-1 h-4" aria-hidden="true">
                {[0.45, 0.78, 1.0, 0.65, 0.92, 0.55, 0.82, 0.42].map((weight, i) => {
                  const barHeight = isVoiceAnimating
                    ? Math.min(18, Math.max(3, Math.round(3 + audioLevel * weight * 15)))
                    : 3;
                  return (
                    <motion.span
                      key={i}
                      animate={{
                        height: barHeight,
                        opacity: isVoiceAnimating ? Math.min(1, 0.55 + audioLevel * 0.45) : 0.32,
                      }}
                      transition={{
                        duration: 0.07,
                        ease: "easeOut",
                      }}
                      className={`w-[2px] rounded-full transition-colors duration-150 ${
                        isVoiceAnimating
                          ? "bg-[#1a1a1a] dark:bg-[#e0e0e0]"
                          : "bg-neutral-400 dark:bg-neutral-500"
                      } ${i >= 4 ? "hidden sm:inline-block" : ""}`}
                      style={{ height: 3 }}
                    />
                  );
                })}
              </div>

              <span
                className={`font-prime text-[9px] sm:text-xs font-semibold tracking-wider sm:tracking-widest uppercase whitespace-nowrap transition-colors duration-200 ${
                  voiceStatus === "speaking"
                    ? "text-[#1a1a1a] dark:text-[#e0e0e0]"
                    : "text-neutral-500 dark:text-neutral-400"
                }`}
              >
                {statusLabel}
              </span>
            </motion.div>

            {/* 3. Right Controls Group: CC, Mic, Speaker, End Call */}
            <motion.div
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.22, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-1 sm:gap-1.5 shrink-0"
            >
              {/* CC Toggle */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                type="button"
                onClick={() => setCaptionsEnabled((prev) => !prev)}
                title="Toggle captions (CC)"
                aria-label="Toggle captions"
                className={`size-7 sm:size-10 rounded-full flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                  captionsEnabled
                    ? "bg-[#d0d0d0] dark:bg-[#3a3a3a] text-[#1a1a1a] dark:text-[#e0e0e0]"
                    : "bg-[#f5f5f5] hover:bg-[#e8e8e8] dark:bg-[#2a2a2a] dark:hover:bg-[#3a3a3a] text-[#1a1a1a] dark:text-[#e0e0e0]"
                }`}
              >
                <Captions className="size-3.5 sm:size-4" aria-hidden="true" />
              </motion.button>

              {/* Mic Mute Toggle */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                type="button"
                onClick={() => setMicMuted((prev) => !prev)}
                title={micMuted ? "Unmute microphone" : "Mute microphone"}
                aria-label="Mute microphone"
                className={`size-7 sm:size-10 rounded-full flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                  micMuted
                    ? "bg-[#d0d0d0] dark:bg-[#3a3a3a] text-[#1a1a1a] dark:text-[#e0e0e0]"
                    : "bg-[#f5f5f5] hover:bg-[#e8e8e8] dark:bg-[#2a2a2a] dark:hover:bg-[#3a3a3a] text-[#1a1a1a] dark:text-[#e0e0e0]"
                }`}
              >
                {micMuted ? (
                  <MicOff className="size-3.5 sm:size-4" aria-hidden="true" />
                ) : (
                  <Mic className="size-3.5 sm:size-4" aria-hidden="true" />
                )}
              </motion.button>

              {/* Speaker Mute Toggle */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                type="button"
                onClick={() => setSpeakerMuted((prev) => !prev)}
                title={speakerMuted ? "Unmute speaker" : "Mute audio playback"}
                aria-label="Mute speaker"
                className={`size-7 sm:size-10 rounded-full flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                  speakerMuted
                    ? "bg-[#d0d0d0] dark:bg-[#3a3a3a] text-[#1a1a1a] dark:text-[#e0e0e0]"
                    : "bg-[#f5f5f5] hover:bg-[#e8e8e8] dark:bg-[#2a2a2a] dark:hover:bg-[#3a3a3a] text-[#1a1a1a] dark:text-[#e0e0e0]"
                }`}
              >
                {speakerMuted ? (
                  <VolumeX className="size-3.5 sm:size-4" aria-hidden="true" />
                ) : (
                  <Volume2 className="size-3.5 sm:size-4" aria-hidden="true" />
                )}
              </motion.button>

              {/* End Call Button */}
              <motion.button
                whileHover={isPickupInProgress ? {} : { scale: 1.04 }}
                whileTap={isPickupInProgress ? {} : { scale: 0.96 }}
                type="button"
                disabled={isPickupInProgress}
                onClick={handleToggleCall}
                aria-label="End call"
                title={
                  isPickupInProgress
                    ? "Wait for Naphier to pick up the phone..."
                    : "End Call"
                }
                className={`inline-flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-5 h-7 sm:h-10 rounded-[50px] bg-[#222222] text-white dark:bg-white dark:text-black font-prime text-[10px] sm:text-xs font-semibold tracking-wide transition-all shrink-0 whitespace-nowrap ${
                  isPickupInProgress
                    ? "opacity-45 cursor-not-allowed"
                    : "hover:bg-[#333333] dark:hover:bg-neutral-200 cursor-pointer shadow-sm"
                }`}
              >
                <PhoneOff className="size-3 sm:size-3.5 shrink-0" aria-hidden="true" />
                <span>End Call</span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full flex flex-col justify-center items-center pointer-events-auto select-none perspective-[1000px] lg:-mt-4"
    >
      {/* Centered Constrained Isometric Room Container (~13% smaller for balanced breathing room) */}
      <div
        style={{
          transform:
            isHovered || tilt.x !== 0 || tilt.y !== 0
              ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(${
                  isHovered ? 1.02 : 1
                }, ${isHovered ? 1.02 : 1}, 1)`
              : undefined,
          transition: isHovered
            ? "transform 0.12s ease-out"
            : "transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)",
        }}
        className="relative w-[76vw] max-w-[340px] sm:max-w-[380px] md:max-w-[400px] lg:max-w-[410px] xl:max-w-[430px] 2xl:max-w-[450px] aspect-[988/1038] flex items-center justify-center group"
      >
        {/* 1. GPU-Composited Ambient Floor Shadow & Monitor Backlight Glow */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute bottom-[1%] left-[10%] right-[10%] h-[20%] rounded-full blur-2xl pointer-events-none bg-black/18 dark:bg-black/80" />
          <div
            className="absolute top-[18%] left-[48%] w-[38%] h-[28%] rounded-full blur-2xl pointer-events-none transition-opacity duration-500 opacity-35 dark:opacity-95"
            style={{ backgroundColor: "#06b6d438" }}
          />
        </div>

        {/* 2. Live 3D Isometric Room Box with Exact Polygon Clip-Path */}
        <div
          style={{
            clipPath: ISOMETRIC_BOX_CLIP,
            WebkitClipPath: ISOMETRIC_BOX_CLIP,
          }}
          className="relative w-full h-full overflow-hidden"
        >
          {/* Unified Cutout Poster (instant 0ms LCP) */}
          <picture className="absolute inset-0 w-full h-full select-none pointer-events-none dark:brightness-[0.84] dark:contrast-[1.06] dark:saturate-[0.96]">
            <source
              media="(max-width: 640px)"
              srcSet="/artisan-bg/room-light-cutout-mobile.webp"
              type="image/webp"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/artisan-bg/room-light-cutout.webp"
              alt="3D Developer Workspace"
              width={988}
              height={1038}
              fetchPriority="high"
              decoding="sync"
              className="w-full h-full object-cover select-none pointer-events-none"
            />
          </picture>

          {/* Double-Buffered Video Players for Zero-Flash State Transitions */}
          {isVideoMounted && (
            <div
              style={{
                clipPath: ISOMETRIC_BOX_CLIP,
                WebkitClipPath: ISOMETRIC_BOX_CLIP,
              }}
              className={`absolute inset-0 w-full h-full overflow-hidden pointer-events-none transition-opacity duration-300 dark:brightness-[0.84] dark:contrast-[1.06] dark:saturate-[0.96] ${
                isVideoReady ? "opacity-100" : "opacity-0"
              }`}
            >
              <video
                ref={slotARef}
                muted
                playsInline
                preload="auto"
                onEnded={() => handleSlotEnded(0)}
                aria-label="3D Developer Workspace animation stream A"
                style={{
                  clipPath: ISOMETRIC_BOX_CLIP,
                  WebkitClipPath: ISOMETRIC_BOX_CLIP,
                }}
                className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-200 ${
                  activeSlot === 0 ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              />
              <video
                ref={slotBRef}
                muted
                playsInline
                preload="auto"
                onEnded={() => handleSlotEnded(1)}
                aria-label="3D Developer Workspace animation stream B"
                style={{
                  clipPath: ISOMETRIC_BOX_CLIP,
                  WebkitClipPath: ISOMETRIC_BOX_CLIP,
                }}
                className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-200 ${
                  activeSlot === 1 ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              />
            </div>
          )}

          {/* Balanced Evening Studio Shading (Softly tames bright wall glare while keeping all 3D edges, plant, and shelf details crisp) */}
          <div
            aria-hidden="true"
            style={{
              background: [
                "radial-gradient(ellipse 68% 64% at 55% 48%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.03) 52%, rgba(8,11,16,0.24) 82%, rgba(8,11,16,0.40) 100%)",
                "linear-gradient(180deg, rgba(8,11,16,0.22) 0%, transparent 30%, transparent 82%, rgba(8,11,16,0.26) 100%)",
              ].join(", "),
            }}
            className="hidden dark:block absolute inset-0 w-full h-full pointer-events-none z-20 transition-opacity duration-300"
          />

          {/* Subtle Dark-Mode Monitor & Desk Lamp Aura Inside Room */}
          <div
            aria-hidden="true"
            style={{
              background: [
                "radial-gradient(circle at 64% 36%, #06b6d432 0%, transparent 46%)",
                "radial-gradient(circle at 46% 27%, rgba(251,191,36,0.12) 0%, transparent 34%)",
              ].join(", "),
            }}
            className="hidden dark:block absolute inset-0 w-full h-full pointer-events-none mix-blend-screen z-20"
          />
        </div>

        {/* Subpixel GPU compositing edge guard along the 0.3% unclipped margin */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 -right-px w-[2px] bg-background z-30"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 -left-px w-[2px] bg-background z-30"
        />

        {/* 2.5 Interactive Hotspots Overlay */}
        <RoomHotspots
          isDark={isDark}
          activeHotspot={activeHotspot}
          onSelectHotspot={(id) => setActiveHotspot(id)}
          onTriggerPhoneCall={handleToggleCall}
          isCallActive={isCallActive}
          isTransitionLocked={isPickupInProgress || isHangupInProgress}
        />
      </div>

      {/* 3. Voice Controls: inline on Home tab, portaled fixed above DockNav on non-Home tabs while call is active */}
      {isHomeActive
        ? voiceControlsElement
        : isCallActive && typeof document !== "undefined"
        ? createPortal(voiceControlsElement, document.body)
        : null}

      {/* 4. Interactive Object Inspector Drawer (Lazy-loaded on demand) */}
      {activeHotspot && (
        <RoomObjectModal
          hotspotId={activeHotspot}
          isDark={isDark}
          onClose={() => setActiveHotspot(null)}
          onSelectHotspot={(id) => setActiveHotspot(id)}
          isCallActive={isCallActive}
          isTransitionLocked={isPickupInProgress || isHangupInProgress}
          onToggleCall={handleToggleCall}
        />
      )}
    </div>
  );
}

export default Hero3DBackground;
