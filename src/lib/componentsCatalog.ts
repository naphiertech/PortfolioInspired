export type ComponentSlug =
  | "reading-shelf"
  | "contribution-truck"
  | "floating-islands"
  | "thanos-gauntlet"
  | "ai-companion-toggle"
  | "rocket-mountain";

export type ComponentCategory = "interactive" | "pixel-scenes" | "widgets";

export interface ComponentPropDoc {
  name: string;
  type: string;
  defaultValue: string;
  description: string;
}

export interface ComponentSourceFileSpec {
  label: string;
  path: string;
  language: "tsx" | "css" | "ts";
}

export interface LoadedComponentSourceFile {
  label: string;
  language: "tsx" | "css" | "ts";
  code: string;
  lineCount: number;
}

export interface ComponentCatalogItem {
  slug: ComponentSlug;
  title: string;
  summary: string;
  description: string;
  category: ComponentCategory;
  categoryLabel: string;
  isNew?: boolean;
  dependencies: string[];
  assets?: string[];
  usageCode: string;
  props: ComponentPropDoc[];
  notes: string[];
  sourceFiles: ComponentSourceFileSpec[];
}

export const COMPONENTS_CATALOG: ComponentCatalogItem[] = [
  {
    slug: "reading-shelf",
    title: "Reading Shelf",
    summary: "Interactive spines that expand in-place to reveal front covers.",
    description:
      "An accordion row of hardcover and paperback spines standing on a rounded shelf ledge. Hover lifts each spine; clicking expands it horizontally into its full cover artwork while neighboring volumes part smoothly.",
    category: "interactive",
    categoryLabel: "Interactive",
    isNew: true,
    dependencies: ["framer-motion"],
    usageCode: `import { ReadingShelf } from "@/components/ReadingShelf";

export function ReadingShelfDemo() {
  return (
    <ReadingShelf
      embedded
      hoverLift={10}
      scale={1}
    />
  );
}`,
    props: [
      {
        name: "variant",
        type: '"default" | "focus" | "artisan"',
        defaultValue: '"default"',
        description: "Controls section framing and outer gutter annotation placement.",
      },
      {
        name: "embedded",
        type: "boolean",
        defaultValue: "false",
        description: "Renders only the interactive shelf rail and ledge without outer section chrome.",
      },
      {
        name: "hoverLift",
        type: "number",
        defaultValue: "10",
        description: "Upward hover lift in pixels on collapsed spines (0–20px).",
      },
      {
        name: "scale",
        type: "number",
        defaultValue: "1",
        description: "Multiplier applied to book heights and spine widths.",
      },
    ],
    assets: ["public/books/*-cover.webp"],
    notes: [
      "Front covers render real book artwork from /public/books/, while spines are data-driven (and support optional spineImage overrides).",
      "Keyboard accessible with Tab, Enter/Space, aria-pressed state, and Escape to collapse the open cover.",
      "On screens under 540px, books scale to 0.74x inside a horizontally scrollable rail with overscroll containment.",
      "Transitions and hover lift honor prefers-reduced-motion: reduce.",
    ],
    sourceFiles: [
      { label: "ReadingShelf.tsx", path: "src/components/ReadingShelf.tsx", language: "tsx" },
      { label: "ReadingShelf.module.css", path: "src/components/ReadingShelf.module.css", language: "css" },
      { label: "BookSpine.tsx", path: "src/components/BookSpine.tsx", language: "tsx" },
      { label: "readingShelfData.ts", path: "src/lib/readingShelfData.ts", language: "ts" },
    ],
  },
  {
    slug: "contribution-truck",
    title: "Contribution Truck",
    summary: "Pixel-art freight cab and ISO trailer carrying an activity heatmap.",
    description:
      "A crisp SVG pixel-art freight cab paired with an ISO container cargo chassis that frames any GitHub-style contribution matrix or telemetry grid, complete with subtle cab suspension and exhaust wisps.",
    category: "pixel-scenes",
    categoryLabel: "Pixel Scenes",
    dependencies: [],
    usageCode: `import { ContributionTruck } from "@/components/ContributionTruck";

export function ContributionTruckDemo() {
  return (
    <ContributionTruck>
      {/* Place your contribution heatmap grid or metric strip inside */}
      <div className="h-24 flex items-center justify-center font-mono text-xs">
        52-Week Activity Payload
      </div>
    </ContributionTruck>
  );
}`,
    props: [
      {
        name: "children",
        type: "React.ReactNode",
        defaultValue: "required",
        description: "Content rendered inside the ribbed ISO shipping container payload bay.",
      },
    ],
    notes: [
      "Built purely with crispEdges inline SVG geometry and scoped CSS module keyframes — zero external image files.",
      "Adapts container trim, corner castings, and chassis shadows cleanly between light and dark themes.",
      "Suspends exhaust animation under prefers-reduced-motion.",
    ],
    sourceFiles: [
      { label: "ContributionTruck.tsx", path: "src/components/ContributionTruck.tsx", language: "tsx" },
      { label: "ContributionTruck.module.css", path: "src/components/ContributionTruck.module.css", language: "css" },
    ],
  },
  {
    slug: "floating-islands",
    title: "Floating Islands",
    summary: "Pointer-reactive multi-layer parallax pixel terrain and beacons.",
    description:
      "A layered isometric pixel-art archipelago driven by requestAnimationFrame CSS custom properties (--terrain-x, --terrain-y). Foreground ledges, deep rock strata, drifting mist, and signal beacons respond smoothly to cursor position.",
    category: "pixel-scenes",
    categoryLabel: "Pixel Scenes",
    dependencies: ["framer-motion"],
    usageCode: `import { FloatingTerrain } from "@/components/FloatingTerrain";

export function FloatingIslandsDemo() {
  return <FloatingTerrain variant="now" />;
}`,
    props: [
      {
        name: "variant",
        type: '"now" | "projects"',
        defaultValue: '"now"',
        description: "Switches rock silhouettes, platform hardware density, and skyline balance.",
      },
      {
        name: "className",
        type: "string",
        defaultValue: '""',
        description: "Optional wrapper class for spacing or width constraints.",
      },
    ],
    notes: [
      "Pointer tracking updates only CSS custom properties inside requestAnimationFrame with zero React state re-renders.",
      "Attaches listener to the enclosing <section> so nearby cursor motion drives parallax depth.",
      "Freezes parallax and mist animations automatically when prefers-reduced-motion is enabled.",
    ],
    sourceFiles: [
      { label: "FloatingTerrain.tsx", path: "src/components/FloatingTerrain.tsx", language: "tsx" },
      { label: "FloatingTerrain.module.css", path: "src/components/FloatingTerrain.module.css", language: "css" },
      { label: "motion.ts", path: "src/lib/motion.ts", language: "ts" },
    ],
  },
  {
    slug: "thanos-gauntlet",
    title: "Thanos Snap Gauntlet",
    summary: "Sprite-animated gauntlet with canvas dust burst and Time Stone rewind.",
    description:
      "An interactive pixel gauntlet using 48-frame CSS steps() sprite sheets and an HTML5 Canvas particle field. Clicking Snap dissolves scoped target cards into drifting dust; clicking again reverses time to restore them.",
    category: "interactive",
    categoryLabel: "Interactive",
    dependencies: [],
    assets: [
      "/easter-egg/thanos/idle-light.png",
      "/easter-egg/thanos/idle-dark.png",
      "/easter-egg/thanos/snap-light.png",
      "/easter-egg/thanos/snap-dark.png",
      "/easter-egg/thanos/time-light.png",
      "/easter-egg/thanos/time-dark.png",
      "/easter-egg/thanos/thanos_snap_sound.mp3",
      "/easter-egg/thanos/thanos_reverse_sound.mp3",
    ],
    usageCode: `import { ThanosGauntletSandbox } from "@/components/showcase/ThanosGauntletSandbox";

export function ThanosGauntletDemo() {
  return (
    <ThanosGauntletSandbox
      soundEnabled={true}
      label="Target Module"
    />
  );
}`,
    props: [
      {
        name: "soundEnabled",
        type: "boolean",
        defaultValue: "true",
        description: "Enables snap and Time Stone reverse audio cues when clicked.",
      },
      {
        name: "label",
        type: "string",
        defaultValue: '"Target Module"',
        description: "Heading displayed inside the scoped demo target card.",
      },
    ],
    notes: [
      "Standalone sandbox variant scopes particle bounds strictly to the target container via Canvas 2D.",
      "Supports light and dark sprite variants via documentElement .dark class observation.",
      "Locks duplicate clicks while the 2.25s 48-frame sprite animation plays.",
    ],
    sourceFiles: [
      { label: "ThanosGauntletSandbox.tsx", path: "src/components/showcase/ThanosGauntletSandbox.tsx", language: "tsx" },
      { label: "GauntletTrigger.module.css", path: "src/components/GauntletTrigger.module.css", language: "css" },
    ],
  },
  {
    slug: "ai-companion-toggle",
    title: "AI Companion Toggle",
    summary: "Blinking corner companion that fans out a 2x2 radial AI cluster.",
    description:
      "The lower-right Artisan companion launcher featuring gradually blinking, cursor-glancing eyes that spring-expand ChatGPT, Claude, and Perplexity actions into a 2x2 corner arc (plus a Sparkles popover variant).",
    category: "widgets",
    categoryLabel: "Widgets",
    dependencies: ["framer-motion", "lucide-react", "react-icons"],
    usageCode: `import { AICompanionWidget } from "@/components/showcase/AICompanionWidget";

export function AICompanionDemo() {
  return (
    <AICompanionWidget
      variant="artisan"
      contained
      defaultOpen={false}
    />
  );
}`,
    props: [
      {
        name: "variant",
        type: '"artisan" | "standard"',
        defaultValue: '"artisan"',
        description: "Switches between the Artisan blinking-eyes 2x2 radial cluster and the Sparkles popover.",
      },
      {
        name: "contained",
        type: "boolean",
        defaultValue: "false",
        description: "Positions inline inside a relative corner stage instead of fixed viewport coordinates.",
      },
      {
        name: "prompt",
        type: "string",
        defaultValue: '"Analyze this developer portfolio..."',
        description: "Pre-filled prompt copied to clipboard and passed to ChatGPT, Claude, and Perplexity.",
      },
      {
        name: "defaultOpen",
        type: "boolean",
        defaultValue: "false",
        description: "Initial expanded state of the launcher.",
      },
    ],
    notes: [
      "Closes automatically on Escape key press or outside pointer click.",
      "Copies the analysis prompt to clipboard cleanly when a target AI provider is chosen.",
      "Uses GPU transform springs for the 2x2 radial fan-out.",
    ],
    sourceFiles: [
      { label: "AICompanionWidget.tsx", path: "src/components/showcase/AICompanionWidget.tsx", language: "tsx" },
    ],
  },
  {
    slug: "rocket-mountain",
    title: "Rocket Mountain",
    summary: "Floating voxel citadel with emerald ion thrusters and beacons.",
    description:
      "A 320x124 crisp-edged pixel citadel floating above drifting cloud layers. Seven emerald ion plumes, cascading waterfall pixels, and beacon lights auto-pause when scrolled off-screen via IntersectionObserver.",
    category: "pixel-scenes",
    categoryLabel: "Pixel Scenes",
    dependencies: [],
    usageCode: `import { RocketMountain } from "@/components/RocketMountain";

export function RocketMountainDemo() {
  return <RocketMountain paused={false} />;
}`,
    props: [
      {
        name: "paused",
        type: "boolean",
        defaultValue: "false",
        description: "Freezes thrusters, mist, and beacon animations on demand.",
      },
      {
        name: "className",
        type: "string",
        defaultValue: '""',
        description: "Optional wrapper CSS class.",
      },
    ],
    notes: [
      "Uses IntersectionObserver to pause CSS keyframes automatically whenever scrolled out of view.",
      "Vectorized with unique SVG gradient/mask IDs via React useId() so multiple instances never collide.",
      "Honors prefers-reduced-motion with static beacon fallback.",
    ],
    sourceFiles: [
      { label: "RocketMountain.tsx", path: "src/components/RocketMountain.tsx", language: "tsx" },
      { label: "RocketMountain.module.css", path: "src/components/RocketMountain.module.css", language: "css" },
    ],
  },
];

export function getComponentBySlug(slug: string): ComponentCatalogItem | undefined {
  return COMPONENTS_CATALOG.find((item) => item.slug === slug);
}

export function getNextPrevComponents(slug: string): {
  prev: ComponentCatalogItem | null;
  next: ComponentCatalogItem | null;
} {
  const index = COMPONENTS_CATALOG.findIndex((item) => item.slug === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? COMPONENTS_CATALOG[index - 1] : null,
    next: index < COMPONENTS_CATALOG.length - 1 ? COMPONENTS_CATALOG[index + 1] : null,
  };
}
