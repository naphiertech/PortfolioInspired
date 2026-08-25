import React from "react";
import { SectionHeader } from "./SectionHeader";

export function AboutSection() {
  return (
    <section className="w-full space-y-3.5 select-none mb-16" aria-label="About">
      <SectionHeader label="ABOUT" className="mb-3" />

      <div className="font-sans text-[15px] text-muted-foreground leading-[26px] space-y-4">
        <p>
          I&apos;m <span className="text-ink font-medium">Naphier Awalie</span>, an IT student and full-stack developer who enjoys turning ideas into practical web applications with clean interfaces, thoughtful user experiences, and reliable functionality.
        </p>

        <p>
          Most of my work comes from turning ideas into working products, from school systems and productivity tools to personal side projects. I&apos;m especially interested in <span className="text-ink font-medium">UI/UX</span>, <span className="text-ink font-medium">web animation</span>, <span className="text-ink font-medium">AI-assisted development</span>, and learning how real software systems are designed, connected, and improved over time.
        </p>
      </div>
    </section>
  );
}

export default AboutSection;
