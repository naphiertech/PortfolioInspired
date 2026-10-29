"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { HotspotId } from "@/features/presentation-modes/modes/artisan/RoomHotspots";
import {
  usePortfolioMemory,
  formatMemoryForPrompt,
  saveVisitorMemory,
  VoiceTranscriptTurn,
} from "./usePortfolioMemory";

export type VoiceAgentStatus =
  | "idle"
  | "connecting"
  | "listening"
  | "thinking"
  | "speaking"
  | "error";

interface UseNaphBotVoiceOptions {
  micMuted: boolean;
  speakerMuted: boolean;
  activeTab?: string;
  activeHotspot?: HotspotId | null;
  onNavigateTab?: (tab: string) => void;
  onOpenHotspot?: (id: HotspotId) => void;
  onToggleTheme?: (mode?: "dark" | "light" | "toggle") => void;
}

interface SectionDestination {
  tab: "home" | "about" | "experience" | "projects" | "notes";
  sectionId: string;
  label: string;
}

const SECTION_DESTINATIONS: Record<string, SectionDestination> = {
  work: { tab: "experience", sectionId: "work", label: "Work Experience timeline" },
  timeline: { tab: "experience", sectionId: "work", label: "Work Experience timeline" },
  jobs: { tab: "experience", sectionId: "work", label: "Work Experience timeline" },
  "tech-stack": { tab: "experience", sectionId: "tech-stack", label: "Skills & Tech Stack" },
  skills: { tab: "experience", sectionId: "tech-stack", label: "Skills & Tech Stack" },
  stack: { tab: "experience", sectionId: "tech-stack", label: "Skills & Tech Stack" },
  technologies: { tab: "experience", sectionId: "tech-stack", label: "Skills & Tech Stack" },
  certifications: { tab: "experience", sectionId: "certifications", label: "Certifications" },
  certificates: { tab: "experience", sectionId: "certifications", label: "Certifications" },
  credentials: { tab: "experience", sectionId: "certifications", label: "Certifications" },
  education: { tab: "experience", sectionId: "education", label: "Education" },
  school: { tab: "experience", sectionId: "education", label: "Education" },
  "about-bio": { tab: "about", sectionId: "about-bio", label: "About Bio" },
  bio: { tab: "about", sectionId: "about-bio", label: "About Bio" },
  story: { tab: "about", sectionId: "about-bio", label: "About Bio" },
  "about-gear": { tab: "about", sectionId: "about-gear", label: "Workspace & Gear" },
  gear: { tab: "about", sectionId: "about-gear", label: "Workspace & Gear" },
  setup: { tab: "about", sectionId: "about-gear", label: "Workspace & Gear" },
  workspace: { tab: "about", sectionId: "about-gear", label: "Workspace & Gear" },
  hardware: { tab: "about", sectionId: "about-gear", label: "Workspace & Gear" },
  "about-moments": { tab: "about", sectionId: "about-moments", label: "Moments & Memories Gallery" },
  moments: { tab: "about", sectionId: "about-moments", label: "Moments & Memories Gallery" },
  memories: { tab: "about", sectionId: "about-moments", label: "Moments & Memories Gallery" },
  gallery: { tab: "about", sectionId: "about-moments", label: "Moments & Memories Gallery" },
  photos: { tab: "about", sectionId: "about-moments", label: "Moments & Memories Gallery" },
  "about-philosophy": { tab: "about", sectionId: "about-philosophy", label: "How I Build Philosophy" },
  philosophy: { tab: "about", sectionId: "about-philosophy", label: "How I Build Philosophy" },
  principles: { tab: "about", sectionId: "about-philosophy", label: "How I Build Philosophy" },
  "projects-stage": { tab: "projects", sectionId: "projects-stage", label: "Projects MacBook Stage" },
  "projects-index": { tab: "projects", sectionId: "projects-index", label: "Projects Index" },
  "notes-list": { tab: "notes", sectionId: "notes-list", label: "Field Notes Archive" },
};

const TAB_SECTIONS: Record<string, string[]> = {
  experience: ["work", "tech-stack", "certifications", "education"],
  about: ["about-bio", "about-gear", "about-moments", "about-philosophy"],
  projects: ["projects-stage", "projects-index"],
  notes: ["notes-list"],
  home: [],
};

const TAB_CONTENT_SUMMARY: Record<string, string> = {
  home: "Interactive 3D developer workspace, bio intro, Let's Talk contact menu, Core Stack pills, and Certifications preview.",
  about: "Sections: #about-bio (Profile & bio), #about-gear (Workspace & Gear: ASUS Vivobook 16, Mloong MX301, Z-G61 Mechanical, AI/Dev tools), #about-moments (Moments & Memories photo gallery), #about-philosophy (How I Build principles).",
  experience: "Sections: #work (Work Experience timeline), #tech-stack (Categorized Skills & Tech Stack), #certifications (Verified Google & DICT Certifications), #education (BSIT at ZPPSU).",
  projects: "Sections: #projects-stage (Interactive MacBook Pro preview stage), #projects-index (Full project archive: MKBRiderTrack, AssetLink, MovieStream, Naphix Résumé).",
  notes: "Sections: #notes-list (Engineering Field Notes & Journal essays).",
};

interface SpeechRecognitionAlternativeLike {
  transcript: string;
}

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  0: SpeechRecognitionAlternativeLike;
  length: number;
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: SpeechRecognitionResultLike;
  };
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onerror: ((e: { error?: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

function stripMarkdownForSpeech(raw: string): string {
  return raw
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`~#>]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Keeps live captions concise by showing the latest spoken sentence/clause window
 * so the caption pill never grows into a tall multi-paragraph block.
 */
function formatRollingCaption(raw: string): string {
  const clean = stripMarkdownForSpeech(raw);
  if (clean.length <= 155) return clean;
  const sentences = clean.match(/[^.!?]+[.!?]*/g)?.map((s) => s.trim()).filter(Boolean) || [clean];
  if (sentences.length >= 2) {
    const lastTwo = sentences.slice(-2).join(" ");
    if (lastTwo.length <= 170) return lastTwo;
    const lastOne = sentences[sentences.length - 1];
    if (lastOne.length <= 170) return lastOne;
  }
  return "…" + clean.slice(-150).replace(/^\S+\s/, "");
}

function downsampleTo16kHz(
  inputBuffer: Float32Array,
  inputSampleRate: number
): Float32Array {
  if (inputSampleRate === 16000) {
    return inputBuffer;
  }
  const ratio = inputSampleRate / 16000;
  const newLength = Math.max(1, Math.round(inputBuffer.length / ratio));
  const result = new Float32Array(newLength);
  let offsetResult = 0;
  let offsetBuffer = 0;
  while (offsetResult < result.length) {
    const nextOffsetBuffer = Math.min(
      inputBuffer.length,
      Math.round((offsetResult + 1) * ratio)
    );
    let accum = 0;
    let count = 0;
    for (let i = offsetBuffer; i < nextOffsetBuffer; i++) {
      accum += inputBuffer[i];
      count++;
    }
    result[offsetResult] = count > 0 ? accum / count : 0;
    offsetResult++;
    offsetBuffer = nextOffsetBuffer;
  }
  return result;
}

function floatTo16BitPCMBase64(float32Array: Float32Array): string {
  const buffer = new ArrayBuffer(float32Array.length * 2);
  const view = new DataView(buffer);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function base64PCM24kToFloat32(base64: string): Float32Array {
  const binary = window.atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const view = new DataView(bytes.buffer);
  const sampleCount = Math.floor(bytes.byteLength / 2);
  const float32 = new Float32Array(sampleCount);
  for (let i = 0; i < sampleCount; i++) {
    const int16 = view.getInt16(i * 2, true);
    float32[i] = int16 / 32768;
  }
  return float32;
}

export function useNaphBotVoice({
  micMuted,
  speakerMuted,
  activeTab = "home",
  activeHotspot = null,
  onNavigateTab,
  onOpenHotspot,
  onToggleTheme,
}: UseNaphBotVoiceOptions) {
  const { memory, consolidateCallMemory } = usePortfolioMemory();

  const [status, setStatus] = useState<VoiceAgentStatus>("idle");
  const [captionText, setCaptionText] = useState<string>("");
  const [captionRole, setCaptionRole] = useState<"user" | "assistant">(
    "assistant"
  );
  const [audioLevel, setAudioLevel] = useState<number>(0);

  const isActiveRef = useRef(false);
  const micMutedRef = useRef(micMuted);
  const speakerMutedRef = useRef(speakerMuted);
  const activeTabRef = useRef(activeTab);
  const activeHotspotRef = useRef<HotspotId | null>(activeHotspot);
  const completedActionsRef = useRef<string[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextPlayTimeRef = useRef<number>(0);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const transcriptRef = useRef<VoiceTranscriptTurn[]>([]);
  const pickupReadyRef = useRef(false);
  const pendingGreetingTriggerRef = useRef<(() => void) | null>(null);
  const userUtteranceBufRef = useRef<string>("");
  const botUtteranceBufRef = useRef<string>("");
  const turnIdRef = useRef<number>(0);
  const activeAbortRef = useRef<AbortController | null>(null);
  const bargeInFramesRef = useRef<number>(0);
  const outputAnalyserRef = useRef<AnalyserNode | null>(null);
  const micAnalyserRef = useRef<AnalyserNode | null>(null);
  const levelTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  micMutedRef.current = micMuted;
  speakerMutedRef.current = speakerMuted;
  activeTabRef.current = activeTab;
  activeHotspotRef.current = activeHotspot;

  const recordCompletedAction = useCallback((action: string) => {
    const prev = completedActionsRef.current;
    if (prev[prev.length - 1] !== action) {
      completedActionsRef.current = [...prev.slice(-11), action];
    }
  }, []);

  /**
   * Inspects the live DOM and shared application state to determine the open page,
   * currently visible section, scroll position, page content, and completed actions.
   */
  const getLiveWebsiteContext = useCallback(() => {
    const currentTab = activeTabRef.current || "home";
    let visibleSection: string | null = null;
    let scrollY = 0;
    let maxScroll = 0;

    if (typeof window !== "undefined" && typeof document !== "undefined") {
      scrollY = Math.round(window.scrollY || 0);
      maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const candidateIds = TAB_SECTIONS[currentTab] || [];
      const viewportAnchor = window.innerHeight * 0.35;
      let bestDistance = Number.POSITIVE_INFINITY;

      for (const id of candidateIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const isVisibleInViewport =
          rect.bottom > 60 && rect.top < window.innerHeight - 60;
        if (isVisibleInViewport) {
          const dist = Math.abs(rect.top - viewportAnchor);
          if (dist < bestDistance) {
            bestDistance = dist;
            visibleSection = id;
          }
        }
      }
      if (!visibleSection && candidateIds.length > 0) {
        visibleSection = candidateIds[0];
      }
    }

    return {
      activeTab: currentTab,
      visibleSection,
      scrollY,
      maxScroll,
      openHotspot: activeHotspotRef.current,
      pageContent: TAB_CONTENT_SUMMARY[currentTab] || TAB_CONTENT_SUMMARY.home,
      completedActions: completedActionsRef.current,
    };
  }, []);

  const stopQueuedAudio = useCallback(() => {
    for (const src of activeSourcesRef.current) {
      try {
        src.onended = null;
        src.stop();
        src.disconnect();
      } catch {
        // Ignore already stopped source
      }
    }
    activeSourcesRef.current.clear();
    if (audioCtxRef.current) {
      nextPlayTimeRef.current = audioCtxRef.current.currentTime;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setAudioLevel(0);
  }, []);

  useEffect(() => {
    if (speakerMuted) {
      stopQueuedAudio();
    }
  }, [speakerMuted, stopQueuedAudio]);

  useEffect(() => {
    if (micMuted && activeSourcesRef.current.size === 0) {
      setAudioLevel(0);
    }
  }, [micMuted]);

  /**
   * Context-aware navigation & scrolling helper:
   * - Distinguishes between page navigation, section scrolling, and relative scroll commands.
   * - If already on the target page, performs only a direct smooth scroll to the section
   *   without re-triggering page-entry animations or resetting scroll to top.
   * - Prevents redundant navigation or scrolling when the target is already open/visible.
   */
  const navigateOrScrollContextAware = useCallback(
    (rawDestination: string): { result: string; didChangeTab: boolean } => {
      const clean = rawDestination.toLowerCase().trim();
      const uiCtx = getLiveWebsiteContext();

      // 1. Check if rawDestination is formatted as "tab#section" or matches a known section key
      let sectionDest: SectionDestination | undefined;
      if (clean.includes("#")) {
        const [tabPart, hashPart] = clean.split("#");
        if (SECTION_DESTINATIONS[hashPart]) {
          sectionDest = SECTION_DESTINATIONS[hashPart];
        } else if (
          ["home", "about", "experience", "projects", "notes"].includes(tabPart) &&
          hashPart
        ) {
          sectionDest = {
            tab: tabPart as SectionDestination["tab"],
            sectionId: hashPart,
            label: hashPart,
          };
        }
      } else if (SECTION_DESTINATIONS[clean]) {
        sectionDest = SECTION_DESTINATIONS[clean];
      }

      if (sectionDest) {
        const { tab, sectionId, label } = sectionDest;
        if (uiCtx.activeTab === tab) {
          // User is ALREADY on the target page! Perform direct scroll without re-triggering tab transition
          if (typeof document !== "undefined" && typeof window !== "undefined") {
            const el = document.getElementById(sectionId);
            if (el) {
              const rect = el.getBoundingClientRect();
              const isAlreadyAtSection =
                rect.top >= -32 &&
                rect.top <= Math.min(220, window.innerHeight * 0.35);
              if (isAlreadyAtSection) {
                return {
                  result: `Visitor is already on the ${tab} page viewing ${label} (#${sectionId}). Kept current position without redundant scrolling or animations.`,
                  didChangeTab: false,
                };
              }
              el.scrollIntoView({ behavior: "smooth", block: "start" });
              recordCompletedAction(`scroll:${tab}#${sectionId}`);
              return {
                result: `Smoothly scrolled directly to ${label} (#${sectionId}) from current scroll position on the ${tab} page without replaying page transitions.`,
                didChangeTab: false,
              };
            }
          }
          onNavigateTab?.(`${tab}#${sectionId}`);
          recordCompletedAction(`scroll:${tab}#${sectionId}`);
          return {
            result: `Scrolled to ${label} (#${sectionId}) on the ${tab} page.`,
            didChangeTab: false,
          };
        }

        // User is on a different page -> switch to tab and scroll to section
        activeTabRef.current = tab;
        onNavigateTab?.(`${tab}#${sectionId}`);
        recordCompletedAction(`navigate:${tab}#${sectionId}`);
        return {
          result: `Navigated from ${uiCtx.activeTab} to ${tab} and scrolled to ${label} (#${sectionId}).`,
          didChangeTab: true,
        };
      }

      // 2. Check if rawDestination is a top-level page ("home", "about", "experience", "projects", "notes")
      if (["home", "about", "experience", "projects", "notes"].includes(clean)) {
        if (uiCtx.activeTab === clean) {
          return {
            result: `Visitor is already on the ${clean} page (visible section: #${uiCtx.visibleSection || clean}, scrollY: ${uiCtx.scrollY}px). Skipped redundant page transition and preserved scroll position.`,
            didChangeTab: false,
          };
        }
        activeTabRef.current = clean;
        onNavigateTab?.(clean);
        recordCompletedAction(`navigate:${clean}`);
        return {
          result: `Navigated visitor from ${uiCtx.activeTab} to the ${clean} page.`,
          didChangeTab: true,
        };
      }

      // 3. Relative scroll directions ("down", "up", "top", "bottom")
      if (typeof window !== "undefined" && typeof document !== "undefined") {
        const step = Math.round(window.innerHeight * 0.65);
        if (clean === "top") {
          if (uiCtx.scrollY <= 8) {
            return {
              result: `Already at the top of the ${uiCtx.activeTab} page.`,
              didChangeTab: false,
            };
          }
          window.scrollTo({ top: 0, behavior: "smooth" });
          recordCompletedAction(`scroll:top(${uiCtx.activeTab})`);
          return {
            result: `Scrolled to the top of the ${uiCtx.activeTab} page.`,
            didChangeTab: false,
          };
        }
        if (clean === "bottom") {
          if (uiCtx.maxScroll > 0 && uiCtx.scrollY >= uiCtx.maxScroll - 12) {
            return {
              result: `Already at the bottom of the ${uiCtx.activeTab} page.`,
              didChangeTab: false,
            };
          }
          window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "smooth",
          });
          recordCompletedAction(`scroll:bottom(${uiCtx.activeTab})`);
          return {
            result: `Scrolled to the bottom of the ${uiCtx.activeTab} page.`,
            didChangeTab: false,
          };
        }
        if (clean === "up") {
          if (uiCtx.scrollY <= 8) {
            return {
              result: `Already at the top of the ${uiCtx.activeTab} page.`,
              didChangeTab: false,
            };
          }
          window.scrollBy({ top: -step, behavior: "smooth" });
          recordCompletedAction(`scroll:up(${uiCtx.activeTab})`);
          return {
            result: `Scrolled up on the ${uiCtx.activeTab} page.`,
            didChangeTab: false,
          };
        }
        window.scrollBy({ top: step, behavior: "smooth" });
        recordCompletedAction(`scroll:down(${uiCtx.activeTab})`);
        return {
          result: `Scrolled down on the ${uiCtx.activeTab} page.`,
          didChangeTab: false,
        };
      }

      return { result: "Navigation completed.", didChangeTab: false };
    },
    [getLiveWebsiteContext, onNavigateTab, recordCompletedAction]
  );

  const executeVoiceToolIntent = useCallback(
    (name: string, args: Record<string, unknown>): string => {
      if (name === "navigate_tab") {
        const rawTab = String(args.tab || "projects").toLowerCase().trim();
        return navigateOrScrollContextAware(rawTab).result;
      } else if (name === "scroll_page") {
        const rawTarget = String(
          args.target || args.direction || "down"
        )
          .toLowerCase()
          .trim();
        return navigateOrScrollContextAware(rawTarget).result;
      } else if (name === "select_project") {
        const rawProj = String(args.project || "mkb-ridertrack")
          .toLowerCase()
          .trim();
        const openModal = Boolean(args.openModal);
        const uiCtx = getLiveWebsiteContext();
        if (uiCtx.activeTab !== "projects") {
          activeTabRef.current = "projects";
          onNavigateTab?.("projects#projects-stage");
        } else if (typeof document !== "undefined") {
          const stageEl = document.getElementById("projects-stage");
          const rect = stageEl?.getBoundingClientRect();
          if (
            stageEl &&
            rect &&
            (rect.top < -40 || rect.top > window.innerHeight * 0.45)
          ) {
            stageEl.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
        if (typeof window !== "undefined") {
          const dispatchSelect = () => {
            window.dispatchEvent(
              new CustomEvent("artisan-select-project", {
                detail: { slug: rawProj, openModal },
              })
            );
          };
          dispatchSelect();
          setTimeout(dispatchSelect, 450);
        }
        recordCompletedAction(
          `select_project:${rawProj}${openModal ? "(modal)" : ""}`
        );
        return `Selected project ${rawProj} on the Projects MacBook stage${openModal ? " and opened its Case Study modal" : ""}.`;
      } else if (name === "open_desk_object") {
        const raw = String(args.objectId || "bookshelf").toLowerCase();
        const objectId: HotspotId =
          raw.includes("monitor") || raw.includes("screen") || raw.includes("workstation")
            ? "monitors"
            : raw.includes("coffee") || raw.includes("corner") || raw.includes("mug")
            ? "desk_corner"
            : "bookshelf";
        if (activeTabRef.current !== "home") {
          activeTabRef.current = "home";
          onNavigateTab?.("home");
        }
        if (activeHotspotRef.current !== objectId) {
          activeHotspotRef.current = objectId;
          onOpenHotspot?.(objectId);
        }
        recordCompletedAction(`open_desk_object:${objectId}`);
        return `Opened ${objectId} drawer on desk.`;
      } else if (name === "open_contact_options") {
        if (activeTabRef.current !== "home") {
          activeTabRef.current = "home";
          onNavigateTab?.("home");
        }
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("artisan-open-lets-talk"));
        }
        recordCompletedAction("open_contact_options");
        return "Opened the Let's Talk contact menu on the left side of the Home screen (Email: naphiera@gmail.com, LinkedIn, X/Twitter).";
      } else if (name === "toggle_theme") {
        const mode = (args.mode as "dark" | "light" | "toggle") || "toggle";
        onToggleTheme?.(mode);
        recordCompletedAction(`toggle_theme:${mode}`);
        return `Switched theme (${mode}).`;
      } else if (name === "save_visitor_memory") {
        saveVisitorMemory({
          visitorName:
            typeof args.visitorName === "string" ? args.visitorName : undefined,
          roleOrCompany:
            typeof args.roleOrCompany === "string"
              ? args.roleOrCompany
              : undefined,
          interests:
            typeof args.interest === "string" ? [args.interest] : undefined,
          episodicNotes:
            typeof args.note === "string" ? [args.note] : undefined,
        });
        return "Saved visitor memory to browser storage.";
      }
      return "Action completed.";
    },
    [
      getLiveWebsiteContext,
      navigateOrScrollContextAware,
      onNavigateTab,
      onOpenHotspot,
      onToggleTheme,
      recordCompletedAction,
    ]
  );

  /**
   * Detect natural voice UI commands in Web Speech fallback mode
   * using live website context so we never replay transitions when already on the target page.
   */
  const tryExecuteLocalVoiceCommand = useCallback(
    (utterance: string): string | null => {
      const lower = utterance.toLowerCase();
      const uiCtx = getLiveWebsiteContext();

      // Check specific section targets BEFORE generic "scroll down" so "now go down to skills" scrolls to #tech-stack!
      if (
        /\b(go|scroll|move|jump|head|take me|show|open|view)\b.*\b(skills|tech stack|stack)\b/.test(
          lower
        )
      ) {
        const wasOnExp = uiCtx.activeTab === "experience";
        navigateOrScrollContextAware("tech-stack");
        return wasOnExp
          ? "Scrolling right down to my Skills section."
          : "Opening my Experience page and scrolling to my full tech stack and skills.";
      }
      if (
        /\b(go|scroll|move|jump|head|take me|show|open|view)\b.*\b(certificate|certificates|certification|certifications)\b/.test(
          lower
        )
      ) {
        const wasOnExp = uiCtx.activeTab === "experience";
        navigateOrScrollContextAware("certifications");
        return wasOnExp
          ? "Scrolling directly to my verified certifications."
          : "Opening my Experience page and scrolling to my verified certifications.";
      }
      if (
        /\b(go|scroll|move|jump|head|take me|show|open|view)\b.*\b(education|school|university|zppsu)\b/.test(
          lower
        )
      ) {
        const wasOnExp = uiCtx.activeTab === "experience";
        navigateOrScrollContextAware("education");
        return wasOnExp
          ? "Scrolling down to my Education section."
          : "Opening my Experience page and scrolling to my Education section.";
      }
      if (
        /\b(go|scroll|move|jump|head|take me|show|open|view)\b.*\b(gear|workspace|setup|hardware)\b/.test(
          lower
        )
      ) {
        const wasOnAbout = uiCtx.activeTab === "about";
        navigateOrScrollContextAware("about-gear");
        return wasOnAbout
          ? "Scrolling right to my Workspace and Gear section—I use an ASUS Vivobook 16, an Mloong MX301 wireless mouse, and a Z-G61 60% mechanical keyboard."
          : "Opening my About page and scrolling to my Workspace and Gear—I use an ASUS Vivobook 16, an Mloong MX301 wireless mouse, and a Z-G61 60% mechanical keyboard.";
      }
      if (
        /\b(go|scroll|move|jump|head|take me|show|open|view)\b.*\b(moments|memories|gallery|photos|pictures)\b/.test(
          lower
        )
      ) {
        const wasOnAbout = uiCtx.activeTab === "about";
        navigateOrScrollContextAware("about-moments");
        return wasOnAbout
          ? "Scrolling directly to my Moments and Memories photo gallery."
          : "Opening my About page and scrolling to my Moments and Memories photo gallery.";
      }
      if (
        /\b(go|scroll|move|jump|head|take me|show|open|view)\b.*\b(philosophy|how i build|principles)\b/.test(
          lower
        )
      ) {
        const wasOnAbout = uiCtx.activeTab === "about";
        navigateOrScrollContextAware("about-philosophy");
        return wasOnAbout
          ? "Scrolling down to my How I Build engineering philosophy."
          : "Opening my About page and scrolling to my How I Build engineering philosophy.";
      }

      if (/\b(scroll down|go down|move down|further down|keep scrolling)\b/.test(lower)) {
        navigateOrScrollContextAware("down");
        return "Scrolling down for you.";
      }
      if (/\b(scroll up|go back up|move up)\b/.test(lower)) {
        navigateOrScrollContextAware("up");
        return "Scrolling back up.";
      }
      if (/\b(scroll to top|back to top|top of the page)\b/.test(lower)) {
        navigateOrScrollContextAware("top");
        return "Back at the top of the page.";
      }
      if (/\b(scroll to bottom|bottom of the page)\b/.test(lower)) {
        navigateOrScrollContextAware("bottom");
        return "Scrolled down to the bottom.";
      }
      if (
        /\b(contact|reach|email|hire|let's talk|lets talk|get in touch|social|linkedin)\b/.test(
          lower
        )
      ) {
        executeVoiceToolIntent("open_contact_options", {});
        return "You can click the Let's Talk button right here on the left—I just popped it open for you! You can also email me at naphiera@gmail.com or connect with me on LinkedIn.";
      }
      if (
        /\b(show|open|go to|take me to|view|navigate to)\b.*\b(project|projects)\b/.test(
          lower
        )
      ) {
        const wasOnProjects = uiCtx.activeTab === "projects";
        navigateOrScrollContextAware("projects");
        return wasOnProjects
          ? "We're already right here on my Projects page."
          : "Pulling up my Projects page for you right now.";
      }
      if (
        /\b(show|open|go to|take me to|view|navigate to)\b.*\b(experience|resume|career|background)\b/.test(
          lower
        )
      ) {
        const wasOnExp = uiCtx.activeTab === "experience";
        navigateOrScrollContextAware("experience");
        return wasOnExp
          ? "We're already on my Experience page."
          : "Opening my Experience page.";
      }
      if (
        /\b(show|open|go to|take me to|view|navigate to)\b.*\b(about|bio)\b/.test(
          lower
        )
      ) {
        const wasOnAbout = uiCtx.activeTab === "about";
        navigateOrScrollContextAware("about");
        return wasOnAbout
          ? "We're already right here on my About page."
          : "Opening my About page.";
      }
      if (
        /\b(show|open|go to|take me to|view|navigate to)\b.*\b(notes|field notes|articles|blog|writing)\b/.test(
          lower
        )
      ) {
        const wasOnNotes = uiCtx.activeTab === "notes";
        navigateOrScrollContextAware("notes");
        return wasOnNotes
          ? "We're already on my Field Notes page."
          : "Opening my engineering Field Notes.";
      }
      if (
        /\b(show|open|go to|take me to|view|navigate to|back to)\b.*\b(home|desk|main page)\b/.test(
          lower
        )
      ) {
        const wasOnHome = uiCtx.activeTab === "home";
        navigateOrScrollContextAware("home");
        return wasOnHome
          ? "We're already on the Home workspace."
          : "Taking you back to my 3D Home workspace.";
      }
      if (/\b(reading shelf|bookshelf)\b/.test(lower)) {
        executeVoiceToolIntent("open_desk_object", { objectId: "bookshelf" });
        return "Opening my reading shelf—it features Designing Data-Intensive Applications, Refactoring UI, Clean Code, and The Pragmatic Programmer.";
      }
      if (
        /\b(show|open|inspect|view)\b.*\b(monitor|monitors|screen|workstation)\b/.test(
          lower
        )
      ) {
        executeVoiceToolIntent("open_desk_object", { objectId: "monitors" });
        return "Opening my dual-monitor workstation details.";
      }
      if (/\b(coffee|mug|latte|desk corner)\b/.test(lower)) {
        executeVoiceToolIntent("open_desk_object", { objectId: "desk_corner" });
        return "Showing you my desk corner.";
      }
      if (/\b(dark mode|night mode)\b/.test(lower)) {
        executeVoiceToolIntent("toggle_theme", { mode: "dark" });
        return "Switched to dark mode for you.";
      }
      if (/\b(light mode|day mode)\b/.test(lower)) {
        executeVoiceToolIntent("toggle_theme", { mode: "light" });
        return "Switched to light mode for you.";
      }
      return null;
    },
    [
      executeVoiceToolIntent,
      getLiveWebsiteContext,
      navigateOrScrollContextAware,
    ]
  );

  const schedulePCM24kPlayback = useCallback((base64Audio: string) => {
    if (speakerMutedRef.current || !isActiveRef.current) return;
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const float32 = base64PCM24kToFloat32(base64Audio);
    if (float32.length === 0) return;

    setStatus("speaking");

    const audioBuffer = ctx.createBuffer(1, float32.length, 24000);
    audioBuffer.getChannelData(0).set(float32);

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    if (outputAnalyserRef.current) {
      source.connect(outputAnalyserRef.current);
    } else {
      source.connect(ctx.destination);
    }

    const startAt = Math.max(ctx.currentTime + 0.015, nextPlayTimeRef.current);
    nextPlayTimeRef.current = startAt + audioBuffer.duration;

    activeSourcesRef.current.add(source);
    source.onended = () => {
      activeSourcesRef.current.delete(source);
      if (activeSourcesRef.current.size === 0 && isActiveRef.current) {
        setAudioLevel(0);
        setStatus("listening");
      }
    };
    source.start(startAt);
  }, []);

  /**
   * Speak text via browser SpeechSynthesis (used in Web Speech fallback mode)
   */
  const speakFallbackText = useCallback(
    (text: string, onDone?: () => void) => {
      const clean = stripMarkdownForSpeech(text);
      setCaptionRole("assistant");
      setCaptionText(formatRollingCaption(clean));
      transcriptRef.current.push({ role: "assistant", text: clean });

      if (
        speakerMutedRef.current ||
        typeof window === "undefined" ||
        !("speechSynthesis" in window)
      ) {
        setStatus("listening");
        onDone?.();
        return;
      }

      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(clean);
      utter.rate = 1.04;
      utter.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const preferred =
        voices.find(
          (v) =>
            v.lang.startsWith("en") &&
            /natural|online|google|samantha|guy|aria/i.test(v.name)
        ) || voices.find((v) => v.lang.startsWith("en"));
      if (preferred) utter.voice = preferred;

      utter.onstart = () => {
        if (!isActiveRef.current) return;
        setStatus("speaking");
        setAudioLevel(0.65);
      };
      utter.onend = () => {
        if (!isActiveRef.current) return;
        setAudioLevel(0);
        setStatus("listening");
        onDone?.();
      };
      utter.onerror = () => {
        if (!isActiveRef.current) return;
        setAudioLevel(0);
        setStatus("listening");
        onDone?.();
      };

      window.speechSynthesis.speak(utter);
    },
    []
  );

  /**
   * Start Web Speech API + /api/chat voice loop (zero-cost fallback when WebSocket isn't active)
   */
  const startWebSpeechFallback = useCallback(
    (greetingText: string) => {
      if (!isActiveRef.current || typeof window === "undefined") return;

      const triggerGreeting = () => {
        if (!isActiveRef.current) return;
        speakFallbackText(greetingText);
      };

      if (pickupReadyRef.current) {
        triggerGreeting();
      } else {
        setCaptionRole("assistant");
        setCaptionText("Picking up the phone...");
        pendingGreetingTriggerRef.current = triggerGreeting;
      }

      const SpeechRecognitionCtor = (
        window as unknown as {
          SpeechRecognition?: new () => SpeechRecognitionInstance;
          webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
        }
      ).SpeechRecognition ||
        (
          window as unknown as {
            webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
          }
        ).webkitSpeechRecognition;

      if (!SpeechRecognitionCtor) {
        setStatus("listening");
        return;
      }

      const recognition = new SpeechRecognitionCtor();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      recognitionRef.current = recognition;

      recognition.onresult = async (event: SpeechRecognitionEventLike) => {
        if (!isActiveRef.current || micMutedRef.current) return;

        let interim = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          const text = res[0]?.transcript || "";
          if (res.isFinal) {
            finalTranscript += text;
          } else {
            interim += text;
          }
        }

        const interimText = interim.trim();
        if (interimText) {
          const wordCount = interimText.split(/\s+/).filter(Boolean).length;
          const isBotSpeakingOrThinking =
            Boolean(activeAbortRef.current) ||
            (typeof window !== "undefined" &&
              "speechSynthesis" in window &&
              window.speechSynthesis.speaking);

          // Prevent stray 1-word background sounds from interrupting NaphBot while speaking,
          // while keeping normal speech detection immediate when NaphBot is already listening.
          if (!isBotSpeakingOrThinking || wordCount >= 2) {
            turnIdRef.current += 1;
            if (activeAbortRef.current) {
              activeAbortRef.current.abort();
              activeAbortRef.current = null;
            }
            if (
              typeof window !== "undefined" &&
              "speechSynthesis" in window &&
              window.speechSynthesis.speaking
            ) {
              window.speechSynthesis.cancel();
            }
            setStatus("listening");
            setAudioLevel(0.45);
            setCaptionRole("user");
            setCaptionText(formatRollingCaption(interimText));
          }
        }

        const query = finalTranscript.trim();
        if (!query) return;

        // Latest-Turn-Wins: cancel any previous in-flight question
        const myTurnId = ++turnIdRef.current;
        if (activeAbortRef.current) {
          activeAbortRef.current.abort();
        }
        const abortController = new AbortController();
        activeAbortRef.current = abortController;

        stopQueuedAudio();
        setAudioLevel(0);
        setCaptionRole("user");
        setCaptionText(formatRollingCaption(query));
        transcriptRef.current.push({ role: "user", text: query });

        // 1. Check direct voice UI tool commands first
        const commandReply = tryExecuteLocalVoiceCommand(query);
        if (commandReply) {
          if (myTurnId === turnIdRef.current) {
            speakFallbackText(commandReply);
          }
          return;
        }

        // 2. Query /api/chat for grounded portfolio response (instructed to reply in first-person)
        setStatus("thinking");
        try {
          const uiCtx = getLiveWebsiteContext();
          const recentMessages = [
            {
              role: "user" as const,
              content: `[Voice Call Instruction: Answer in first-person ('I', 'my', 'me') as Naphier speaking directly on the phone in 1-2 short sentences. Current Page: "${uiCtx.activeTab}"${uiCtx.visibleSection ? `, Visible Section: "#${uiCtx.visibleSection}"` : ""}.]`,
            },
            ...transcriptRef.current
              .slice(-6)
              .map((t) => ({ role: t.role, content: t.text })),
          ];

          const pageTypeMap: Record<string, string> = {
            home: "home",
            about: "about",
            experience: "experience",
            projects: "projects",
            notes: "notes",
          };

          const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              messages: recentMessages,
              pageContext: {
                pathname: uiCtx.activeTab === "home" ? "/" : `/${uiCtx.activeTab}`,
                pageType: pageTypeMap[uiCtx.activeTab] || "home",
                title: `Artisan Portfolio - ${uiCtx.activeTab}`,
                activeTab: uiCtx.activeTab,
                visibleSection: uiCtx.visibleSection || undefined,
              },
            }),
            signal: abortController.signal,
          });

          if (!isActiveRef.current || myTurnId !== turnIdRef.current) return;
          if (res.ok) {
            const data = await res.json();
            if (!isActiveRef.current || myTurnId !== turnIdRef.current) return;
            const reply =
              data?.reply ||
              "I can tell you about my projects, my experience, or my tech stack.";
            // Keep spoken reply concise (first 2 sentences)
            const sentences =
              stripMarkdownForSpeech(reply).match(/[^.!?]+[.!?]+/g) || [
                stripMarkdownForSpeech(reply),
              ];
            const conciseReply = sentences.slice(0, 2).join(" ").trim();
            speakFallbackText(conciseReply);
          } else {
            speakFallbackText(
              "Ask me about my projects like MKBRiderTrack, AssetLink, or Naphix Résumé, or tell me to open any section."
            );
          }
        } catch (err: unknown) {
          if (err instanceof DOMException && err.name === "AbortError") {
            return;
          }
          if (isActiveRef.current && myTurnId === turnIdRef.current) {
            speakFallbackText(
              "I'm right here on the line. Ask me about my projects or my tech stack!"
            );
          }
        }
      };

      recognition.onerror = () => {
        // Keep session alive on non-fatal speech recognition pauses
      };

      recognition.onend = () => {
        if (isActiveRef.current && recognitionRef.current === recognition) {
          try {
            recognition.start();
          } catch {
            // Ignore restart race
          }
        }
      };

      try {
        recognition.start();
      } catch {
        // Ignore start error if already started
      }
    },
    [
      getLiveWebsiteContext,
      speakFallbackText,
      stopQueuedAudio,
      tryExecuteLocalVoiceCommand,
    ]
  );

  const notifyPhonePickedUp = useCallback(() => {
    pickupReadyRef.current = true;
    if (pendingGreetingTriggerRef.current) {
      const fn = pendingGreetingTriggerRef.current;
      pendingGreetingTriggerRef.current = null;
      fn();
    }
  }, []);

  const startVoiceCall = useCallback(async () => {
    if (isActiveRef.current) return;
    isActiveRef.current = true;
    pickupReadyRef.current = false;
    pendingGreetingTriggerRef.current = null;
    userUtteranceBufRef.current = "";
    botUtteranceBufRef.current = "";
    bargeInFramesRef.current = 0;
    turnIdRef.current += 1;
    transcriptRef.current = [];
    setStatus("connecting");

    const currentMemory = memory;
    const greeting = currentMemory.visitorName
      ? `Hey ${currentMemory.visitorName}, welcome back! Great to have you on the line again—what can I show you today?`
      : currentMemory.callCount > 0
      ? `Hey, welcome back to my desk! What would you like to explore today?`
      : `Hey! Naphier here—well, my AI twin NaphBot! Ask me about my projects, my tech stack, or tell me to pull up any page.`;

    setCaptionRole("assistant");
    setCaptionText("Picking up the phone...");

    try {
      // Request microphone stream and native AudioContext immediately inside user gesture
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioCtxRef.current = audioCtx;
      if (audioCtx.state === "suspended") {
        await audioCtx.resume();
      }
      nextPlayTimeRef.current = audioCtx.currentTime;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      if (!isActiveRef.current) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      mediaStreamRef.current = stream;

      // Real-time AnalyserNodes for both speaker playback and microphone voice input
      const outputAnalyser = audioCtx.createAnalyser();
      outputAnalyser.fftSize = 256;
      outputAnalyser.connect(audioCtx.destination);
      outputAnalyserRef.current = outputAnalyser;

      const micAnalyser = audioCtx.createAnalyser();
      micAnalyser.fftSize = 256;
      const micMonitorSource = audioCtx.createMediaStreamSource(stream);
      micMonitorSource.connect(micAnalyser);
      micAnalyserRef.current = micAnalyser;

      const sampleBuf = new Float32Array(outputAnalyser.fftSize);
      if (levelTimerRef.current) clearInterval(levelTimerRef.current);
      levelTimerRef.current = setInterval(() => {
        if (!isActiveRef.current) return;

        // 1. If NaphBot audio is playing and speaker is unmuted, sample actual speaker output
        if (activeSourcesRef.current.size > 0 && !speakerMutedRef.current && outputAnalyserRef.current) {
          outputAnalyserRef.current.getFloatTimeDomainData(sampleBuf);
          let sumSq = 0;
          for (let i = 0; i < sampleBuf.length; i++) {
            sumSq += sampleBuf[i] * sampleBuf[i];
          }
          const rawRms = Math.sqrt(sumSq / sampleBuf.length);
          const gated = rawRms > 0.008 ? Math.min(1, (rawRms - 0.008) * 5.2) : 0;
          setAudioLevel(gated);
          return;
        }

        // 2. Otherwise sample user microphone with noise-floor gate so silent room stays at 0
        if (!micMutedRef.current && micAnalyserRef.current) {
          micAnalyserRef.current.getFloatTimeDomainData(sampleBuf);
          let sumSq = 0;
          for (let i = 0; i < sampleBuf.length; i++) {
            sumSq += sampleBuf[i] * sampleBuf[i];
          }
          const rawRms = Math.sqrt(sumSq / sampleBuf.length);
          // Gate out ambient fan/room noise below 0.022
          const gated = rawRms > 0.022 ? Math.min(1, (rawRms - 0.022) * 7.5) : 0;
          setAudioLevel(gated);
          return;
        }

        setAudioLevel(0);
      }, 35);

      const initialUiCtx = getLiveWebsiteContext();
      const memParam = encodeURIComponent(formatMemoryForPrompt(currentMemory));
      const tabParam = encodeURIComponent(initialUiCtx.activeTab);
      const secParam = encodeURIComponent(initialUiCtx.visibleSection || "");
      const sessionRes = await fetch(
        `/api/voice-session?memory=${memParam}&tab=${tabParam}&section=${secParam}`
      );
      const sessionData = await sessionRes.json();

      if (!isActiveRef.current) return;

      if (sessionData.mode !== "gemini_live" || !sessionData.wsUrl) {
        startWebSpeechFallback(greeting);
        return;
      }

      const ws = new WebSocket(sessionData.wsUrl);
      wsRef.current = ws;

      let setupFinished = false;

      ws.onopen = () => {
        if (!isActiveRef.current) {
          ws.close();
          return;
        }

        // Model, voice, systemInstruction, and tools are server-locked inside the ephemeral auth_token
        ws.send(JSON.stringify({ setup: {} }));
      };

      ws.onmessage = async (event) => {
        if (!isActiveRef.current) return;
        try {
          const rawText =
            event.data instanceof Blob
              ? await event.data.text()
              : String(event.data);
          const msg = JSON.parse(rawText);

          if (msg.setupComplete && !setupFinished) {
            setupFinished = true;
            setStatus("listening");

            // Start streaming resampled 16kHz microphone PCM chunks
            const source = audioCtx.createMediaStreamSource(stream);
            const processor = audioCtx.createScriptProcessor(2048, 1, 1);
            // Mute scriptProcessor output so mic never feeds back to speakers
            const silentGain = audioCtx.createGain();
            silentGain.gain.value = 0;
            processorRef.current = processor;

            processor.onaudioprocess = (e) => {
              if (
                !isActiveRef.current ||
                micMutedRef.current ||
                ws.readyState !== WebSocket.OPEN
              ) {
                return;
              }
              const inputData = e.inputBuffer.getChannelData(0);

              let sumSq = 0;
              for (let i = 0; i < inputData.length; i += 8) {
                sumSq += inputData[i] * inputData[i];
              }
              const micRms = Math.min(
                1,
                Math.sqrt(sumSq / Math.max(1, inputData.length / 8)) * 5.5
              );

              // Client-side Barge-In: require sustained voice (~300ms) while NaphBot is speaking so brief background noises don't cut it off
              if (activeSourcesRef.current.size > 0) {
                if (micRms > 0.32) {
                  bargeInFramesRef.current += 1;
                  if (bargeInFramesRef.current >= 7) {
                    bargeInFramesRef.current = 0;
                    stopQueuedAudio();
                    botUtteranceBufRef.current = "";
                    setStatus("listening");
                  }
                } else {
                  bargeInFramesRef.current = Math.max(
                    0,
                    bargeInFramesRef.current - 1
                  );
                }
              } else {
                bargeInFramesRef.current = 0;
              }

              const resampled16k = downsampleTo16kHz(
                inputData,
                audioCtx.sampleRate
              );
              const base64PCM = floatTo16BitPCMBase64(resampled16k);
              ws.send(
                JSON.stringify({
                  realtimeInput: {
                    audio: {
                      mimeType: "audio/pcm;rate=16000",
                      data: base64PCM,
                    },
                  },
                })
              );
            };

            source.connect(processor);
            processor.connect(silentGain);
            silentGain.connect(audioCtx.destination);

            const sendInitialGreeting = () => {
              if (!isActiveRef.current || ws.readyState !== WebSocket.OPEN) {
                return;
              }
              setCaptionRole("assistant");
              setCaptionText(formatRollingCaption(greeting));
              ws.send(
                JSON.stringify({
                  clientContent: {
                    turns: [
                      {
                        role: "user",
                        parts: [
                          {
                            text: `The visitor just picked up the desk phone. Say this exact greeting warmly in 1 short sentence: "${greeting}"`,
                          },
                        ],
                      },
                    ],
                    turnComplete: true,
                  },
                })
              );
            };

            if (pickupReadyRef.current) {
              sendInitialGreeting();
            } else {
              pendingGreetingTriggerRef.current = sendInitialGreeting;
            }
            return;
          }

          if (msg.serverContent?.interrupted) {
            const currentWords = formatRollingCaption(
              userUtteranceBufRef.current
            )
              .split(/\s+/)
              .filter(Boolean).length;
            // Only flush NaphBot's active speech if the visitor is actually speaking (sustained mic energy or 2+ words)
            if (
              activeSourcesRef.current.size === 0 ||
              bargeInFramesRef.current >= 2 ||
              currentWords >= 2
            ) {
              stopQueuedAudio();
              botUtteranceBufRef.current = "";
              setStatus("listening");
            }
            return;
          }

          // Live input speech transcription (visitor speaking a new question)
          const inputTranscriptChunk =
            msg.serverContent?.inputTranscription?.text;
          if (typeof inputTranscriptChunk === "string" && inputTranscriptChunk) {
            userUtteranceBufRef.current += inputTranscriptChunk;
            const cleanUser = formatRollingCaption(userUtteranceBufRef.current);
            const spokenWordCount = cleanUser
              .split(/\s+/)
              .filter(Boolean).length;

            // Flush playing NaphBot audio only when visitor speaks a multi-word phrase or triggers server interruption
            if (
              spokenWordCount >= 2 &&
              (activeSourcesRef.current.size > 0 || botUtteranceBufRef.current)
            ) {
              stopQueuedAudio();
              if (botUtteranceBufRef.current.trim()) {
                transcriptRef.current.push({
                  role: "assistant",
                  text: botUtteranceBufRef.current.trim(),
                });
                botUtteranceBufRef.current = "";
              }
              setStatus("listening");
            }

            if (cleanUser && (activeSourcesRef.current.size === 0 || spokenWordCount >= 2)) {
              setCaptionRole("user");
              setCaptionText(cleanUser);
            }
          }

          // Live output speech transcription (NaphBot speaking)
          const outputTranscriptChunk =
            msg.serverContent?.outputTranscription?.text;
          if (
            typeof outputTranscriptChunk === "string" &&
            outputTranscriptChunk
          ) {
            if (userUtteranceBufRef.current.trim()) {
              // New turn starting after user spoke: flush any residual scheduled audio so this new answer plays immediately (never queued!)
              stopQueuedAudio();
              transcriptRef.current.push({
                role: "user",
                text: userUtteranceBufRef.current.trim(),
              });
              userUtteranceBufRef.current = "";
              botUtteranceBufRef.current = "";
            }
            botUtteranceBufRef.current += outputTranscriptChunk;
            const cleanBot = formatRollingCaption(botUtteranceBufRef.current);
            if (cleanBot) {
              setCaptionRole("assistant");
              setCaptionText(cleanBot);
            }
          }

          const parts = msg.serverContent?.modelTurn?.parts;
          if (Array.isArray(parts)) {
            if (userUtteranceBufRef.current.trim()) {
              // New model turn starting right after user spoke: flush any leftover audio from previous turn
              stopQueuedAudio();
              transcriptRef.current.push({
                role: "user",
                text: userUtteranceBufRef.current.trim(),
              });
              userUtteranceBufRef.current = "";
              botUtteranceBufRef.current = "";
            }
            for (const part of parts) {
              // Skip internal reasoning/thought blocks from Gemini 2.5 native audio
              if (part.text && !part.thought) {
                const clean = formatRollingCaption(part.text);
                if (clean && !botUtteranceBufRef.current) {
                  setCaptionRole("assistant");
                  setCaptionText(clean);
                }
              }
              if (
                part.inlineData?.data &&
                String(part.inlineData.mimeType || "").startsWith("audio/pcm")
              ) {
                schedulePCM24kPlayback(part.inlineData.data);
              }
            }
          }

          if (msg.serverContent?.turnComplete) {
            if (userUtteranceBufRef.current.trim()) {
              transcriptRef.current.push({
                role: "user",
                text: userUtteranceBufRef.current.trim(),
              });
              userUtteranceBufRef.current = "";
            }
            if (botUtteranceBufRef.current.trim()) {
              transcriptRef.current.push({
                role: "assistant",
                text: botUtteranceBufRef.current.trim(),
              });
              botUtteranceBufRef.current = "";
            }
          }

          const functionCalls = msg.toolCall?.functionCalls;
          if (Array.isArray(functionCalls) && functionCalls.length > 0) {
            const functionResponses = functionCalls.map(
              (fc: {
                id: string;
                name: string;
                args?: Record<string, unknown>;
              }) => {
                const result = executeVoiceToolIntent(fc.name, fc.args || {});
                const liveContext = getLiveWebsiteContext();
                return {
                  id: fc.id,
                  name: fc.name,
                  response: {
                    output: result,
                    uiContext: liveContext,
                  },
                };
              }
            );
            ws.send(
              JSON.stringify({
                toolResponse: { functionResponses },
              })
            );
          }
        } catch {
          // Ignore malformed frame
        }
      };

      ws.onerror = () => {
        if (!setupFinished && isActiveRef.current) {
          ws.close();
          startWebSpeechFallback(greeting);
        }
      };

      ws.onclose = () => {
        if (!setupFinished && isActiveRef.current) {
          startWebSpeechFallback(greeting);
        }
      };
    } catch {
      if (isActiveRef.current) {
        startWebSpeechFallback(greeting);
      }
    }
  }, [
    memory,
    getLiveWebsiteContext,
    startWebSpeechFallback,
    stopQueuedAudio,
    schedulePCM24kPlayback,
    executeVoiceToolIntent,
  ]);

  const stopVoiceCall = useCallback(() => {
    if (!isActiveRef.current) return;
    isActiveRef.current = false;
    pickupReadyRef.current = false;
    pendingGreetingTriggerRef.current = null;

    if (userUtteranceBufRef.current.trim()) {
      transcriptRef.current.push({
        role: "user",
        text: userUtteranceBufRef.current.trim(),
      });
      userUtteranceBufRef.current = "";
    }
    if (botUtteranceBufRef.current.trim()) {
      transcriptRef.current.push({
        role: "assistant",
        text: botUtteranceBufRef.current.trim(),
      });
      botUtteranceBufRef.current = "";
    }

    turnIdRef.current += 1;
    if (activeAbortRef.current) {
      activeAbortRef.current.abort();
      activeAbortRef.current = null;
    }

    if (levelTimerRef.current) {
      clearInterval(levelTimerRef.current);
      levelTimerRef.current = null;
    }
    outputAnalyserRef.current = null;
    micAnalyserRef.current = null;

    stopQueuedAudio();

    if (recognitionRef.current) {
      try {
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      } catch {
        // Ignore stop errors
      }
      recognitionRef.current = null;
    }

    if (processorRef.current) {
      try {
        processorRef.current.disconnect();
      } catch {
        // Ignore disconnect errors
      }
      processorRef.current = null;
    }

    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch {
        // Ignore close errors
      }
      wsRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }

    if (audioCtxRef.current) {
      try {
        void audioCtxRef.current.close();
      } catch {
        // Ignore close errors
      }
      audioCtxRef.current = null;
    }

    setStatus("idle");
    setCaptionText("");
    setAudioLevel(0);

    // Flush deferred memory queue (0ms local + background LLM consolidation)
    const finalTranscript = [...transcriptRef.current];
    transcriptRef.current = [];
    void consolidateCallMemory(finalTranscript);
  }, [stopQueuedAudio, consolidateCallMemory]);

  useEffect(() => {
    return () => {
      if (isActiveRef.current) {
        stopVoiceCall();
      }
    };
  }, [stopVoiceCall]);

  return {
    status,
    captionText,
    captionRole,
    audioLevel,
    memory,
    startVoiceCall,
    stopVoiceCall,
    notifyPhonePickedUp,
  };
}
