import React from "react";

export function AboutSection() {
  return (
    <div className="gsap-about-section bento-card p-4 col-span-1 md:col-span-4 space-y-2 group">
      <h2 className="text-lg font-bold text-text-primary dark:text-dark-text-primary">
        About
      </h2>
      <p className="gsap-about-p text-sm text-text-secondary dark:text-dark-text-secondary leading-relaxed">
        {"I'm Naphier Awalie, a passionate IT Student and Full-Stack Developer based in Zamboanga City, Philippines. I specialize in building high-performance, responsive, and accessible web experiences using modern technologies like React, Next.js, TypeScript, and Node.js. My focus is always on crafting clean, maintainable code that delivers a fast, stable, and reliable user experience."}
        <br />
        <br />
        {"Currently pursuing my BS in Information Technology at Zamboanga Peninsula Polytechnic State University (ZPPSU), I actively apply software engineering best practices to build practical solutions. As an active member of Google Developer Groups (GDG) Zamboanga Region, I am dedicated to community building, open-source collaboration, and continuous learning."}
        <br />
        <br />
        {"Beyond web development, I am deeply passionate about modern UI/UX design, interactive web animations, and optimizing PC gaming systems. I thrive on translating creative ideas into clean, functional digital products that work fast and feel right for users."}
      </p>
    </div>
  );
}
export default AboutSection;
