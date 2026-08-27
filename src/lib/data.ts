import { AVAILABILITY, EDUCATION, SOCIAL_PROFILES } from "./siteConfig";

export interface TechStackItem {
  name: string;
}

export interface TechSection {
  title: string;
  items: string[];
}

export interface ProjectItem {
  name: string;
  description: string;
  url: string;
  href: string;
}

export interface CertificationItem {
  name: string;
  issuer: string;
  href: string;
  code?: string;
  tag?: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  year: string;
  isCurrent?: boolean;
  description?: string;
  yearNode?: string;
}

export interface RecommendationItem {
  id?: string;
  quote: string;
  author: string;
  title?: string;
  role?: string;
  organization?: string;
  relationship?: string;
  profileUrl?: string;
  status?: "pending" | "approved" | "rejected";
  createdAt?: string;
}

export type ProjectStatus =
  | "live"
  | "active"
  | "wip"
  | "school-project"
  | "archived";

export interface TechnicalDecision {
  title: string;
  description: string;
}

export interface ProjectLearning {
  title: string;
  description: string;
}

export interface CurrentBuild {
  title: string;
  description: string;
  projectSlug?: string;
  href?: string;
  status?: "building" | "improving" | "experimenting";
  updatedAt?: string;
  technologies?: string[];
}

export interface FullProjectItem {
  slug: string;
  title: string;
  category: string;
  year: string;
  image: string;
  color?: string;
  role?: string;
  client?: string;
  tags: string[];
  overview: string;
  fullDescription?: string;
  designScreens?: string[];
  gallery?: string[];
  techStack: string[];
  features?: string[];
  status?: ProjectStatus;
  technicalDecisions?: TechnicalDecision[];
  learnings?: ProjectLearning[];
  highlights?: string[];
  buildNotes?: string;
  lessons?: string;
  live?: string;
  github?: string;
  featured?: boolean;
}

export const projectStatusConfig: Record<
  ProjectStatus,
  { label: string; dotClass: string; badgeClass: string }
> = {
  live: {
    label: "LIVE",
    dotClass: "bg-emerald-500",
    badgeClass: "text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
  active: {
    label: "ACTIVE",
    dotClass: "bg-cyan-500",
    badgeClass: "text-cyan-500 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  },
  wip: {
    label: "WIP",
    dotClass: "bg-amber-500",
    badgeClass: "text-amber-500 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
  },
  "school-project": {
    label: "SCHOOL PROJECT",
    dotClass: "bg-indigo-500 dark:bg-indigo-400",
    badgeClass: "text-indigo-500 dark:text-indigo-300 bg-indigo-500/10 border-indigo-500/20",
  },
  archived: {
    label: "ARCHIVED",
    dotClass: "bg-zinc-500",
    badgeClass: "text-zinc-500 dark:text-zinc-400 bg-zinc-500/10 border-zinc-500/20",
  },
};

// Single Source of Truth: All Featured & Side Projects
export const fullProjects: FullProjectItem[] = [
  {
    slug: "naphix-resume",
    title: "Naphix Resume",
    category: "Web Application",
    year: "2026",
    image: "/projects/resumebuilder.png",
    color: "bg-[#0f172a]",
    role: "Fullstack Developer & Creator",
    client: "Personal Project",
    tags: ["React 18", "TypeScript", "Tailwind CSS", "Vite", "Zustand"],
    overview:
      "Naphix Resume is a privacy-first resume builder with a real-time split-screen editor and live A4 preview, drag-and-drop customization, and native PDF and Word export.",
    fullDescription:
      "Naphix Resume is a modern, client-side resume workspace created to eliminate the frustrations of clunky, template-restricted builders. Designed around a live split-screen interface, every edit updates an ISO 216 A4 preview in real time without lag. It features dynamic custom section schemas, smooth drag-and-drop reordering, and native dual export: selectable ATS-compliant vector PDF and fully editable Word .docx files. Everything runs 100% locally in the browser with zero server data collection.",
    gallery: [
      "/projects/resumebuilder-1.png",
      "/projects/resumebuilder-2.png",
      "/projects/resumebuilder-3.png",
    ],
    designScreens: [
      "/projects/resumebuilder.png",
      "/projects/resumebuilder-1.png",
      "/projects/resumebuilder-2.png",
      "/projects/resumebuilder-3.png",
    ],
    techStack: [
      "React 18",
      "TypeScript",
      "Tailwind CSS 3.4",
      "Vite",
      "Zustand",
      "@dnd-kit",
      "docx",
      "@react-pdf/renderer",
      "Lucide React",
      "Zod",
    ],
    features: [
      "Real-time split-screen workspace with 1:1 ISO 216 A4 live preview mirror",
      "Smooth drag-and-drop section and entry reordering powered by @dnd-kit",
      "Universal custom section system with dynamic schema fields",
      "Dual native export: selectable ATS-compliant vector PDF and editable Word .docx",
      "Adaptive responsive layout for desktop, laptop, tablet, and mobile",
      "100% client-side local storage with zero server tracking",
      "Undo/redo history with keyboard shortcuts and debounced state management",
    ],
    technicalDecisions: [
      {
        title: "Why 100% client-side local storage?",
        description:
          "Resume content stays entirely within the user's browser local storage. This preserves personal identity privacy by default and eliminates remote server accounts, login friction, and database latency.",
      },
      {
        title: "Why Zustand for centralized workspace state?",
        description:
          "A centralized immutable store coordinates real-time synchronization between the split-screen form inputs, dynamic section ordering, live ISO A4 preview, and undo/redo history without props drilling or unnecessary re-renders.",
      },
      {
        title: "Why dual export pipelines for PDF and Word (.docx)?",
        description:
          "Instead of rasterized HTML screen capture which degrades ATS compliance, @react-pdf/renderer produces sharp, selectable vector PDF documents, while the docx library compiles a structured, fully editable Microsoft Word document.",
      },
    ],
    learnings: [
      {
        title: "Document layout mathematics require strict CSS coordinate isolation",
        description:
          "Matching ISO 216 A4 aspect ratios across varying screen sizes required fixed print-coordinate scaling to ensure the split-screen browser preview remained 1:1 identical to the compiled PDF output.",
      },
      {
        title: "Managing complex drag-and-drop state transitions",
        description:
          "Handling nested dynamic sections with @dnd-kit required careful sensor tuning and stable ID generation so reordering never dropped active form focus or unsaved text.",
      },
    ],
    live: "https://naphix-resume.netlify.app/",
    github: `${SOCIAL_PROFILES.github}/resumebuilder`,
    status: "live",
    featured: true,
  },
  {
    slug: "assetlink",
    title: "AssetLink",
    category: "Asset Management",
    year: "2026",
    image: "/projects/assetlink.png",
    color: "bg-[#E6F0FF]",
    role: "Fullstack Developer",
    client: "School Project",
    tags: ["Next.js", "Supabase", "TypeScript", "Tailwind CSS", "QR Logic"],
    overview:
      "AssetLink is a school asset and repair tracking system. Leveraging QR code technology, it allows teachers and staff to report and track maintenance issues with a simple scan, streamlining communication between faculty and maintenance teams.",
    fullDescription:
      "AssetLink is a centralized hardware and facility tracking system designed for educational institutions. It connects physical school assets to a digital repair and inventory workflow using uniquely generated QR codes. Faculty members can scan an equipment badge to submit a repair ticket, while maintenance staff and administrators receive immediate real-time status updates through role-specific dashboards.",
    gallery: [
      "/projects/assetlink-1.png",
      "/projects/assetlink-2.png",
    ],
    designScreens: ["/projects/assetlink-1.png", "/projects/assetlink-2.png"],
    techStack: [
      "Next.js",
      "Supabase",
      "TypeScript",
      "Tailwind CSS",
      "Lucide React",
      "Framer Motion",
    ],
    features: [
      "QR-Code Asset Scanning for rapid equipment lookup and ticketing",
      "Real-time repair tracking and status progression",
      "Role-based dashboards (Teacher, Admin, Maintenance)",
      "Automated status updates and ticket notifications",
      "Comprehensive school asset inventory management",
      "Intuitive mobile-first reporting interface",
    ],
    technicalDecisions: [
      {
        title: "Why Supabase with Row-Level Security?",
        description:
          "PostgreSQL Row-Level Security (RLS) allowed granular permission modeling between teachers, maintenance staff, and administrators directly at the database layer, ensuring clean role separation with real-time ticket subscription updates.",
      },
      {
        title: "Why dynamic QR code asset tags?",
        description:
          "Equipping physical equipment with unique QR identifiers allows staff to scan and open maintenance tickets in seconds without typing serial numbers or navigating long inventory catalogs.",
      },
    ],
    learnings: [
      {
        title: "Role-based authorization is cleaner at the database boundary",
        description:
          "Leveraging PostgreSQL RLS policies in Supabase proved significantly more resilient against unauthorized state updates than relying solely on client-side routing guards.",
      },
      {
        title: "Physical-to-digital workflows demand fast mobile UX",
        description:
          "Testing asset scanning on mobile devices highlighted the need for instant camera initialization and high-contrast status feedback in variable classroom and workshop lighting.",
      },
    ],
    live: "https://assetlink-supabase-landing.vercel.app/",
    github: `${SOCIAL_PROFILES.github}/ASSETLINK-supabase`,
    status: "school-project",
    featured: true,
  },
  {
    slug: "moviestream",
    title: "MovieStream",
    category: "Next-Gen Cinematic Experience",
    year: "2026",
    image: "/projects/moviestream.png",
    color: "bg-[#0A0A0A]",
    role: "Fullstack Developer",
    client: "Personal Project",
    tags: ["Next.js", "React", "Tailwind CSS", "Framer Motion", "TMDB API"],
    overview:
      "MovieStream is a high-fidelity, editorial-style movie discovery platform built for the modern web. It combines live TMDB data with a premium, cinematic user interface designed for enthusiasts who appreciate bold typography, smooth motion, and a distraction-free viewing experience.",
    fullDescription:
      "MovieStream is an editorial cinema portal focusing on atmospheric typography, deep contrast, and motion-first interactions. Integrating with TMDB's live catalog, it provides curated trending carousels, genre hubs, and instant search while maintaining high frame-rate transitions and fluid layout shifts.",
    gallery: [
      "/projects/moviestream-1.png",
      "/projects/moviestream-2.png",
    ],
    designScreens: [
      "/projects/moviestream.png",
      "/projects/moviestream-1.png",
      "/projects/moviestream-2.png",
    ],
    techStack: [
      "Next.js 15",
      "React 19",
      "Tailwind CSS 4.0",
      "Motion 12",
      "Lucide React",
      "TMDB API",
    ],
    features: [
      "Live TMDB API integration with real-time movie & TV metadata",
      "Secure Edge middleware for request protection",
      "Dynamic Genre discovery hubs and filter matrices",
      "Persistent intelligent watch history in local storage",
      "Motion-first cinematic animations and smooth page transitions",
      "Instant debounced search across thousands of titles",
    ],
    technicalDecisions: [
      {
        title: "Why Edge API proxying for TMDB data?",
        description:
          "Proxying TMDB API requests through Next.js server routes protects upstream API credentials, applies response caching headers, and shapes movie payloads to reduce client payload sizes.",
      },
      {
        title: "Why Motion 12 with hardware-accelerated layouts?",
        description:
          "Cinematic media browsing requires buttery carousel scrolling and layout-preserving image expand transitions without causing frame drops or layout recalculation spikes.",
      },
    ],
    learnings: [
      {
        title: "Debouncing and caching high-frequency search requests",
        description:
          "Implementing debounced query handlers with in-memory request caching drastically reduced TMDB rate-limit pressure and eliminated UI stutter during fast typing.",
      },
      {
        title: "Progressive placeholders for heavy media grids",
        description:
          "Progressive poster placeholders and lazy poster image loading kept the initial viewport payload minimal even when browsing extensive genre catalogs.",
      },
    ],
    live: "https://phierplay.vercel.app/",
    status: "live",
    featured: true,
  },
  {
    slug: "mkb-ridertrack",
    title: "MKBRiderTrack",
    category: "Workforce & Logistics Platform",
    year: "2026",
    image: "/projects/mkb.png",
    color: "bg-[#1a1410]",
    role: "Lead Fullstack Developer",
    client: "Capstone Project",
    tags: [
      "React 18",
      "Next.js",
      "Supabase",
      "TypeScript",
      "PostgreSQL",
      "Tailwind CSS",
      "Leaflet",
    ],
    overview:
      "MKBRiderTrack is an enterprise workforce operations and rider logistics system combining biometric face verification, GPS geofencing, parcel delivery auditing, role-based portals (Admin, HR, Payroll, Rider), and automated payroll snapshotting.",
    fullDescription:
      "MKBRiderTrack is a comprehensive full-stack workforce and fleet logistics management platform built for delivery rider operations. Backed by Supabase PostgreSQL with strict Row Level Security (RLS), it unifies role-based portals for Admins, HR managers, Payroll accountants, and Field Riders. Features include real-time biometric facial recognition and GPS geofence validation for shift attendance, offline-first sync with Dexie.js, interactive zone mapping with Leaflet, immutable payroll snapshots with automated formula audits, and a modern Next.js landing portal.",
    gallery: [
      "/projects/mkb-1.png",
      "/projects/mkb-2.png",
    ],
    designScreens: [
      "/projects/mkb.png",
      "/projects/mkb-1.png",
      "/projects/mkb-2.png",
    ],
    techStack: [
      "React 18",
      "Next.js 16",
      "Supabase",
      "TypeScript",
      "PostgreSQL",
      "Tailwind CSS",
      "Leaflet",
      "Dexie.js",
      "Framer Motion",
      "Recharts",
      "Vitest",
    ],
    features: [
      "Role-based portal architecture with isolated dashboards for Admin, HR, Payroll, and Riders",
      "Biometric facial verification & GPS geofencing validation for attendance clock-ins",
      "Real-time fleet monitoring, route history replay, and operational zone boundary tracking with Leaflet",
      "Offline-first synchronization with Dexie.js for uninterrupted field logging in low-connectivity areas",
      "Automated payroll calculations with immutable finalized snapshots and payslip generation",
      "Row-Level Security (RLS), real-time subscriptions, and private document storage on Supabase",
    ],
    technicalDecisions: [
      {
        title: "Why offline-first IndexedDB (Dexie.js) synchronization for riders?",
        description:
          "Delivery riders frequently operate in low-connectivity environments. Dexie.js stores attendance and GPS check-ins locally in an idempotent queue, automatically syncing and resolving conflicts with Supabase once network connectivity is restored.",
      },
      {
        title: "Why multi-role Row Level Security (RLS) over API-layer authorization?",
        description:
          "Enforcing security directly at the PostgreSQL layer via Supabase RLS ensures zero unauthorized cross-tenant data leakage between Riders, HR staff, and Payroll accountants regardless of client-side queries.",
      },
      {
        title: "Why immutable payroll snapshots?",
        description:
          "To maintain regulatory auditability and prevent retroactive calculation discrepancies, finalized payroll cycles store point-in-time rate matrices and immutable attendance data snapshots.",
      },
    ],
    learnings: [
      {
        title: "Real-time geospatial state requires strict throttle & boundary isolation",
        description:
          "Tracking dozens of active riders simultaneously required tuning Leaflet coordinate updates and spatial turf.js computations to maintain 60 FPS UI rendering without main-thread blocking.",
      },
      {
        title: "Designing enterprise-grade multi-role permission matrices",
        description:
          "Structuring clean boundary transitions across 4 distinct operational roles reinforced the importance of atomic permission sets and resilient database migrations.",
      },
    ],
    live: "https://mkbridertrack.vercel.app/",
    github: `${SOCIAL_PROFILES.github}/MKB-supabase`,
    status: "wip",
    featured: true,
  },
];

const currentBuildProject = getProjectBySlug("mkb-ridertrack")!;

export const currentBuild: CurrentBuild = {
  title: currentBuildProject.title,
  description:
    "Building a full-stack workforce operations and rider logistics platform with biometric attendance, GPS geofencing, parcel auditing, and automated payroll snapshots.",
  projectSlug: currentBuildProject.slug,
  status: "building",
  updatedAt: "Aug 2026",
  // The progress card shows the first six technologies from the project.
  technologies: currentBuildProject.techStack.slice(0, 6),
};

export function normalizeTechName(name: string): string {
  if (!name) return "";
  const clean = name.trim().toLowerCase().replace(/[\s._-]+/g, "");
  if (clean === "next" || clean === "nextjs" || clean === "nextjs15" || clean === "next15") return "next.js";
  if (clean === "react" || clean === "react18" || clean === "react19" || clean === "reactjs") return "react";
  if (clean === "tailwind" || clean === "tailwindcss" || clean === "tailwindcss34" || clean === "tailwind40" || clean === "tailwindcss40") return "tailwind css";
  if (clean === "postgres" || clean === "postgresql") return "postgresql";
  if (clean === "node" || clean === "nodejs") return "node.js";
  if (clean === "express" || clean === "expressjs") return "express.js";
  if (clean === "vue" || clean === "vuejs") return "vue.js";
  if (clean === "motion" || clean === "motion12" || clean === "framermotion") return "framer motion";
  if (clean === "dndkit" || clean === "@dndkit") return "@dnd-kit";
  if (clean === "tmdb" || clean === "tmdbapi") return "tmdb api";
  if (clean === "typescript" || clean === "ts") return "typescript";
  if (clean === "javascript" || clean === "js") return "javascript";
  return clean;
}

export function getProjectsUsingTech(tech: string): FullProjectItem[] {
  if (!tech) return [];
  const target = normalizeTechName(tech);
  return fullProjects.filter((p) => {
    const allTech = [...(p.techStack || []), ...(p.tags || [])];
    return allTech.some((t) => normalizeTechName(t) === target);
  });
}

export function getAllTechItems(): string[] {
  const set = new Set<string>();
  techSections.forEach((sec) => {
    sec.items.forEach((item) => set.add(item));
  });
  fullProjects.forEach((p) => {
    (p.techStack || []).forEach((t) => set.add(t));
    (p.tags || []).forEach((t) => set.add(t));
  });
  return Array.from(set);
}

export function getCanonicalTechName(query: string): string | null {
  if (!query) return null;
  const target = normalizeTechName(query);
  const all = getAllTechItems();
  const exact = all.find((item) => normalizeTechName(item) === target);
  return exact || null;
}

export function getProjectBySlug(slug: string): FullProjectItem | undefined {
  return fullProjects.find((p) => p.slug === slug);
}

// Dynamically derived summary projects list for backward compatibility
export const projects: ProjectItem[] = fullProjects
  .filter((p) => p.featured !== false)
  .map((p) => ({
    name: p.title,
    description: p.overview,
    url: (p.live || p.github || "").replace(/^https?:\/\//, ""),
    href: p.live || p.github || "#",
  }));

// Single Source of Truth: Tech Stack Categories
export const techSections: TechSection[] = [
  {
    title: "Frontend",
    items: [
      "HTML5",
      "CSS3",
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Vue.js",
      "Tailwind CSS",
      "Flutter",
      "Dart",
      "Capacitor",
    ],
  },
  {
    title: "Backend",
    items: [
      "Node.js",
      "Express.js",
      "PHP",
      "Laravel",
      "Python",
      "FastAPI",
      "GraphQL",
      "Prisma",
    ],
  },
  {
    title: "Databases & Cloud",
    items: [
      "Supabase",
      "MySQL",
      "PostgreSQL",
      "MongoDB",
      "Firebase",
    ],
  },
  {
    title: "AI & Machine Learning",
    items: [
      "TensorFlow",
      "PyTorch",
      "Codex",
      "Gemini",
      "Claude",
      "Ollama",
    ],
  },
  {
    title: "Animation & Design",
    items: [
      "Figma",
      "GSAP",
      "Framer Motion",
      "Lottie",
    ],
  },
  {
    title: "DevOps & Tools",
    items: [
      "Docker",
      "Jenkins",
      "GitHub Actions",
      "Git",
      "GitHub",
      "VS Code",
      "Postman",
      "Vercel",
    ],
  },
];

// Curated order for the Work page; display names come from the shared catalog.
export const coreTechStack = [
  "React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "Supabase", "PostgreSQL",
].map(getCanonicalTechName).filter((tech): tech is string => tech !== null);

// Full-page capability copy is distinct from the compact profileInfo summaries.
export const workCapabilities = [
  "Responsive web applications",
  "Clean user interfaces",
  "Dashboards & internal systems",
  "High-converting landing pages",
  "Interactive web experiences",
  "AI-assisted development & UI animation",
];

export const certifications: CertificationItem[] = [
  {
    name: "Build with AI 2026",
    issuer: "Google Developer Groups Zamboanga",
    href: "/certificates/BuildWithAI_2026.png",
    code: "440727A3",
    tag: "GOOGLE",
  },
  {
    name: "Build with AI Hackathon 2026",
    issuer: "Google Developers Group Zamboanga",
    href: "#",
    tag: "GOOGLE",
  },
  {
    name: "Artificial Intelligence for Education: Unlocking the Power of NotebookLM",
    issuer: "Department of Information and Communications Technology (DICT)",
    href: "/certificates/DICT-NotebookLM.png",
    code: "AAR-TOD-2026-ZAM-010-193",
    tag: "DICT",
  },
  {
    name: "Google I/O Extended Zamboanga Peninsula",
    issuer: "Google Developer Groups Zamboanga",
    href: "/certificates/GoogleIOExtended.jpg",
    code: "BD9B3110",
    tag: "GOOGLE",
  },
  {
    name: "Build with AI | Zamboanga Peninsula",
    issuer: "Google Developer Groups Zamboanga",
    href: "/certificates/BuildWithAIZampen.jpg",
    code: "6D72DF79",
    tag: "GOOGLE",
  },
];

export const experiences: ExperienceItem[] = [
  {
    role: "Full-Stack Developer",
    company: "Freelance & Student",
    year: "2025 - Present",
    yearNode: "PRESENT",
    isCurrent: true,
    description:
      "Building web & mobile applications, solving real problems, and learning every day.",
  },
  {
    role: "Backend Developer",
    company: "Freelance & Student",
    year: "2024 - 2025",
    yearNode: "2025",
    description:
      "Focused on building scalable APIs, databases, and server-side logic.",
  },
  {
    role: "Front-End Developer",
    company: "Freelance & Student",
    year: "2023 - 2024",
    yearNode: "2024",
    description:
      "Turned ideas into interactive and accessible web experiences.",
  },
  {
    role: EDUCATION.degree,
    company: EDUCATION.institution,
    year: EDUCATION.period,
    yearNode: "2023",
    description:
      "Formal education that strengthened my technical and problem-solving foundation.",
  },
  {
    role: "Hello World! 👋🏻",
    company: "Wrote my first line of code",
    year: "2022",
    yearNode: "2022",
    description: "The beginning of a journey I'm still excited about.",
  },
];

export const recommendations: RecommendationItem[] = [];

export const galleryImages: string[] = [
  "/gallery/capstone.jpg",
  "/gallery/hacakthon2026.jpg",
  "/gallery/hackathon-team.jpg",
  "/gallery/me.jpg",
  "/gallery/networking.jpg",
  "/gallery/recursia.jpg",
  "/gallery/roblox.png",
];

export const memberOf = [
  {
    name: `${EDUCATION.abbreviation} - ${EDUCATION.department}`,
    href: EDUCATION.website,
  },
  {
    name: "Google Developer Groups (GDG) Zamboanga Region",
    href: "https://developers.google.com/community/gdg",
  },
];

export interface CapabilityGroup {
  id: string;
  items: string[];
}

export interface ProfileInfoData {
  currentFocus: {
    description: string;
    terminalLine: string;
  };
  whatIBuild: {
    groups: CapabilityGroup[];
  };
  howIWork: {
    principles: string[];
  };
  quickFacts: {
    label: string;
    value: string;
  }[];
}

export const profileInfo: ProfileInfoData = {
  currentFocus: {
    description:
      "Building accessible, performant, and polished digital experiences while strengthening real-world full-stack skills.",
    terminalLine: "> learn · build · iterate · ship",
  },
  whatIBuild: {
    groups: [
      {
        id: "01",
        items: ["Full-Stack Web Apps", "Responsive Interfaces"],
      },
      {
        id: "02",
        items: ["Dashboards & Portals", "APIs & Integrations"],
      },
      {
        id: "03",
        items: ["UI Systems & Tooling", "Database Tools"],
      },
    ],
  },
  howIWork: {
    principles: [
      "Clean architecture & modularity",
      "Thoughtful, accessible interfaces",
      "Fast iteration & continuous learning",
    ],
  },
  quickFacts: [
    { label: "OPEN TO", value: AVAILABILITY.openTo },
    { label: "WORK SETUP", value: AVAILABILITY.workSetup },
    { label: "PROJECT STYLE", value: "Product-focused web applications" },
    { label: "CORE FOCUS", value: "UI Engineering + Full-Stack Architecture" },
    { label: "INTERESTS", value: "SaaS · Dashboards · Developer Tools" },
  ],
};
