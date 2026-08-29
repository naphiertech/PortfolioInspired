"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useSnap } from "@/context/SnapContext";
import { SnappedRouteFallback } from "./SnappedRouteFallback";

interface SnapRouteGuardProps {
  children: React.ReactNode;
}

/**
 * Universal client-side guard for snap-eligible routes.
 *
 * Resolves snap session state before rendering snap-eligible routes using three states:
 * - "unknown": Renders a neutral page shell matching the page background without flashing route content.
 * - "snapped": Renders the existing SnappedRouteFallback screen.
 * - "normal": Renders the normal page content.
 *
 * Non-snap-eligible routes (like "/") resolve immediately as "normal".
 */
export function SnapRouteGuard({ children }: SnapRouteGuardProps) {
  const pathname = usePathname();
  const { getRouteSnapStatus } = useSnap();

  const status = getRouteSnapStatus(pathname);

  // 1. Unknown state: Neutral shell matching background/theme (prevents any hydration flash)
  if (status === "unknown") {
    return (
      <div
        className="w-full min-h-[60vh] bg-page"
        aria-hidden="true"
        data-snap-state="unknown"
      />
    );
  }

  // 2. Snapped state: Disintegrated route fallback
  if (status === "snapped") {
    return <SnappedRouteFallback />;
  }

  // 3. Normal state: Real page content
  return <>{children}</>;
}

export default SnapRouteGuard;
