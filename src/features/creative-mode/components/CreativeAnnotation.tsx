"use client";

import { motion } from "framer-motion";
import styles from "../creativeNotes.module.css";

export interface CreativeNote {
  number: string;
  title: string;
  description: string;
  side: "left" | "right";
}

export function CreativeAnnotation({ note, top, targetTop, targetLeft, index, quiet }: {
  note: CreativeNote;
  top: number;
  targetTop: number;
  targetLeft?: number;
  index: number;
  quiet: boolean;
}) {
  const isFirstNote = note.number === "01";

  if (isFirstNote) {
    const endX = targetLeft !== undefined ? Math.round(47 + targetLeft - 12) : 74;
    const startY = 36;
    const endY = targetTop - top;
    const arrowHeight = Math.max(startY, endY) + 12;
    const arrowWidth = endX + 6;
    const d = `M 3 ${startY} C 20 ${startY - 3}, ${endX - 24} ${endY}, ${endX} ${endY} M ${endX - 9} ${endY - 5} L ${endX} ${endY} L ${endX - 9} ${endY + 5}`;

    return (
      <motion.aside
        aria-hidden="true"
        className={styles.note}
        data-side={note.side}
        data-annotation-number={note.number}
        style={{ top }}
        initial={{ opacity: 0, y: quiet ? 0 : 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, transition: { duration: quiet ? 0 : 0.12, delay: 0 } }}
        transition={{ duration: quiet ? 0 : 0.16, delay: quiet ? 0 : 0.1 + index * 0.06, ease: "easeOut" }}
      >
        <p className={styles.heading}>{note.number} // {note.title}</p>
        <p>{note.description}</p>
        <svg
          className={styles.arrow}
          style={{ top: 0, width: arrowWidth, height: arrowHeight, overflow: "visible" }}
          viewBox={`0 0 ${arrowWidth} ${arrowHeight}`}
          fill="none"
          focusable="false"
          aria-hidden="true"
        >
          <path d={d} />
        </svg>
      </motion.aside>
    );
  }

  // Notes #02–#05: 100% UNCHANGED original calculation and arrow geometry
  const targetY = targetTop - top;
  const arrowTop = Math.min(12, targetY - 12);
  const startY = 48 - arrowTop;
  const endY = targetY - arrowTop;
  const arrowHeight = Math.max(startY, endY + 8) + 4;
  return (
    <motion.aside
      aria-hidden="true"
      className={styles.note}
      data-side={note.side}
      data-annotation-number={note.number}
      style={{ top }}
      initial={{ opacity: 0, y: quiet ? 0 : 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: quiet ? 0 : 0.12, delay: 0 } }}
      transition={{ duration: quiet ? 0 : 0.16, delay: quiet ? 0 : 0.1 + index * 0.06, ease: "easeOut" }}
    >
      <p className={styles.heading}>{note.number} // {note.title}</p>
      <p>{note.description}</p>
      <svg className={styles.arrow} style={{ top: arrowTop, height: arrowHeight }} viewBox={`0 0 44 ${arrowHeight}`} fill="none" focusable="false" aria-hidden="true">
        <path d={`M2 ${startY} C5 ${startY - 24} 22 ${endY - 8} 41 ${endY} M32 ${endY - 8} L41 ${endY} L30 ${endY + 5}`} />
      </svg>
    </motion.aside>
  );
}
