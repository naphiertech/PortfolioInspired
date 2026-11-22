export type ReadingBookId =
  | "atomic-habits"
  | "48-laws-of-power"
  | "shoe-dog"
  | "ddia"
  | "steve-jobs"
  | "pragprog"
  | "psychology-of-money"
  | "refactoring-ui"
  | "meditations"
  | "clean-arch";

export type SpineFontStyle =
  | "serif"
  | "serif-italic"
  | "serif-caps"
  | "sans"
  | "sans-bold"
  | "condensed"
  | "stacked";

export type SpineImprint =
  | "avery"
  | "penguin"
  | "scribner"
  | "oreilly"
  | "ss"
  | "pearson"
  | "harriman"
  | "tailwind"
  | "penguin-classics";

export interface BookSpineDesign {
  /** Solid hex or CSS gradient matching the physical edition spine */
  bg: string;
  /** Short title displayed along the spine */
  titleText: string;
  /** Author credit displayed along the spine */
  authorText: string;
  /** Optional tiny horizontal kicker near the spine crown */
  topLabel?: string;
  /** Optional sub-credit beneath author (e.g. stacked editions) */
  subAuthor?: string;
  titleColor: string;
  authorColor: string;
  accentColor: string;
  fontStyle: SpineFontStyle;
  imprint: SpineImprint;
  /** Optional subtle edition detail */
  detail?: "speckle" | "top-band" | "rules" | "swoosh" | "none";
  /** True for light paper spines so edge shading stays subtle */
  isLight?: boolean;
}

export interface ReadingBookItem {
  id: ReadingBookId;
  title: string;
  author: string;
  publisher: string;
  domain: string;
  url: string;
  lesson: string;
  /** Local high-res official book cover artwork in /public/books/ */
  coverImage: string;
  /** Optional real scanned spine photo in /public/books/ (overrides data-driven spine) */
  spineImage?: string;
  /** Data-driven spine palette and edition typography */
  spine: BookSpineDesign;
  /** Spine thickness in px at desktop scale (scale = 1) */
  spineWidth: number;
  /** Book height in px at desktop scale (scale = 1) */
  height: number;
  /** Exact front cover width / height aspect ratio */
  coverRatio: number;
}

export const READING_SHELF_BOOKS: ReadingBookItem[] = [
  {
    id: "atomic-habits",
    title: "Atomic Habits",
    author: "James Clear",
    publisher: "Avery",
    domain: "jamesclear.com",
    url: "https://jamesclear.com/atomic-habits",
    lesson:
      "You do not rise to the level of your goals; you fall to the level of your systems.",
    coverImage: "/books/atomic-habits-cover.webp",
    spine: {
      bg: "#f5f1e6",
      titleText: "Atomic Habits",
      authorText: "James Clear",
      titleColor: "#9c7530",
      authorColor: "#23211d",
      accentColor: "#c8a14c",
      fontStyle: "serif-italic",
      imprint: "avery",
      detail: "speckle",
      isLight: true,
    },
    spineWidth: 40,
    height: 244,
    coverRatio: 0.662,
  },
  {
    id: "48-laws-of-power",
    title: "The 48 Laws of Power",
    author: "Robert Greene",
    publisher: "Penguin Books",
    domain: "penguinrandomhouse.com",
    url: "https://www.penguinrandomhouse.com/books/330006/the-48-laws-of-power-by-robert-greene/",
    lesson:
      "Study incentives, timing, and human dynamics clearly so you never navigate complex rooms blind.",
    coverImage: "/books/48-laws-of-power-cover.webp",
    spine: {
      bg: "#292d7c",
      topLabel: "THE 48 LAWS OF",
      titleText: "POWER",
      authorText: "ROBERT GREENE",
      subAuthor: "A JOOST ELFFERS BOOK",
      titleColor: "#d9b44a",
      authorColor: "#e5c76b",
      accentColor: "#e86420",
      fontStyle: "stacked",
      imprint: "penguin",
      detail: "none",
    },
    spineWidth: 56,
    height: 274,
    coverRatio: 0.703,
  },
  {
    id: "shoe-dog",
    title: "Shoe Dog",
    author: "Phil Knight",
    publisher: "Scribner",
    domain: "simonandschuster.com",
    url: "https://www.simonandschuster.com/books/Shoe-Dog/Phil-Knight/9781501135927",
    lesson:
      "Keep moving forward through uncertainty; enduring companies are built one gritty problem at a time.",
    coverImage: "/books/shoe-dog-cover.webp",
    spine: {
      bg: "#1b1a18",
      titleText: "SHOE DOG",
      authorText: "PHIL KNIGHT",
      titleColor: "#b48a47",
      authorColor: "#b48a47",
      accentColor: "#e61e26",
      fontStyle: "condensed",
      imprint: "scribner",
      detail: "swoosh",
    },
    spineWidth: 46,
    height: 250,
    coverRatio: 0.649,
  },
  {
    id: "ddia",
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    publisher: "O'Reilly Media",
    domain: "dataintensive.net",
    url: "https://dataintensive.net/",
    lesson:
      "Reliability, scalability, and maintainability are the foundational pillars of lasting data systems.",
    coverImage: "/books/ddia-cover.webp",
    spine: {
      bg: "#f8f8f7",
      titleText: "Designing Data-Intensive Applications",
      authorText: "Kleppmann",
      titleColor: "#141414",
      authorColor: "#52525b",
      accentColor: "#c81e2b",
      fontStyle: "sans",
      imprint: "oreilly",
      detail: "top-band",
      isLight: true,
    },
    spineWidth: 50,
    height: 258,
    coverRatio: 0.762,
  },
  {
    id: "steve-jobs",
    title: "Steve Jobs",
    author: "Walter Isaacson",
    publisher: "Simon & Schuster",
    domain: "simonandschuster.com",
    url: "https://www.simonandschuster.com/books/Steve-Jobs/Walter-Isaacson/9781982176860",
    lesson:
      "Simplicity is the ultimate sophistication — craft the unseen parts as faithfully as the surface.",
    coverImage: "/books/steve-jobs-cover.webp",
    spine: {
      bg: "#ffffff",
      titleText: "Steve Jobs",
      authorText: "Walter Isaacson",
      titleColor: "#111111",
      authorColor: "#71717a",
      accentColor: "#d4d4d8",
      fontStyle: "sans-bold",
      imprint: "ss",
      detail: "none",
      isLight: true,
    },
    spineWidth: 50,
    height: 284,
    coverRatio: 0.657,
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
    coverImage: "/books/pragprog-cover.webp",
    spine: {
      bg: "linear-gradient(180deg, #272b31 0%, #171a1f 100%)",
      topLabel: "20TH",
      titleText: "The Pragmatic Programmer",
      authorText: "Thomas · Hunt",
      titleColor: "#f4f4f5",
      authorColor: "#a1a1aa",
      accentColor: "#cf362f",
      fontStyle: "serif",
      imprint: "pearson",
      detail: "rules",
    },
    spineWidth: 44,
    height: 248,
    coverRatio: 0.767,
  },
  {
    id: "psychology-of-money",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    publisher: "Harriman House",
    domain: "harriman-house.com",
    url: "https://www.harriman-house.com/psychologyofmoney",
    lesson:
      "Long-term compounding and avoiding ruin matter far more than short-lived brilliance.",
    coverImage: "/books/psychology-of-money-cover.webp",
    spine: {
      bg: "#fbfbfb",
      titleText: "The Psychology of Money",
      authorText: "MORGAN HOUSEL",
      titleColor: "#578868",
      authorColor: "#27272a",
      accentColor: "#e6b83a",
      fontStyle: "serif-italic",
      imprint: "harriman",
      detail: "none",
      isLight: true,
    },
    spineWidth: 42,
    height: 244,
    coverRatio: 0.647,
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
    coverImage: "/books/refactoring-ui-cover.webp",
    spine: {
      bg: "linear-gradient(180deg, #243244 0%, #111a28 100%)",
      titleText: "Refactoring UI",
      authorText: "Wathan · Schoger",
      titleColor: "#f8fafc",
      authorColor: "#94a3b8",
      accentColor: "#38bdf8",
      fontStyle: "sans-bold",
      imprint: "tailwind",
      detail: "top-band",
    },
    spineWidth: 42,
    height: 246,
    coverRatio: 0.747,
  },
  {
    id: "meditations",
    title: "Meditations",
    author: "Marcus Aurelius",
    publisher: "Penguin Classics",
    domain: "penguinrandomhouse.com",
    url: "https://www.penguinrandomhouse.com/books/296088/meditations-by-marcus-aurelius/",
    lesson:
      "Focus energy strictly on what is within your control and meet obstacles with steady clarity.",
    coverImage: "/books/meditations-cover.webp",
    spine: {
      bg: "#111618",
      titleText: "MEDITATIONS",
      authorText: "MARCUS AURELIUS",
      titleColor: "#f1ede4",
      authorColor: "#b89b66",
      accentColor: "#a88750",
      fontStyle: "serif-caps",
      imprint: "penguin-classics",
      detail: "rules",
    },
    spineWidth: 40,
    height: 246,
    coverRatio: 0.651,
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
    coverImage: "/books/clean-arch-cover.webp",
    spine: {
      bg: "linear-gradient(180deg, #13233b 0%, #0b1526 100%)",
      titleText: "Clean Architecture",
      authorText: "Robert C. Martin",
      titleColor: "#f8fafc",
      authorColor: "#94a3b8",
      accentColor: "#38bdf8",
      fontStyle: "sans-bold",
      imprint: "pearson",
      detail: "top-band",
    },
    spineWidth: 44,
    height: 242,
    coverRatio: 0.765,
  },
];
