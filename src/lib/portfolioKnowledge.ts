import {
  fullProjects,
  techSections,
  experiences,
  FullProjectItem,
  getProjectBySlug,
  getProjectsUsingTech,
} from "./data";
import { EDUCATION, SOCIAL_PROFILES } from "./siteConfig";
import { PortfolioPageContext, ValidatedLink } from "./portfolioContext";

/**
 * Concrete AI architecture and model configuration currently implemented in this portfolio.
 * SINGLE SOURCE OF TRUTH for AI / Model questions to eliminate hallucinations.
 */
export const CONFIGURED_AI_MODELS = {
  primaryModel: "gemini-2.5-flash",
  fallbackModel: "gemini-1.5-flash",
  provider: "Google Gemini (Generative Language API)",
  generationConfig: {
    temperature: 0.4,
    maxOutputTokens: 1200,
  },
  architecture: [
    "Layer 1: Pre-generation Intent Gate (chatIntentGate.ts) — Deny-by-default scope filtering, prompt-injection defense, zero-code enforcement.",
    "Layer 2: Relational Context Retrieval (portfolioKnowledge.ts) — Dynamic query-targeted grounding from data.ts and siteConfig.ts.",
    "Layer 3: Post-generation Output Guard (chatOutputGuard.ts) — Scanner for code blocks, HTML/XML tags, shell commands, and prompt leakage.",
  ],
  aiProjectsAndFeatures: [
    {
      title: "Portfolio Agent (Agent Folio)",
      description:
        "An interactive AI workspace allowing visitors to converse with Naphier's portfolio using natural language. Powered by Gemini 2.5 Flash with strict server-side grounding and prompt-injection defense.",
    },
    {
      title: "MKBRiderTrack Biometric Attendance",
      description:
        "Integrates biometric facial verification alongside GPS geofencing to authenticate delivery rider shift clock-ins in real time.",
    },
  ],
  aiCredentials: [
    "Google Developer Groups (GDG) Zamboanga: 'Build with AI 2026' (Credential: 440727A3)",
    "Google Developer Groups (GDG) Zamboanga: 'Build with AI Hackathon 2026'",
    "Department of Information and Communications Technology (DICT): 'Artificial Intelligence for Education: Unlocking the Power of NotebookLM' (Credential: AAR-TOD-2026-ZAM-010-193)",
    "Google Developer Groups (GDG) Zamboanga: 'Build with AI | Zamboanga Peninsula' (Credential: 6D72DF79)",
  ],
  aiToolchain: ["TensorFlow", "PyTorch", "Codex", "Gemini", "Claude", "Ollama"],
  missingClarification:
    "While TensorFlow and PyTorch are part of Naphier's AI & Machine Learning toolchain and academic background, he does not currently feature a dedicated standalone production TensorFlow project in this portfolio.",
};

/**
 * Active conversation context tracking entities across multiple turns
 */
export interface ConversationEntityState {
  activeProject?: FullProjectItem;
  activeTech?: string;
  activeTopic?: "project" | "tech" | "ai" | "experience" | "education" | "contact" | "general";
  lastUserIntent?: string;
}

/**
 * Result of the relational retrieval process for a visitor's query
 */
export interface RetrievedKnowledge {
  matchedProjects: FullProjectItem[];
  matchedTechs: string[];
  techToProjectsMap: Record<string, string[]>;
  aiContext?: typeof CONFIGURED_AI_MODELS;
  experienceItems: typeof experiences;
  educationInfo: typeof EDUCATION;
  contactInfo: typeof SOCIAL_PROFILES;
  referencedEntityNotice?: string;
  relevantLinks: ValidatedLink[];
  groundingSnippets: string[];
  missingInfoNotices: string[];
  activeEntity?: { type: "project" | "tech" | "topic"; name: string };
  groundedKnowledge: string;
  verifiedLinks: Array<{ label: string; url: string }>;
}

/**
 * Normalizes an entity search token for tolerant fuzzy/alias matching
 */
export function normalizeToken(token: string): string {
  return token.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Technology aliases dictionary mapping common visitor terms to canonical names
 */
const TECH_ALIASES: Record<string, string> = {
  postgres: "PostgreSQL",
  postgresql: "PostgreSQL",
  supabase: "Supabase",
  react: "React",
  reactjs: "React",
  next: "Next.js",
  nextjs: "Next.js",
  tailwind: "Tailwind CSS",
  tailwindcss: "Tailwind CSS",
  ts: "TypeScript",
  typescript: "TypeScript",
  js: "JavaScript",
  javascript: "JavaScript",
  node: "Node.js",
  nodejs: "Node.js",
  express: "Express.js",
  expressjs: "Express.js",
  php: "PHP",
  laravel: "Laravel",
  python: "Python",
  fastapi: "FastAPI",
  graphql: "GraphQL",
  prisma: "Prisma",
  mysql: "MySQL",
  mongodb: "MongoDB",
  firebase: "Firebase",
  tensorflow: "TensorFlow",
  pytorch: "PyTorch",
  gemini: "Gemini",
  claude: "Claude",
  ollama: "Ollama",
  codex: "Codex",
  leaflet: "Leaflet",
  dexie: "Dexie.js",
  dexiejs: "Dexie.js",
  indexeddb: "Dexie.js",
  dndkit: "@dnd-kit",
  framer: "Framer Motion",
  framermotion: "Framer Motion",
  motion: "Motion 12",
  recharts: "Recharts",
  vitest: "Vitest",
  figma: "Figma",
  docker: "Docker",
  git: "Git",
  github: "GitHub",
  vercel: "Vercel",
};

/**
 * Project aliases dictionary mapping common informal names to project slugs
 */
const PROJECT_ALIASES: Record<string, string> = {
  mkb: "mkb-ridertrack",
  ridertrack: "mkb-ridertrack",
  mkbridertrack: "mkb-ridertrack",
  rider: "mkb-ridertrack",
  logistics: "mkb-ridertrack",
  workforce: "mkb-ridertrack",
  assetlink: "assetlink",
  asset: "assetlink",
  qr: "assetlink",
  moviestream: "moviestream",
  phierplay: "moviestream",
  movie: "moviestream",
  cinema: "moviestream",
  naphix: "naphix-resume",
  naphixresume: "naphix-resume",
  resumebuilder: "naphix-resume",
  resume: "naphix-resume",
  builder: "naphix-resume",
};

/**
 * Scans conversation history to track active entities (project, technology, topic)
 */
export function extractConversationContext(
  messages: Array<{ role: string; content: string }> = []
): ConversationEntityState {
  if (!messages || messages.length === 0) {
    return {};
  }

  const state: ConversationEntityState = {};

  // Inspect the last 6 messages from most recent to oldest
  const recentMessages = messages.slice(-6).reverse();

  for (const msg of recentMessages) {
    const text = msg.content;
    const lower = text.toLowerCase();
    const normalized = lower.replace(/[^a-z0-9]/g, "");

    // 1. Check for Project reference if not yet found
    if (!state.activeProject) {
      for (const [alias, slug] of Object.entries(PROJECT_ALIASES)) {
        if (normalized.includes(alias) || lower.includes(alias)) {
          const project = getProjectBySlug(slug);
          if (project) {
            state.activeProject = project;
            state.activeTopic = "project";
            break;
          }
        }
      }

      if (!state.activeProject) {
        for (const project of fullProjects) {
          const pNorm = project.title.toLowerCase().replace(/[^a-z0-9]/g, "");
          if (lower.includes(project.slug) || normalized.includes(pNorm) || lower.includes(project.title.toLowerCase())) {
            state.activeProject = project;
            state.activeTopic = "project";
            break;
          }
        }
      }
    }

    // 2. Check for Technology reference if not yet found
    if (!state.activeTech) {
      for (const [alias, canonical] of Object.entries(TECH_ALIASES)) {
        if (new RegExp(`\\b${alias}\\b`, "i").test(lower)) {
          state.activeTech = canonical;
          if (!state.activeTopic) state.activeTopic = "tech";
          break;
        }
      }
    }

    // 3. Topic detection
    if (!state.activeTopic) {
      if (/\b(ai|model|gemini|llm|machine\s+learning|tensorflow|pytorch)\b/i.test(lower)) {
        state.activeTopic = "ai";
      } else if (/\b(work|experience|job|career|freelance|roles?)\b/i.test(lower)) {
        state.activeTopic = "experience";
      } else if (/\b(education|school|university|degree|zppsu|college)\b/i.test(lower)) {
        state.activeTopic = "education";
      } else if (/\b(contact|email|reach|hire|github|linkedin)\b/i.test(lower)) {
        state.activeTopic = "contact";
      }
    }

    if (state.activeProject && state.activeTech) {
      break;
    }
  }

  return state;
}

/**
 * Determines whether a query is an anaphoric follow-up question referencing a previous entity
 */
export function isAnaphoricFollowUp(query: string): boolean {
  const lower = query.toLowerCase().trim();
  const patterns = [
    /\b(tell\s+me\s+more|explain\s+more|elaborate|what\s+else)\s+(about\s+)?(it|that|this|the\s+project)?\b/i,
    /\b(what\s+technologies|what\s+tech|what\s+stack|what\s+tools|what\s+database|what\s+language)\s+(does\s+it|is\s+used|did\s+he\s+use)\b/i,
    /\b(can\s+i|how\s+can\s+i|where\s+can\s+i)\s+(see\s+it|view\s+it|visit\s+it|access\s+it|test\s+it|open\s+it|find\s+it)\b/i,
    /\b(is\s+it|does\s+it)\s+(live|deployed|open\s+source|on\s+github|work|using|use)\b/i,
    /\b(does\s+it\s+use|did\s+it\s+use)\s+(ai|machine\s+learning|database|auth|realtime)\b/i,
    /\b(show\s+me\s+the|give\s+me\s+the|where\s+is\s+the)\s+(link|url|website|demo|code|repo|repository)\b/i,
    /\b(who\s+was\s+it\s+for|what\s+problem\s+does\s+it\s+solve|why\s+did\s+he\s+build\s+it)\b/i,
    /\bhow\s+does\s+it\s+work\b/i,
    /\bwhat\s+are\s+its\s+features\b/i,
    /\babout\s+(that|this)\s+(one|project|app)\b/i,
  ];

  return patterns.some((p) => p.test(lower));
}

/**
 * Intelligent Relational Knowledge Retrieval Engine
 * Retrieves precise, non-hallucinated relationships and facts based on visitor query and conversation state.
 */
export function retrieveGroundedContext(
  query: string,
  history: Array<{ role: string; content: string }> = [],
  pageContext?: PortfolioPageContext
): RetrievedKnowledge {
  const lower = (query || "").toLowerCase();
  const normalizedQuery = lower.replace(/[^a-z0-9]/g, "");
  const conversationState = extractConversationContext(history);
  const isFollowUp = isAnaphoricFollowUp(lower);

  const matchedProjects: FullProjectItem[] = [];
  const matchedTechs: string[] = [];
  const techToProjectsMap: Record<string, string[]> = {};
  const relevantLinks: ValidatedLink[] = [];
  const groundingSnippets: string[] = [];
  const missingInfoNotices: string[] = [];

  // Helper to safely add project
  const addProject = (project: FullProjectItem, reason: string) => {
    if (!matchedProjects.some((p) => p.slug === project.slug)) {
      matchedProjects.push(project);
      const stack = (project.techStack || project.tags).join(", ");
      const features = project.features ? project.features.slice(0, 3).join("; ") : "Production implementation";
      groundingSnippets.push(
        `[PROJECT MATCH: ${project.title}] ${reason}\n- Tech Stack: ${stack}\n- Overview: ${project.overview}\n- Features: ${features}`
      );
      relevantLinks.push({
        label: project.title,
        href: `/projects/${project.slug}`,
        isExternal: false,
      });
      if (project.live) {
        relevantLinks.push({
          label: `${project.title} (Live Demo)`,
          href: project.live,
          isExternal: true,
        });
      }
    }
  };

  // 1. Check Page Context First (if currently on a specific detail page)
  if (pageContext?.projectSlug) {
    const pageProject = getProjectBySlug(pageContext.projectSlug);
    if (pageProject) {
      addProject(pageProject, `Visitor is currently browsing this project's detail page (${pageContext.pathname}).`);
    }
  }

  // 2. Anaphora / Relative Follow-up Resolution
  let referencedEntityNotice: string | undefined;
  if (isFollowUp && conversationState.activeProject) {
    const targetProject = conversationState.activeProject;
    referencedEntityNotice = `The visitor is asking a follow-up question ("${query}") referring to "${targetProject.title}". Answer directly about "${targetProject.title}".`;
    addProject(targetProject, `Resolved from multi-turn conversation context as active entity.`);
  }

  // 3. Direct Project Recognition
  for (const [alias, slug] of Object.entries(PROJECT_ALIASES)) {
    if (normalizedQuery.includes(alias) || new RegExp(`\\b${alias}\\b`, "i").test(lower)) {
      const project = getProjectBySlug(slug);
      if (project) {
        addProject(project, `Explicitly mentioned project name/alias "${alias}".`);
      }
    }
  }

  for (const project of fullProjects) {
    const pNorm = project.title.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (lower.includes(project.slug) || normalizedQuery.includes(pNorm) || lower.includes(project.title.toLowerCase())) {
      addProject(project, `Explicitly matched project title or slug.`);
    }
  }

  // 4. Technology Recognition & Technology -> Projects Resolution
  for (const [alias, canonical] of Object.entries(TECH_ALIASES)) {
    if (new RegExp(`\\b${alias}\\b`, "i").test(lower)) {
      if (!matchedTechs.includes(canonical)) {
        matchedTechs.push(canonical);

        // Resolve Technology -> Projects relationship
        const matchingProjects = getProjectsUsingTech(canonical);
        techToProjectsMap[canonical] = matchingProjects.map((p) => p.title);

        if (matchingProjects.length > 0) {
          groundingSnippets.push(
            `[TECH RELATIONSHIP] Technology "${canonical}" is used in: ${matchingProjects.map((p) => p.title).join(", ")}.`
          );
          matchingProjects.forEach((p) =>
            addProject(p, `Connected to mentioned technology "${canonical}".`)
          );
        } else {
          groundingSnippets.push(
            `[TECH TOOLCHAIN] Technology "${canonical}" is in Naphier's technical toolchain (data.ts), but no dedicated standalone production project is featured for it.`
          );
        }
      }
    }
  }

  // 5. AI / Model Query Handling (Explicit, Truthful, Non-Hallucinated)
  let aiContext: typeof CONFIGURED_AI_MODELS | undefined;
  const isAiQuery =
    /\b(ai|model|models|gemini|llm|machine\s+learning|tensorflow|pytorch|claude|ollama|codex|notebooklm|artificial\s+intelligence)\b/i.test(
      lower
    ) || conversationState.activeTopic === "ai";

  if (isAiQuery) {
    aiContext = CONFIGURED_AI_MODELS;

    groundingSnippets.push(`[AUTHORITATIVE AI CONFIGURATION]
- Actual Portfolio Agent Model: "${CONFIGURED_AI_MODELS.primaryModel}" (with fallback to "${CONFIGURED_AI_MODELS.fallbackModel}").
- Agent Folio Portfolio Agent: Grounded conversational AI assistant running on Google Gemini 2.5 Flash.
- Architecture: 3-tier bounded pipeline (chatIntentGate.ts pre-generation gate, portfolioKnowledge.ts retrieval, chatOutputGuard.ts output scanner).
- Biometric Face Verification: Built into MKBRiderTrack for rider shift attendance verification.
- Certifications: GDG Build with AI 2026 (Code: 440727A3), DICT NotebookLM for Education (Code: AAR-TOD-2026-ZAM-010-193).
- Toolchain: ${CONFIGURED_AI_MODELS.aiToolchain.join(", ")}.
- Important Boundary: ${CONFIGURED_AI_MODELS.missingClarification}
- Model Guardrail: NEVER guess or fabricate unconfigured model versions. Do not cite unconfigured model versions.`);

    if (lower.includes("tensorflow")) {
      missingInfoNotices.push(
        "TensorFlow is listed in his AI & Machine Learning skills and academic background, but there is no standalone public production project featured for it in this portfolio."
      );
    }

    if (lower.includes("gemini") || lower.includes("model")) {
      groundingSnippets.push(
        `Exact Model Answer: Naphier's interactive portfolio agent is powered by Google Gemini 2.5 Flash (gemini-2.5-flash) with graceful fallback to Gemini 1.5 Flash (gemini-1.5-flash). NEVER guess or fabricate unconfigured model versions.`
      );
    }
  }

  // 6. Backend Stack Query Handling
  if (/\b(backend|server|api|database|databases|stack)\b/i.test(lower)) {
    const backendSection = techSections.find((s) => s.title === "Backend");
    const dbSection = techSections.find((s) => s.title === "Databases & Cloud");
    groundingSnippets.push(`[BACKEND STACK & ARCHITECTURE]
- Backend Languages & Frameworks: ${backendSection?.items.join(", ") || "Node.js, Express.js, PHP, Laravel, Python, FastAPI, GraphQL, Prisma"}.
- Databases & Cloud: ${dbSection?.items.join(", ") || "Supabase, PostgreSQL, MySQL, MongoDB, Firebase"}.
- Core Backend Projects: MKBRiderTrack (Supabase PostgreSQL, strict Row Level Security, Dexie.js offline-first sync), AssetLink (Supabase PostgreSQL with RLS and dynamic QR code asset tags).`);
  }

  // 7. General Fallback: If no specific project was identified, include featured projects
  if (matchedProjects.length === 0) {
    fullProjects.forEach((p) => {
      relevantLinks.push({
        label: p.title,
        href: `/projects/${p.slug}`,
        isExternal: false,
      });
    });
  }

  const verifiedLinks: Array<{ label: string; url: string }> = relevantLinks.map((l) => ({
    label: l.label,
    url: l.href,
  }));

  const combinedBlocks: string[] = [];
  if (referencedEntityNotice) {
    combinedBlocks.push(referencedEntityNotice);
  }
  if (groundingSnippets.length > 0) {
    combinedBlocks.push(groundingSnippets.join("\n\n"));
  }
  if (missingInfoNotices.length > 0) {
    combinedBlocks.push(
      `[EXPLICIT BOUNDARIES & MISSING INFORMATION]\n${missingInfoNotices.map((n) => `- ${n}`).join("\n")}`
    );
  }
  if (verifiedLinks.length > 0) {
    combinedBlocks.push(
      `[VERIFIED INTERNAL & EXTERNAL LINKS]\n${verifiedLinks.map((l) => `- [${l.label}](${l.url})`).join("\n")}`
    );
  }

  const groundedKnowledge = combinedBlocks.join("\n\n");

  let activeEntity: { type: "project" | "tech" | "topic"; name: string } | undefined;
  if (conversationState.activeProject) {
    activeEntity = { type: "project", name: conversationState.activeProject.title };
  } else if (conversationState.activeTech) {
    activeEntity = { type: "tech", name: conversationState.activeTech };
  } else if (conversationState.activeTopic) {
    activeEntity = { type: "topic", name: conversationState.activeTopic };
  }

  return {
    matchedProjects,
    matchedTechs,
    techToProjectsMap,
    aiContext,
    experienceItems: experiences,
    educationInfo: EDUCATION,
    contactInfo: SOCIAL_PROFILES,
    referencedEntityNotice,
    relevantLinks,
    groundingSnippets,
    missingInfoNotices,
    activeEntity,
    groundedKnowledge,
    verifiedLinks,
  };
}
