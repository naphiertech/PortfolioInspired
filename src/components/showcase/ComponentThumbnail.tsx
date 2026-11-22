"use client";

import React from "react";
import type { ComponentSlug } from "@/lib/componentsCatalog";

interface ThumbnailProps {
  slug: ComponentSlug;
  className?: string;
}

export function ComponentThumbnail({ slug, className = "size-10" }: ThumbnailProps) {
  switch (slug) {
    case "reading-shelf":
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
          {/* Technical editorial row of standing spines + tilted open cover */}
          <rect
            x="6"
            y="14"
            width="5"
            height="22"
            rx="1"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeOpacity="0.65"
            fill="currentColor"
            fillOpacity="0.08"
          />
          <rect
            x="12.5"
            y="10"
            width="6"
            height="26"
            rx="1"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeOpacity="0.85"
            fill="currentColor"
            fillOpacity="0.14"
          />
          <line x1="14" y1="15" x2="17" y2="15" stroke="currentColor" strokeWidth="1" strokeOpacity="0.55" />
          <rect
            x="20"
            y="11"
            width="13"
            height="25"
            rx="1.2"
            stroke="currentColor"
            strokeWidth="1.35"
            strokeOpacity="0.9"
            fill="currentColor"
            fillOpacity="0.04"
          />
          <line x1="23" y1="11" x2="23" y2="36" stroke="currentColor" strokeWidth="0.9" strokeOpacity="0.25" />
          <circle cx="28" cy="21" r="2.7" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.85" />
          <line x1="25.5" y1="27" x2="30.5" y2="27" stroke="currentColor" strokeOpacity="0.85" strokeWidth="1.4" strokeLinecap="round" />
          <rect
            x="34.5"
            y="15"
            width="5.5"
            height="21"
            rx="1"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeOpacity="0.65"
            fill="currentColor"
            fillOpacity="0.1"
          />
          <line
            x1="4.5"
            y1="38.5"
            x2="43.5"
            y2="38.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeOpacity="0.4"
          />
        </svg>
      );

    case "contribution-truck":
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
          {/* Blueprint cab + ISO trailer + 4x3 contribution cells */}
          <path
            d="M4.5 22 L8.5 16 H15.5 V33 H4.5 Z"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
            fill="currentColor"
            fillOpacity="0.08"
          />
          <path d="M7.5 18.5 H13 V22.5 H6.5 Z" stroke="currentColor" strokeWidth="1" strokeOpacity="0.6" />
          <line x1="14" y1="12" x2="14" y2="16" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeOpacity="0.7" />
          <rect
            x="17"
            y="14"
            width="26.5"
            height="19"
            rx="1"
            stroke="currentColor"
            strokeWidth="1.3"
            fill="currentColor"
            fillOpacity="0.05"
          />
          {/* ISO corner marks */}
          <rect x="16.5" y="13.5" width="2.5" height="2.5" fill="currentColor" />
          <rect x="41.5" y="13.5" width="2.5" height="2.5" fill="currentColor" />
          {/* Contribution matrix cells */}
          <rect x="20.5" y="18" width="3.5" height="3.5" rx="0.5" fill="currentColor" fillOpacity="0.35" />
          <rect x="25.5" y="18" width="3.5" height="3.5" rx="0.5" fill="currentColor" fillOpacity="0.85" />
          <rect x="30.5" y="18" width="3.5" height="3.5" rx="0.5" fill="currentColor" />
          <rect x="35.5" y="18" width="3.5" height="3.5" rx="0.5" fill="currentColor" fillOpacity="0.55" />
          <rect x="20.5" y="23" width="3.5" height="3.5" rx="0.5" fill="currentColor" fillOpacity="0.8" />
          <rect x="25.5" y="23" width="3.5" height="3.5" rx="0.5" fill="currentColor" fillOpacity="0.16" />
          <rect x="30.5" y="23" width="3.5" height="3.5" rx="0.5" fill="currentColor" fillOpacity="0.65" />
          <rect x="35.5" y="23" width="3.5" height="3.5" rx="0.5" fill="currentColor" />
          {/* Twin axles */}
          <circle cx="10.5" cy="34.5" r="3" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.3" />
          <circle cx="35.5" cy="34.5" r="3" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.3" />
        </svg>
      );

    case "floating-islands":
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
          {/* Layered isometric archipelago */}
          <path
            d="M7 22 H41 L36.5 28 H11.5 Z"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
            fill="currentColor"
            fillOpacity="0.12"
          />
          <path
            d="M12.5 28 L17.5 34.5 L24 38 L31.5 33.5 L35.5 28"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinejoin="round"
            fill="currentColor"
            fillOpacity="0.06"
          />
          <rect x="13" y="17.5" width="7" height="4.5" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.18" />
          <rect x="28" y="18.5" width="5" height="3.5" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.1" />
          {/* Signal mast & beacon */}
          <line x1="24" y1="11.5" x2="24" y2="22" stroke="currentColor" strokeWidth="1.25" />
          <circle cx="24" cy="9.5" r="2" fill="currentColor" />
          {/* Floating debris */}
          <rect x="9" y="34" width="3" height="2.5" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
          <rect x="35.5" y="34" width="3.5" height="2.5" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
        </svg>
      );

    case "thanos-gauntlet":
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
          {/* Pixel-grid wireframe gauntlet + dust disintegration particles */}
          <path
            d="M14 21 V14 H17 V20 H18.5 V11 H21.5 V20 H23 V10 H26 V20 H27.5 V13 H30.5 V26 L28 33 V38 H16 V32 L11.5 26 V22 H14 Z"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
            fill="currentColor"
            fillOpacity="0.1"
          />
          {/* Knuckle & stone anchor marks */}
          <line x1="16" y1="32" x2="28" y2="32" stroke="currentColor" strokeWidth="1" strokeOpacity="0.45" />
          <rect x="20.5" y="23.5" width="3.5" height="3.5" rx="0.5" fill="currentColor" />
          {/* Dispersing dust squares */}
          <rect x="33.5" y="15.5" width="2.5" height="2.5" fill="currentColor" fillOpacity="0.7" />
          <rect x="38" y="12.5" width="2" height="2" fill="currentColor" />
          <rect x="35.5" y="21.5" width="2" height="2" fill="currentColor" fillOpacity="0.45" />
          <rect x="40" y="19" width="2" height="2" fill="currentColor" fillOpacity="0.3" />
          <rect x="34" y="27.5" width="2" height="2" fill="currentColor" fillOpacity="0.35" />
        </svg>
      );

    case "ai-companion-toggle":
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
          {/* Radial orbital arc matching the 2x2 Artisan companion fan-out */}
          <path
            d="M14 29 A15 15 0 0 1 29 14"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="2 2.5"
            strokeOpacity="0.45"
          />
          <circle cx="15" cy="15" r="3.2" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.12" />
          <circle cx="29" cy="13" r="3.2" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.12" />
          <circle cx="13" cy="29" r="3.2" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.12" />
          <circle cx="29" cy="13" r="1.2" fill="currentColor" />
          {/* Companion circle with twin pill eyes */}
          <circle
            cx="30"
            cy="30"
            r="10.5"
            stroke="currentColor"
            strokeWidth="1.35"
            fill="currentColor"
            fillOpacity="0.06"
          />
          <rect x="25.8" y="25.5" width="2.8" height="8.5" rx="1.4" fill="currentColor" />
          <rect x="31.4" y="25.5" width="2.8" height="8.5" rx="1.4" fill="currentColor" />
        </svg>
      );

    case "rocket-mountain":
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
          {/* FN-01 voxel citadel silhouette & emerald thruster columns */}
          <path
            d="M8 26 L16 17 L20.5 11.5 L26.5 15 L31.5 19 L40 26 L34 30.5 H14 Z"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
            fill="currentColor"
            fillOpacity="0.1"
          />
          <path d="M18 26 V20 H22 V16.5 H26 V26" stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.6" />
          <circle cx="24" cy="14" r="1.3" fill="currentColor" />
          {/* Dual thruster beams */}
          <line x1="19" y1="31" x2="19" y2="37" stroke="currentColor" strokeOpacity="0.85" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="24" y1="31" x2="24" y2="40" stroke="currentColor" strokeOpacity="0.85" strokeWidth="2" strokeLinecap="round" />
          <line x1="29" y1="31" x2="29" y2="36" stroke="currentColor" strokeOpacity="0.85" strokeWidth="1.8" strokeLinecap="round" />
          {/* Subtle cloud rule */}
          <line x1="11" y1="34" x2="15" y2="34" stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.35" strokeLinecap="round" />
          <line x1="33" y1="35" x2="38" y2="35" stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.35" strokeLinecap="round" />
        </svg>
      );
  }
}

export default ComponentThumbnail;
