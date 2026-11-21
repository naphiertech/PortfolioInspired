"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCreativeMode } from "../context/CreativeModeContext";

interface CreativeSceneRevealProps {
  children: ReactNode;
  className?: string;
}

/**
 * Reveals Creative Mode-exclusive illustrations with a smooth height expand/collapse
 * on toggle and a tactile scroll-triggered pop-up once per Creative Mode activation.
 * Unmounts children completely when Creative Mode is off to keep initial load zero-cost.
 */
export function CreativeSceneReveal({ children, className }: CreativeSceneRevealProps) {
  const { active, effectiveMotion } = useCreativeMode();
  const systemReducedMotion = useReducedMotion();
  const quiet = !!systemReducedMotion || effectiveMotion === "off";
  const expressive = effectiveMotion === "expressive";

  const popDuration = quiet ? 0 : expressive ? 0.52 : 0.42;
  const popDistance = quiet ? 0 : expressive ? 26 : 18;
  const popScale = quiet ? 1 : expressive ? 0.91 : 0.94;
  const heightDuration = quiet ? 0 : expressive ? 0.42 : 0.34;
  const popEase: [number, number, number, number] = expressive
    ? [0.16, 1.12, 0.3, 1]
    : [0.22, 1, 0.36, 1];

  return (
    <AnimatePresence initial={false}>
      {active && (
        <motion.div
          key="creative-scene"
          initial={{ height: 0, opacity: quiet ? 1 : 0, overflowY: "clip" }}
          animate={{
            height: "auto",
            opacity: 1,
            transition: {
              height: { duration: heightDuration, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: quiet ? 0 : 0.2, ease: "easeOut" },
            },
            transitionEnd: { overflowY: "visible" },
          }}
          exit={{
            height: 0,
            opacity: 0,
            overflowY: "clip",
            transition: {
              height: { duration: quiet ? 0 : 0.26, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: quiet ? 0 : 0.16, ease: "easeIn" },
            },
          }}
          style={{ overflowX: "visible" }}
          className={className}
        >
          <motion.div
            initial={quiet ? false : { opacity: 0, y: popDistance, scale: popScale }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            exit={quiet ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.96 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: popDuration, ease: popEase }}
            style={{ transformOrigin: "50% 65%" }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
