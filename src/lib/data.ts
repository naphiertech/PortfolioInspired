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
}

export interface ExperienceItem {
  role: string;
  company: string;
  year: string;
  isCurrent?: boolean;
}

export interface RecommendationItem {
  quote: string;
  author: string;
  title: string;
}

export const techSections: TechSection[] = [
  {
    title: "Frontend",
    items: [
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Tailwind CSS",
      "Framer Motion",
      "Locomotive Scroll",
    ],
  },
  {
    title: "Backend",
    items: ["Node.js", "Express.js", "PostgreSQL", "MongoDB"],
  },
  {
    title: "Specialty",
    items: [
      "PC Gaming Systems",
      "Graphic Design",
      "Animations",
      "UI/UX Design",
    ],
  },
];

export const projects: ProjectItem[] = [
  {
    name: "MovieStream",
    description: "Cinematic Movie Search Experience",
    url: "movie-stream-pi.vercel.app/",
    href: "https://movie-stream-pi.vercel.app/",
  },
  {
    name: "AssetLink",
    description: "Decentralized Asset Management & Auditing",
    url: "assetlink-supabase-landing.vercel.app/",
    href: "https://assetlink-supabase-landing.vercel.app/",
  },
];

export const certifications: CertificationItem[] = [
  {
    name: "Build with AI 2026",
    issuer: "Google Developer Groups Zamboanga",
    href: "/certificates/BuildWithAI_2026.png",
    code: "440727A3",
  },
  {
    name: "Build with AI Hackathon 2026",
    issuer: "Google Developers Group Zamboanga",
    href: "#",
  },
  {
    name: "Artificial Intelligence for Education: Unlocking the Power of NotebookLM",
    issuer: "Department of Information and Communications Technology (DICT)",
    href: "/certificates/DICT-NotebookLM.png",
    code: "AAR-TOD-2026-ZAM-010-193",
  },
  {
    name: "Google I/O Extended Zamboanga Peninsula",
    issuer: "Google Developer Groups Zamboanga",
    href: "/certificates/GoogleIOExtended.jpg",
    code: "BD9B3110",
  },
  {
    name: "Build with AI | Zamboanga Peninsula",
    issuer: "Google Developer Groups Zamboanga",
    href: "/certificates/BuildWithAIZampen.jpg",
    code: "6D72DF79",
  },
];

export const experiences: ExperienceItem[] = [
  {
    role: "Full-Stack Developer",
    company: "Freelance & Student",
    year: "2025 - Present",
    isCurrent: true,
  },
  {
    role: "Backend Developer",
    company: "Freelance & Student",
    year: "2024 - 2025",
  },
  {
    role: "Front-End Developer",
    company: "Freelance & Student",
    year: "2023 - 2024",
  },
  {
    role: "BS Information Technology",
    company: "Zamboanga Peninsula Polytechnic State University",
    year: "2023 - Present",
  },
  {
    role: "Hello World! 👋🏻",
    company: "Wrote my first line of code",
    year: "2022",
  },
];

export const recommendations: RecommendationItem[] = [
  {
    quote:
      "Naphier is one of the most talented software developers I've mentored. He is a fast learner, and he always makes sure to deliver quality output given a period of time. He is also very keen on learning new technologies, and I find him to be objectively passionate about tech. He's definitely someone you want on your team.",
    author: "Cris Lawrence Adrian Militante",
    title: "ICT Director at GCM",
  },
  {
    quote:
      "Intelligent software engineer. Naphier takes lead during software development and can handle and manage teams well.",
    author: "Ken Gorro",
    title: "Senior Developer at Fullscale",
  },
  {
    quote:
      "Was an intern at PocketDevs and sir Naphier was our main trainer for the different technologies we use in the company such as Laravel, React, and Bootstrap. With his guidance, I was equipped with some of the current trends and insights in the tech industry which enabled me to succeed.",
    author: "Patrick Vince Velasco",
    title: "Software Engineer, YNS",
  },
  {
    quote:
      "Sir Naphier's teaching approach is incredibly hands-on, and the projects significantly accelerated my learning process in web development. I am truly grateful for the mentorship I received from him during my web development internship.",
    author: "John Edmerson Pizarra",
    title: "Jr. Full-stack Developer, PocketDevs",
  },
  {
    quote:
      "Naphier is a dedicated student and software developer who shows professionalism in whatever he does. His software projects during his academic years are up to standard and are highly regarded by the university. He also demonstrated social awareness and leadership skills through active involvement in local groups.",
    author: "Glenn Pepito",
    title: "Professor at University of San Carlos",
  },
  {
    quote:
      "Naphier and I worked together in various projects where I saw his tenacity to deliver what he promised to do. He is able to meet deadlines without sacrificing the quality of the output, and at times even exceeding the set goals. His dedication to pursue his craft and his mindset as a lifelong learner allow him to be easily mentored, as he is eager to learn new technologies. His enthusiasm at new opportunities makes him a great asset because he does everything with renewed energy.",
    author: "Van Honoridez",
    title: "Application Development Analyst at Accenture",
  },
];

export interface FullProjectItem {
  title: string;
  category: string;
  year: string;
  image: string;
  color: string;
  role: string;
  client: string;
  tags: string[];
  overview: string;
  designScreens: string[];
  techStack: string[];
  features: string[];
  live?: string;
  github?: string;
}

export const fullProjects: FullProjectItem[] = [
  {
    title: "AssetLink",
    category: "Asset Management",
    year: "2026",
    image: "/projects/assetlink.png",
    color: "bg-[#E6F0FF]",
    role: "Fullstack Developer",
    client: "School Project",
    tags: ["Next.js", "Supabase", "TypeScript", "Tailwind CSS", "QR Logic"],
    overview:
      "AssetLink is a revolutionary school asset and repair tracking system. By leveraging QR code technology, it allows teachers and staff to report and track maintenance issues with a simple scan, streamlining communication between faculty and maintenance teams.",
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
      "QR-Code Asset Scanning",
      "Real-time Repair Tracking",
      "Role-based Dashboards (Teacher, Admin, Maintenance)",
      "Automated Status Updates",
      "Comprehensive Asset Inventory",
      "Intuitive Reporting Interface",
    ],
    live: "https://assetlink-supabase-landing.vercel.app/",
    github: "https://github.com/bagatata05/ASSETLINK-supabase",
  },
  {
    title: "MovieStream",
    category: "Next-Gen Cinematic Experience",
    year: "2026",
    image: "/projects/moviestream.png",
    color: "bg-[#0A0A0A]",
    role: "Fullstack Developer",
    client: "Personal Project",
    tags: ["Next.js 15", "React 19", "Tailwind 4", "Motion 12", "TMDB API"],
    overview:
      "MovieStream is a high-fidelity, editorial-style movie discovery platform built for the modern web. It combines live TMDB data with a premium, cinematic user interface designed for enthusiasts who appreciate bold typography, smooth motion, and a distraction-free viewing experience.",
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
      "Live TMDB Integration",
      "Secure Middleware",
      "Dynamic Genres Hub",
      "Intelligent Watch History",
      "Motion-First Design",
      "Advanced Search",
    ],
    live: "https://movie-stream-pi.vercel.app/",
  },
  {
    title: "BudgetBuddy",
    category: "App Development",
    year: "2025",
    image: "/projects/budgetbuddy.png",
    color: "bg-[#FDF6D5]",
    role: "App Developer",
    client: "Personal Project",
    tags: ["Flutter", "Dart", "Provider", "SharedPreferences"],
    overview:
      "BudgetBuddy is a smart financial companion designed to help users track expenses, set budgets, and achieve their financial goals with ease. Built with modern technologies, it offers a seamless and intuitive experience for personal finance management.",
    designScreens: [
      "/projects/budgetbuddy-1.png",
      "/projects/budgetbuddy-2.png",
      "/projects/budgetbuddy-3.png",
    ],
    techStack: [
      "Flutter",
      "Dart",
      "Provider",
      "go_router",
      "SharedPreferences",
    ],
    features: [
      "Intuitive Dashboard with expense visualization",
      "Category-based expense tracking with pie charts",
      "Weekly and monthly spending trend charts",
      "Persistent local storage with SharedPreferences",
      "Glass-morphism UI with smooth animations",
    ],
    github: "https://github.com/bagatata05/budgetbuddy",
  },
  {
    title: "Freelance",
    category: "Frontend Development",
    year: "2025",
    image: "/projects/freelance.png",
    color: "bg-[#FFD6E8]",
    role: "Frontend Developer",
    client: "School Project",
    tags: ["React", "TypeScript", "TailwindCSS", "React Router"],
    overview:
      "A professional portfolio for a freelance creative, focusing on high-performance animations and a unique aesthetic that highlights their design and coding capabilities. This platform is built to provide an immersive experience for potential clients and collaborators.",
    designScreens: [
      "/projects/freelance-1.png",
      "/projects/freelance-2.png",
      "/projects/freelance-3.png",
    ],
    techStack: [
      "React 18",
      "TypeScript",
      "Tailwind CSS",
      "React Router v6",
      "React Context API",
    ],
    features: [
      "Smooth scroll implementation",
      "Dynamic project gallery",
      "Responsive and accessible design",
      "Optimized performance for mobile devices",
    ],
    github: "https://github.com/bagatata05/freelance-marketplace/",
  },
  {
    title: "Online Business Permit Management System",
    category: "Web Development",
    year: "2025",
    image: "/projects/obms.png",
    color: "bg-[#E5E5E5]",
    role: "Fullstack Developer",
    client: "School Project",
    tags: ["PHP", "MySQL", "JavaScript", "CSS"],
    overview:
      "A comprehensive digital solution for local government units to streamline the business permit application process. This system reduces paper usage and wait times through an intuitive online portal.",
    designScreens: [
      "/projects/obms-1.png",
      "/projects/obms-2.png",
      "/projects/obms-3.png",
    ],
    techStack: ["PHP", "MySQL", "JavaScript", "CSS", "AJAX"],
    features: [
      "User-friendly application portal",
      "Admin dashboard for application review",
      "Role-based access control (Admin, Staff, Applicant)",
      "Automated email notifications",
      "Secure document upload and storage",
    ],
    github: "https://github.com/bagatata05/OnlineBusinessPermit",
  },
  {
    title: "Quicknotes",
    category: "App Development",
    year: "2025",
    image: "/projects/quicknotes.png",
    color: "bg-[#C4F5D6]",
    role: "Mobile Developer",
    client: "Personal Project",
    tags: ["Flutter", "Dart", "Provider", "SharedPreferences"],
    overview:
      "Quicknotes is a lightweight and blazing-fast note-taking application designed for capturing thoughts on the go. It prioritizes speed and simplicity, ensuring that nothing gets in the way of your ideas.",
    designScreens: ["/projects/quicknotes-1.png", "/projects/quicknotes-2.png"],
    techStack: [
      "Flutter",
      "Dart",
      "Provider",
      "SharedPreferences",
      "Google Fonts",
      "Material 3",
    ],
    features: [
      "Offline-first functionality with local storage",
      "6 customizable note colors and 5 categories",
      "Smart search across titles, content, and tags",
      "Masonry grid layout with smooth animations",
      "Favorites, sorting, and advanced filtering",
    ],
    github: "https://github.com/bagatata05/quicknotes",
  },
];

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
