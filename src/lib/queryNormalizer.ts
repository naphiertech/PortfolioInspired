import { fullProjects, coreTechStack, techSections } from "./data";
import { DetailedIntent } from "./chatIntentGate";

/**
 * Calculates the Optimal String Alignment (restricted Damerau-Levenshtein) distance
 * between two strings. Handles insertions, deletions, substitutions, and transpositions.
 */
export function damerauLevenshteinDistance(source: string, target: string): number {
  const s = source.toLowerCase();
  const t = target.toLowerCase();
  const n = s.length;
  const m = t.length;

  if (n === 0) return m;
  if (m === 0) return n;
  if (s === t) return 0;

  const d: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));

  for (let i = 0; i <= n; i++) d[i][0] = i;
  for (let j = 0; j <= m; j++) d[0][j] = j;

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const cost = s[i - 1] === t[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1, // deletion
        d[i][j - 1] + 1, // insertion
        d[i - 1][j - 1] + cost // substitution
      );

      // Transposition check
      if (
        i > 1 &&
        j > 1 &&
        s[i - 1] === t[j - 2] &&
        s[i - 2] === t[j - 1]
      ) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }

  return d[n][m];
}

/**
 * Calculates a normalized similarity score between 0 and 1.
 */
export function calculateSimilarity(s1: string, s2: string): number {
  const maxLen = Math.max(s1.length, s2.length);
  if (maxLen === 0) return 1.0;
  const dist = damerauLevenshteinDistance(s1, s2);
  return 1 - dist / maxLen;
}

export interface VocabularyItem {
  canonical: string;
  normalized: string;
  type: "project" | "tech" | "ai" | "topic" | "intent" | "security" | "contact";
  aliases?: string[];
  inferredIntent?: DetailedIntent;
}

/**
 * Compiles the authoritative portfolio vocabulary dynamically from existing data.
 */
export function buildPortfolioVocabulary(): VocabularyItem[] {
  const vocab: VocabularyItem[] = [];
  const seen = new Set<string>();

  const add = (
    canonical: string,
    type: VocabularyItem["type"],
    aliases: string[] = [],
    inferredIntent?: DetailedIntent
  ) => {
    const norm = canonical.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (!norm || seen.has(norm)) return;
    seen.add(norm);
    vocab.push({
      canonical,
      normalized: norm,
      type,
      aliases,
      inferredIntent,
    });
  };

  // 1. Projects and Project Aliases
  for (const p of fullProjects) {
    const aliases = [p.slug.toLowerCase()];
    if (p.slug === "mkb-ridertrack") {
      aliases.push("mkb", "ridertrack", "mkbridertrack", "rider");
    } else if (p.slug === "assetlink") {
      aliases.push("asset", "assetlink", "qr");
    } else if (p.slug === "moviestream") {
      aliases.push("movie", "cinema", "phierplay", "moviestream");
    } else if (p.slug === "naphix-resume") {
      aliases.push("naphix", "naphixresume", "resumebuilder", "resume");
    }
    add(p.title, "project", aliases, "PROJECT_QUERY");
  }

  // 2. Core & Section Technologies
  const allTechs = new Set<string>([...coreTechStack]);
  for (const sec of techSections) {
    for (const item of sec.items) {
      allTechs.add(item);
    }
  }
  // GitHub is primarily a contact/code profile destination, exclude from general tech
  allTechs.delete("GitHub");

  const techAliasesMap: Record<string, string[]> = {
    "PostgreSQL": ["postgres", "postgresql", "psql", "postgre"],
    "Supabase": ["supabase", "supa"],
    "React": ["react", "reactjs"],
    "Next.js": ["next", "nextjs", "next.js"],
    "Tailwind CSS": ["tailwind", "tailwindcss"],
    "TypeScript": ["ts", "typescript"],
    "JavaScript": ["js", "javascript"],
    "Node.js": ["node", "nodejs"],
    "Express.js": ["express", "expressjs"],
    "PHP": ["php"],
    "Laravel": ["laravel"],
    "Python": ["python", "py"],
    "FastAPI": ["fastapi"],
    "GraphQL": ["graphql", "gql"],
    "Prisma": ["prisma"],
    "MySQL": ["mysql"],
    "MongoDB": ["mongodb", "mongo"],
    "Firebase": ["firebase"],
    "TensorFlow": ["tensorflow", "tf"],
    "PyTorch": ["pytorch", "torch"],
    "Dexie.js": ["dexie", "dexiejs", "indexeddb"],
    "Leaflet": ["leaflet"],
    "Recharts": ["recharts"],
    "Vitest": ["vitest"],
    "Docker": ["docker"],
    "Git": ["git"],
    "Vercel": ["vercel"],
  };

  for (const tech of allTechs) {
    const aliases = techAliasesMap[tech] || [];
    add(tech, "tech", aliases, "TECHNOLOGY_QUERY");
  }

  // 3. AI / Models
  add("Gemini", "ai", ["gemini", "gemini-2.5-flash", "gemini-1.5-flash", "llm", "ai", "model", "models"], "AI_QUERY");
  add("Agent Folio", "ai", ["agentfolio", "agent", "portfolioagent"], "AI_QUERY");
  add("Biometric Verification", "ai", ["biometrics", "biometric", "faceverification"], "AI_QUERY");
  add("NotebookLM", "ai", ["notebooklm"], "AI_QUERY");

  // 4. Intent & Topic Keywords
  add("projects", "topic", ["projects", "project", "apps", "app", "work", "builds"], "PROJECT_QUERY");
  add("experience", "topic", ["experience", "work", "job", "career", "history"], "EXPERIENCE_QUERY");
  add("education", "topic", ["education", "school", "university", "degree", "college", "zppsu", "bsit"], "EDUCATION_QUERY");
  add("certifications", "topic", ["certifications", "certification", "certs", "credentials"], "EDUCATION_QUERY");
  add("stack", "topic", ["stack", "techstack", "toolchain", "technologies", "tools"], "TECHNOLOGY_QUERY");
  add("contact", "topic", ["contact", "email", "reach", "hire", "social"], "CONTACT_QUERY");
  add("github", "contact", ["github", "gh", "githb", "repo", "repository"], "CONTACT_QUERY");
  add("linkedin", "topic", ["linkedin"], "CONTACT_QUERY");
  add("resume", "topic", ["resume", "cv"], "CONTACT_QUERY");
  add("about", "topic", ["about", "bio", "background", "who"], "PORTFOLIO_FACT");

  // 5. Common Navigation Words
  add("see", "intent", ["see", "view", "open", "check", "visit", "link", "demo"], "NAVIGATION");

  // 6. Security Vocabulary (to normalize and catch evasion attempts)
  add("ignore", "security", ["ignore", "disregard", "forget", "override"]);
  add("instructions", "security", ["instructions", "prompts", "rules", "guidelines"]);
  add("reveal", "security", ["reveal", "display"]);
  add("system", "security", ["system", "developer", "initial"]);
  add("prompt", "security", ["prompt"]);

  return vocab;
}

/**
 * Common English words that must NEVER be mutated by fuzzy matching
 */
export const PROTECTED_ENGLISH_WORDS = new Set([
  "code", "work", "view", "open", "show", "make", "what", "from", "with",
  "into", "some", "this", "that", "have", "here", "help", "like", "more",
  "tell", "good", "need", "give", "find", "link", "user", "page", "site",
  "time", "tech", "test", "role", "apps", "main", "call", "pass", "chat",
  "text", "data", "live", "demo", "repo", "hire", "read", "fast", "full",
  "he", "his", "him", "he's", "hes", "does", "did", "is", "are", "was",
  "who", "why", "where", "how", "when", "can", "could", "would", "should",
  "they", "them", "their", "it", "its", "you", "your", "me", "my", "we"
]);

// Cached vocabulary singleton
let cachedVocab: VocabularyItem[] | null = null;
export function getPortfolioVocabulary(): VocabularyItem[] {
  if (!cachedVocab) {
    cachedVocab = buildPortfolioVocabulary();
  }
  return cachedVocab;
}

/**
 * Common typo mappings and phonetic substitutions for instant high-confidence resolution
 */
const KNOWN_TYPO_MAP: Record<string, string> = {
  // Projects
  rpojects: "projects",
  projcts: "projects",
  prajects: "projects",
  proejcts: "projects",
  project: "projects",
  projets: "projects",
  projekts: "projects",
  projs: "projects",
  mkbridertrak: "mkbridertrack",
  ridertrak: "ridertrack",
  asetlink: "assetlink",
  asetlik: "assetlink",
  moviestrem: "moviestream",
  phierply: "phierplay",
  nafix: "naphix",
  naphixresum: "naphix-resume",

  // Technologies
  supabse: "supabase",
  supa: "supabase",
  postgre: "postgresql",
  postgress: "postgresql",
  postgres: "postgresql",
  pgadmin: "postgresql",
  typscript: "typescript",
  typescrip: "typescript",
  javascrip: "javascript",
  recat: "react",
  nextjs: "next.js",
  nxtjs: "next.js",
  talwind: "tailwind",
  talwindcss: "tailwind",
  tialwind: "tailwind",
  dockr: "docker",
  pyton: "python",
  pyhton: "python",
  vercl: "vercel",
  dexy: "dexie",

  // AI
  gemni: "gemini",
  gemn: "gemini",
  gemnii: "gemini",
  gemini2: "gemini",
  tensorflo: "tensorflow",
  pytoch: "pytorch",
  noteboklm: "notebooklm",

  // General portfolio terms
  experince: "experience",
  experiance: "experience",
  experence: "experience",
  skils: "skills",
  stck: "stack",
  educaton: "education",
  edukasyon: "education",
  certificaton: "certifications",
  certficates: "certifications",
  certifcates: "certifications",
  contct: "contact",
  contat: "contact",
  githb: "github",
  gitub: "github",
  guthub: "github",
  liknedin: "linkedin",
  linkdin: "linkedin",
  seee: "see",
  seeee: "see",

  // Security & Code-gen terms (for normalized detection)
  ignroe: "ignore",
  ignre: "ignore",
  disregd: "disregard",
  promtp: "prompt",
  promt: "prompt",
  reveael: "reveal",
  revel: "reveal",
  instrcutions: "instructions",
  instruxions: "instructions",
  wrtie: "write",
  wrt: "write",
  writ: "write",
  scirpt: "script",
  skript: "script",
  scrper: "scraper",
  scrapper: "scraper",
  gnrate: "generate",
  genrate: "generate",
  implment: "implement",
  pythn: "python",
};

/**
 * Conversational slang and shorthand expansion rules
 */
const CASUAL_SLANG_MAP: Record<string, string> = {
  u: "you",
  ur: "your",
  wat: "what",
  wut: "what",
  gimme: "give me",
  lemme: "let me",
  wanna: "want to",
  gotta: "got to",
  kinda: "kind of",
  im: "i am",
  "i'm": "i am",
  hes: "he is",
  "he's": "he is",
  whats: "what is",
  "what's": "what is",
  dont: "do not",
  "don't": "do not",
  doesnt: "does not",
  "doesn't": "does not",
  aint: "is not",
  "ain't": "is not",
  yall: "you all",
  "y'all": "you all",
  sup: "sup",
  yo: "hello",
  heyyy: "hey",
  heyy: "hey",
  hey: "hey",
  hi: "hi",
  hello: "hello",
};

/**
 * Compresses exaggerated repeated characters (e.g. "seeee" -> "see", "gemmiii" -> "gemini")
 */
export function compressRepeatedChars(str: string): string {
  // Compress 3+ repeated characters down to 1 or 2
  return str.replace(/([a-zA-Z])\1{2,}/g, (match, char) => {
    // Keep 'ee' or 'oo' if common in English, else single character
    if (char.toLowerCase() === "e" || char.toLowerCase() === "o") {
      return char + char;
    }
    return char;
  });
}

/**
 * Simple, zero-dependency English stemmer / plural-to-singular normalizer.
 * Preserves core semantics without mangling names or short words.
 */
export function stemToken(token: string): string {
  const lower = token.toLowerCase();
  if (lower.length <= 3 || PROTECTED_ENGLISH_WORDS.has(lower)) {
    return lower;
  }

  // Common portfolio-specific morphological forms
  if (lower === "technologies" || lower === "techs") return "technology";
  if (lower === "certifications" || lower === "certs" || lower === "certificates") return "certification";
  if (lower === "applications" || lower === "apps") return "application";
  if (lower === "projects") return "project";
  if (lower === "languages") return "language";
  if (lower === "frameworks") return "framework";
  if (lower === "databases") return "database";
  if (lower === "models") return "model";
  if (lower === "skills") return "skill";
  if (lower === "tools") return "tool";
  if (lower === "built" || lower === "building" || lower === "builds") return "build";
  if (lower === "created" || lower === "creating" || lower === "creates" || lower === "creation" || lower === "creations") return "create";
  if (lower === "made" || lower === "making" || lower === "makes") return "make";
  if (lower === "worked" || lower === "working" || lower === "works") return "work";
  if (lower === "developed" || lower === "developing" || lower === "develops") return "develop";
  if (lower === "used" || lower === "using" || lower === "uses") return "use";
  if (lower === "known" || lower === "knowing" || lower === "knows") return "know";
  if (lower === "studied" || lower === "studying" || lower === "studies") return "study";

  // Standard regular suffix rules
  if (lower.endsWith("ies") && lower.length > 5) {
    return lower.slice(0, -3) + "y";
  }
  if (lower.endsWith("es") && (lower.endsWith("shes") || lower.endsWith("ches") || lower.endsWith("xes"))) {
    return lower.slice(0, -2);
  }
  if (lower.endsWith("s") && !lower.endsWith("ss") && lower.length > 4) {
    return lower.slice(0, -1);
  }

  return lower;
}

export interface MatchedEntity {
  type: VocabularyItem["type"];
  original: string;
  matched: string;
  canonical: string;
  confidence: number;
}

export interface SemanticConceptScores {
  project: number;
  technology: number;
  ai: number;
  experience: number;
  education: number;
  contact: number;
  navigation: number;
  greeting: number;
  followUp: number;
  generalAbout: number;
}

export interface NormalizedQuery {
  raw: string;
  cleanText: string;
  normalizedText: string;
  tokens: string[];
  stemmedTokens: string[];
  matchedEntities: MatchedEntity[];
  isShortQuery: boolean;
  hasQuestionMark: boolean;
  hasPronoun: boolean;
  isGreeting: boolean;
  isAmbiguous: boolean;
  ambiguousCandidates?: Array<"PROJECT_QUERY" | "TECHNOLOGY_QUERY" | "EXPERIENCE_QUERY" | "EDUCATION_QUERY" | "CONTACT_QUERY" | "AI_QUERY">;
  conceptScores: SemanticConceptScores;
  inferredIntent?: DetailedIntent;
}

/**
 * Evaluates whether a candidate token matches a target vocabulary word.
 */
export function matchTokenAgainstWord(
  token: string,
  target: string
): { matched: boolean; confidence: number } {
  const cleanToken = token.toLowerCase().replace(/[^a-z0-9]/g, "");
  const cleanTarget = target.toLowerCase().replace(/[^a-z0-9]/g, "");

  if (!cleanToken || !cleanTarget) {
    return { matched: false, confidence: 0 };
  }

  // Exact match
  if (cleanToken === cleanTarget) {
    return { matched: true, confidence: 1.0 };
  }

  // Protected words
  if (PROTECTED_ENGLISH_WORDS.has(cleanToken)) {
    return { matched: false, confidence: 0 };
  }

  const len = cleanToken.length;
  const targetLen = cleanTarget.length;
  const lenDiff = Math.abs(len - targetLen);

  if (lenDiff > 2) {
    return { matched: false, confidence: 0 };
  }

  if (len <= 3 || targetLen <= 3) {
    return { matched: false, confidence: 0 };
  }

  const dist = damerauLevenshteinDistance(cleanToken, cleanTarget);
  const similarity = 1 - dist / Math.max(len, targetLen);

  if (len <= 5 && targetLen <= 6) {
    if (dist <= 1 && similarity >= 0.75) {
      return { matched: true, confidence: similarity };
    }
    return { matched: false, confidence: 0 };
  }

  if (dist <= 2 && similarity >= 0.75) {
    return { matched: true, confidence: similarity };
  }

  return { matched: false, confidence: 0 };
}

/**
 * Universal semantic normalization pipeline:
 * 1. Sanitizes noise, invisible characters, and excessive whitespace
 * 2. Compresses character repetitions ("heyyyy", "seeee", "gemmiii")
 * 3. Expands casual slang ("u", "wat", "gimme", "whats")
 * 4. Tokenizes and computes morphological stems
 * 5. Resolves typos and vocabulary entities via Damerau-Levenshtein
 * 6. Computes multi-feature semantic concept scores across portfolio domains
 * 7. Detects greetings, pronouns, follow-ups, and genuine domain ambiguity
 */
export function normalizeUserQuery(raw: string): NormalizedQuery {
  if (!raw || typeof raw !== "string") {
    return {
      raw: "",
      cleanText: "",
      normalizedText: "",
      tokens: [],
      stemmedTokens: [],
      matchedEntities: [],
      isShortQuery: false,
      hasQuestionMark: false,
      hasPronoun: false,
      isGreeting: false,
      isAmbiguous: false,
      conceptScores: {
        project: 0,
        technology: 0,
        ai: 0,
        experience: 0,
        education: 0,
        contact: 0,
        navigation: 0,
        greeting: 0,
        followUp: 0,
        generalAbout: 0,
      },
    };
  }

  const hasQuestionMark = raw.includes("?");

  // 1. Clean whitespace and non-printable characters
  const cleaned = raw
    .replace(/[\u200B-\u200D\uFEFF\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  // 2. Compress exaggerated repeated characters
  const compressed = compressRepeatedChars(cleaned);

  // 3. Tokenize and normalize
  const rawWords = compressed.split(/\s+/).filter(Boolean);
  const normalizedWords: string[] = [];
  const stemmedTokens: string[] = [];
  const cleanTokens: string[] = [];
  const matchedEntities: MatchedEntity[] = [];
  const vocab = getPortfolioVocabulary();

  for (const rawWord of rawWords) {
    const punctMatch = rawWord.match(/^([^a-zA-Z0-9]*)(.*?)([^a-zA-Z0-9]*)$/);
    const prefix = punctMatch ? punctMatch[1] : "";
    const coreWord = punctMatch ? punctMatch[2] : rawWord;
    const suffix = punctMatch ? punctMatch[3] : "";
    const lowerCore = coreWord.toLowerCase();

    if (!coreWord) {
      normalizedWords.push(rawWord);
      continue;
    }

    cleanTokens.push(lowerCore);

    // A. Slang expansion
    let resolvedCore = lowerCore;
    if (CASUAL_SLANG_MAP[lowerCore]) {
      resolvedCore = CASUAL_SLANG_MAP[lowerCore];
    }

    // B. Known typo map
    if (KNOWN_TYPO_MAP[resolvedCore]) {
      resolvedCore = KNOWN_TYPO_MAP[resolvedCore];
    }

    // C. Check vocabulary match
    const vExact = vocab.find(
      (v) =>
        v.normalized === resolvedCore.replace(/[^a-z0-9]/g, "") ||
        (v.aliases && v.aliases.some((a) => a.toLowerCase() === resolvedCore))
    );

    if (vExact) {
      matchedEntities.push({
        type: vExact.type,
        original: coreWord,
        matched: resolvedCore,
        canonical: vExact.canonical,
        confidence: 1.0,
      });
      normalizedWords.push(prefix + resolvedCore + suffix);
      stemmedTokens.push(stemToken(resolvedCore));
      continue;
    }

    // D. Fuzzy matching against vocabulary
    let bestMatch: { item: VocabularyItem; targetWord: string; confidence: number } | null = null;
    if (!PROTECTED_ENGLISH_WORDS.has(resolvedCore)) {
      for (const v of vocab) {
        const cMatch = matchTokenAgainstWord(resolvedCore, v.canonical);
        if (cMatch.matched && (!bestMatch || cMatch.confidence > bestMatch.confidence)) {
          bestMatch = { item: v, targetWord: v.canonical.toLowerCase(), confidence: cMatch.confidence };
        }
        if (v.aliases) {
          for (const alias of v.aliases) {
            const aMatch = matchTokenAgainstWord(resolvedCore, alias);
            if (aMatch.matched && (!bestMatch || aMatch.confidence > bestMatch.confidence)) {
              bestMatch = { item: v, targetWord: alias.toLowerCase(), confidence: aMatch.confidence };
            }
          }
        }
      }
    }

    if (bestMatch && bestMatch.confidence >= 0.75) {
      normalizedWords.push(prefix + bestMatch.targetWord + suffix);
      matchedEntities.push({
        type: bestMatch.item.type,
        original: coreWord,
        matched: bestMatch.targetWord,
        canonical: bestMatch.item.canonical,
        confidence: bestMatch.confidence,
      });
      stemmedTokens.push(stemToken(bestMatch.targetWord));
    } else {
      normalizedWords.push(prefix + resolvedCore + suffix);
      stemmedTokens.push(stemToken(resolvedCore));
    }
  }

  const normalizedText = normalizedWords.join(" ");
  const lowerNorm = normalizedText.toLowerCase();
  const isShortQuery = cleanTokens.length <= 2;

  // 4. Pronoun detection (e.g. "it", "that", "this", "they")
  const hasPronoun = /\b(it|its|that|this|they|them|that\s+project|this\s+project|that\s+one|the\s+other\s+one)\b/i.test(lowerNorm);

  // 5. Greeting detection (e.g. "yo", "heyyy", "hi", "hello", "good morning", "sup")
  const trimmedLower = lowerNorm.replace(/[!?.]/g, "").trim();
  const trimmedClean = cleaned.toLowerCase().replace(/[!?.]/g, "").trim();
  const isGreeting =
    /^(yo|hey|heyy|heyyy|hi|hello|greetings|howdy|sup|what\s+is\s+up|whats\s+up)(\s+(there|naphier|assistant|bot|man|bro|friend))?$/i.test(trimmedLower) ||
    /^(yo|hey|heyy|heyyy|hi|hello|greetings|howdy|sup|what\s+is\s+up|whats\s+up)(\s+(there|naphier|assistant|bot|man|bro|friend))?$/i.test(trimmedClean) ||
    /^(good\s+(morning|afternoon|evening|day))$/i.test(trimmedLower);

  // 6. Semantic Concept Scoring
  const scores: SemanticConceptScores = {
    project: 0,
    technology: 0,
    ai: 0,
    experience: 0,
    education: 0,
    contact: 0,
    navigation: 0,
    greeting: isGreeting ? 1.0 : 0,
    followUp: 0,
    generalAbout: 0,
  };

  // Helper score increment
  const addScore = (key: keyof SemanticConceptScores, weight: number) => {
    scores[key] = Math.min(1.0, scores[key] + weight);
  };

  // Evaluate Matched Entities
  for (const entity of matchedEntities) {
    if (entity.type === "project") addScore("project", 0.75 * entity.confidence);
    else if (entity.type === "tech") addScore("technology", 0.75 * entity.confidence);
    else if (entity.type === "ai") addScore("ai", 0.75 * entity.confidence);
    else if (entity.type === "contact") addScore("contact", 0.75 * entity.confidence);
  }

  // Evaluate Stemmed Tokens & Concept Clusters
  for (const token of stemmedTokens) {
    // Project concepts
    if (["project", "app", "application", "build", "create", "creation", "creations", "make", "develop", "ship", "software", "system"].includes(token)) {
      addScore("project", 0.4);
    }
    // Ambiguous "work" concept adds to both project and experience
    if (token === "work") {
      addScore("project", 0.45);
      addScore("experience", 0.45);
    }
    // Technology concepts
    if (["tech", "technology", "stack", "toolchain", "framework", "library", "language", "database", "backend", "frontend", "api", "tool"].includes(token)) {
      addScore("technology", 0.4);
    }
    if (["use", "know"].includes(token)) {
      addScore("technology", 0.25);
    }
    // AI concepts
    if (["ai", "model", "gemini", "flash", "llm", "neural", "biometric"].includes(token)) {
      addScore("ai", 0.5);
    }
    // Experience concepts
    if (["experience", "job", "career", "employment", "history", "role"].includes(token)) {
      addScore("experience", 0.4);
    }
    // Education & Certs
    if (["education", "school", "university", "college", "degree", "zppsu", "bsit", "study", "graduate"].includes(token)) {
      addScore("education", 0.5);
    }
    if (["certification", "cert", "credential", "hackathon"].includes(token)) {
      addScore("education", 0.5);
    }
    // Contact & Social
    if (["contact", "email", "reach", "hire", "github", "gh", "githb", "linkedin", "social", "available"].includes(token)) {
      addScore("contact", 0.5);
    }
    // Navigation / Seeing
    if (["see", "view", "visit", "open", "check", "link", "demo", "url", "test", "live", "preview"].includes(token)) {
      addScore("navigation", 0.4);
    }
    // Follow-up
    if (["more", "detail", "elaborate", "why", "how", "other", "next"].includes(token)) {
      addScore("followUp", 0.35);
    }
    // General About
    if (["about", "who", "bio", "background"].includes(token)) {
      addScore("generalAbout", 0.4);
    }
  }

  // Phrase-level semantic signals
  if (/\b(what\s+did\s+he\s+build|what\s+has\s+he\s+made|what\s+has\s+naphier\s+worked\s+on|what\s+are\s+his\s+apps|things\s+he\s+created|his\s+creations)\b/i.test(lowerNorm)) {
    addScore("project", 0.6);
  }
  if (/\b(what\s+is\s+his\s+stack|what\s+tech\s+does\s+he\s+use|does\s+he\s+know|what\s+technologies|what\s+tools)\b/i.test(lowerNorm)) {
    addScore("technology", 0.6);
  }
  if (/\b(what\s+ai|what\s+model|which\s+model|gemini\s+model|does\s+he\s+use\s+ai)\b/i.test(lowerNorm)) {
    addScore("ai", 0.6);
  }
  if (/\b(can\s+i\s+see|where\s+can\s+i\s+see|check\s+the\s+live|live\s+version|try\s+the\s+demo)\b/i.test(lowerNorm)) {
    addScore("navigation", 0.6);
  }
  if (/\b(tell\s+me\s+more|elaborate|what\s+else|why\s+did\s+he\s+use|what\s+did\s+he\s+use\s+for\s+that)\b/i.test(lowerNorm)) {
    addScore("followUp", 0.5);
  }

  // 7. Ambiguity Detection: Check if two major domain scores are in high conflict
  let isAmbiguous = false;
  let ambiguousCandidates: NormalizedQuery["ambiguousCandidates"];

  // Example: "naphier's work" could mean his projects or his job experience
  if (
    !isShortQuery &&
    ((scores.project >= 0.35 && scores.experience >= 0.35 && Math.abs(scores.project - scores.experience) < 0.25) ||
      /\b(tell\s+me\s+about\s+his\s+work|what\s+is\s+his\s+work|naphier('s)?\s+work|about\s+his\s+work|about\s+work)\b/i.test(lowerNorm)) &&
    !hasPronoun
  ) {
    isAmbiguous = true;
    ambiguousCandidates = ["PROJECT_QUERY", "EXPERIENCE_QUERY"];
  }

  // 8. Determine final inferred intent from highest confidence score
  let inferredIntent: DetailedIntent | undefined;

  if (isAmbiguous) {
    inferredIntent = "AMBIGUOUS";
  } else if (isGreeting) {
    inferredIntent = "PORTFOLIO_FACT";
  } else if (
    scores.contact >= 0.4 &&
    (matchedEntities.some((e) => e.canonical.toLowerCase() === "github" || e.type === "contact") ||
      lowerNorm.includes("github") ||
      lowerNorm.includes("githb"))
  ) {
    inferredIntent = "CONTACT_QUERY";
  } else if (scores.navigation >= 0.5 && (hasPronoun || matchedEntities.some((e) => e.type === "project") || scores.project >= 0.3)) {
    inferredIntent = "NAVIGATION";
  } else if (scores.ai >= 0.45 && scores.ai >= scores.technology) {
    inferredIntent = "AI_QUERY";
  } else if (scores.project >= 0.4 && scores.project >= scores.technology && scores.project >= scores.experience) {
    inferredIntent = "PROJECT_QUERY";
  } else if (scores.technology >= 0.4 && scores.technology >= scores.project) {
    inferredIntent = "TECHNOLOGY_QUERY";
  } else if (scores.experience >= 0.4) {
    inferredIntent = "EXPERIENCE_QUERY";
  } else if (scores.education >= 0.4) {
    inferredIntent = "EDUCATION_QUERY";
  } else if (scores.contact >= 0.4) {
    inferredIntent = "CONTACT_QUERY";
  } else if (scores.followUp >= 0.4 && hasPronoun) {
    inferredIntent = "FOLLOW_UP";
  } else if (scores.generalAbout >= 0.4) {
    inferredIntent = "PORTFOLIO_FACT";
  }

  // Fallback for single-token short inquiries (e.g. "projects?", "stack?", "python?", "githb?")
  if (!inferredIntent && isShortQuery && cleanTokens.length > 0) {
    const single = stemmedTokens[0] || cleanTokens[0];
    if (["project", "app", "build"].includes(single)) {
      inferredIntent = "PROJECT_QUERY";
    } else if (
      ["contact", "email", "github", "gh", "githb", "linkedin", "hire"].includes(single) ||
      matchedEntities.some((e) => e.canonical.toLowerCase() === "github" || e.canonical.toLowerCase() === "contact")
    ) {
      inferredIntent = "CONTACT_QUERY";
    } else if (["stack", "tech", "technology", "backend", "frontend", "tool"].includes(single) || matchedEntities.some((e) => e.type === "tech")) {
      inferredIntent = "TECHNOLOGY_QUERY";
    } else if (["ai", "model", "gemini"].includes(single)) {
      inferredIntent = "AI_QUERY";
    } else if (["experience", "job", "career"].includes(single)) {
      inferredIntent = "EXPERIENCE_QUERY";
    } else if (["education", "school", "degree", "certification", "cert"].includes(single)) {
      inferredIntent = "EDUCATION_QUERY";
    }
  }

  return {
    raw,
    cleanText: cleaned,
    normalizedText,
    tokens: cleanTokens,
    stemmedTokens,
    matchedEntities,
    isShortQuery,
    hasQuestionMark,
    hasPronoun,
    isGreeting,
    isAmbiguous,
    ambiguousCandidates,
    conceptScores: scores,
    inferredIntent,
  };
}
