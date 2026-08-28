"use client";

import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useSnap } from "@/context/SnapContext";

interface SnappedFragmentProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  inline?: boolean;
}

/**
 * SnappedFragment
 * Wraps optional modifiers, secondary descriptors, or qualifiers that can
 * semantically dissolve into fine dust after the main snap sequence.
 * Preserves grammar, layout integrity, and instant rematerialization on restore.
 */
export function SnappedFragment({
  id,
  children,
  className = "",
  inline = true,
}: SnappedFragmentProps) {
  const { isSnappedText, registerTextRef } = useSnap();
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement | null>(null);

  const isRemoved = isSnappedText(id);

  useEffect(() => {
    if (ref.current) {
      registerTextRef(id, ref.current);
    }
    return () => {
      registerTextRef(id, null);
    };
  }, [id, registerTextRef]);

  if (shouldReduceMotion) {
    if (isRemoved) return null;
    return (
      <span id={`snap-text-${id}`} className={className}>
        {children}
      </span>
    );
  }

  return (
    <AnimatePresence initial={false}>
      {!isRemoved && (
        <motion.span
          id={`snap-text-${id}`}
          ref={ref}
          initial={{ opacity: 1, filter: "blur(0px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{
            opacity: 0,
            filter: "blur(2.5px)",
            transition: {
              duration: 0.35,
              ease: "easeOut",
            },
          }}
          className={`${inline ? "inline" : "block"} ${className}`}
        >
          {children}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

export default SnappedFragment;
