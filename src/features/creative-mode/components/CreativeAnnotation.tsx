"use client";

import { motion } from "framer-motion";
import styles from "../creativeNotes.module.css";

export interface CreativeNote {
  number: string;
  title: string;
  description: string;
  side: "left" | "right";
}

export function CreativeAnnotation({ note, top, index, quiet }: {
  note: CreativeNote;
  top: number;
  index: number;
  quiet: boolean;
}) {
  return (
    <motion.aside
      aria-hidden="true"
      className={styles.note}
      data-side={note.side}
      style={{ top }}
      initial={{ opacity: 0, y: quiet ? 0 : 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: quiet ? 0 : 0.12, delay: 0 } }}
      transition={{ duration: quiet ? 0 : 0.16, delay: quiet ? 0 : 0.1 + index * 0.06, ease: "easeOut" }}
    >
      <p className={styles.heading}>{note.number} / {note.title}</p>
      <p>{note.description}</p>
      <svg className={styles.arrow} viewBox="0 0 44 40" fill="none" focusable="false" aria-hidden="true">
        <path d="M2 36 C5 12 22 7 41 15 M32 7 L41 15 L30 20" />
      </svg>
    </motion.aside>
  );
}
