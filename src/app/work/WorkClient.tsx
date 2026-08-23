"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Calendar,
  FolderGit2,
  FileText,
} from "lucide-react";
import { TechIcon } from "@/components/TechIcon";
import { useUISound } from "@/context/SoundContext";

export function WorkClient() {
  const { playHover, playClick } = useUISound();
  const capabilities = [
    "Responsive web applications",
    "Clean user interfaces",
    "Dashboards & internal systems",
    "High-converting landing pages",
    "Interactive web experiences",
    "AI-assisted development & UI animation",
  ];

  const coreStack = [
    "React",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "Node.js",
    "Supabase",
    "PostgreSQL",
  ];

  return (
    <div className="space-y-12 sm:space-y-14 animate-in fade-in duration-300">
      {/* Top Header & Context Row */}
      <div className="space-y-4">
        <Link
          href="/"
          onMouseEnter={playHover}
          onClick={playClick}
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-ink transition-colors duration-150 group cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-150 group-hover:-translate-x-1" />
          <span>cd .. / home</span>
        </Link>

        <div className="flex items-start sm:items-center justify-between flex-wrap gap-3 pt-1">
          <div>
            <span className="font-caps text-xs text-muted-foreground uppercase tracking-wider font-mono font-semibold block mb-1">
              &lt;work/&gt;
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
              Work & Availability
            </h1>
            <p className="font-mono text-xs text-muted-foreground mt-1">
              {"// Opportunities, capabilities, and collaboration"}
            </p>
          </div>

          {/* Availability Status Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 dark:text-emerald-400 self-start sm:self-auto">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-status-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500 dark:bg-emerald-400"></span>
            </span>
            <span className="text-[11px] font-mono font-medium leading-none">
              Available for work
            </span>
          </div>
        </div>
      </div>

      {/* Compact Status Block */}
      <div className="p-4 sm:p-5 rounded-lg bg-surface/30 border border-border-hairline">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground/60">Status:</span>
            <span className="text-emerald-500 dark:text-emerald-400 font-medium">
              Available
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground/60">Looking for:</span>
            <span className="text-ink">Junior / Internship / Freelance</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground/60">Location:</span>
            <span className="text-ink">Zamboanga City, Philippines</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground/60">Work preference:</span>
            <span className="text-ink">Remote / On-site / Hybrid</span>
          </div>
        </div>
      </div>

      {/* Main Narrative Copy */}
      <div className="font-sans text-[15px] text-muted-foreground leading-[26px] space-y-4">
        <p>
          I&apos;m currently looking for my first professional opportunity in tech.
        </p>
        <p>
          I&apos;m still early in my career, but I&apos;ve spent a lot of time{" "}
          <span className="text-ink font-medium">building real projects</span>,
          experimenting with different technologies, and learning how to turn ideas
          into working applications. I&apos;m especially interested in{" "}
          <span className="text-ink font-medium">web development</span>,{" "}
          <span className="text-ink font-medium">UI/UX</span>,{" "}
          <span className="text-ink font-medium">frontend work</span>, and{" "}
          <span className="text-ink font-medium">full-stack projects</span>.
        </p>
        <p>
          I&apos;m open to{" "}
          <span className="text-ink font-medium">junior roles</span>,{" "}
          <span className="text-ink font-medium">internships</span>,{" "}
          <span className="text-ink font-medium">freelance work</span>,{" "}
          <span className="text-ink font-medium">project-based collaborations</span>,
          and opportunities where I can learn while contributing to something useful.
        </p>
      </div>

      {/* Section: <WHAT-I-CAN-HELP-WITH/> */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center gap-2">
          <span className="font-caps text-xs text-muted-foreground uppercase tracking-wider font-mono font-semibold">
            &lt;what-i-can-help-with/&gt;
          </span>
        </div>

        {/* Areas of Help / Capabilities */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {capabilities.map((area) => (
            <div
              key={area}
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-surface/30 border border-border-hairline font-sans text-xs sm:text-[13px] text-ink"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 flex-shrink-0" />
              <span>{area}</span>
            </div>
          ))}
        </div>

        {/* Working Stack with authentic icons */}
        <div className="pt-3 space-y-2.5">
          <span className="font-mono text-xs text-muted-foreground/70 block">
            {"// Current working stack"}
          </span>
          <div className="flex flex-wrap gap-2">
            {coreStack.map((tech) => (
              <span
                key={tech}
                onMouseEnter={playHover}
                className="skill-pill"
              >
                <TechIcon name={tech} className="w-3.5 h-3.5" />
                <span>{tech}</span>
              </span>
            ))}
          </div>
        </div>

        <p className="font-sans text-xs sm:text-[13px] text-muted-foreground leading-relaxed pt-1">
          I also actively explore{" "}
          <span className="text-ink font-medium">AI-assisted development workflows</span>,{" "}
          <span className="text-ink font-medium">fluid UI animations</span>, and{" "}
          <span className="text-ink font-medium">improving existing products</span> with modern frontend architecture.
        </p>
      </section>

      {/* Section: <LET'S-WORK-TOGETHER/> */}
      <section className="space-y-5 pt-2 border-t border-border-hairline/60">
        <div className="flex items-center gap-2 pt-2">
          <span className="font-caps text-xs text-muted-foreground uppercase tracking-wider font-mono font-semibold">
            &lt;let&apos;s-work-together/&gt;
          </span>
        </div>

        <div className="font-sans text-[15px] text-muted-foreground leading-[26px] space-y-3">
          <p>
            If you&apos;re working on something and think I might be a good fit, I&apos;d be happy to hear about it.
          </p>
          <p>
            Whether it&apos;s a junior role, internship, freelance project, collaboration, or simply a conversation about an idea, feel free to reach out.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-3 pt-2">
          <a
            href="mailto:naphiera@gmail.com"
            className="tactile-btn gap-2 h-9 px-4 rounded-md"
          >
            <Mail className="w-3.5 h-3.5 opacity-70" />
            <span>Send Email</span>
          </a>

          <a
            href="mailto:naphiera@gmail.com?subject=Let's%20Schedule%20a%20Call"
            className="tactile-btn gap-2 h-9 px-4 rounded-md"
          >
            <Calendar className="w-3.5 h-3.5 opacity-70" />
            <span>Schedule a Call</span>
          </a>

          <Link
            href="/projects"
            className="tactile-btn gap-2 h-9 px-4 rounded-md"
          >
            <FolderGit2 className="w-3.5 h-3.5 opacity-70" />
            <span>View Projects</span>
          </Link>

          <a
            href="/resume/IT_Resume_ATS.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="tactile-btn gap-2 h-9 px-4 rounded-md"
          >
            <FileText className="w-3.5 h-3.5 opacity-70" />
            <span>Download Resume</span>
          </a>
        </div>
      </section>
    </div>
  );
}

export default WorkClient;
