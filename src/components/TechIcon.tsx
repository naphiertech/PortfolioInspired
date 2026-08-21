"use client";

import React from "react";
import type { IconType } from "react-icons";
import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiTypescript,
  SiPython,
  SiRust,
  SiGo,
  SiCplusplus,
  SiSharp,
  SiOpenjdk,
  SiKotlin,
  SiSwift,
  SiPhp,
  SiRuby,
  SiDart,
  SiLua,
  SiR,
  SiScala,
  SiElixir,
  SiGnubash,
  SiReact,
  SiNextdotjs,
  SiVuedotjs,
  SiNuxt,
  SiSvelte,
  SiAngular,
  SiFlutter,
  SiVite,
  SiTailwindcss,
  SiBootstrap,
  SiSass,
  SiExpress,
  SiNestjs,
  SiFastapi,
  SiDjango,
  SiFlask,
  SiLaravel,
  SiAstro,
  SiThreedotjs,
  SiGreensock,
  SiFramer,
  SiLottiefiles,
  SiRedux,
  SiJquery,
  SiCapacitor,
  SiElectron,
  SiReactrouter,
  SiZod,
  SiLucide,
  SiPostgresql,
  SiMysql,
  SiMongodb,
  SiSqlite,
  SiRedis,
  SiSupabase,
  SiFirebase,
  SiPrisma,
  SiGraphql,
  SiApollographql,
  SiMariadb,
  SiDocker,
  SiKubernetes,
  SiJenkins,
  SiGithubactions,
  SiGit,
  SiGithub,
  SiGitlab,
  SiBitbucket,
  SiVercel,
  SiNetlify,
  SiGooglecloud,
  SiCloudflare,
  SiTerraform,
  SiNginx,
  SiLinux,
  SiPostman,
  SiFigma,
  SiBun,
  SiNodedotjs,
  SiTensorflow,
  SiPytorch,
  SiGooglegemini,
  SiClaude,
  SiAnthropic,
  SiDeepseek,
  SiCursor,
  SiGithubcopilot,
  SiOllama,
  SiHuggingface,
  SiMistralai,
  SiLangchain,
} from "react-icons/si";
import { RiOpenaiFill } from "react-icons/ri";
import { VscVscode } from "react-icons/vsc";

interface TechIconProps {
  name: string;
  className?: string;
}

interface IconConfig {
  component: IconType;
  color?: string;
  isThemeAware?: boolean;
}

// Complete library of top 90+ technology icons with brand hex colors
const ICON_REGISTRY: Record<string, IconConfig> = {
  // Frontend Languages & Standards
  html: { component: SiHtml5, color: "#E34F26" },
  html5: { component: SiHtml5, color: "#E34F26" },
  css: { component: SiCss, color: "#1572B6" },
  css3: { component: SiCss, color: "#1572B6" },
  javascript: { component: SiJavascript, color: "#F7DF1E" },
  js: { component: SiJavascript, color: "#F7DF1E" },
  typescript: { component: SiTypescript, color: "#3178C6" },
  ts: { component: SiTypescript, color: "#3178C6" },

  // Programming Languages
  python: { component: SiPython, color: "#3776AB" },
  rust: { component: SiRust, color: "#DEA584" },
  go: { component: SiGo, color: "#00ADD8" },
  golang: { component: SiGo, color: "#00ADD8" },
  cplusplus: { component: SiCplusplus, color: "#00599C" },
  cpp: { component: SiCplusplus, color: "#00599C" },
  csharp: { component: SiSharp, color: "#239120" },
  cs: { component: SiSharp, color: "#239120" },
  sharp: { component: SiSharp, color: "#239120" },
  java: { component: SiOpenjdk, color: "#ED8B00" },
  kotlin: { component: SiKotlin, color: "#7F52FF" },
  swift: { component: SiSwift, color: "#F05138" },
  php: { component: SiPhp, color: "#777BB4" },
  ruby: { component: SiRuby, color: "#CC342D" },
  dart: { component: SiDart, color: "#0175C2" },
  lua: { component: SiLua, color: "#000080" },
  r: { component: SiR, color: "#276DC3" },
  scala: { component: SiScala, color: "#DC322F" },
  elixir: { component: SiElixir, color: "#4B275F" },
  bash: { component: SiGnubash, color: "#4EAA25" },
  shell: { component: SiGnubash, color: "#4EAA25" },

  // Frontend Frameworks & Libraries
  react: { component: SiReact, color: "#61DAFB" },
  reactjs: { component: SiReact, color: "#61DAFB" },
  react18: { component: SiReact, color: "#61DAFB" },
  react19: { component: SiReact, color: "#61DAFB" },
  next: { component: SiNextdotjs, isThemeAware: true },
  nextjs: { component: SiNextdotjs, isThemeAware: true },
  nextdotjs: { component: SiNextdotjs, isThemeAware: true },
  vue: { component: SiVuedotjs, color: "#4FC08D" },
  vuejs: { component: SiVuedotjs, color: "#4FC08D" },
  nuxt: { component: SiNuxt, color: "#00DC82" },
  nuxtjs: { component: SiNuxt, color: "#00DC82" },
  svelte: { component: SiSvelte, color: "#FF3E00" },
  sveltejs: { component: SiSvelte, color: "#FF3E00" },
  angular: { component: SiAngular, color: "#DD0031" },
  angularjs: { component: SiAngular, color: "#DD0031" },
  astro: { component: SiAstro, color: "#BC52EE" },
  flutter: { component: SiFlutter, color: "#02569B" },
  reactnative: { component: SiReact, color: "#61DAFB" },
  capacitor: { component: SiCapacitor, color: "#119EFF" },
  electron: { component: SiElectron, color: "#47848F" },
  vite: { component: SiVite, color: "#646CFF" },
  bun: { component: SiBun, color: "#FBF0DF" },
  tailwind: { component: SiTailwindcss, color: "#06B6D4" },
  tailwindcss: { component: SiTailwindcss, color: "#06B6D4" },
  bootstrap: { component: SiBootstrap, color: "#7952B3" },
  sass: { component: SiSass, color: "#CC6699" },
  scss: { component: SiSass, color: "#CC6699" },

  // State, UI & Motion
  redux: { component: SiRedux, color: "#764ABC" },
  framer: { component: SiFramer, color: "#0055FF" },
  framermotion: { component: SiFramer, color: "#0055FF" },
  motion: { component: SiFramer, color: "#0055FF" },
  gsap: { component: SiGreensock, color: "#88CE02" },
  greensock: { component: SiGreensock, color: "#88CE02" },
  lottie: { component: SiLottiefiles, color: "#00DDB3" },
  lottiefiles: { component: SiLottiefiles, color: "#00DDB3" },
  threejs: { component: SiThreedotjs, color: "#049EF4" },
  threedotjs: { component: SiThreedotjs, color: "#049EF4" },
  reactrouter: { component: SiReactrouter, color: "#CA4245" },
  zod: { component: SiZod, color: "#3E67B1" },
  lucide: { component: SiLucide, color: "#F56565" },
  lucidereact: { component: SiLucide, color: "#F56565" },
  jquery: { component: SiJquery, color: "#0769AD" },

  // Backend & APIs
  node: { component: SiNodedotjs, color: "#5FA04E" },
  nodejs: { component: SiNodedotjs, color: "#5FA04E" },
  nodedotjs: { component: SiNodedotjs, color: "#5FA04E" },
  express: { component: SiExpress, isThemeAware: true },
  expressjs: { component: SiExpress, isThemeAware: true },
  nestjs: { component: SiNestjs, color: "#E0234E" },
  fastapi: { component: SiFastapi, color: "#009688" },
  django: { component: SiDjango, color: "#092E20" },
  flask: { component: SiFlask, isThemeAware: true },
  laravel: { component: SiLaravel, color: "#FF2D20" },
  graphql: { component: SiGraphql, color: "#E10098" },
  apollo: { component: SiApollographql, color: "#311C87" },

  // Databases & Cloud BaaS
  postgres: { component: SiPostgresql, color: "#4169E1" },
  postgresql: { component: SiPostgresql, color: "#4169E1" },
  mysql: { component: SiMysql, color: "#4479A1" },
  mongodb: { component: SiMongodb, color: "#47A248" },
  mongo: { component: SiMongodb, color: "#47A248" },
  sqlite: { component: SiSqlite, color: "#003B57" },
  redis: { component: SiRedis, color: "#FF4438" },
  supabase: { component: SiSupabase, color: "#3ECF8E" },
  firebase: { component: SiFirebase, color: "#FFCA28" },
  prisma: { component: SiPrisma, color: "#2D3748" },
  mariadb: { component: SiMariadb, color: "#003545" },

  // AI & ML (Core + LLMs & AI Tools)
  tensorflow: { component: SiTensorflow, color: "#FF6F00" },
  pytorch: { component: SiPytorch, color: "#EE4C2C" },
  gemini: { component: SiGooglegemini, color: "#8E75FF" },
  googlegemini: { component: SiGooglegemini, color: "#8E75FF" },
  claude: { component: SiClaude, color: "#D97706" },
  anthropic: { component: SiAnthropic, color: "#CC785C" },
  codex: { component: RiOpenaiFill, color: "#10A37F" },
  openai: { component: RiOpenaiFill, color: "#10A37F" },
  chatgpt: { component: RiOpenaiFill, color: "#10A37F" },
  gpt: { component: RiOpenaiFill, color: "#10A37F" },
  deepseek: { component: SiDeepseek, color: "#4D6BFE" },
  cursor: { component: SiCursor, isThemeAware: true },
  copilot: { component: SiGithubcopilot, isThemeAware: true },
  githubcopilot: { component: SiGithubcopilot, isThemeAware: true },
  ollama: { component: SiOllama, isThemeAware: true },
  huggingface: { component: SiHuggingface, color: "#FFD21E" },
  mistral: { component: SiMistralai, color: "#FF7000" },
  mistralai: { component: SiMistralai, color: "#FF7000" },
  langchain: { component: SiLangchain, color: "#1C3C3C" },

  // DevOps & Tools
  docker: { component: SiDocker, color: "#2496ED" },
  kubernetes: { component: SiKubernetes, color: "#326CE5" },
  k8s: { component: SiKubernetes, color: "#326CE5" },
  jenkins: { component: SiJenkins, color: "#D24939" },
  githubactions: { component: SiGithubactions, color: "#2088FF" },
  actions: { component: SiGithubactions, color: "#2088FF" },
  git: { component: SiGit, color: "#F05032" },
  github: { component: SiGithub, isThemeAware: true },
  gitlab: { component: SiGitlab, color: "#FC6D26" },
  bitbucket: { component: SiBitbucket, color: "#0052CC" },
  vercel: { component: SiVercel, isThemeAware: true },
  netlify: { component: SiNetlify, color: "#00C7B7" },
  googlecloud: { component: SiGooglecloud, color: "#4285F4" },
  gcp: { component: SiGooglecloud, color: "#4285F4" },
  cloudflare: { component: SiCloudflare, color: "#F38020" },
  terraform: { component: SiTerraform, color: "#844FBA" },
  nginx: { component: SiNginx, color: "#009639" },
  linux: { component: SiLinux, color: "#FCC624" },
  postman: { component: SiPostman, color: "#FF6C37" },
  figma: { component: SiFigma, color: "#F24E1E" },
};

export function TechIcon({ name, className = "w-3.5 h-3.5 flex-shrink-0" }: TechIconProps) {
  const normalized = name
    .toLowerCase()
    .trim()
    .replace(/\+/g, "plus")
    .replace(/#/g, "sharp")
    .replace(/\./g, "")
    .replace(/[\s\-_@/]/g, "");

  // VS Code special handling (from react-icons/vsc)
  if (normalized.includes("vscode") || normalized.includes("visualstudio") || (normalized === "code" && !name.includes(" "))) {
    return <VscVscode className={className} style={{ color: "#007ACC" }} aria-hidden={true} />;
  }

  // 1. Direct registry lookup
  let config = ICON_REGISTRY[normalized];

  // 2. Partial/fuzzy registry lookup if exact match not found
  if (!config) {
    for (const [key, val] of Object.entries(ICON_REGISTRY)) {
      if (normalized.includes(key) || key.includes(normalized)) {
        config = val;
        break;
      }
    }
  }

  if (config) {
    const Icon = config.component;
    if (config.isThemeAware) {
      return <Icon className={`${className} text-ink`} aria-hidden={true} />;
    }
    return <Icon className={className} style={config.color ? { color: config.color } : undefined} aria-hidden={true} />;
  }

  // Safe fallback: null (clean text-only pill)
  return null;
}

export default TechIcon;
