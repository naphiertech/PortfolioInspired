"use client";

import React from "react";
import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiFlutter,
  SiDart,
  SiCapacitor,
  SiNodedotjs,
  SiExpress,
  SiPhp,
  SiLaravel,
  SiSupabase,
  SiMysql,
  SiPostgresql,
  SiMongodb,
  SiFirebase,
  SiTensorflow,
  SiPytorch,
  SiFigma,
  SiGreensock,
  SiFramer,
  SiLottiefiles,
  SiDocker,
  SiJenkins,
  SiGithubactions,
  SiGit,
  SiGithub,
  SiPostman,
  SiVercel,
  SiVite,
  SiZod,
  SiLucide,
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";

interface TechIconProps {
  name: string;
  className?: string;
}

export function TechIcon({ name, className = "w-3.5 h-3.5 flex-shrink-0" }: TechIconProps) {
  const normalized = name.toLowerCase().trim().replace(/[\s\.\-_@/]/g, "");

  // HTML5
  if (normalized === "html" || normalized === "html5") {
    return <SiHtml5 className={className} style={{ color: "#E34F26" }} aria-hidden="true" />;
  }

  // CSS3
  if (normalized === "css" || normalized === "css3") {
    return <SiCss className={className} style={{ color: "#1572B6" }} aria-hidden="true" />;
  }

  // JavaScript
  if (normalized === "javascript" || normalized === "js") {
    return <SiJavascript className={className} style={{ color: "#F7DF1E" }} aria-hidden="true" />;
  }

  // TypeScript
  if (normalized === "typescript" || normalized === "ts") {
    return <SiTypescript className={className} style={{ color: "#3178C6" }} aria-hidden="true" />;
  }

  // React
  if (normalized.includes("react") && !normalized.includes("router")) {
    return <SiReact className={className} style={{ color: "#61DAFB" }} aria-hidden="true" />;
  }

  // Next.js (Theme aware: black in light mode, white in dark mode)
  if (normalized.includes("next")) {
    return <SiNextdotjs className={`${className} text-ink`} aria-hidden="true" />;
  }

  // Tailwind CSS
  if (normalized.includes("tailwind")) {
    return <SiTailwindcss className={className} style={{ color: "#06B6D4" }} aria-hidden="true" />;
  }

  // Vite
  if (normalized.includes("vite")) {
    return <SiVite className={className} style={{ color: "#646CFF" }} aria-hidden="true" />;
  }

  // Zod
  if (normalized.includes("zod")) {
    return <SiZod className={className} style={{ color: "#3E67B1" }} aria-hidden="true" />;
  }

  // Lucide
  if (normalized.includes("lucide")) {
    return <SiLucide className={className} style={{ color: "#F56565" }} aria-hidden="true" />;
  }

  // Flutter
  if (normalized.includes("flutter")) {
    return <SiFlutter className={className} style={{ color: "#02569B" }} aria-hidden="true" />;
  }

  // Dart
  if (normalized.includes("dart")) {
    return <SiDart className={className} style={{ color: "#0175C2" }} aria-hidden="true" />;
  }

  // Capacitor
  if (normalized.includes("capacitor")) {
    return <SiCapacitor className={className} style={{ color: "#119EFF" }} aria-hidden="true" />;
  }

  // Node.js
  if (normalized.includes("node")) {
    return <SiNodedotjs className={className} style={{ color: "#5FA04E" }} aria-hidden="true" />;
  }

  // Express.js (Theme aware: black in light mode, white in dark mode)
  if (normalized.includes("express")) {
    return <SiExpress className={`${className} text-ink`} aria-hidden="true" />;
  }

  // PHP
  if (normalized.includes("php")) {
    return <SiPhp className={className} style={{ color: "#777BB4" }} aria-hidden="true" />;
  }

  // Laravel
  if (normalized.includes("laravel")) {
    return <SiLaravel className={className} style={{ color: "#FF2D20" }} aria-hidden="true" />;
  }

  // Supabase
  if (normalized.includes("supabase")) {
    return <SiSupabase className={className} style={{ color: "#3ECF8E" }} aria-hidden="true" />;
  }

  // MySQL
  if (normalized.includes("mysql")) {
    return <SiMysql className={className} style={{ color: "#4479A1" }} aria-hidden="true" />;
  }

  // PostgreSQL
  if (normalized.includes("postgres")) {
    return <SiPostgresql className={className} style={{ color: "#4169E1" }} aria-hidden="true" />;
  }

  // MongoDB
  if (normalized.includes("mongo")) {
    return <SiMongodb className={className} style={{ color: "#47A248" }} aria-hidden="true" />;
  }

  // Firebase
  if (normalized.includes("firebase")) {
    return <SiFirebase className={className} style={{ color: "#FFCA28" }} aria-hidden="true" />;
  }

  // TensorFlow
  if (normalized.includes("tensorflow")) {
    return <SiTensorflow className={className} style={{ color: "#FF6F00" }} aria-hidden="true" />;
  }

  // PyTorch
  if (normalized.includes("pytorch")) {
    return <SiPytorch className={className} style={{ color: "#EE4C2C" }} aria-hidden="true" />;
  }

  // Figma
  if (normalized.includes("figma")) {
    return <SiFigma className={className} style={{ color: "#F24E1E" }} aria-hidden="true" />;
  }

  // GSAP (Greensock)
  if (normalized.includes("gsap") || normalized.includes("greensock")) {
    return <SiGreensock className={className} style={{ color: "#88CE02" }} aria-hidden="true" />;
  }

  // Framer Motion / Motion
  if (normalized.includes("framer") || normalized.includes("motion")) {
    return <SiFramer className={className} style={{ color: "#0055FF" }} aria-hidden="true" />;
  }

  // Lottie
  if (normalized.includes("lottie")) {
    return <SiLottiefiles className={className} style={{ color: "#00DDB3" }} aria-hidden="true" />;
  }

  // Docker
  if (normalized.includes("docker")) {
    return <SiDocker className={className} style={{ color: "#2496ED" }} aria-hidden="true" />;
  }

  // Jenkins
  if (normalized.includes("jenkins")) {
    return <SiJenkins className={className} style={{ color: "#D24939" }} aria-hidden="true" />;
  }

  // GitHub Actions
  if (normalized.includes("action")) {
    return <SiGithubactions className={className} style={{ color: "#2088FF" }} aria-hidden="true" />;
  }

  // Git
  if (normalized === "git") {
    return <SiGit className={className} style={{ color: "#F05032" }} aria-hidden="true" />;
  }

  // GitHub (Theme aware)
  if (normalized.includes("github")) {
    return <SiGithub className={`${className} text-ink`} aria-hidden="true" />;
  }

  // VS Code
  if (normalized.includes("vscode") || normalized.includes("visualstudio") || normalized.includes("code")) {
    return <VscVscode className={className} style={{ color: "#007ACC" }} aria-hidden="true" />;
  }

  // Postman
  if (normalized.includes("postman")) {
    return <SiPostman className={className} style={{ color: "#FF6C37" }} aria-hidden="true" />;
  }

  // Vercel (Theme aware)
  if (normalized.includes("vercel")) {
    return <SiVercel className={`${className} text-ink`} aria-hidden="true" />;
  }

  // Fallback: Clean text-only
  return null;
}

export default TechIcon;
