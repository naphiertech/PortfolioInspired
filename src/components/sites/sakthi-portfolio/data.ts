export interface SocialLink {
  name: string;
  url: string;
  type: "twitter" | "whatsapp" | "linkedin" | "github" | "email";
}

export interface HeroData {
  title: string;
  name: string;
  tagline: string;
  status: string;
  bio: string;
  socials: SocialLink[];
}

export interface ExperienceItem {
  title: string;
  timeline: string;
  company: string;
  description: string;
  hasProjectLink?: boolean;
}

export interface EducationItem {
  degree: string;
  timeline: string;
  institution: string;
  description: string;
}

export const HERO_DATA: HeroData = {
  title: "Full-Stack Developer",
  name: "Naphier",
  tagline: "Full-Stack & UI/UX Developer",
  status: "Available for work",
  bio: "I'm an IT student and full-stack developer who enjoys turning ideas into practical web applications with clean interfaces, thoughtful user experiences, and reliable functionality.",
  socials: [
    { name: "X (Twitter)", url: "https://x.com/bagatata05", type: "twitter" },
    { name: "LinkedIn", url: "https://www.linkedin.com/in/naphier-awalie-0551983b5/", type: "linkedin" },
    { name: "GitHub", url: "https://github.com/naphiertech", type: "github" },
    { name: "Email", url: "mailto:naphiera@gmail.com", type: "email" },
  ],
};

export const EXPERIENCE_DATA: ExperienceItem[] = [
  {
    title: "Full-Stack Developer",
    timeline: "2025 - Present",
    company: "Personal & Open Source Projects",
    description:
      "Engineering full-stack architectures combining Next.js, React, and TypeScript with Supabase PostgreSQL backends. Building production-grade apps including MKBRiderTrack (logistics with biometric attendance) and Naphix Resume (split-screen ISO A4 builder).",
    hasProjectLink: true,
  },
  {
    title: "Backend & Systems Developer",
    timeline: "2024 - 2025",
    company: "Technical Practice & System Projects",
    description:
      "Architected relational schemas, PostgreSQL migrations, and Row-Level Security (RLS) policies on Supabase. Engineered data workflows for AssetLink (QR-based school asset management) and modular RESTful API endpoints.",
    hasProjectLink: true,
  },
  {
    title: "Front-End Developer",
    timeline: "2023 - 2024",
    company: "UI Engineering & Web Practice",
    description:
      "Engineered responsive, accessible single-page web applications using modern React, TypeScript, and Tailwind CSS. Built MovieStream with fluid animations, debounced search caching, and live TMDB API integrations.",
    hasProjectLink: true,
  },
];

export const EDUCATION_DATA: EducationItem[] = [
  {
    degree: "BS Information Technology (BS IT)",
    timeline: "2023 - Present",
    institution: "Zamboanga Peninsula Polytechnic State University (ZPPSU)",
    description:
      "Pursuing strong technical grounding in software engineering, database design, computer networks, systems analysis, and modern web architectures at the College of Information and Computing Sciences.",
  },
];
