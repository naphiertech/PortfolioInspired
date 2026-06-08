"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { galleryImages } from "@/lib/data";

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
      const scrollAmount = 300; // width of card + gaps
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
    <div className="bento-card p-4 col-span-1 md:col-span-6 space-y-2 group animate-fade-in animation-delay-600">
      <h2 className="text-lg font-bold text-text-primary dark:text-dark-text-primary">
        Gallery
      </h2>

      {/* Gallery Strip Wrapper */}
      <div className="relative">
        <div className="relative overflow-hidden">
          {/* Scroll Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-2 overflow-x-auto scroll-snap-type-x-mandatory pb-2 scrollbar-hide scroll-smooth"
          >
            {galleryImages.map((src, idx) => (
              <div
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className="relative flex-shrink-0 aspect-square overflow-hidden rounded-lg bg-foreground/5 shadow-[0_1px_2px_rgba(0,0,0,0.03),0_1px_1px_rgba(0,0,0,0.04)] hover:shadow-[0_3px_10px_rgba(0,0,0,0.06)] transition-all duration-200 hover:-translate-y-0.5 group/image cursor-pointer w-[140px] sm:w-[160px] md:w-[170px]"
              >
                <Image
                  src={src}
                  alt={`Gallery image ${idx + 1}`}
                  fill
                  priority={idx < 5}
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 33vw, 20vw"
                  className="object-cover transition-transform duration-200 group-hover/image:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/10 transition-colors duration-200" />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 md:-translate-x-6 z-10 p-2 rounded-full bg-background shadow-[0_1px_2px_rgba(0,0,0,0.05),0_1px_1px_rgba(0,0,0,0.06)] hover:shadow-[0_3px_10px_rgba(0,0,0,0.08)] hover:bg-foreground/5 transition-all duration-200 hover:scale-110 cursor-pointer"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-5 h-5 text-text-primary dark:text-dark-text-primary" />
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 md:translate-x-6 z-10 p-2 rounded-full bg-background shadow-[0_1px_2px_rgba(0,0,0,0.05),0_1px_1px_rgba(0,0,0,0.06)] hover:shadow-[0_3px_10px_rgba(0,0,0,0.08)] hover:bg-foreground/5 transition-all duration-200 hover:scale-110 cursor-pointer"
          aria-label="Next image"
        >
          <ChevronRight className="w-5 h-5 text-text-primary dark:text-dark-text-primary" />
        </button>
      </div>

      {/* Lightbox Modal (rendered safely inside a React Portal to break out of layout transform boundaries) */}
      {mounted &&
        typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {activeIdx !== null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-black/90 dark:bg-black/95 z-[999999] flex items-center justify-center backdrop-blur-sm select-none"
                onClick={() => setActiveIdx(null)}
              >
                {/* Header / Counter */}
                <div className="absolute top-6 left-6 bg-zinc-900/80 border border-zinc-800 text-white font-mono text-xs px-3 py-1.5 rounded-[4px] shadow-md">
                  {activeIdx + 1} / {galleryImages.length}
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setActiveIdx(null)}
                  className="absolute top-6 right-6 text-white/70 hover:text-white hover:bg-white/10 p-2.5 rounded transition-colors cursor-pointer"
                  aria-label="Close lightbox"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Left navigation arrow */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIdx((prev) =>
                      prev !== null
                        ? (prev - 1 + galleryImages.length) %
                          galleryImages.length
                        : null,
                    );
                  }}
                  className="absolute left-6 top-1/2 -translate-y-1/2 bg-zinc-900/60 hover:bg-zinc-900/90 text-white p-3.5 rounded border border-zinc-800 transition-all hover:scale-105 cursor-pointer z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Centered Image */}
                <motion.div
                  key={activeIdx}
                  initial={{ scale: 0.97, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.97, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="relative max-w-[85vw] max-h-[75vh] md:max-w-[70vw] md:max-h-[80vh] flex items-center justify-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={galleryImages[activeIdx]}
                    alt={`Expanded gallery image ${activeIdx + 1}`}
                    className="max-w-full max-h-full object-contain rounded-md shadow-2xl border border-zinc-800"
                  />
                </motion.div>

                {/* Right navigation arrow */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIdx((prev) =>
                      prev !== null ? (prev + 1) % galleryImages.length : null,
                    );
                  }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 bg-zinc-900/60 hover:bg-zinc-900/90 text-white p-3.5 rounded border border-zinc-800 transition-all hover:scale-105 cursor-pointer z-10"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Bottom Keyboard instructions */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900/95 border border-zinc-800 text-zinc-400 font-mono text-[11px] px-4 py-2.5 rounded-[4px] shadow-lg">
                  Use arrow keys to navigate • ESC to close
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
export default Gallery;
