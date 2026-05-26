"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface ProjectItem {
  title: string;
  description: string;
  url: string;
  link: string;
}

const projects: ProjectItem[] = [
  {
    title: "AssetLink",
    description: "Decentralized Asset Management & Auditing",
    url: "assetlink-supabase-landing.vercel.app",
    link: "https://assetlink-supabase-landing.vercel.app/",
  },
  {
    title: "MovieStream",
    description: "Cinematic Movie Search Experience",
    url: "movie-stream-pi.vercel.app",
    link: "https://movie-stream-pi.vercel.app/",
  },
  {
    title: "BudgetBuddy",
    description: "Smart expense tracker & budget visualizer",
    url: "github.com/bagatata05/budgetbuddy",
    link: "https://github.com/bagatata05/budgetbuddy",
  },
  {
    title: "Freelance",
    description: "Freelance matches & student jobs portal",
    url: "github.com/bagatata05/freelance-marketplace",
    link: "https://github.com/bagatata05/freelance-marketplace",
  },
  {
    title: "Online Business Permit Management System",
    description: "Online Business Permit System for Zamboanga",
    url: "github.com/bagatata05/OnlineBusinessPermit",
    link: "https://github.com/bagatata05/OnlineBusinessPermit",
  },
  {
    title: "Quicknotes",
    description: "Cloud-based minimal note taking app",
    url: "github.com/bagatata05/quicknotes",
    link: "https://github.com/bagatata05/quicknotes",
  },
];

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as const, // custom cubic bezier for premium feel
    },
  },
};

export function ProjectsPageClient() {
  return (
    <div className="min-h-screen bg-bg-primary dark:bg-dark-bg-primary text-text-primary dark:text-dark-text-primary pt-24 pb-32">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header with Animation */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex items-center gap-6 mb-12"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to Home
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary dark:text-dark-text-primary">
            All Projects
          </h1>
        </motion.div>

        {/* Clean Border Grid with Animation */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-border-default dark:border-dark-border"
        >
          {projects.map((project, index) => (
            <motion.a
              key={index}
              variants={itemVariants}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group block border-b border-r border-border-default dark:border-dark-border p-8 hover:bg-bg-secondary dark:hover:bg-dark-bg-secondary transition-all duration-300"
            >
              <div className="flex flex-col gap-3 h-full justify-between">
                <div className="flex flex-col gap-2">
                  <h2 className="text-lg font-bold tracking-tight text-text-primary dark:text-dark-text-primary group-hover:text-accent dark:group-hover:text-accent transition-colors">
                    {project.title}
                  </h2>
                  <p className="text-[14px] text-text-secondary dark:text-dark-text-secondary leading-relaxed font-normal">
                    {project.description}
                  </p>
                </div>
                <div className="mt-4">
                  <span className="inline-block px-2.5 py-1 rounded bg-[#f4f4f5] dark:bg-[#18181b] border border-border-default dark:border-dark-border text-xs font-mono text-[#27272a] dark:text-zinc-300 transition-colors group-hover:border-accent/30 dark:group-hover:border-accent/30">
                    {project.url}
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default ProjectsPageClient;
