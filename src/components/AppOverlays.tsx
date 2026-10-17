"use client";

import React from "react";
import dynamic from "next/dynamic";
import { usePresentationMode } from "@/features/presentation-modes/context/PresentationModeContext";

const DustCanvas = dynamic(
  () => import("@/components/DustCanvas").then((m) => m.DustCanvas),
  { ssr: false }
);

const FlickeringGrid = dynamic(
  () => import("@/components/FlickeringGrid").then((m) => m.FlickeringGrid),
  { ssr: false }
);

const StarsBackground = dynamic(
  () => import("@/components/StarsBackground").then((m) => m.StarsBackground),
  { ssr: false }
);

const ChatWidget = dynamic(
  () => import("@/components/ChatWidget").then((m) => m.ChatWidget),
  { ssr: false }
);

const NavigationDock = dynamic(
  () => import("@/components/NavigationDock").then((m) => m.NavigationDock),
  { ssr: false }
);

import { usePathname } from "next/navigation";

const MouseTourGuide = dynamic(
  () => import("@/components/MouseTourGuide").then((m) => m.MouseTourGuide),
  { ssr: false }
);

export function AppOverlays() {
  const pathname = usePathname();
  const { mode, starsEnabled, gridEnabled } = usePresentationMode();

  const isArtisan = mode === "agent" || pathname === "/artisan";

  if (isArtisan) {
    return (
      <>
        <ChatWidget />
        <MouseTourGuide />
      </>
    );
  }

  return (
    <>
      {/* 1. Global Flickering Blueprint Grid Layer (Behind stars and content) */}
      {gridEnabled && <FlickeringGrid />}

      {/* 2. Ambient Global Stars Background Canvas (Fixed behind content) */}
      {starsEnabled && <StarsBackground />}

      {/* 3. AI Assistant Chat Widget */}
      <ChatWidget />

      {/* 4. High-Performance Canvas for Snap Dust Disintegration */}
      <DustCanvas />

      {/* 5. Persistent Floating Navigation Dock */}
      <NavigationDock />

      {/* 6. Autonomous Mouse Tour Guide System */}
      <MouseTourGuide />
    </>
  );
}

export default AppOverlays;
