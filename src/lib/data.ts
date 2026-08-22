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
  status?: string;
  highlights?: string[];
  buildNotes?: string;
  lessons?: string;
  live?: string;
  github?: string;
  featured?: boolean;
}

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
    live: "https://naphix-resume.netlify.app/",
    status: "Live Production",
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
    live: "https://assetlink-supabase-landing.vercel.app/",
    github: "https://github.com/naphiertech/ASSETLINK-supabase",
    status: "Active Prototype",
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
    live: "https://phierplay.vercel.app/",
    status: "Live Production",
    featured: true,
  },
];

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
    role: "BS Information Technology",
    company: "Zamboanga Peninsula Polytechnic State University",
    year: "2023 - Present",
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
    name: "ZPPSU - College of Information and Computing Sciences",
    href: "https://zppsu.edu.ph",
  },
  {
    name: "Google Developer Groups (GDG) Zamboanga Region",
    href: "https://developers.google.com/community/gdg",
  },
];
