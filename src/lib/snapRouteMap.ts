export const SNAP_ROUTE_MAPPINGS = [
  { dockId: "Work", pathPrefix: "/work", label: "Work & Availability" },
  { dockId: "Projects", pathPrefix: "/projects", label: "Projects" },
  { dockId: "Tech", pathPrefix: "/tech-stack", label: "Tech Stack" },
  { dockId: "Certs", pathPrefix: "/certifications", label: "Certifications" },
] as const;

export type MappedDockId = (typeof SNAP_ROUTE_MAPPINGS)[number]["dockId"];

export type RouteSnapStatus = "unknown" | "snapped" | "normal";

/**
 * Derives the associated dock identifier for any given pathname.
 * Handles exact paths and nested sub-routes (e.g. /projects/mkb-ridertrack).
 */
export function getSnappedDockIdForPathname(pathname: string): string | null {
  if (!pathname || pathname === "/") return null;

  // Clean trailing slashes, query params, and hashes
  const cleanPath = pathname.split("?")[0].split("#")[0].replace(/\/+$/, "") || "/";

  for (const mapping of SNAP_ROUTE_MAPPINGS) {
    if (
      cleanPath === mapping.pathPrefix ||
      cleanPath.startsWith(`${mapping.pathPrefix}/`)
    ) {
      return mapping.dockId;
    }
  }

  return null;
}
