"use client";

import { useState, useCallback, useEffect } from "react";

export interface VisitorMemoryProfile {
  visitorId: string;
  visitorName?: string;
  roleOrCompany?: string;
  interests: string[];
  episodicNotes: string[];
  callCount: number;
  lastVisitedAt: string;
}

export interface VoiceTranscriptTurn {
  role: "user" | "assistant";
  text: string;
}

const STORAGE_KEY = "naphbot_visitor_memory_v1";
const IDB_NAME = "naphbot_memory_db";
const IDB_STORE = "visitor_profile";

function createDefaultProfile(): VisitorMemoryProfile {
  const randomId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `v_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  return {
    visitorId: randomId,
    interests: [],
    episodicNotes: [],
    callCount: 0,
    lastVisitedAt: new Date().toISOString(),
  };
}

function writeToIndexedDB(profile: VisitorMemoryProfile): void {
  if (typeof window === "undefined" || !("indexedDB" in window)) return;
  try {
    const req = window.indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE, { keyPath: "id" });
      }
    };
    req.onsuccess = () => {
      try {
        const db = req.result;
        const tx = db.transaction(IDB_STORE, "readwrite");
        tx.objectStore(IDB_STORE).put({ id: "current", ...profile });
      } catch {
        // Ignore IDB transaction errors
      }
    };
  } catch {
    // Ignore IDB open errors
  }
}

export function loadVisitorMemory(): VisitorMemoryProfile {
  if (typeof window === "undefined") {
    return createDefaultProfile();
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<VisitorMemoryProfile>;
      return {
        visitorId: parsed.visitorId || createDefaultProfile().visitorId,
        visitorName: parsed.visitorName,
        roleOrCompany: parsed.roleOrCompany,
        interests: Array.isArray(parsed.interests) ? parsed.interests : [],
        episodicNotes: Array.isArray(parsed.episodicNotes)
          ? parsed.episodicNotes
          : [],
        callCount: typeof parsed.callCount === "number" ? parsed.callCount : 0,
        lastVisitedAt: parsed.lastVisitedAt || new Date().toISOString(),
      };
    }
  } catch {
    // Ignore corrupt localStorage
  }
  const fresh = createDefaultProfile();
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  } catch {
    // Ignore storage quota errors
  }
  return fresh;
}

export function saveVisitorMemory(
  patch: Partial<VisitorMemoryProfile>
): VisitorMemoryProfile {
  const current = loadVisitorMemory();
  const mergedInterests = Array.from(
    new Set([...(current.interests || []), ...(patch.interests || [])])
  ).slice(0, 12);

  const mergedNotes = Array.from(
    new Set([...(patch.episodicNotes || []), ...(current.episodicNotes || [])])
  ).slice(0, 12);

  const next: VisitorMemoryProfile = {
    ...current,
    ...patch,
    visitorName: patch.visitorName || current.visitorName,
    roleOrCompany: patch.roleOrCompany || current.roleOrCompany,
    interests: mergedInterests,
    episodicNotes: mergedNotes,
    lastVisitedAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage quota errors
    }
    writeToIndexedDB(next);
  }
  return next;
}

/**
 * Instant client-side heuristic memory extractor so returning visitor memory works
 * even with 0ms latency or when operating without an external LLM call.
 */
function extractLocalFacts(
  transcript: VoiceTranscriptTurn[]
): Partial<VisitorMemoryProfile> {
  const userLines = transcript
    .filter((t) => t.role === "user")
    .map((t) => t.text.trim())
    .filter(Boolean);

  if (userLines.length === 0) return {};

  let visitorName: string | undefined;
  let roleOrCompany: string | undefined;
  const interests: string[] = [];
  const episodicNotes: string[] = [];

  const fullUserText = userLines.join(" ");

  const nameMatch = fullUserText.match(
    /\b(?:my name is|i am|i'm|this is|call me)\s+([A-Z][a-z]{1,18})\b/i
  );
  if (nameMatch?.[1]) {
    const candidate = nameMatch[1];
    const stopWords = new Set([
      "looking",
      "asking",
      "interested",
      "calling",
      "curious",
      "wondering",
      "here",
      "good",
      "fine",
      "great",
      "building",
      "working",
    ]);
    if (!stopWords.has(candidate.toLowerCase())) {
      visitorName =
        candidate.charAt(0).toUpperCase() + candidate.slice(1).toLowerCase();
    }
  }

  const companyMatch = fullUserText.match(
    /\b(?:i work at|i'm from|i am from|recruiter at|hiring for|founder of)\s+([A-Za-z0-9 .&-]{2,28})/i
  );
  if (companyMatch?.[1]) {
    roleOrCompany = companyMatch[1].trim();
  }

  const topicMap: Array<[RegExp, string]> = [
    [/\bmkb|rider\s*track\b/i, "MKBRiderTrack"],
    [/\basset\s*link\b/i, "AssetLink"],
    [/\bnaphix|resume\b/i, "Naphix-Resume"],
    [/\bmovie\s*stream\b/i, "MovieStream"],
    [/\bnext\.?js|react\b/i, "Next.js & React"],
    [/\bthree\.?js|3d|webgl\b/i, "3D Web & Three.js"],
    [/\bpython|fastapi|django\b/i, "Python Backend"],
    [/\bhire|hiring|job|role|freelance|contract\b/i, "Hiring / Collaboration"],
    [/\bcertificat/i, "Certifications"],
  ];

  for (const [regex, label] of topicMap) {
    if (regex.test(fullUserText)) {
      interests.push(label);
    }
  }

  const lastQuestions = userLines.slice(-2).join(" | ");
  if (lastQuestions.length > 6) {
    episodicNotes.push(
      `Asked about: "${lastQuestions.slice(0, 110)}${
        lastQuestions.length > 110 ? "..." : ""
      }"`
    );
  }

  return {
    visitorName,
    roleOrCompany,
    interests,
    episodicNotes,
  };
}

export function formatMemoryForPrompt(profile: VisitorMemoryProfile): string {
  const lines: string[] = [];
  if (profile.visitorName) {
    lines.push(`- Visitor Name: ${profile.visitorName}`);
  }
  if (profile.roleOrCompany) {
    lines.push(`- Role / Organization: ${profile.roleOrCompany}`);
  }
  if (profile.callCount > 0) {
    lines.push(`- Previous Voice Calls: ${profile.callCount}`);
  }
  if (profile.interests.length > 0) {
    lines.push(`- Known Interests: ${profile.interests.join(", ")}`);
  }
  if (profile.episodicNotes.length > 0) {
    lines.push(
      `- Past Conversation Notes: ${profile.episodicNotes.slice(0, 4).join("; ")}`
    );
  }
  if (lines.length === 0) {
    return "First-time voice caller (no prior stored memories yet).";
  }
  return lines.join("\n");
}

export function usePortfolioMemory() {
  const [memory, setMemory] = useState<VisitorMemoryProfile>(() =>
    loadVisitorMemory()
  );

  useEffect(() => {
    setMemory(loadVisitorMemory());
  }, []);

  const consolidateCallMemory = useCallback(
    async (transcript: VoiceTranscriptTurn[]) => {
      const current = loadVisitorMemory();
      const localExtracted = extractLocalFacts(transcript);

      // 1. Immediately persist local heuristic facts + increment call count (0ms latency)
      const updated = saveVisitorMemory({
        ...localExtracted,
        callCount: current.callCount + 1,
      });
      setMemory(updated);

      // 2. If meaningful conversation occurred, run non-blocking LLM consolidation in background
      if (transcript.length >= 2) {
        try {
          const res = await fetch("/api/voice-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "consolidate_memory",
              transcript,
              existingMemory: updated,
            }),
          });
          if (res.ok) {
            const data = await res.json();
            if (data?.memoryPatch) {
              const llmMerged = saveVisitorMemory(data.memoryPatch);
              setMemory(llmMerged);
            }
          }
        } catch {
          // Background consolidation is best-effort
        }
      }
    },
    []
  );

  return {
    memory,
    consolidateCallMemory,
  };
}
