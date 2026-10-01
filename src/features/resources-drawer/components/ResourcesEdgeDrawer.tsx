"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ResourcesEdgeTab } from "./ResourcesEdgeTab";
import { ResourcesDrawer } from "./ResourcesDrawer";
import { useSideDrawers } from "@/features/side-drawers/SideDrawerProvider";

interface ResourcesEdgeDrawerProps {
  initialOpen?: boolean;
  className?: string;
}

/**
 * ResourcesEdgeDrawer
 *
 * Self-contained entry point for the Development Resources & Toolbox drawer.
 * Orchestrates the fixed left-edge folder tab (stacked below <MUSIC/>) and overlay drawer panel.
 *
 * Rendered via React Portal into document.body to ensure it remains strictly anchored
 * to the viewport edges without being trapped by containing-block CSS transforms.
 *
 * Open state and backdrop belong to the shared side-drawer provider.
 */
export function ResourcesEdgeDrawer({
  initialOpen = false,
  className = "",
}: ResourcesEdgeDrawerProps) {
  const [mounted, setMounted] = useState<boolean>(false);
  const { activeDrawer, openDrawer, toggleDrawer, closeDrawer, finishClose } = useSideDrawers();
  const isOpen = activeDrawer === "resources";

  useEffect(() => {
    setMounted(true);
    if (initialOpen) openDrawer("resources");
  }, [initialOpen, openDrawer]);

  if (!mounted || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className={`resources-edge-drawer-container ${className}`}>
      {/* 1. Left-edge launcher stacked below Music */}
      <ResourcesEdgeTab isOpen={isOpen} onToggle={() => toggleDrawer("resources")} />

      {/* 2. Open State Overlay Drawer Card */}
      <ResourcesDrawer isOpen={isOpen} onClose={closeDrawer} onExitComplete={() => finishClose("resources")} />
    </div>,
    document.body
  );
}

export default ResourcesEdgeDrawer;
