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

export interface ArtisanGalleryItem {
  id: string;
  src: string;
  title: string;
  caption: string;
  tag: string;
  date: string;
  location?: string;
  aspect?: "landscape" | "portrait" | "square";
}

export const ARTISAN_GALLERY: ArtisanGalleryItem[] = [
  {
    id: "me",
    src: "/gallery/me.jpg",
    title: "Desk Setup & Late-Night Builds",
    caption: "Late hours spent designing interfaces, writing code, and iterating on web applications.",
    tag: "Studio",
    date: "2025",
    location: "Home Workspace",
    aspect: "portrait",
  },
  {
    id: "hackathon-2026",
    src: "/gallery/hacakthon2026.jpg",
    title: "Hackathon 2026",
    caption: "Building full-stack prototypes and presenting under high-intensity development sprints.",
    tag: "Hackathon",
    date: "2026",
    location: "Tech Arena",
    aspect: "landscape",
  },
  {
    id: "hackathon-team",
    src: "/gallery/hackathon-team.jpg",
    title: "Hackathon Engineering Team",
    caption: "Collaborating with fellow student developers, aligning system requirements, and shipping together.",
    tag: "Team",
    date: "2026",
    location: "Campus Arena",
    aspect: "landscape",
  },
  {
    id: "capstone",
    src: "/gallery/capstone.jpg",
    title: "Capstone Project Defense",
    caption: "Defending systems architecture, security patterns, and database design before faculty panelists.",
    tag: "Academic",
    date: "2025",
    location: "ZPPSU CICS",
    aspect: "landscape",
  },
  {
    id: "recursia",
    src: "/gallery/recursia.jpg",
    title: "Recursia Tech Summit",
    caption: "Participating in developer events and engaging with local tech enthusiasts and peer builders.",
    tag: "Community",
    date: "2025",
    location: "Student Summit",
    aspect: "landscape",
  },
  {
    id: "networking",
    src: "/gallery/networking.jpg",
    title: "Developer Community Networking",
    caption: "Exchanging ideas with fellow creators and exploring emerging web technologies.",
    tag: "Networking",
    date: "2024",
    location: "Developer Meetup",
    aspect: "landscape",
  },
  {
    id: "roblox",
    src: "/gallery/roblox.png",
    title: "Virtual World Sandbox",
    caption: "Exploring 3D space architecture and interactive game mechanics during creative downtime.",
    tag: "Creative",
    date: "2024",
    location: "Virtual Sandbox",
    aspect: "landscape",
  },
];

export interface AboutPhilosophyItem {
  title: string;
  description: string;
  badge: string;
}

export const ABOUT_PHILOSOPHY: AboutPhilosophyItem[] = [
  {
    title: "Tactile Craft & Interaction",
    description: "Software should feel responsive and tangible. I care about microinteractions, clean layout physics, and typography that make digital tools delightful.",
    badge: "01 // CRAFT",
  },
  {
    title: "Pragmatic Architecture",
    description: "Solid TypeScript types, well-modeled relational databases, and clean modular code. Choosing simplicity and stability over unnecessary abstraction.",
    badge: "02 // SYSTEMS",
  },
  {
    title: "Continuous Curiosity",
    description: "Always experimenting with new technologies—from edge functions and WebGL to AI agent workflows—while staying grounded in fundamentals.",
    badge: "03 // GROWTH",
  },
];

