"use client";

import { Music2 } from "lucide-react";
import { EdgeLauncher } from "@/components/EdgeLauncher";

interface MusicEdgeTabProps {
  isOpen: boolean;
  isPlaying?: boolean;
  onToggle: () => void;
  className?: string;
}

export function MusicEdgeTab({ isOpen, onToggle, className = "" }: MusicEdgeTabProps) {
  return (
    <EdgeLauncher
      icon={Music2}
      label="Music"
      controls="music-drawer-panel"
      ariaLabel={isOpen ? "Close music drawer" : "What I'm Listening To"}
      title="What I'm Listening To"
      isOpen={isOpen}
      onToggle={onToggle}
      className={className}
    />
  );
}
