"use client";

import React, { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useSnap } from "@/context/SnapContext";

interface SnapSectionWrapperProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export function SnapSectionWrapper({
  id,
  children,
  className = "",
}: SnapSectionWrapperProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const {
    registerSection,
    snappingSectionIds,
    snappedSectionIds,
    restoringSectionIds,
  } = useSnap();
  const shouldReduceMotion = useReducedMotion();

  const isSnapping = snappingSectionIds.includes(id);
  const isSnapped = snappedSectionIds.includes(id);
  const isRestoring = restoringSectionIds.includes(id);

  useEffect(() => {
    registerSection(id, containerRef.current);
    return () => {
      registerSection(id, null);
    };
  }, [id, registerSection]);

  if (shouldReduceMotion) {
    if (isSnapped) {
      return null;
    }
    return (
      <div
        ref={containerRef}
        id={`section-${id}`}
        className={`transition-opacity duration-300 ${
          isSnapping ? "opacity-0" : "opacity-100"
        } ${className}`}
      >
        {children}
      </div>
    );
  }

  // Once fully snapped & dissolved: smoothly collapse height to 0
  if (isSnapped) {
    return (
      <motion.div
        ref={containerRef}
        id={`section-${id}`}
        initial={{ height: "auto", opacity: 0 }}
        animate={{ height: 0, opacity: 0, marginBottom: 0, marginTop: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden pointer-events-none"
        aria-hidden="true"
      />
    );
  }

  return (
    <motion.div
      ref={containerRef}
      id={`section-${id}`}
      initial={
        isRestoring
          ? { opacity: 0, height: 0, y: 20, filter: "blur(6px)" }
          : false
      }
      animate={
        isSnapping
          ? {
              opacity: 0,
              filter: "blur(2.5px) brightness(1.2)",
              scale: 0.98,
              transition: { duration: 1.1, ease: "easeOut" },
            }
          : isRestoring
          ? {
              opacity: 1,
              height: "auto",
              y: 0,
              scale: 1,
              filter: "blur(0px)",
              transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
            }
          : {
              opacity: 1,
              height: "auto",
              y: 0,
              scale: 1,
              filter: "blur(0px)",
            }
      }
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default SnapSectionWrapper;
