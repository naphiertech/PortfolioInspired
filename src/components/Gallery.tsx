"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { galleryImages } from "@/lib/data";
import { SectionHeader } from "./SectionHeader";

export function Gallery() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when modal is active
  useEffect(() => {
    if (activeIdx !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeIdx]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 260;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (activeIdx === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveIdx(null);
      } else if (e.key === "ArrowLeft") {
        setActiveIdx((prev) =>
          prev !== null
            ? (prev - 1 + galleryImages.length) % galleryImages.length
            : null,
        );
      } else if (e.key === "ArrowRight") {
        setActiveIdx((prev) =>
          prev !== null ? (prev + 1) % galleryImages.length : null,
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIdx]);

  return (
    <section className="w-full space-y-4 select-none mb-16" aria-label="Moments and Events">
      {/* Consistent Section Header */}
      <SectionHeader
        label="MOMENTS-AND-EVENTS"
        actionComponent={
          <div className="flex items-center gap-1">
            <button
              onClick={() => scroll("left")}
              className="p-1.5 rounded bg-surface border border-border-hairline text-muted-foreground hover:text-ink transition-colors cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-1.5 rounded bg-surface border border-border-hairline text-muted-foreground hover:text-ink transition-colors cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        }
        className="mb-4 pb-2 border-b border-border-hairline/40"
      />

      {/* Horizontal Strip */}
      <div
        ref={scrollContainerRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide py-1"
      >
        {galleryImages.map((src, idx) => (
          <div
            key={idx}
            onClick={() => setActiveIdx(idx)}
            className="relative flex-shrink-0 w-36 h-28 sm:w-48 sm:h-34 rounded-[4px] overflow-hidden bg-surface border border-border-hairline cursor-pointer group"
          >
            <Image
              src={src}
              alt={`Event photo ${idx + 1}`}
              fill
              sizes="200px"
              className="object-cover opacity-80 grayscale transition-all duration-200 group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-105"
            />
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {mounted &&
        typeof document !== "undefined" &&
        activeIdx !== null &&
        createPortal(
          <div
            className="fixed inset-0 bg-page/95 backdrop-blur-md z-[100] flex items-center justify-center p-4 select-none"
            onClick={() => setActiveIdx(null)}
          >
            {/* Counter */}
            <div className="absolute top-6 left-6 font-mono text-xs text-muted-foreground bg-surface px-2.5 py-1 rounded border border-border-hairline">
              {activeIdx + 1} / {galleryImages.length}
            </div>

            {/* Close */}
            <button
              onClick={() => setActiveIdx(null)}
              className="absolute top-6 right-6 p-2 rounded bg-surface border border-border-hairline text-muted-foreground hover:text-ink transition-colors cursor-pointer"
              aria-label="Close image"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Prev */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveIdx((prev) =>
                  prev !== null
                    ? (prev - 1 + galleryImages.length) % galleryImages.length
                    : null,
                );
              }}
              className="absolute left-4 sm:left-8 p-2 rounded bg-surface border border-border-hairline text-muted-foreground hover:text-ink transition-colors cursor-pointer z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Center Image */}
            <div
              className="relative w-[85vw] h-[75vh] max-w-3xl rounded-lg overflow-hidden border border-border-hairline"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={galleryImages[activeIdx]}
                alt={`Expanded view ${activeIdx + 1}`}
                fill
                sizes="(max-width: 768px) 85vw, 768px"
                className="object-contain"
              />
            </div>

            {/* Next */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveIdx((prev) =>
                  prev !== null ? (prev + 1) % galleryImages.length : null,
                );
              }}
              className="absolute right-4 sm:right-8 p-2 rounded bg-surface border border-border-hairline text-muted-foreground hover:text-ink transition-colors cursor-pointer z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>,
          document.body,
        )}
    </section>
  );
}

export default Gallery;
