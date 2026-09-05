import { fullProjects, experiences, certifications } from "./data";
import { AUTHOR_INFO, EDUCATION, SOCIAL_PROFILES } from "./siteConfig";
import { CONFIGURED_AI_MODELS } from "./portfolioKnowledge";
import { NormalizedQuery } from "./queryNormalizer";
import { ChatMessage } from "./chatIntentGate";
import { inspectGeneratedOutput } from "./chatOutputGuard";
import { PortfolioPageContext } from "./portfolioContext";

export interface DeterministicResult {
  answered: boolean;
  reply?: string;
  source?: string;
}

/**
 * Resolves active project slug from multi-turn conversation history or current page context
 */
export function getActiveProjectFromHistory(
  history: ChatMessage[],
  pageContext?: PortfolioPageContext
): { title: string; slug: string } | null {
  for (let i = history.length - 1; i >= 0; i--) {
    const text = history[i].content.toLowerCase();
    for (const p of fullProjects) {
      if (
        text.includes(p.slug.toLowerCase()) ||
        text.includes(p.title.toLowerCase()) ||
        (p.slug === "mkb-ridertrack" && (text.includes("mkb") || text.includes("ridertrack"))) ||
        (p.slug === "assetlink" && text.includes("assetlink")) ||
        (p.slug === "moviestream" && (text.includes("moviestream") || text.includes("phierplay"))) ||
        (p.slug === "naphix-resume" && (text.includes("naphix") || text.includes("resume builder")))
      ) {
        return { title: p.title, slug: p.slug };
      }
    }
  }

  if (pageContext?.projectSlug) {
    const p = fullProjects.find((item) => item.slug === pageContext.projectSlug);
    if (p) return { title: p.title, slug: p.slug };
  }

  return null;
}

/**
 * Attempts to answer standard factual and conversational questions deterministically from verified portfolio data.
 * Does NOT call Gemini when the answer is completely known from local structured records.
 */
export function tryDeterministicAnswer(
  query: NormalizedQuery,
  history: ChatMessage[] = [],
  pageContext?: PortfolioPageContext
): DeterministicResult {
  const normText = query.normalizedText.toLowerCase();
  const intent = query.inferredIntent;
  const isShort = query.isShortQuery;
  const activeProject = getActiveProjectFromHistory(history, pageContext);

  // Helper to run through output guard
  const finalize = (rawReply: string, source: string): DeterministicResult => {
    const inspection = inspectGeneratedOutput(rawReply);
    return {
      answered: true,
      reply: inspection.sanitizedReply,
      source,
    };
  };

  // -------------------------------------------------------------
  // 1. GREETINGS & CASUAL OPENERS
  // e.g. "yo", "heyyy", "hi", "hello", "good morning", "sup"
  // -------------------------------------------------------------
  if (query.isGreeting || intent === "GREETING") {
    const rawReply = `Hello! I'm Naphier's portfolio agent.

You can ask me anything about his work:
- **Featured Projects**: [MKBRiderTrack](/projects/mkb-ridertrack), [AssetLink](/projects/assetlink), [MovieStream](/projects/moviestream), and [Naphix Resume](/projects/naphix-resume)
- **Tech Stack**: Next.js, Supabase, React 19, TypeScript, Tailwind CSS, Python, Node.js
- **AI Architecture**: Google Gemini 2.5 Flash, Biometric Facial Verification, GDG AI Credentials
- **Experience & Education**: BSIT at ZPPSU, GDG Build with AI 2026, DICT certifications

What would you like to explore?`;

    return finalize(rawReply, "deterministic-greeting");
  }

  // -------------------------------------------------------------
  // 2. AMBIGUOUS QUESTIONS (Targeted Clarification)
  // e.g. "tell me about his work" (projects vs experience)
  // -------------------------------------------------------------
  if (query.isAmbiguous && query.ambiguousCandidates) {
    if (
      query.ambiguousCandidates.includes("PROJECT_QUERY") &&
      query.ambiguousCandidates.includes("EXPERIENCE_QUERY")
    ) {
      const rawReply = `I can help with that! Do you mean Naphier's software projects (like [MKBRiderTrack](/projects/mkb-ridertrack) and [AssetLink](/projects/assetlink)) or his professional work experience?`;
      return finalize(rawReply, "deterministic-ambiguity-projects-vs-experience");
    }

    if (
      query.ambiguousCandidates.includes("PROJECT_QUERY") &&
      query.ambiguousCandidates.includes("TECHNOLOGY_QUERY")
    ) {
      const rawReply = `I can help with that! Did you want to view Naphier's projects or explore his overall technology stack?`;
      return finalize(rawReply, "deterministic-ambiguity-projects-vs-tech");
    }
  }

  // -------------------------------------------------------------
  // 3. SPECIFIC PROJECT LOOKUP (Direct Name / Alias Mentioned)
  // Check this BEFORE general projects so "tell me about mkbridertrack" matches the specific project!
  // -------------------------------------------------------------
  for (const p of fullProjects) {
    const matchesProjectDirectly =
      normText === p.slug.toLowerCase() ||
      normText === p.title.toLowerCase() ||
      normText.includes(p.slug.toLowerCase()) ||
      normText.includes(p.title.toLowerCase()) ||
      (p.slug === "mkb-ridertrack" && (normText.includes("mkb") || normText.includes("ridertrack") || normText.includes("mkbridertrack"))) ||
      (p.slug === "assetlink" && normText.includes("assetlink")) ||
      (p.slug === "moviestream" && (normText.includes("moviestream") || normText.includes("phierplay"))) ||
      (p.slug === "naphix-resume" && (normText.includes("naphix") || normText.includes("resume builder")));

    const hasExplicitProjectName =
      p.slug === "mkb-ridertrack" ? /\b(mkb|ridertrack|mkbridertrack)\b/i.test(normText) :
      p.slug === "assetlink" ? /\bassetlink\b/i.test(normText) :
      p.slug === "moviestream" ? /\b(moviestream|phierplay)\b/i.test(normText) :
      p.slug === "naphix-resume" ? /\b(naphix|naphix-resume)\b/i.test(normText) :
      normText.includes(p.slug.toLowerCase());

    if (matchesProjectDirectly && hasExplicitProjectName) {
      // Check if user is asking about tech for this specific project
      if (/\b(tech|technologies|stack|tools?|database|backend|what\s+did\s+he\s+use|built\s+with)\b/i.test(normText)) {
        const rawReply = `**[${p.title}](/projects/${p.slug})** is built with:
- **Frontend & UI**: ${p.techStack.slice(0, 3).join(", ")}
- **Backend & Database**: ${p.techStack.slice(3).join(", ") || "Next.js API routes & modern web standards"}
- **Core Focus**: ${p.overview}

[View Project Details](/projects/${p.slug})${p.live ? ` · [Live Demo](${p.live})` : ""}`;
        return finalize(rawReply, `deterministic-project-tech-${p.slug}`);
      }

      // Check if user is asking to see or demo this specific project
      if (/\b(see|view|open|visit|check|link|demo|live)\b/i.test(normText)) {
        const liveDemo = p.live ? ` or test the [Live Demo](${p.live})` : "";
        const rawReply = `You can explore [${p.title}](/projects/${p.slug}) directly in the portfolio${liveDemo}.`;
        return finalize(rawReply, `deterministic-project-nav-${p.slug}`);
      }

      // Default project overview
      const liveDemo = p.live ? ` · [Live Demo](${p.live})` : "";
      const repo = p.github ? ` · [GitHub Repository](${p.github})` : "";
      const featureList = p.features && p.features.length > 0
        ? `\n**Key Capabilities:**\n${p.features.slice(0, 3).map((f) => `- ${f}`).join("\n")}`
        : "";

      const rawReply = `**[${p.title}](/projects/${p.slug})** (${p.year})
${p.overview}
${featureList}

**Core Technologies:**
${p.techStack.join(" · ")}

[Explore Project](/projects/${p.slug})${liveDemo}${repo}`;

      return finalize(rawReply, `deterministic-project-${p.slug}`);
    }
  }

  // -------------------------------------------------------------
  // 4. MULTI-TURN CONTEXTUAL FOLLOW-UPS (Active Project in Conversation)
  // Handles: "what did he use for it?", "what did he use for that?", "does it use AI?", "where can I see it?", "tell me more", "how about the other one"
  // -------------------------------------------------------------
  if (activeProject) {
    const proj = fullProjects.find((p) => p.slug === activeProject.slug);

    // A. "How about the other one?" / "What about the other one?" / Topic switching
    if (/\b(other\s+one|next\s+one|another\s+one|another\s+project|other\s+project)\b/i.test(normText)) {
      const otherProjects = fullProjects.filter((p) => p.slug !== activeProject.slug);
      const nextProj =
        (activeProject.slug === "mkb-ridertrack"
          ? otherProjects.find((p) => p.slug === "assetlink")
          : otherProjects.find((p) => p.slug === "mkb-ridertrack")) ||
        otherProjects[0] ||
        fullProjects[0];
      const liveDemo = nextProj.live ? ` · [Live Demo](${nextProj.live})` : "";

      const rawReply = `Another standout project is **[${nextProj.title}](/projects/${nextProj.slug})** (${nextProj.year}):
${nextProj.overview}

**Core Technologies:** ${nextProj.techStack.join(", ")}

[View ${nextProj.title}](/projects/${nextProj.slug})${liveDemo}`;

      return finalize(rawReply, `deterministic-switch-project-${nextProj.slug}`);
    }

    // B. "What did he use for it?" / "What did he use for that?" / "What tech does it use?" / "tech?" / "stack?"
    if (
      /\b(what\s+did\s+he\s+use|what\s+tech|what\s+technologies|what\s+stack|what\s+tools?|what\s+database)\b/i.test(normText) ||
      normText.includes("what did he use for that") ||
      normText.includes("what did he use for it")
    ) {
      if (proj) {
        const rawReply = `For **[${proj.title}](/projects/${proj.slug})**, Naphier utilized:
- **Frontend & Interface**: ${proj.techStack.slice(0, 3).join(", ")}
- **Backend & Data**: ${proj.techStack.slice(3).join(", ") || "Next.js API routes & modern standards"}
- **Architecture**: ${proj.overview}`;

        return finalize(rawReply, `deterministic-active-project-tech-${proj.slug}`);
      }
    }

    // C. "Does it use AI?" / "Is AI used in it?"
    if (/\b(does\s+it\s+use\s+ai|is\s+ai\s+used|ai|model)\b/i.test(normText)) {
      if (activeProject.slug === "mkb-ridertrack") {
        const rawReply = `Yes! **[MKBRiderTrack](/projects/mkb-ridertrack)** incorporates **Biometric Facial Verification** alongside GPS geofencing to authenticate delivery riders during shift clock-in/out, preventing buddy punching. Cloud synchronization and audit records are managed in Supabase PostgreSQL.`;
        return finalize(rawReply, "deterministic-active-project-ai-mkb");
      } else {
        const rawReply = `**[${activeProject.title}](/projects/${activeProject.slug})** focuses primarily on ${proj?.overview || "modern full-stack architecture"} and does not use machine learning models. For Naphier's AI work, check out **[Agent Folio](/projects)** (powered by Gemini 2.5 Flash) and **[MKBRiderTrack](/projects/mkb-ridertrack)** (biometric face verification).`;
        return finalize(rawReply, `deterministic-active-project-ai-other-${activeProject.slug}`);
      }
    }

    // D. "Where can I see it?" / "Can I check the live version?" / "Can I see it?" / "Live demo?"
    if (
      /\b(can\s+i\s+see\s+it|where\s+can\s+i\s+see\s+it|check\s+the\s+live|live\s+version|demo|open|link)\b/i.test(normText) ||
      normText === "can i see it" ||
      normText === "can i seee it?" ||
      normText === "where can i see it"
    ) {
      if (proj) {
        const liveDemo = proj.live ? ` or test the [Live Demo](${proj.live})` : "";
        const rawReply = `You can explore [${proj.title}](/projects/${proj.slug}) directly inside the portfolio${liveDemo}.`;
        return finalize(rawReply, `deterministic-active-project-nav-${proj.slug}`);
      }
    }

    // E. "Tell me more" / "Elaborate" / "Why did he build it?"
    if (/\b(tell\s+me\s+more|elaborate|what\s+else|why\s+did\s+he\s+build\s+it|what\s+problem\s+does\s+it\s+solve)\b/i.test(normText)) {
      if (proj) {
        const featureBullets = proj.features?.map((f) => `- ${f}`).join("\n") || "";
        const liveDemo = proj.live ? ` · [Live Demo](${proj.live})` : "";
        const rawReply = `Here is more detail on **[${proj.title}](/projects/${proj.slug})**:
${proj.overview}

**Key Capabilities:**
${featureBullets}

**Tech Stack:** ${proj.techStack.join(", ")}

[Open Project Details](/projects/${proj.slug})${liveDemo}`;
        return finalize(rawReply, `deterministic-active-project-more-${proj.slug}`);
      }
    }

    // F. "Why did he use supabase?" (when active project or general)
    if (/\bwhy\s+did\s+he\s+use\s+supabase\b/i.test(normText)) {
      const rawReply = `Naphier chose **Supabase** because it provides an enterprise-grade PostgreSQL foundation with built-in **Row Level Security (RLS)**, real-time database subscriptions, and seamless authentication.

In **[MKBRiderTrack](/projects/mkb-ridertrack)**, it secures rider telemetry and shift records, while in **[AssetLink](/projects/assetlink)**, it manages departmental permissions and inventory audit logs.`;
      return finalize(rawReply, "deterministic-why-supabase");
    }
  }

  // -------------------------------------------------------------
  // 5. AI & GEMINI MODEL INQUIRIES
  // Evaluated BEFORE general tech stack so questions like "what Gemini model does he use?" or "gemni model?" trigger AI directly!
  // -------------------------------------------------------------
  if (
    intent === "AI_QUERY" ||
    /\b(gemini\s+model|what\s+model|which\s+model|what\s+ai\s+does\s+naphier\s+use|gemini|what\s+ai\s+stuff|does\s+he\s+use\s+ai|ai\?)\b/i.test(normText) ||
    normText === "gemni model?" ||
    normText === "gemini model?" ||
    normText === "what gemini model" ||
    normText.includes("gemini") ||
    (normText.includes("model") && !normText.includes("data model"))
  ) {
    const rawReply = `Naphier’s portfolio agent (**Agent Folio**) uses **Google Gemini 2.5 Flash** (\`${CONFIGURED_AI_MODELS.primaryModel}\`) as its primary model, with automated fallback to **Gemini 1.5 Flash** (\`${CONFIGURED_AI_MODELS.fallbackModel}\`).

**AI Implementations & Background:**
- **Agent Folio**: A bounded portfolio agent with pre-generation intent gating, relational retrieval from structured data, and an authoritative output guard.
- **MKBRiderTrack Biometrics**: Real-time biometric face verification paired with GPS geofencing for delivery rider attendance.
- **AI Certifications**: Google Developer Groups (GDG) *Build with AI 2026* and DICT *Artificial Intelligence for Education: Unlocking the Power of NotebookLM*.
- **Toolchain**: TensorFlow, PyTorch, Codex, Gemini, Claude, and Ollama.

*(Note: TensorFlow and PyTorch form part of his AI/ML academic and engineering toolchain; he does not feature a dedicated standalone production TensorFlow project in this portfolio.)*`;

    return finalize(rawReply, "deterministic-ai-model");
  }

  // -------------------------------------------------------------
  // 6. CONTACT & SOCIAL INQUIRIES
  // Evaluated BEFORE general tech stack so "where is his github?" or "github?" returns contact details!
  // -------------------------------------------------------------
  if (
    intent === "CONTACT_QUERY" ||
    /\b(github|email|linkedin|contact|reach|hire|social|where\s+is\s+his\s+github|how\s+to\s+contact)\b/i.test(normText) ||
    normText.includes("github.com") ||
    normText === "github?" ||
    normText === "contact?" ||
    normText === "email?" ||
    normText === "where is his github?"
  ) {
    const rawReply = `You can connect with Naphier through:
- **GitHub**: [${SOCIAL_PROFILES.github}](${SOCIAL_PROFILES.github})
- **LinkedIn**: [LinkedIn Profile](${SOCIAL_PROFILES.linkedin})
- **Email**: [${SOCIAL_PROFILES.email}](mailto:${SOCIAL_PROFILES.email})
- **Location**: ${AUTHOR_INFO.location}
- **Availability**: ${AUTHOR_INFO.jobTitle} (Available for Junior Roles, Internships, Freelance)`;

    return finalize(rawReply, "deterministic-contact");
  }

  // -------------------------------------------------------------
  // 7. EDUCATION & CERTIFICATIONS INQUIRIES
  // Discriminate between Certifications and Degree
  // -------------------------------------------------------------
  if (
    /\b(certifications?|certs?|credentials?|hackathon)\b/i.test(normText) ||
    normText === "certifications?" ||
    normText === "certs?"
  ) {
    const certList = certifications
      .map((c) => `- **${c.issuer}**: *${c.name}*${c.code ? ` (ID: \`${c.code}\`)` : ""}`)
      .join("\n");

    const rawReply = `Here are Naphier’s verified certifications:
${certList}`;

    return finalize(rawReply, "deterministic-certifications");
  }

  if (
    intent === "EDUCATION_QUERY" ||
    /\b(education|degree|school|university|college|zppsu|bsit|study|studied)\b/i.test(normText) ||
    normText === "education?" ||
    normText === "what is his education?"
  ) {
    const rawReply = `Naphier is pursuing a **${EDUCATION.degree}** (${EDUCATION.department}) at **${EDUCATION.institution}** (${EDUCATION.abbreviation}), **${EDUCATION.period}**.`;
    return finalize(rawReply, "deterministic-education");
  }

  // -------------------------------------------------------------
  // 8. EXPERIENCE INQUIRIES
  // e.g. "what work experience does naphier have?", "experience?", "experince?"
  // -------------------------------------------------------------
  if (
    intent === "EXPERIENCE_QUERY" ||
    /\b(experience|work\s+history|job|career|roles?)\b/i.test(normText) ||
    normText === "experience?" ||
    normText === "experince?"
  ) {
    const expList = experiences
      .map((e) => `- **${e.role}** at **${e.company}** (${e.year})${e.description ? `\n  ${e.description}` : ""}`)
      .join("\n");

    const rawReply = `Here is Naphier’s professional experience:
${expList}`;

    return finalize(rawReply, "deterministic-experience");
  }

  // -------------------------------------------------------------
  // 9. TECH STACK & SPECIFIC TECH INQUIRIES
  // -------------------------------------------------------------
  // A. Python Inquiry
  if (/\b(does\s+he\s+know\s+python|python\??|does\s+he\s+use\s+python)\b/i.test(normText)) {
    const rawReply = `Yes! **Python** is part of Naphier’s backend and AI/ML toolchain. He uses Python with frameworks like **FastAPI** for high-performance async APIs, as well as in machine learning and data workflows with **PyTorch** and **TensorFlow**.`;
    return finalize(rawReply, "deterministic-tech-python");
  }

  // B. Supabase Inquiry
  if (
    normText.includes("supabase") ||
    normText === "supabse" ||
    normText === "supabse?" ||
    normText === "supabase?" ||
    /\bwhat\s+projects?\s+use\s+supabase\b/i.test(normText) ||
    /\bwhy\s+did\s+he\s+use\s+supabase\b/i.test(normText) ||
    /\bdoes\s+he\s+use\s+supabase\b/i.test(normText)
  ) {
    const rawReply = `Naphier uses **Supabase** (PostgreSQL with Row Level Security) as the primary cloud backend and database for:
- **[MKBRiderTrack](/projects/mkb-ridertrack)**: Stores rider credentials, attendance shifts, GPS telemetry, and handles real-time cloud synchronization.
- **[AssetLink](/projects/assetlink)**: Powers asset cataloging, department registries, scan history logs, and multi-role access controls.

Both systems employ custom Row Level Security (RLS) policies to prevent unauthorized data exposure.`;

    return finalize(rawReply, "deterministic-tech-supabase");
  }

  // C. PostgreSQL Inquiry
  if (
    normText.includes("postgresql") ||
    normText.includes("postgres") ||
    /\b(which|what)\s+projects?\s+(use|uses)\s+postgres(ql)?\b/i.test(normText)
  ) {
    const rawReply = `**PostgreSQL** (hosted on Supabase) is the primary relational database for both **[MKBRiderTrack](/projects/mkb-ridertrack)** and **[AssetLink](/projects/assetlink)**. It provides structured schemas, relational integrity, and server-side policy enforcement.`;
    return finalize(rawReply, "deterministic-tech-postgresql");
  }

  // D. General Stack Inquiry (e.g. "stack?", "what is his backend stack?", "what stuff does he use", "what tech he use", "naphier tech?")
  if (
    intent === "TECHNOLOGY_QUERY" ||
    query.conceptScores.technology >= 0.45 ||
    (isShort && ["stack", "tech", "technologies", "tools", "backend", "frontend"].some((w) => normText.includes(w))) ||
    /\bwhat\s+(is\s+his\s+)?(backend\s+)?(stack|technologies|tech)\b/i.test(normText) ||
    /\bwhat\s+technologies\s+does\s+he\s+use\b/i.test(normText) ||
    normText === "what tech he use" ||
    normText === "what stuff does he use" ||
    normText.includes("naphier tech")
  ) {
    const isBackendFocus = /\bbackend\b/i.test(normText);

    let rawReply = "";
    if (isBackendFocus) {
      rawReply = `Naphier’s **Backend & Database** toolchain includes:
- **Languages & Frameworks**: Node.js, Express.js, PHP, Laravel, Python, FastAPI, GraphQL, Prisma.
- **Databases & Cloud**: Supabase, PostgreSQL, MySQL, MongoDB, Firebase.
- **Architecture**: Row Level Security (RLS), RESTful APIs, offline synchronization with Dexie.js (IndexedDB).`;
    } else {
      rawReply = `Naphier’s core technology stack includes:
- **Frontend**: Next.js (App Router), React 19, TypeScript, Tailwind CSS, Motion.
- **Backend & APIs**: Node.js, Express.js, PHP, Laravel, Python, FastAPI, GraphQL, Prisma.
- **Databases & Offline**: Supabase, PostgreSQL, MySQL, MongoDB, Dexie.js (IndexedDB).
- **Tools & DevOps**: Git, GitHub, Docker, Vitest, Vercel.`;
    }

    return finalize(rawReply, "deterministic-stack-general");
  }

  // -------------------------------------------------------------
  // 10. GENERAL PROJECTS INQUIRY (Universal Phrasing)
  // Handles all variants:
  // "projects?", "what projects has he made", "show me what he built",
  // "what has Naphier worked on", "what are his apps", "tell me about the things he created",
  // "prajects", "proejcts", "projcts?", "what did he build recently", "what u build", "what did he build"
  // -------------------------------------------------------------
  const isGeneralProjectsQuery =
    (intent === "PROJECT_QUERY" && !query.hasPronoun) ||
    query.conceptScores.project >= 0.45 ||
    (isShort && ["projects", "project", "apps", "app", "work", "builds"].some((w) => normText.includes(w))) ||
    /\b(what\s+proj(ects?|cts)\s+has\s+he\s+made|what\s+proj(ects?|cts)\s+did\s+he\s+make|show\s+me\s+what\s+he\s+built|what\s+has\s+naphier\s+worked\s+on|what\s+are\s+his\s+apps|things\s+he\s+created|what\s+did\s+he\s+build\s+recently|what\s+u\s+build|what\s+did\s+he\s+build|what\s+he\s+(make|built)|show\s+me\s+his\s+projects|portfolio\s+projects|list\s+projects)\b/i.test(normText);

  if (isGeneralProjectsQuery) {
    const rawReply = `Here are Naphier’s featured projects:

1. **[MKBRiderTrack](/projects/mkb-ridertrack)** (2026, Production)
   Logistics and rider attendance platform with biometric facial verification, GPS geofencing, Supabase PostgreSQL, and offline-first Dexie.js sync.
   [Open Project](/projects/mkb-ridertrack) · [Live Demo](https://mkbridertrack.vercel.app)

2. **[AssetLink](/projects/assetlink)** (2026, Production)
   Enterprise asset management and inventory tracking system featuring dynamic QR code generation, Supabase backend, and Row Level Security (RLS).
   [Open Project](/projects/assetlink) · [Live Demo](https://assetlink-supabase-landing.vercel.app)

3. **[MovieStream (PhierPlay)](/projects/moviestream)** (2025, Active)
   Modern video streaming web application with TMDB API integration, dynamic search, watchlist persistence, and responsive media streaming.
   [Open Project](/projects/moviestream) · [Live Demo](https://phierplay.vercel.app)

4. **[Naphix Resume Builder](/projects/naphix-resume)** (2026, Active)
   Modular real-time resume creator with drag-and-drop section reordering (@dnd-kit) and instant client-side PDF and Word export.
   [Open Project](/projects/naphix-resume) · [Live Demo](https://naphix-resume.vercel.app)

You can ask me for architectural details, tech stack info, or live demos for any of these!`;

    return finalize(rawReply, "deterministic-projects-list");
  }

  // -------------------------------------------------------------
  // 11. NAVIGATION & VIEWING
  // Handles: "can i see it", "where can i see it", "open projects"
  // -------------------------------------------------------------
  if (
    intent === "NAVIGATION" ||
    query.conceptScores.navigation >= 0.5 ||
    /\b(can\s+i\s+see|where\s+can\s+i\s+see|open|view|visit|link\s+to|demo)\b/i.test(normText)
  ) {
    const rawReply = `You can explore all featured projects in the [Projects section](/projects), review his [Experience](/work), or inspect the [Tech Stack](/tech-stack).`;
    return finalize(rawReply, "deterministic-nav-general");
  }

  // Not resolved deterministically -> falls through to grounded Gemini synthesis
  return { answered: false };
}
