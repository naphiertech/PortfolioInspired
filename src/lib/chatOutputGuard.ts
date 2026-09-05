import { AUTHOR_INFO } from "./siteConfig";

export interface OutputGuardResult {
  isSafe: boolean;
  sanitizedReply: string;
  violations: string[];
}

/**
 * Checks if the generated text contains any prohibited code blocks, syntax patterns,
 * executable structures, system prompt disclosures, or implementation snippets.
 */
export function inspectGeneratedOutput(generatedText: string): OutputGuardResult {
  if (!generatedText) {
    return {
      isSafe: true,
      sanitizedReply: "",
      violations: [],
    };
  }

  const text = generatedText.trim();
  const violations: string[] = [];

  // 1. Fenced Code Blocks (```...``` or opening ```)
  if (/```[\s\S]*?```/.test(text) || /```/.test(text)) {
    violations.push("fenced_code_block");
  }

  // 2. Multiline or Embedded HTML / XML / Script Tags
  const htmlTagPattern =
    /<(!DOCTYPE|html|head|body|script|style|div|span|button|form|input|table|tbody|thead|tr|td|th|ul|ol|li|main|nav|section|header|footer|iframe|canvas|svg\s+xmlns)[^>]*>/i;
  if (htmlTagPattern.test(text)) {
    violations.push("html_tags");
  }

  // 3. Programming Language Declarations & Source Code
  const codeKeywords = [
    /\bfunction\s+\w+\s*\(/,
    /\bdef\s+\w+\s*\(/,
    /\bconst\s+\w+\s*=\s*(\([^)]*\)|async\s*\([^)]*\))\s*=>/,
    /\blet\s+\w+\s*=\s*(\([^)]*\)|async\s*\([^)]*\))\s*=>/,
    /\bclass\s+\w+(\s+extends|\s+implements|\s*\{|\s*:)/,
    /\bimport\s+.*\s+from\s+['"][^'"]+['"]/,
    /\bexport\s+(default\s+)?(const|function|class|let|var)/,
    /\bfrom\s+[\w.]+\s+import\s+[\w*]+/,
    /\bpublic\s+(static\s+)?(void|class|int|String|boolean)/,
    /\bfn\s+\w+\s*\(/,
    /\bpackage\s+[\w.]+;/,
    /\b#include\s+<[\w.]+>/,
  ];

  for (const pattern of codeKeywords) {
    if (pattern.test(text)) {
      violations.push("programming_source_code");
      break;
    }
  }

  // 4. SQL Statements
  const sqlPattern =
    /\b(SELECT\s+[\s\S]+?\s+FROM|INSERT\s+INTO\s+[\w.]+|UPDATE\s+[\w.]+\s+SET|DELETE\s+FROM\s+[\w.]+|CREATE\s+TABLE|ALTER\s+TABLE|DROP\s+TABLE|CREATE\s+INDEX)\b/i;
  if (sqlPattern.test(text)) {
    violations.push("sql_statement");
  }

  // 5. Shell & Package Manager Commands
  const shellPattern =
    /\b(npm\s+(install|i|run|start|build|test)|pnpm\s+(add|install|i|run|build)|yarn\s+(add|install|build)|pip\s+install|git\s+(clone|commit|push|checkout|pull)|curl\s+-[a-zA-Z]|docker\s+(run|build|compose)|npx\s+[a-z0-9_-]+)\b/i;
  if (shellPattern.test(text)) {
    violations.push("shell_command");
  }

  // 6. System Prompt Disclosure / Internal Instructions Leak
  const promptLeakPatterns = [
    /GUIDELINES FOR RESPONSES/i,
    /STRICT ZERO-CODE POLICY/i,
    /AUTHORITATIVE PROFILE/i,
    /ACTIVE VISITOR CONTEXT/i,
    /You are the personal AI Assistant for/i,
    /AUTHORITATIVE PROJECTS \(SINGLE SOURCE OF TRUTH\)/i,
    /\b(system\s+prompt|system\s+instructions?|developer\s+mode\s+instructions?|internal\s+guidelines?)\b/i,
    /\b(grounded AI|You are Agent Folio)\b/i,
  ];

  for (const pattern of promptLeakPatterns) {
    if (pattern.test(text)) {
      violations.push("prompt_leak");
      break;
    }
  }

  // 7. Unverified External Link Check (Enforce only authorized portfolio domains)
  const linkMatches = text.match(/https?:\/\/[^\s\)]+/g);
  if (linkMatches) {
    const allowedHosts = [
      "github.com",
      "linkedin.com",
      "vercel.app",
      "assetlink-supabase-landing.vercel.app",
      "mkbridertrack.vercel.app",
      "naphier.tech",
      "localhost",
    ];
    for (const link of linkMatches) {
      try {
        const host = new URL(link).hostname.toLowerCase();
        const allowed = allowedHosts.some((h) => host === h || host.endsWith("." + h));
        if (!allowed) {
          violations.push(`unverified_external_url: ${link}`);
          break;
        }
      } catch {
        violations.push(`malformed_url: ${link}`);
        break;
      }
    }
  }

  // If any violation is detected, discard the entire model output and return the standard portfolio redirect
  if (violations.length > 0) {
    return {
      isSafe: false,
      sanitizedReply: `I’m here to help you explore ${AUTHOR_INFO.shortName}’s portfolio. I can answer questions about his projects, skills, experience, and background.`,
      violations,
    };
  }

  return {
    isSafe: true,
    sanitizedReply: text,
    violations: [],
  };
}

/**
 * Validates model generation, returning a normalized boolean and sanitized text
 */
export function validateAssistantResponse(generatedText: string): {
  valid: boolean;
  sanitizedText: string;
  reason?: string;
  violations: string[];
} {
  const result = inspectGeneratedOutput(generatedText);
  return {
    valid: result.isSafe,
    sanitizedText: result.sanitizedReply,
    reason: result.violations.join(", ") || undefined,
    violations: result.violations,
  };
}
