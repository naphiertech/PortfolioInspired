/**
 * Production Build & Deployment Metadata
 * Automatically populated at Next.js build time via next.config.mjs
 */

export const BUILD_TIMESTAMP =
  process.env.NEXT_PUBLIC_BUILD_TIME || new Date().toISOString();

const buildDate = new Date(BUILD_TIMESTAMP);

export const BUILD_INFO = {
  timestamp: BUILD_TIMESTAMP,
  isoDate: BUILD_TIMESTAMP.split("T")[0],
  formattedDate: new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "Asia/Manila",
  }).format(buildDate),
};
