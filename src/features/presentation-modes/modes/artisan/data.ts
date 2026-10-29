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
      "Engineering full-stack architectures combining Next.js, React, and TypeScript with Supabase PostgreSQL backends. Building production-grade apps including MKBRiderTrack (logistics with biometric attendance) and Naphix Résumé (split-screen ISO A4 builder).",
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

export const ABOUT_PHILOSOPHY_ROW_1: AboutPhilosophyItem[] = [
  {
    title: "Tactile Physics & Microinteractions",
    description: "Interfaces should feel mechanical and physical. I build with instant keyboard feedback, Web Audio synthesizers, responsive hover mechanics, and typography tuned for visual hierarchy.",
    badge: "01 // CRAFT",
  },
  {
    title: "Defensive Type Safety",
    description: "Zero-any TypeScript contracts, explicit runtime schemas, and strict data boundaries. Designing APIs and components where invalid states are unrepresentable by construction.",
    badge: "02 // ARCHITECTURE",
  },
  {
    title: "AI-Augmented Engineering",
    description: "Leveraging LLMs and AI agent workflows for rapid scaffolding while maintaining strict human architectural verification, zero hallucination tolerance, and surgical diffs.",
    badge: "03 // VELOCITY",
  },
];

export const ABOUT_PHILOSOPHY_ROW_2: AboutPhilosophyItem[] = [
  {
    title: "Local-First & Offline Resilience",
    description: "Prioritizing client-side compute, optimistic UI mutations, and state caching. Applications should work smoothly even under spotty network conditions without data loss.",
    badge: "04 // RESILIENCE",
  },
  {
    title: "YAGNI & Surgical Simplicity",
    description: "The best code is the code never written. Rejecting speculative abstractions in favor of direct, maintainable solutions that solve real domain problems immediately.",
    badge: "05 // PRAGMATISM",
  },
  {
    title: "Zero-Jank Runtime Hygiene",
    description: "Zero layout shifts (CLS), lazy chunk loading, efficient bundle trees, and GPU-accelerated compositing. Crafting web applications that run at a persistent 60fps.",
    badge: "06 // PERFORMANCE",
  },
];

export const ABOUT_PHILOSOPHY: AboutPhilosophyItem[] = [
  ...ABOUT_PHILOSOPHY_ROW_1,
  ...ABOUT_PHILOSOPHY_ROW_2,
];

export interface WorkspaceGearItem {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  image: string;
  width: number;
  height: number;
  specLabel: string;
  specDetail: string;
}

export const WORKSPACE_GEAR: WorkspaceGearItem[] = [
  {
    id: "asus-vivobook-16",
    name: "ASUS Vivobook 16",
    subtitle: "16-inch · Laptop",
    category: "Laptop",
    image: "/gear/asus-vivobook-16.webp",
    width: 240,
    height: 153,
    specLabel: "Laptop",
    specDetail: "Aluminum Riser Stand",
  },
  {
    id: "mloong-mx301",
    name: "Mloong MX301",
    subtitle: "Tri-Mode · Wireless mouse",
    category: "Mouse",
    image: "/gear/mloong-mouse.webp",
    width: 140,
    height: 240,
    specLabel: "Mouse",
    specDetail: "Wireless Ergonomic",
  },
  {
    id: "zg61-keyboard",
    name: "Z-G61 Mechanical",
    subtitle: "60% · Blue switches",
    category: "Keyboard",
    image: "/gear/zg61-keyboard.webp",
    width: 280,
    height: 162,
    specLabel: "Keyboard",
    specDetail: "White Compact Layout (60% · Blue switches)",
  },
];

export const WORKSPACE_DESK_SPECS = [
  { label: "Laptop", value: "ASUS Vivobook 16", sub: "Aluminum Riser Stand" },
  { label: "External Display", value: '27" IPS Monitor', sub: "Borderless + Cyan LED" },
  { label: "Keyboard", value: "Z-G61 60% Mech", sub: "White Compact Layout" },
  { label: "Mouse", value: "Mloong MX301", sub: "Wireless Ergonomic" },
] as const;

export const WORKSPACE_DESK_ESSENTIALS = [
  { name: "Monstera Plant", desc: "Ceramic planter" },
  { name: "Hot Coffee", desc: "Cork coaster mug" },
  { name: "Leather Journal", desc: "Architecture notes" },
] as const;

export const WORKSPACE_DESK_ARTIFACTS = [
  { name: "Flip Clock", desc: "Pomodoro focus" },
  { name: "Desk Plants", desc: "Visual calm" },
  { name: "Notebook", desc: "System sketches" },
] as const;

export const WORKSPACE_AI_DEV_TOOLS = [
  "Claude",
  "Codex",
  "Gemini",
  "Cursor",
  "Antigravity",
  "OpenCode",
  "VS Code",
  "Supabase",
] as const;

export interface WorkspaceBookItem {
  id: string;
  title: string;
  author: string;
  publisher: string;
  domain: string;
  url: string;
  lesson: string;
}

export const WORKSPACE_BOOKSHELF: WorkspaceBookItem[] = [
  {
    id: "ddia",
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    publisher: "O'Reilly Media",
    domain: "dataintensive.net",
    url: "https://dataintensive.net/",
    lesson:
      "Reliability, scalability, and maintainability are the foundational pillars of lasting data systems.",
  },
  {
    id: "pragprog",
    title: "The Pragmatic Programmer",
    author: "David Thomas & Andrew Hunt",
    publisher: "20th Anniversary Ed.",
    domain: "pragprog.com",
    url: "https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/",
    lesson:
      "Care about your craft, think critically about your work, and build adaptable software.",
  },
  {
    id: "refactoring-ui",
    title: "Refactoring UI",
    author: "Adam Wathan & Steve Schoger",
    publisher: "Tailwind Labs",
    domain: "refactoringui.com",
    url: "https://www.refactoringui.com/",
    lesson:
      "Design with clear visual hierarchy, deliberate spacing, and restrained typography.",
  },
  {
    id: "clean-arch",
    title: "Clean Architecture",
    author: "Robert C. Martin",
    publisher: "Prentice Hall",
    domain: "oreilly.com",
    url: "https://www.oreilly.com/library/view/clean-architecture-a/9780134494272/",
    lesson:
      "Keep core domain logic independent of frameworks, user interfaces, and external databases.",
  },
];


