/**
 * Contextual Cursor Tooltip Configuration
 *
 * Centralized mapping of contextual labels for key navigation items,
 * projects, profile areas, and social contact channels.
 */

export const NAV_CURSOR_LABELS: Record<string, string> = {
  Home: "Back to the beginning.",
  Work: "My experience and work.",
  Projects: "Things I've built.",
  Tech: "Tools I work with.",
  Certifications: "Certificates and credentials.",
};

export const PROJECT_CURSOR_LABELS: Record<string, string> = {
  "mkb-ridertrack": "Fleet logistics and offline-first mobile app.",
  "naphix-resume": "AI resume builder and ATS optimization suite.",
  "assetlink": "Enterprise RFID and QR asset tracking system.",
  "moviestream": "Streaming platform and recommendation engine.",
};

export const ABOUT_CURSOR_LABELS = {
  profile: "A little context about me.",
  avatar: "That's me.",
  introParagraph: "A little context before the projects.",
} as const;

export const SOCIAL_CURSOR_LABELS = {
  github: "My code and projects.",
  linkedin: "My professional profile.",
  email: "Send me an email.",
  call: "Let's talk.",
} as const;
