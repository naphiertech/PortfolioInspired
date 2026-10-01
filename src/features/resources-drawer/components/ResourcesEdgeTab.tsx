"use client";

import { Boxes } from "lucide-react";
import { EdgeLauncher } from "@/components/EdgeLauncher";
import { useUISound } from "@/context/SoundContext";

interface ResourcesEdgeTabProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export function ResourcesEdgeTab({ isOpen, onToggle, className = "" }: ResourcesEdgeTabProps) {
  const { playHover, playClick } = useUISound();
  return (
    <EdgeLauncher
      icon={Boxes}
      label="Resources"
      controls="resources-drawer-panel"
      ariaLabel={isOpen ? "Close resources drawer" : "Development Resources & Toolbox"}
      title="Development Resources & Workflows"
      isOpen={isOpen}
      onToggle={() => { playClick(); onToggle(); }}
      onHover={playHover}
      second
      className={className}
    />
  );
}
