import type { Variants, Transition } from "framer-motion";

/**
 * Standard Interaction & Section Reveal Motion Tokens
 * Follows the "Anti-Slop / Restrained Motion" philosophy:
 * - Interaction: 150-350ms
 * - Ambient: 2.5-3.5s (CSS keyframes)
 * - Zero layout shift, GPU-accelerated (transform & opacity only)
 */

export const easeOutCubic: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const dockSpring: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 36,
  mass: 0.8,
};

export const magneticSpring: Transition = {
  type: "spring",
  stiffness: 380,
  damping: 26,
  mass: 0.4,
};

/**
 * Section container wake-up variants
 */
export const sectionContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.02,
    },
  },
};

/**
 * Code-style section label (<SECTION/>) reveal
 * opacity 0 -> 1, translateY 6px -> 0, duration: ~220ms
 */
export const sectionLabelVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.22,
      ease: easeOutCubic,
    },
  },
};

/**
 * Horizontal hairline divider line draw
 * scaleX 0 -> 1 with transform-origin: left, duration: ~350ms
 */
export const sectionLineVariants: Variants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: {
      duration: 0.35,
      ease: easeOutCubic,
      delay: 0.05,
    },
  },
};

/**
 * Primary content block or single card reveal
 * opacity 0 -> 1, translateY 10px -> 0, duration: ~300ms
 */
export const contentBlockVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: easeOutCubic,
    },
  },
};

/**
 * Staggered grid container for project rows, certification cards, tech categories
 */
export const staggeredGridVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.045, // 45ms micro-stagger
      delayChildren: 0.05,
    },
  },
};

/**
 * Individual grid item / card reveal inside staggered container
 */
export const gridItemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.28,
      ease: easeOutCubic,
    },
  },
};

/**
 * Timeline rail and milestone sequence variants
 */
export const timelineContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.055,
      delayChildren: 0.06,
    },
  },
};

export const milestoneVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.28,
      ease: easeOutCubic,
    },
  },
};

export const railVariants: Variants = {
  hidden: { scaleY: 0 },
  visible: {
    scaleY: 1,
    transition: {
      duration: 0.38,
      ease: easeOutCubic,
    },
  },
};

/**
 * Technical Drafting Mask Reveal for Project Media Overlay
 * Uncovers image smoothly from left to right with a 1px drafting rule edge
 */
export const draftingOverlayVariants: Variants = {
  hidden: {
    scaleX: 1,
    opacity: 1,
  },
  visible: {
    scaleX: 0,
    opacity: 0,
    transition: {
      duration: 0.42,
      ease: easeOutCubic,
    },
  },
};

/**
 * 1px Technical Drafting Sweep Line
 */
export const draftingSweepVariants: Variants = {
  hidden: {
    left: "0%",
    opacity: 0.6,
  },
  visible: {
    left: "100%",
    opacity: 0,
    transition: {
      duration: 0.42,
      ease: easeOutCubic,
    },
  },
};
