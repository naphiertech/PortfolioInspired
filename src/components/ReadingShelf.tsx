"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { READING_SHELF_BOOKS, type ReadingBookId } from "@/lib/readingShelfData";
import { BookSpine } from "./BookSpine";
import { SectionHeader } from "./SectionHeader";
import { useUISound } from "@/context/SoundContext";
import { sectionContainerVariants, contentBlockVariants } from "@/lib/motion";
import styles from "./ReadingShelf.module.css";

export interface ReadingShelfProps {
  variant?: "default" | "focus" | "artisan";
  embedded?: boolean;
  hoverLift?: number;
  scale?: number;
}

function MarginAnnotation({
  visibilityClass,
  extraClassName = "",
}: {
  visibilityClass: string;
  extraClassName?: string;
}) {
  return (
    <aside
      className={`${styles.marginNote} ${extraClassName} ${visibilityClass}`}
      aria-hidden="true"
    >
      <span className={styles.marginText}>
        Books I keep{" "}
        <br />
        coming back to
      </span>
      <svg
        viewBox="0 0 72 52"
        fill="none"
        className={styles.marginArrow}
        aria-hidden="true"
      >
        <path
          d="M58 5 C61 23 45 41 11 38 M20 30 C16 34 12 37 8 38 C12 40 16 43 20 47"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </aside>
  );
}

export function ReadingShelf({
  variant = "default",
  embedded = false,
  hoverLift = 10,
  scale,
}: ReadingShelfProps) {
  const [openId, setOpenId] = useState<ReadingBookId | null>(null);
  const bookRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const shouldReduceMotion = useReducedMotion();
  const { playHover, playOpen, playClose } = useUISound();

  const handleToggle = (id: ReadingBookId) => {
    const isClosing = openId === id;
    if (isClosing) {
      playClose();
      setOpenId(null);
      return;
    }

    playOpen();
    setOpenId(id);

    const button = bookRefs.current[id];
    if (button) {
      requestAnimationFrame(() => {
        button.scrollIntoView({
          behavior: shouldReduceMotion ? "auto" : "smooth",
          block: "nearest",
          inline: "nearest",
        });
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Escape" && openId !== null) {
      e.stopPropagation();
      playClose();
      setOpenId(null);
    }
  };

  const shelfStyle = {
    "--shelf-hover-lift": `${hoverLift}px`,
    ...(scale !== undefined ? { "--book-scale": scale } : {}),
  } as React.CSSProperties;

  const shelfCore = (
    <div className={styles.shelf} style={shelfStyle}>
      <div className={styles.rail}>
        <div className={styles.books} role="group" aria-label="Interactive bookshelf">
          {READING_SHELF_BOOKS.map((book) => {
            const isOpen = openId === book.id;
            return (
              <button
                key={book.id}
                ref={(el) => {
                  bookRefs.current[book.id] = el;
                }}
                type="button"
                data-bookshelf-book={book.id}
                data-open={isOpen}
                aria-pressed={isOpen}
                aria-label={`${book.title} by ${book.author}${
                  isOpen ? " — cover open, click to close" : " — click to open cover"
                }`}
                style={
                  {
                    "--spine-w": `${book.spineWidth}px`,
                    "--book-h": `${book.height}px`,
                    "--cover-ratio": book.coverRatio,
                  } as React.CSSProperties
                }
                onMouseEnter={() => {
                  if (!isOpen) playHover();
                }}
                onClick={() => handleToggle(book.id)}
                className={styles.book}
              >
                <span className={styles.artwork}>
                  <span className={styles.spineLayer}>
                    <BookSpine book={book} />
                  </span>
                  <span className={styles.coverLayer}>
                    <Image
                      src={book.coverImage}
                      alt={`${book.title} by ${book.author}`}
                      fill
                      sizes="240px"
                      loading="eager"
                      className={styles.coverImage}
                    />
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.baseline} aria-hidden="true" />
    </div>
  );

  if (embedded) {
    return (
      <div onKeyDown={handleKeyDown} className="w-full select-none">
        {shelfCore}
      </div>
    );
  }

  if (variant === "focus") {
    return (
      <section
        aria-label="Bookshelf"
        onKeyDown={handleKeyDown}
        className="w-full relative select-none"
      >
        <MarginAnnotation visibilityClass="hidden 2xl:block" />

        <div className="flex items-center justify-between gap-2 font-mono text-xs text-muted-foreground/80 select-none mb-2">
          <h2 className="tracking-wider font-medium font-mono text-xs">
            [ 06 // READING SHELF ]
          </h2>
          <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-muted-foreground/70">
            BOOKS I KEEP COMING BACK TO
          </span>
        </div>

        <div className="border-t border-dashed border-border-dashed pt-2">
          {shelfCore}
        </div>
      </section>
    );
  }

  if (variant === "artisan") {
    return (
      <section
        id="about-reading-shelf"
        aria-label="Reading shelf"
        onKeyDown={handleKeyDown}
        className="w-full relative space-y-3 scroll-mt-20 select-none"
      >
        <MarginAnnotation visibilityClass="hidden min-[1360px]:block" />

        <div className="flex items-baseline justify-between pb-2 border-b border-black/10 dark:border-white/10">
          <div className="space-y-1">
            <h3 className="font-mono text-xl font-semibold tracking-wider text-foreground">
              Reading Shelf
            </h3>
            <p className="font-sans font-normal text-xs sm:text-sm text-foreground/80 leading-relaxed">
              Books I keep coming back to. Select any spine to inspect its cover.
            </p>
          </div>
          <span className="font-sans text-xs text-muted-foreground shrink-0">
            {READING_SHELF_BOOKS.length} Books
          </span>
        </div>

        <div className="pt-1">{shelfCore}</div>
      </section>
    );
  }

  // Default Mode: Standard <READING-SHELF/> SectionHeader + right-gutter Caveat annotation
  return (
    <motion.section
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView={shouldReduceMotion ? undefined : "visible"}
      viewport={{ once: true, amount: 0.15 }}
      variants={shouldReduceMotion ? undefined : sectionContainerVariants}
      aria-label="Reading Shelf"
      onKeyDown={handleKeyDown}
      className="w-full relative space-y-3 select-none mb-0 pb-2 sm:pb-3"
    >
      <MarginAnnotation
        visibilityClass="hidden xl:block"
        extraClassName={styles.marginNoteDefault}
      />

      <SectionHeader
        label="READING-SHELF"
        description="Books that shaped how I think, design, and build."
        actionComponent={
          openId ? (
            <button
              type="button"
              onClick={() => {
                playClose();
                setOpenId(null);
              }}
              className="font-mono text-xs text-muted-foreground hover:text-ink transition-colors cursor-pointer"
            >
              close cover ×
            </button>
          ) : (
            <span className="font-mono text-xs text-muted-foreground/80 tabular-nums">
              {READING_SHELF_BOOKS.length} books
            </span>
          )
        }
        className="mb-2 pb-2 border-b border-border-hairline/40"
      />

      <motion.div variants={shouldReduceMotion ? undefined : contentBlockVariants}>
        {shelfCore}
      </motion.div>
    </motion.section>
  );
}

export default ReadingShelf;
