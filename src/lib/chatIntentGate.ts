import { fullProjects, coreTechStack } from "./data";
import { AUTHOR_INFO } from "./siteConfig";

export type IntentClassification =
  | "PORTFOLIO_ALLOWED"
  | "OUT_OF_SCOPE"
  | "SENSITIVE_REQUEST";

export interface IntentGateResult {
  classification: IntentClassification;
  suggestedReply?: string;
  reason?: string;
}

/**
 * Checks if a string contains prompt injection or jailbreak patterns
 */
function isPromptInjection(text: string): boolean {
  const lower = text.toLowerCase();

  // Pattern 1: Direct instruction overrides / jailbreaks
  const overridePatterns = [
    /(ignore|disregard|forget|override|bypass)\s+(all\s+)?(previous|prior|above|system|initial|safety|content)?\s*(instructions|prompts|rules|commands|constraints|guidelines|limits)/i,
    /(you\s+are\s+now|act\s+as|switch\s+to|enter)\s+(in\s+|as\s+)?(developer\s+mode|god\s+mode|unrestricted\s+mode|dan\s+mode|sudo\s+mode|a\s+developer|a\s+coding\s+assistant|a\s+code\s+generator|a\s+general\s+ai|an\s+unrestricted\s+ai|dan|jailbroken)/i,
    /pretend\s+(there\s+are\s+no|you\s+have\s+no|to\s+have\s+no|restrictions\s+do\s+not\s+exist)\s*(rules|restrictions|limits|guidelines)?/i,
    /(reveal|show|print|repeat|output|what\s+is|what\s+are)\s+(me\s+)?(your\s+)?(system\s+prompt|hidden\s+instructions|hidden\s+context|internal\s+prompt|initial\s+prompt|raw\s+instructions|system\s+instructions)/i,
    /repeat\s+(everything\s+)?(above|before\s+this|the\s+system\s+prompt)/i,
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
function isCodeOrImplementationRequest(text: string): boolean {
  const lower = text.toLowerCase().trim();

  // Pattern 1: Explicit requests to write / generate / create code or specific language implementations
  const codeGenPatterns = [
    // "give me / write / generate / create / show / provide / code / build ... code/html/script/..."
    /\b(give\s+me|write|generate|create|build|show\s+me|provide|produce|code|implement|craft|scaffold|draft|supply|output|make)\s+(me\s+)?(a\s+|some\s+|an\s+)?(hello\s+world|code|script|function|component|program|snippet|template|example|class|query|html|css|javascript|typescript|python|java|php|sql|bash|shell|powershell|c\+\+|rust|golang|api|endpoint|server|app|calculator|game|website|login\s+page|database\s+schema)\b/i,
    // "hello world in html", "hello world code", "sample code"
    /\bhello\s+world\s+(code|in\s+(html|css|js|ts|python|java|php|sql|bash|c\+\+|rust|golang))\b/i,
    /\b(sample|example|boilerplate|starter)\s+(code|script|function|implementation|snippet)\b/i,
    // "how to code / how to write / how to build / how to implement ... in html/js/etc"
    /\b(how\s+(can|do)\s+(i|we|you)|show\s+me\s+how\s+to)\s+(write|build|code|implement|create|make|program|develop|scaffold)\s+(a\s+|an\s+)?(code|script|function|component|program|snippet|app|website|login|calculator|query|api|page)\b/i,
    // "teach me / explain how to code ..."
    /\b(teach\s+me|tutorial\s+on|guide\s+me\s+to)\s+(how\s+to\s+)?(code|program|write\s+code|build\s+an\s+app|make\s+a\s+website|react|python|sql|html|css|javascript)\b/i,
    // "debug / fix / solve this code / error / script"
    /\b(debug|fix|troubleshoot|solve|refactor|optimize|review)\s+(this|my|the)?\s*(code|script|bug|error|function|snippet|query|issue|stack\s+trace)\b/i,
    // "write the react code used in ...", "show me sql for ...", "give python example for ..."
    /\b(write|show|give|provide)\s+(the\s+)?(react|next\.js|vue|angular|svelte|python|sql|html|css|js|ts|database)\s+(code|query|script|schema|example)\b/i,
    // "make something similar to ...", "build a clone of ...", "build something like his project"
    /\b(make|build|create|code|develop)\s+(something\s+(similar\s+to|like)|a\s+clone\s+of|an\s+app\s+like|a\s+system\s+like|a\s+project\s+like)\b/i,
    // Disguised code requests: "pretend the code is part of...", "explain X then give me code/html"
    /\b(then\s+(give|write|show|provide|create)\s+(me\s+)?(code|html|css|script|sql|python|javascript|a\s+calculator|an\s+app))\b/i,
    /\b(pretend\s+the\s+code\s+is\s+part\s+of|include\s+the\s+code\s+for)\b/i,
    // Calculator, games, or standalone app generation
    /\b(write|create|build|code|make)\s+(a\s+|an\s+)?(calculator|todo\s+app|tictactoe|weather\s+app|snake\s+game|chat\s+app)\b/i,
  ];

  for (const pattern of codeGenPatterns) {
    if (pattern.test(lower)) {
      return true;
    }
  }

  // Pattern 2: User pasting code blocks to analyze/debug/complete
  if (
    /```[\s\S]*```/.test(text) ||
    /^(<!DOCTYPE|<html>|<script>|<div|<form|def\s+\w+\(|function\s+\w+\(|SELECT\s+.*FROM|import\s+React)/im.test(text)
  ) {
    return true;
  }

  return false;
}

/**
 * Checks if the message is asking legitimate questions about Naphier, his portfolio,
 * his technologies, background, education, work history, or project architecture.
 */
function isPortfolioInquiry(text: string): boolean {
  const lower = text.toLowerCase().trim();

  // Known portfolio project slugs & titles
  const projectKeywords = fullProjects.flatMap((p) => [
    p.slug.toLowerCase(),
    p.title.toLowerCase(),
    p.title.toLowerCase().replace(/[^a-z0-9]/g, ""),
  ]);

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
    "what he does",
    "who is",
    "about him",
    "about naphier",
  ];

  // Check if user is asking about Naphier's relationship with tech:
  // e.g. "Does Naphier know Python?", "What stack does he use?", "Why did he pick Supabase?"
  const techQuestionPatterns = [
    /\b(does\s+(he|naphier)|did\s+(he|naphier)|is\s+(he|naphier))\s+(know|use|work\s+with|experience|learn|build)\b/i,
    /\bwhat\s+(tech|technologies|tools|languages|frameworks|stack|database)\s+(does|did|is)\s+(he|naphier)\b/i,
    /\bwhy\s+did\s+(he|naphier)\s+(use|choose|pick|select|implement)\b/i,
    /\bhow\s+did\s+(he|naphier)\s+(build|design|architect|structure)\b/i,
    /\bwhere\s+did\s+(he|naphier)\s+(use|apply|learn)\b/i,
    /\bwhat\s+architecture\s+does\b/i,
    /\bhow\s+does\s+(the\s+)?(app|project|system|assetlink|mkb|ridertrack|naphix|moviestream)\s+work\b/i,
    /\bwhat\s+is\s+(assetlink|mkb\s+ridertrack|naphix\s+resume|moviestream)\b/i,
    /\bwhat\s+features\s+does\b/i,
  ];

  for (const pattern of techQuestionPatterns) {
    if (pattern.test(lower)) {
      return true;
    }
  }

  // Check for presence of project names or profile keywords in descriptive/informational context
  const hasProject = projectKeywords.some((p) => p.length > 2 && lower.includes(p));
  const hasProfileKeyword = profileKeywords.some((k) => lower.includes(k));

  if (hasProject || hasProfileKeyword) {
    // If it mentions a project or profile keyword, but was NOT classified as a code request, it's allowed!
    return true;
  }

  // Common friendly greeting or portfolio discovery questions
  if (
    /^(hi|hello|hey|good\s+(morning|afternoon|evening)|what\s+can\s+you\s+do|who\s+are\s+you|help)\b/i.test(
      lower
    )
  ) {
    return true;
  }

  // Check if asking about core stack technologies in an exploratory way
  const mentionsCoreTech = coreTechStack.some((tech) =>
    lower.includes(tech.toLowerCase())
  );
  if (mentionsCoreTech && /\b(use|used|using|stack|experience|know|projects?)\b/i.test(lower)) {
    return true;
  }

  return false;
}

/**
 * Builds a relevant suggestion based on mentioned entities
 */
function buildRelevantSuggestion(text: string): string {
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

  return ` You can ask about his projects, technical stack, certifications, or work availability.`;
}

/**
 * Authoritative Pre-Generation Intent Gate
 * Evaluates visitor input and returns a strict classification:
 * - PORTFOLIO_ALLOWED: Permitted to query Gemini with strict portfolio prompt
 * - OUT_OF_SCOPE: Intercepted before Gemini; returns authoritative redirect
 * - SENSITIVE_REQUEST: Prompt injection / jailbreak / security refusal
 */
export function classifyVisitorIntent(message: string): IntentGateResult {
  const trimmed = (message || "").trim();

  if (!trimmed) {
    return {
      classification: "OUT_OF_SCOPE",
      suggestedReply: `I’m ${AUTHOR_INFO.shortName}’s portfolio assistant, so I only answer questions about his projects, skills, experience, and background.`,
      reason: "Empty message",
    };
  }

  // 1. Security & Prompt Injection Check (Top Priority)
  if (isPromptInjection(trimmed)) {
    return {
      classification: "SENSITIVE_REQUEST",
      suggestedReply: `I’m ${AUTHOR_INFO.shortName}’s portfolio assistant, so I only answer questions about his projects, skills, experience, and background.`,
      reason: "Prompt injection / role-override attempt detected",
    };
  }

  // 2. Code Generation / Coding Assistance / Implementation Check
  if (isCodeOrImplementationRequest(trimmed)) {
    const suggestion = buildRelevantSuggestion(trimmed);
    return {
      classification: "OUT_OF_SCOPE",
      suggestedReply: `I’m ${AUTHOR_INFO.shortName}’s portfolio assistant, so I only answer questions about his projects, skills, experience, and background.${suggestion}`,
      reason: "Code generation / coding assistant request detected",
    };
  }

  // 3. Portfolio Relevance Check (Deny by default)
  if (!isPortfolioInquiry(trimmed)) {
    const suggestion = buildRelevantSuggestion(trimmed);
    return {
      classification: "OUT_OF_SCOPE",
      suggestedReply: `I’m ${AUTHOR_INFO.shortName}’s portfolio assistant, so I only answer questions about his projects, skills, experience, and background.${suggestion}`,
      reason: "General non-portfolio request detected (deny by default)",
    };
  }

  // 4. Allowed Portfolio Inquiry
  return {
    classification: "PORTFOLIO_ALLOWED",
  };
}
