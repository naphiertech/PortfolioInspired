"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";
import { SITE_NAME } from "@/lib/siteConfig";
import { sectionContainerVariants, contentBlockVariants } from "@/lib/motion";

export function AboutSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView={shouldReduceMotion ? undefined : "visible"}
      viewport={{ once: true, amount: 0.2 }}
      variants={shouldReduceMotion ? undefined : sectionContainerVariants}
      className="w-full space-y-3.5 select-none mb-16"
      aria-label="About"
    >
      <SectionHeader label="ABOUT" className="mb-3" />

      <motion.div
        variants={shouldReduceMotion ? undefined : contentBlockVariants}
        className="font-sans text-[15px] text-muted-foreground leading-[26px] space-y-4"
      >
        <p>
          I&apos;m <span className="text-ink font-medium">{SITE_NAME}</span>, an IT student and full-stack developer who enjoys turning ideas into practical web applications with clean interfaces, thoughtful user experiences, and reliable functionality.
        </p>

        <p>
          Most of my work comes from turning ideas into working products, from school systems and productivity tools to personal side projects. I&apos;m especially interested in <span className="text-ink font-medium">UI/UX</span>, <span className="text-ink font-medium">web animation</span>, <span className="text-ink font-medium">AI-assisted development</span>, and learning how real software systems are designed, connected, and improved over time.
        </p>
      </motion.div>
    </motion.section>
  );
}

export default AboutSection;
