import React from "react";

export function AboutSection() {
  return (
    <section className="w-full space-y-3.5 select-none mb-14">
      <div className="flex items-center gap-2">
        <span className="font-caps text-xs text-muted-foreground uppercase tracking-wider font-mono font-semibold">
          &lt;about/&gt;
        </span>
      </div>

      <div className="font-sans text-[15px] text-muted-foreground leading-[26px] space-y-4">
        <p>
          I&apos;m <span className="text-ink font-medium">Naphier Awalie</span>, an IT Student and Full-Stack Developer based in <span className="text-ink font-medium">Zamboanga City, Philippines</span>. I specialize in building high-performance, responsive, and accessible web experiences using modern technologies like <span className="text-ink font-medium">React</span>, <span className="text-ink font-medium">Next.js</span>, <span className="text-ink font-medium">TypeScript</span>, and <span className="text-ink font-medium">Node.js</span>. My focus is always on crafting clean, maintainable code that delivers a fast, stable, and reliable user experience.
        </p>

        <p>
          Currently pursuing my BS in Information Technology at <span className="text-ink font-medium">Zamboanga Peninsula Polytechnic State University (ZPPSU)</span>, I actively apply software engineering best practices to build practical digital systems. As an active member of <span className="text-ink font-medium">Google Developer Groups (GDG) Zamboanga Region</span>, I am dedicated to community building, open-source collaboration, and continuous learning.
        </p>

        <p>
          Beyond web development, I am deeply passionate about <span className="text-ink font-medium">modern UI/UX design</span>, <span className="text-ink font-medium">interactive web animations</span>, and <span className="text-ink font-medium">optimizing PC gaming systems</span>. I thrive on translating creative ideas into clean, functional digital products that work fast and feel right for users.
        </p>
      </div>
    </section>
  );
}

export default AboutSection;
