/**
 * Centralized Site & SEO Configuration
 * Single source of truth for canonical site origin, default metadata, and structured data schemas.
 */

export const SITE_URL = "https://naphiernode.vercel.app";

export const SITE_NAME = "Naphier Awalie";
export const GITHUB_USERNAME = "naphiertech";

export const SOCIAL_PROFILES = {
  github: `https://github.com/${GITHUB_USERNAME}`,
  linkedin: "https://www.linkedin.com/in/naphier-awalie-0551983b5/",
  // Existing AI link allowlist alias; keep its matching behavior unchanged.
  linkedinLegacy: "https://www.linkedin.com/in/naphier-awalie",
  instagram: "https://www.instagram.com/bagatata05/",
  email: "naphiera@gmail.com",
};

export const EDUCATION = {
  degree: "BS Information Technology",
  shortDegree: "BS IT",
  institution: "Zamboanga Peninsula Polytechnic State University",
  abbreviation: "ZPPSU",
  department: "College of Information and Computing Sciences",
  period: "2023 - Present",
  website: "https://zppsu.edu.ph",
};

const city = "Zamboanga City";

export const AUTHOR_INFO = {
  name: SITE_NAME,
  shortName: SITE_NAME.split(" ")[0],
  handle: `@${GITHUB_USERNAME}`,
  jobTitle: "Full-Stack Developer",
  profileRole: "Full-Stack & UI/UX Developer",
  city,
  affiliation: `${EDUCATION.institution} (${EDUCATION.abbreviation})`,
  location: `${city}, Philippines`,
  // Preserve the existing Person.sameAs entries; UI-only socials stay separate.
  socials: [SOCIAL_PROFILES.github, SOCIAL_PROFILES.linkedin],
};

const availabilityStatus = "Available";

export const AVAILABILITY = {
  status: availabilityStatus,
  label: `${availabilityStatus} for work`,
  // Keep the existing compact and full-page wording unchanged.
  openTo: "Junior Roles · Internships · Freelance",
  lookingFor: "Junior / Internship / Freelance",
  workSetup: "Remote-friendly · Hybrid",
  workPreference: "Remote / On-site / Hybrid",
};

export const SITE_TAGLINE = `IT Student & ${AUTHOR_INFO.jobTitle}`;
export const SITE_DEFAULT_TITLE = `${SITE_NAME} — ${AUTHOR_INFO.jobTitle}`;
export const SITE_TITLE_TEMPLATE = `%s | ${SITE_NAME}`;

// Keep public/site.webmanifest and public/icon/site.webmanifest in sync with
// this title/description and AUTHOR_INFO.shortName (their short_name).
export const SITE_DEFAULT_DESCRIPTION =
  `Hi, I’m ${SITE_NAME}, an IT student and full-stack developer who enjoys turning ideas into practical web applications with clean interfaces, thoughtful user experiences, and reliable functionality.`;

export const SNAP_EASTER_EGG = {
  triggerLine1: "do not",
  triggerLine2: "click this!",
  restoreLine1: "click to",
  restoreLine2: "restore ↺",
  busySnapLine1: "oohh no..",
  busySnapLine2: "noo..",
  busyRestoreLine1: "restoring",
  busyRestoreLine2: "reality ↺",
};
