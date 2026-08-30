import { AUTHOR_INFO } from "./siteConfig";

export interface OutputGuardResult {
  isSafe: boolean;
  sanitizedReply: string;
  violations: string[];
}

/**
 * Checks if the generated text contains any prohibited code blocks, syntax patterns,
 * executable structures, or implementation snippets.
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

  // If any violation is detected, discard the entire model output and return the standard portfolio redirect
  if (violations.length > 0) {
    return {
      isSafe: false,
      sanitizedReply: `I’m ${AUTHOR_INFO.shortName}’s portfolio assistant, so I only answer questions about his projects, skills, experience, and background. You can ask how his projects work or what technologies he used to build them.`,
      violations,
    };
  }

  return {
    isSafe: true,
    sanitizedReply: text,
    violations: [],
  };
}
