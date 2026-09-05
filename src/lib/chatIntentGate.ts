import { fullProjects, coreTechStack } from "./data";
import { AUTHOR_INFO } from "./siteConfig";
import { extractConversationContext } from "./portfolioKnowledge";
import { normalizeUserQuery, NormalizedQuery } from "./queryNormalizer";

export type IntentClassification =
  | "PORTFOLIO_ALLOWED"
  | "OUT_OF_SCOPE"
  | "SENSITIVE_REQUEST";

export type DetailedIntent =
  | "PORTFOLIO_FACT"
  | "PROJECT_QUERY"
  | "TECHNOLOGY_QUERY"
  | "EXPERIENCE_QUERY"
  | "AI_QUERY"
  | "EDUCATION_QUERY"
  | "CONTACT_QUERY"
  | "NAVIGATION"
  | "FOLLOW_UP"
  | "GREETING"
  | "AMBIGUOUS"
  | "OUT_OF_SCOPE"
  | "PROMPT_INJECTION"
  | "CODE_GENERATION";

export interface IntentGateResult {
  classification: IntentClassification;
  detailedIntent: DetailedIntent;
  suggestedReply?: string;
  reason?: string;
  resolvedEntity?: {
    type: "project" | "tech" | "experience" | "ai" | "general";
    name?: string;
    slug?: string;
  };
  normalizedQuery?: NormalizedQuery;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system" | "model";
  content: string;
}

/**
 * Normalizes input text by stripping invisible characters, unbundling format wrappers,
 * JSON payloads, XML/HTML tags, and excessive whitespace.
 * NOTE: Does NOT strip security signals like "system message:" so injection checks can inspect them.
 */
export function normalizeInput(raw: string): string {
  if (!raw) return "";

  let cleaned = raw;

  // 1. Strip zero-width spaces and control characters
  cleaned = cleaned.replace(/[\u200B-\u200D\uFEFF\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "");

  // 2. Decode standard URL-encoded entities if present (e.g. %20)
  try {
    if (/%[0-9a-fA-F]{2}/.test(cleaned)) {
      cleaned = decodeURIComponent(cleaned);
    }
  } catch {
    // Ignore decode error and keep original string
  }

  // 3. Extract message from JSON wrapper if user wrapped the payload
  const trimmed = cleaned.trim();
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (typeof parsed.content === "string") {
        cleaned = parsed.content;
      } else if (typeof parsed.message === "string") {
        cleaned = parsed.message;
      } else if (typeof parsed.prompt === "string") {
        cleaned = parsed.prompt;
      } else if (typeof parsed.text === "string") {
        cleaned = parsed.text;
      }
    } catch {
      // Not valid JSON, proceed as text
    }
  }

  // 4. Unwrap fake system tags, XML tags, or instruction fences
  cleaned = cleaned.replace(/<\/?(system|instruction|developer|prompt|context|admin|human|assistant|user|im_start|im_end)[^>]*>/gi, " ");

  // 5. Unwrap markdown code fences if entire message is wrapped in ```
  cleaned = cleaned.replace(/^```[a-zA-Z]*\n?([\s\S]*?)\n?```$/g, "$1");

  // 6. Normalize multiple whitespaces into a single space
  cleaned = cleaned.replace(/\s+/g, " ").trim();

  return cleaned;
}

/**
 * Checks if a string contains prompt injection, jailbreak patterns, or instruction override attempts.
 */
export function isPromptInjection(text: string): boolean {
  const lower = text.toLowerCase();

  // Pattern 1: Direct instruction overrides / role hijacking
  const overridePatterns = [
    // Ignore / disregard instructions
    /(ignore|disregard|forget|override|bypass|drop|delete|erase|replace)\s+(all\s+|your\s+|all\s+your\s+|any\s+|the\s+)?(previous|prior|above|system|initial|safety|content|original|default)?\s*(instructions|prompts|rules|commands|constraints|guidelines|limits|identity|directives)/i,
    // Forget you are a portfolio assistant
    /forget\s+(that\s+)?(you('re| are)\s+)?(a\s+)?(portfolio\s+assistant|naphier('s)?\s+assistant)/i,
    // You are now / act as / switch to
    /(you\s+are\s+now|act\s+as|switch\s+to|enter|pretend\s+you\s+are)\s+(in\s+|as\s+)?(developer\s+mode|god\s+mode|unrestricted\s+mode|dan\s+mode|sudo\s+mode|a\s+developer|a\s+coding\s+assistant|a\s+code\s+generator|a\s+general\s+ai|an\s+unrestricted\s+ai|dan|jailbroken|a\s+hacker|an\s+independent\s+ai)/i,
    // Pretend this is a developer console
    /pretend\s+(this\s+is|you\s+are)\s+(a\s+)?(developer\s+console|linux\s+terminal|bash\s+shell|python\s+interpreter|repl|sandbox)/i,
    // Pretend there are no restrictions / disable restrictions
    /(pretend\s+(there\s+are\s+no|you\s+have\s+no|to\s+have\s+no|restrictions\s+do\s+not\s+exist)|disable\s+(your\s+)?(restrictions|filters|limits|rules|safety|guardrails))/i,
    // You must follow my new instructions
    /you\s+must\s+follow\s+my\s+(new\s+)?instructions/i,
    // System message injection
    /\b(system\s+message|system\s+instruction|system\s+prompt|developer\s+prompt)\s*:\s*/i,
    // Hidden instructions / reveal system prompt
    /(reveal|show|print|repeat|output|what\s+is|what\s+are|display)\s+(me\s+)?(your\s+)?(all\s+)?(hidden\s+|secret\s+|internal\s+|initial\s+|system\s+)*(system\s+prompt|instructions|context|prompt|rules|directives)/i,
    /repeat\s+(everything\s+)?(above|before\s+this|the\s+system\s+prompt)/i,
    // Output javascript / python only
    /(output|generate|write|print|give\s+me)\s+(javascript|python|code|html|css|sql|json)\s+only/i,
  ];

  for (const pattern of overridePatterns) {
    if (pattern.test(lower)) {
      return true;
    }
  }

  // Pattern 2: Evasion encoding requests
  const evasionPatterns = [
    /(encode|decode|output|print|respond|convert|translate)\s+.*(base64|rot13|hex|binary|morse|ascii|unicode)/i,
    /(output|give\s+me|print)\s+.*(one\s+character\s+at\s+a\s+time|char\s+by\s+char|reversed|backwards)/i,
    /split\s+(the\s+)?(code|response|message)\s+(across|into)\s+(multiple\s+messages|parts)/i,
  ];

  for (const pattern of evasionPatterns) {
    if (pattern.test(lower)) {
      return true;
    }
  }

  return false;
}

/**
 * Checks if the request is asking the AI to write, generate, debug, or tutor code,
 * create implementation artifacts, or act as a coding assistant.
 */
export function isCodeOrImplementationRequest(text: string): boolean {
  const lower = text.toLowerCase().trim();
  const codeGenPatterns = [
    // "write me a python script", "generate code", "wrtie a pythn scirpt"
    /\b(give\s+me|write|wrtie|generate|create|build|show\s+me|provide|produce|code|implement|craft|scaffold|draft|supply|output|make)\s+(me\s+)?(a\s+|some\s+|an\s+)?.*(hello\s+world|code|script|scirpt|scraper|skript|crawler|bot|function|component|program|snippet|template|example|class|query|html|css|javascript|typescript|python|java|php|sql|bash|shell|powershell|c\+\+|rust|golang|api|endpoint|server|app|calculator|game|website|login\s+page|database\s+schema)\b/i,
    // "write a sql query for me", "write a python script"
    /\b(write|wrtie)\s+(a\s+)?(sql\s+query|database\s+query|python\s+script|pythn\s+scirpt|bash\s+script|javascript\s+code|code)\b/i,
    // scraper, bot, crawler
    /\b(scraper|web\s+scraper|bot|crawler)\s+(for|in|using|with)\b/i,
    /\bfor\s+a\s+(scraper|crawler|bot)\b/i,
    // "hello world in html", "sample code"
    /\bhello\s+world\s+(code|in\s+(html|css|js|ts|python|java|php|sql|bash|c\+\+|rust|golang))\b/i,
    /\b(sample|example|boilerplate|starter)\s+(code|script|function|implementation|snippet)\b/i,
    // "how to code / how to write / how to build ... in html/js/etc"
    /\b(how\s+(can|do)\s+(i|we|you)|show\s+me\s+how\s+to)\s+(write|build|code|implement|create|make|program|develop|scaffold)\s+(a\s+|an\s+)?(code|script|function|component|program|snippet|app|website|login|calculator|query|api|page)\b/i,
    // "debug / fix / solve this code"
    /\b(debug|fix|troubleshoot|solve|refactor|optimize|review)\s+(this|my|the)?\s*(code|script|bug|error|function|snippet|query|issue|stack\s+trace)\b/i,
    // "write the react code used in ...", "show me sql for ..."
    /\b(write|show|give|provide)\s+(the\s+)?(react|next\.js|vue|angular|svelte|python|sql|html|css|js|ts|database)\s+(code|query|script|schema|example)\b/i,
    // "make something similar to ...", "build a clone of ..."
    /\b(make|build|create|code|develop)\s+(something\s+(similar\s+to|like)|a\s+clone\s+of|an\s+app\s+like|a\s+system\s+like|a\s+project\s+like)\b/i,
    // Calculator, games, or standalone app generation
    /\b(write|create|build|code|make)\s+(a\s+|an\s+)?(calculator|todo\s+app|tictactoe|weather\s+app|snake\s+game|chat\s+app)\b/i,
  ];

  for (const pattern of codeGenPatterns) {
    if (pattern.test(lower)) {
      return true;
    }
  }

  // User pasting code blocks to analyze/debug/complete
  if (
    /```[\s\S]*```/.test(text) ||
    /^(<!DOCTYPE|<html>|<script>|<div|<form|def\s+\w+\(|function\s+\w+\(|SELECT\s+.*FROM|import\s+React)/im.test(text)
  ) {
    return true;
  }

  return false;
}

/**
 * Checks if the request is asking for generic programming explanations or tutorials
 * without reference to Naphier or his portfolio (e.g. "Explain how React hooks work").
 */
export function isGeneralTechTutoringRequest(text: string): { isTutoring: boolean; matchedTopic?: string } {
  const lower = text.toLowerCase().trim();

  const tutoringPatterns = [
    /\b(explain|teach\s+me|how\s+do|what\s+are|what\s+is)\s+(how\s+)?(react\s+hooks?|useeffect|usestate|usememo|usecallback|redux|jwt|closures?|prototypes?|promises?|async\s+await|event\s+loop|recursion|binary\s+trees?|sql\s+joins?|foreign\s+keys?|docker\s+containers?|kubernetes|css\s+grid|flexbox)\b/i,
    /\btutorial\s+(on|for)\s+(react|next\.js|python|sql|html|css|javascript|typescript)\b/i,
  ];

  for (const pattern of tutoringPatterns) {
    const match = lower.match(pattern);
    if (match) {
      // If it doesn't mention Naphier or a specific portfolio project, it's generic tutoring!
      const mentionsNaphier = lower.includes(AUTHOR_INFO.shortName.toLowerCase()) || lower.includes("portfolio");
      const normalizedAlpha = lower.replace(/[^a-z0-9]/g, "");
      const mentionsProject = fullProjects.some((p) => {
        const pNorm = p.title.toLowerCase().replace(/[^a-z0-9]/g, "");
        return lower.includes(p.slug.toLowerCase()) || lower.includes(p.title.toLowerCase()) || normalizedAlpha.includes(pNorm);
      });

      if (!mentionsNaphier && !mentionsProject) {
        return { isTutoring: true, matchedTopic: match[2] || match[0] };
      }
    }
  }

  return { isTutoring: false };
}

/**
 * Tests if text matches a known project using names, slugs, or normalized alphanumeric tokens.
 */
function matchesKnownProject(text: string): boolean {
  const lower = text.toLowerCase();
  const normalized = lower.replace(/[^a-z0-9]/g, "");

  const projectAliases = [
    "mkbridertrack",
    "mkb",
    "ridertrack",
    "assetlink",
    "naphix",
    "naphixresume",
    "resumebuilder",
    "moviestream",
    "phierplay",
  ];

  if (projectAliases.some((alias) => normalized.includes(alias))) {
    return true;
  }

  return fullProjects.some((p) => {
    const pSlug = p.slug.toLowerCase();
    const pTitle = p.title.toLowerCase();
    const pNorm = pTitle.replace(/[^a-z0-9]/g, "");

    return lower.includes(pSlug) || lower.includes(pTitle) || normalized.includes(pNorm);
  });
}

/**
 * Resolves context for multi-turn conversations where the user uses relative pronouns
 * like "it", "this project", "that app", "what technologies does it use?", "can I see it?".
 */
export function resolveMultiTurnPortfolioContext(
  messages: ChatMessage[],
  currentQuery?: string,
  normalizedQuery?: NormalizedQuery
): { isContextualFollowUp: boolean; referencedEntity?: string } {
  if (!messages || messages.length === 0) {
    return { isContextualFollowUp: false };
  }

  const targetText = currentQuery
    ? currentQuery
    : [...messages].reverse().find((m) => m.role === "user")?.content || "";

  if (!targetText) {
    return { isContextualFollowUp: false };
  }

  const lower = targetText.toLowerCase().trim();

  // If the query explicitly mentions a project name or alias, it is a direct query, not an anaphoric follow-up
  if (matchesKnownProject(lower)) {
    return { isContextualFollowUp: false };
  }

  // Pronouns or anaphoric phrases
  const anaphoricPatterns = [
    /\b(what\s+tech|what\s+technologies|what\s+stack|what\s+database|what\s+language|what\s+did\s+he\s+use)\s+(does\s+it|is\s+used|did\s+he\s+use|for\s+it|for\s+that)?\b/i,
    /\bwhat\s+did\s+he\s+use\s+for\s+(that|it|this)\b/i,
    /\b(can\s+i|how\s+can\s+i|where\s+can\s+i)\s+(see\s+it|view\s+it|test\s+it|visit\s+it|access\s+it|find\s+it|open\s+it|check\s+the\s+live)\b/i,
    /\b(is\s+it|does\s+it)\s+(live|deployed|open\s+source|on\s+github|work|responsive|use\s+ai|have\s+ai)\b/i,
    /\b(does\s+it|did\s+it)\s+(use|have)\s+(ai|ml|machine\s+learning|database|auth|realtime|api)\b/i,
    /\b(what\s+is\s+its|show\s+its|show\s+the|give\s+me\s+the)\s+(link|url|repo|repository|github|features|overview)\b/i,
    /\b(tell\s+me\s+more|tell\s+me|explain\s+more|what\s+else|elaborate)\s*(about\s+)?(it|that|this|the\s+project|that\s+project|this\s+project)?\b/i,
    /\b(why\s+did\s+he\s+build\s+it|who\s+was\s+it\s+for|what\s+problem\s+does\s+it\s+solve|why\s+did\s+he\s+use\s+supabase)\b/i,
    /\b(what\s+about\s+the\s+other\s+one|what\s+about\s+the\s+next\s+one|how\s+about\s+the\s+other\s+one|the\s+other\s+one)\b/i,
    /\b(that\s+project|this\s+project|that\s+app|this\s+app|that\s+one)\b/i,
    /\bhow\s+does\s+it\s+work\b/i,
    /\bwhat\s+are\s+its\s+features\b/i,
  ];

  const hasAnaphora =
    anaphoricPatterns.some((pattern) => pattern.test(lower)) ||
    (normalizedQuery?.hasPronoun && (normalizedQuery.conceptScores.technology > 0 || normalizedQuery.conceptScores.navigation > 0 || normalizedQuery.conceptScores.ai > 0 || normalizedQuery.conceptScores.followUp > 0));

  if (!hasAnaphora) {
    return { isContextualFollowUp: false };
  }

  const priorMessages = currentQuery ? messages : messages.slice(0, -1);
  if (priorMessages.length === 0) {
    return { isContextualFollowUp: false };
  }

  // Use conversation entity state from portfolioKnowledge across prior messages
  const conversationState = extractConversationContext(priorMessages);
  if (conversationState.activeProject) {
    return {
      isContextualFollowUp: true,
      referencedEntity: conversationState.activeProject.title,
    };
  }

  if (conversationState.activeTech) {
    return {
      isContextualFollowUp: true,
      referencedEntity: conversationState.activeTech,
    };
  }

  for (const prior of [...priorMessages].reverse()) {
    if (matchesKnownProject(prior.content)) {
      return { isContextualFollowUp: true, referencedEntity: "project" };
    }
  }

  const portfolioKeywords = ["experience", "education", "certifications", "tech stack", "projects", "zppsu", "ai"];
  for (const prior of [...priorMessages].reverse()) {
    const priorLower = prior.content.toLowerCase();
    for (const keyword of portfolioKeywords) {
      if (priorLower.includes(keyword)) {
        return { isContextualFollowUp: true, referencedEntity: keyword };
      }
    }
  }

  return { isContextualFollowUp: false };
}

/**
 * Checks if the message is asking legitimate questions about Naphier, his portfolio,
 * his technologies, background, education, work history, or project architecture.
 */
export function isPortfolioInquiry(
  text: string,
  isContextualFollowUp: boolean = false,
  normalizedQuery?: NormalizedQuery
): boolean {
  if (isContextualFollowUp) {
    return true;
  }

  if (normalizedQuery) {
    // 1. Greetings
    if (normalizedQuery.isGreeting || normalizedQuery.conceptScores.greeting > 0.5) {
      return true;
    }

    // 2. High domain scores from universal normalizer
    const scores = normalizedQuery.conceptScores;
    if (
      scores.project >= 0.3 ||
      scores.technology >= 0.3 ||
      scores.ai >= 0.3 ||
      scores.experience >= 0.3 ||
      scores.education >= 0.3 ||
      scores.contact >= 0.3 ||
      scores.navigation >= 0.3 ||
      scores.generalAbout >= 0.3
    ) {
      return true;
    }

    // 3. Matched entities in vocabulary
    if (normalizedQuery.matchedEntities.length > 0) {
      return true;
    }

    // 4. Inferred intent established
    if (normalizedQuery.inferredIntent) {
      return true;
    }
  }

  const lower = text.toLowerCase().trim();

  // Greetings or discovery prompts
  if (
    /^(hi|hello|hey|yo|sup|greetings|howdy|good\s+(morning|afternoon|evening)|what\s+can\s+you\s+do|who\s+are\s+you|help|what\s+can\s+i\s+ask|start)\b/i.test(
      lower
    )
  ) {
    return true;
  }

  // Navigation actions explicitly requested
  const navigationTriggers = [
    /\b(open|view|show|go\s+to|navigate\s+to)\s+(projects|work|tech\s+stack|technologies|certifications|experience|contact|github|linkedin|resume|cv)\b/i,
    /\b(how\s+to|how\s+can\s+i)\s+(contact|reach|hire|email)\s+(naphier|him)\b/i,
    /\b(view|see|check|open)\s+(his\s+)?(github|linkedin|resume|portfolio)\b/i,
    /\b(can\s+i\s+see\s+it|how\s+can\s+i\s+see\s+it)\b/i,
  ];
  for (const trigger of navigationTriggers) {
    if (trigger.test(lower)) {
      return true;
    }
  }

  // Known project matches
  if (matchesKnownProject(lower)) {
    return true;
  }

  // Known developer profile entities
  const profileKeywords = [
    AUTHOR_INFO.name.toLowerCase(),
    AUTHOR_INFO.shortName.toLowerCase(),
    AUTHOR_INFO.handle.toLowerCase().replace("@", ""),
    "portfolio",
    "project",
    "projects",
    "experience",
    "background",
    "education",
    "school",
    "university",
    "zppsu",
    "degree",
    "certification",
    "certifications",
    "certs",
    "resume",
    "cv",
    "contact",
    "email",
    "github",
    "linkedin",
    "hire",
    "available",
    "availability",
    "location",
    "city",
    "philippines",
    "zamboanga",
    "role",
    "skills",
    "stack",
    "tech stack",
    "what he built",
    "what does he build",
    "what he does",
    "who is naphier",
    "who is he",
    "about him",
    "about naphier",
    "what is he currently building",
    "current build",
    "currently building",
    "what does he do",
    "gemini",
    "gemini model",
    "ai model",
  ];

  // Tech and AI questions related to Naphier or his projects
  const techQuestionPatterns = [
    /\b(does\s+(he|naphier)|did\s+(he|naphier)|is\s+(he|naphier))\s+(know|use|work\s+with|experience|learn|build|code)\b/i,
    /\bwhat\s+(tech|technologies|tools|languages|frameworks|stack|database|models?)\s+(does|did|is)\s+(he|naphier)\b/i,
    /\bwhy\s+did\s+(he|naphier)\s+(use|choose|pick|select|implement)\b/i,
    /\bhow\s+did\s+(he|naphier)\s+(build|design|architect|structure)\b/i,
    /\bwhere\s+did\s+(he|naphier)\s+(use|apply|learn)\b/i,
    /\bwhat\s+architecture\s+does\b/i,
    /\bhow\s+does\s+(the\s+)?(app|project|system|assetlink|mkb|ridertrack|naphix|moviestream)\s+work\b/i,
    /\bwhat\s+is\s+(assetlink|mkb\s+ridertrack|mkb|ridertrack|naphix\s+resume|naphix|moviestream)\b/i,
    /\bwhat\s+features\s+does\b/i,
    /\bwhich\s+project\s+(uses|has|built\s+with)\b/i,
    /\bdoes\s+he\s+use\s+(next\.js|react|supabase|tailwind|typescript|postgresql|postgres|tensorflow|gemini|pytorch|python)\b/i,
    /\bdoes\s+(his\s+portfolio|he|naphier)\s+use\s+(gemini|ai|models?)\b/i,
    /\bwhat\s+(gemini\s+model|ai\s+model|model|models)\s+(does|is|are|he)\b/i,
    /\bgemini\s+models?\b/i,
    /\bwhat\s+gemini\b/i,
    /\bwhat\s+did\s+he\s+build\s+(with|using)\b/i,
    /\bwhat\s+ai\s+(stuff|projects|work|tools|models)\b/i,
    /\bwhat('s| is)\s+his\s+(backend|frontend|fullstack|tech)?\s*(stack|toolchain)\b/i,
    /\b(which|what)\s+projects?\s+(use|uses|built\s+with|has)\b/i,
  ];

  for (const pattern of techQuestionPatterns) {
    if (pattern.test(lower)) {
      return true;
    }
  }

  // Check for profile keyword
  if (profileKeywords.some((k) => lower.includes(k))) {
    return true;
  }

  // Core stack exploration
  if (coreTechStack.some((tech) => lower.includes(tech.toLowerCase()))) {
    return true;
  }

  return false;
}

/**
 * Classifies an allowed query into a discrete internal intent
 */
export function detectDetailedIntent(
  text: string,
  history: ChatMessage[],
  classification: IntentClassification,
  multiTurnContext: { isContextualFollowUp: boolean; referencedEntity?: string },
  normalizedQuery?: NormalizedQuery
): DetailedIntent {
  if (classification === "SENSITIVE_REQUEST") {
    return "PROMPT_INJECTION";
  }

  if (classification === "OUT_OF_SCOPE") {
    if (isCodeOrImplementationRequest(text)) {
      return "CODE_GENERATION";
    }
    return "OUT_OF_SCOPE";
  }

  if (normalizedQuery?.isGreeting) {
    return "GREETING";
  }

  if (normalizedQuery?.isAmbiguous) {
    return "AMBIGUOUS";
  }

  if (normalizedQuery?.inferredIntent) {
    return normalizedQuery.inferredIntent;
  }

  const lower = text.toLowerCase().trim();

  // Navigation query
  if (
    /\b(can\s+i|how\s+can\s+i|where\s+can\s+i)\s+(see|view|test|visit|access|find|open)\b/i.test(lower) ||
    /\b(open|view|see|check|go\s+to|navigate\s+to|show\s+me|take\s+me\s+to|show\s+the\s+link|show\s+link|live\s+link|repo\s+link)\b/i.test(lower)
  ) {
    return "NAVIGATION";
  }

  // Multi-turn Follow-up
  if (multiTurnContext.isContextualFollowUp) {
    return "FOLLOW_UP";
  }

  // AI / Machine Learning Query
  if (
    /\b(ai|model|models|gemini|llm|machine\s+learning|tensorflow|pytorch|claude|ollama|codex|notebooklm|artificial\s+intelligence)\b/i.test(
      lower
    )
  ) {
    return "AI_QUERY";
  }

  // Technology & Stack Query
  if (
    /\b(tech|technologies|tools?|stack|backend|frontend|frameworks?|database|databases?|supabase|postgres|postgresql|react|next\.js|nextjs|tailwind|typescript|node|express|fastapi|python|php|laravel|prisma|graphql|leaflet|dexie)\b/i.test(
      lower
    ) ||
    /\b(which\s+project\s+uses|does\s+he\s+use)\b/i.test(lower)
  ) {
    return "TECHNOLOGY_QUERY";
  }

  // Project Query
  if (
    matchesKnownProject(lower) ||
    /\b(project|projects|app|application|system|build|built|mkb|ridertrack|assetlink|moviestream|naphix)\b/i.test(lower)
  ) {
    return "PROJECT_QUERY";
  }

  // Experience / Career Query
  if (
    /\b(experience|work|job|career|freelance|roles?|working|history|timeline)\b/i.test(lower)
  ) {
    return "EXPERIENCE_QUERY";
  }

  // Education & Certifications
  if (
    /\b(education|school|university|degree|zppsu|college|certifications?|certs?|credentials?|hackathon)\b/i.test(
      lower
    )
  ) {
    return "EDUCATION_QUERY";
  }

  // Contact & Availability
  if (
    /\b(contact|reach|hire|email|github|linkedin|social|available|availability|location)\b/i.test(
      lower
    )
  ) {
    return "CONTACT_QUERY";
  }

  return "PORTFOLIO_FACT";
}

/**
 * Builds a helpful domain-specific suggestion based on mentioned entities or concepts
 */
function buildRelevantSuggestion(text: string, normalizedQuery?: NormalizedQuery): string {
  const lower = text.toLowerCase();

  for (const p of fullProjects) {
    if (
      lower.includes(p.slug.toLowerCase()) ||
      lower.includes(p.title.toLowerCase())
    ) {
      return ` You can ask how ${p.title} works or what technologies he used to build it.`;
    }
  }

  for (const tech of coreTechStack) {
    if (lower.includes(tech.toLowerCase())) {
      return ` You can ask how ${AUTHOR_INFO.shortName} uses ${tech} in his projects.`;
    }
  }

  if (normalizedQuery?.matchedEntities && normalizedQuery.matchedEntities.length > 0) {
    const e = normalizedQuery.matchedEntities[0];
    return ` You can ask about his ${e.canonical} work or related projects.`;
  }

  return ` You can ask about his projects, technical stack, certifications, or work availability.`;
}

/**
 * Authoritative Pre-Generation Intent Gate
 * Evaluates visitor input and multi-turn context, returning a strict classification and internal intent:
 * - PORTFOLIO_ALLOWED: Permitted to query Gemini with strict portfolio prompt
 * - OUT_OF_SCOPE: Intercepted before Gemini; returns authoritative redirect
 * - SENSITIVE_REQUEST: Prompt injection / jailbreak / security refusal
 */
export function classifyVisitorIntent(
  message: string,
  history: ChatMessage[] = []
): IntentGateResult {
  const rawMessage = message || "";
  const normalizedQuery = normalizeUserQuery(rawMessage);
  const normalized = normalizedQuery.normalizedText.toLowerCase();

  if (!normalized) {
    return {
      classification: "OUT_OF_SCOPE",
      detailedIntent: "OUT_OF_SCOPE",
      suggestedReply: `I’m here to help you explore ${AUTHOR_INFO.shortName}’s portfolio. Ask me about his projects, technical stack, experience, or certifications!`,
      reason: "Empty message",
      normalizedQuery,
    };
  }

  // 1. Security & Prompt Injection Check (Top Priority)
  // Check BOTH raw input and normalized input to prevent evasions or obfuscations
  if (isPromptInjection(rawMessage) || isPromptInjection(normalized)) {
    return {
      classification: "SENSITIVE_REQUEST",
      detailedIntent: "PROMPT_INJECTION",
      suggestedReply: `I’m ${AUTHOR_INFO.shortName}’s portfolio assistant, so I only answer questions about his projects, skills, experience, and background. I cannot modify my guidelines or assist with unrelated tasks.`,
      reason: "Prompt injection / role-override attempt detected",
      normalizedQuery,
    };
  }

  // 2. Code Generation / Implementation Check
  // Check BOTH raw input and normalized input to catch typo-disguised requests
  if (isCodeOrImplementationRequest(rawMessage) || isCodeOrImplementationRequest(normalized)) {
    return {
      classification: "OUT_OF_SCOPE",
      detailedIntent: "CODE_GENERATION",
      suggestedReply: `I’m here to help you explore ${AUTHOR_INFO.shortName}’s portfolio. I can’t generate code or help with unrelated tasks.${buildRelevantSuggestion(normalized, normalizedQuery)}`,
      reason: "Code generation request detected",
      normalizedQuery,
    };
  }

  // 3. Generic Programming Tutoring / Concept Explanation Check
  const tutoringCheck = isGeneralTechTutoringRequest(normalized);
  if (tutoringCheck.isTutoring) {
    const topic = tutoringCheck.matchedTopic ? tutoringCheck.matchedTopic.trim() : "this technology";
    return {
      classification: "OUT_OF_SCOPE",
      detailedIntent: "OUT_OF_SCOPE",
      suggestedReply: `I’m focused on ${AUTHOR_INFO.shortName}’s portfolio, projects, and experience. I can tell you how ${topic} is used in one of his projects, though.`,
      reason: "General programming tutoring detected",
      normalizedQuery,
    };
  }

  // 4. Check Greetings Locally
  if (normalizedQuery.isGreeting) {
    return {
      classification: "PORTFOLIO_ALLOWED",
      detailedIntent: "GREETING",
      suggestedReply: `Hello! I'm Naphier's portfolio agent. You can ask me about his featured projects (like MKBRiderTrack and AssetLink), his tech stack (Next.js, Supabase, React, Python), experience, or certifications. What would you like to explore?`,
      normalizedQuery,
    };
  }

  // 5. Check Ambiguity Locally
  if (normalizedQuery.isAmbiguous && normalizedQuery.ambiguousCandidates) {
    let clarification = "I can help with that! Do you mean Naphier's projects or his work experience?";
    if (
      normalizedQuery.ambiguousCandidates.includes("PROJECT_QUERY") &&
      normalizedQuery.ambiguousCandidates.includes("TECHNOLOGY_QUERY")
    ) {
      clarification = "I can help with that! Did you want to see Naphier's projects or explore his tech stack?";
    }

    return {
      classification: "PORTFOLIO_ALLOWED",
      detailedIntent: "AMBIGUOUS",
      suggestedReply: clarification,
      normalizedQuery,
    };
  }

  // 6. Multi-turn Context Resolution (Checking if relative follow-up refers to portfolio topic)
  const multiTurnContext = resolveMultiTurnPortfolioContext(history, normalized, normalizedQuery);

  // 7. Portfolio Relevance Check (Deny by default)
  if (!isPortfolioInquiry(normalized, multiTurnContext.isContextualFollowUp, normalizedQuery)) {
    const suggestion = buildRelevantSuggestion(normalized, normalizedQuery);
    return {
      classification: "OUT_OF_SCOPE",
      detailedIntent: "OUT_OF_SCOPE",
      suggestedReply: `I’m here to help you explore ${AUTHOR_INFO.shortName}’s portfolio, projects, skills, and background.${suggestion}`,
      reason: "General non-portfolio request detected (deny by default)",
      normalizedQuery,
    };
  }

  // 8. Allowed Portfolio Inquiry with Discrete Detailed Intent
  const detailedIntent: DetailedIntent =
    normalizedQuery.inferredIntent && normalizedQuery.inferredIntent !== "PORTFOLIO_FACT"
      ? normalizedQuery.inferredIntent
      : detectDetailedIntent(normalized, history, "PORTFOLIO_ALLOWED", multiTurnContext, normalizedQuery);

  return {
    classification: "PORTFOLIO_ALLOWED",
    detailedIntent,
    resolvedEntity: multiTurnContext.referencedEntity
      ? {
          type: "general",
          name: multiTurnContext.referencedEntity,
        }
      : undefined,
    normalizedQuery,
  };
}
