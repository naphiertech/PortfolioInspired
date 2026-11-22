"use client";

import React from "react";
import Image from "next/image";
import type { ReadingBookItem, SpineImprint } from "@/lib/readingShelfData";

interface BookSpineProps {
  book: ReadingBookItem;
}

function PublisherColophon({
  imprint,
  accentColor,
}: {
  imprint: SpineImprint;
  accentColor: string;
}) {
  switch (imprint) {
    case "penguin":
      return (
        <span
          aria-hidden="true"
          className="inline-flex items-center justify-center w-3 h-4 rounded-full"
          style={{ backgroundColor: "#e86420" }}
        >
          <span className="w-1.5 h-2.5 rounded-full bg-zinc-950 flex items-start justify-center pt-0.5">
            <span className="w-0.5 h-0.5 rounded-full bg-white" />
          </span>
        </span>
      );

    case "penguin-classics":
      return (
        <span
          aria-hidden="true"
          className="w-full py-1 bg-[#f5f3ee] flex items-center justify-center"
        >
          <span className="inline-flex items-center justify-center w-2.5 h-3.5 rounded-full bg-zinc-900">
            <span className="w-1 h-1.5 rounded-full bg-white" />
          </span>
        </span>
      );

    case "oreilly":
      return (
        <span
          aria-hidden="true"
          className="text-[6px] font-bold tracking-[0.06em] uppercase leading-none"
          style={{ color: accentColor }}
        >
          O&apos;REILLY
        </span>
      );

    case "pearson":
      return (
        <span
          aria-hidden="true"
          className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#007fa3] text-[7px] font-bold text-white leading-none"
        >
          P
        </span>
      );

    case "harriman":
      return (
        <span
          aria-hidden="true"
          className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-[2px] text-[7px] font-serif font-bold text-zinc-950 leading-none"
          style={{ backgroundColor: accentColor }}
        >
          Hh
        </span>
      );

    case "tailwind":
      return (
        <span
          aria-hidden="true"
          className="inline-flex items-center justify-center w-4 h-4 rounded-full border text-[6px] font-mono font-bold leading-none"
          style={{ borderColor: accentColor, color: accentColor }}
        >
          UI
        </span>
      );

    case "scribner":
      return (
        <span
          aria-hidden="true"
          className="w-2.5 h-2.5 rounded-full border border-amber-500/60"
        />
      );

    case "ss":
      return (
        <span
          aria-hidden="true"
          className="text-[6.5px] font-serif tracking-widest text-zinc-400 leading-none"
        >
          S&amp;S
        </span>
      );

    case "avery":
      return (
        <span
          aria-hidden="true"
          className="text-[5.5px] font-sans font-semibold tracking-[0.12em] uppercase text-stone-500 leading-none"
        >
          AVERY
        </span>
      );
  }
}

export function BookSpine({ book }: BookSpineProps) {
  if (book.spineImage) {
    return (
      <span className="relative block w-full h-full">
        <Image
          src={book.spineImage}
          alt=""
          fill
          sizes="64px"
          className="object-cover"
        />
      </span>
    );
  }

  const { spine } = book;
  const isStacked = spine.fontStyle === "stacked";

  const titleFontClass =
    spine.fontStyle === "serif-italic"
      ? "font-serif italic font-bold text-[13.5px] tracking-[-0.01em]"
      : spine.fontStyle === "serif-caps"
      ? "font-serif font-medium text-[11.5px] tracking-[0.2em] uppercase"
      : spine.fontStyle === "serif"
      ? "font-serif font-semibold text-[11px] tracking-[0.01em]"
      : spine.fontStyle === "condensed"
      ? "font-sans font-black text-[13px] tracking-[0.14em] uppercase"
      : spine.fontStyle === "sans-bold"
      ? "font-sans font-bold text-[13px] tracking-[-0.02em]"
      : "font-sans font-semibold text-[10px] tracking-[-0.01em]";

  return (
    <span
      className="relative flex flex-col items-center justify-between w-full h-full overflow-hidden select-none"
      style={{ background: spine.bg }}
    >
      {/* Subtle physical spine cylindrical shading & binding groove */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: spine.isLight
            ? "linear-gradient(90deg, rgba(0,0,0,0.08) 0%, rgba(255,255,255,0.45) 14%, transparent 28%, transparent 82%, rgba(0,0,0,0.12) 100%)"
            : "linear-gradient(90deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.04) 14%, transparent 30%, transparent 78%, rgba(0,0,0,0.28) 100%)",
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-[3px] w-px"
        style={{
          backgroundColor: spine.isLight
            ? "rgba(0,0,0,0.06)"
            : "rgba(255,255,255,0.08)",
        }}
      />

      {/* Edition accent details */}
      {spine.detail === "top-band" && (
        <span
          aria-hidden="true"
          className="relative z-[1] w-full h-[6px] shrink-0"
          style={{ backgroundColor: spine.accentColor }}
        />
      )}

      {spine.detail === "speckle" && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-45"
          style={{
            backgroundImage:
              "radial-gradient(#c8a14c 0.9px, transparent 0.9px), radial-gradient(#b48a3e 0.65px, transparent 0.65px)",
            backgroundSize: "14px 18px, 11px 15px",
            backgroundPosition: "3px 12px, 8px 26px",
          }}
        />
      )}

      {spine.detail === "rules" && (
        <span
          aria-hidden="true"
          className="relative z-[1] w-[62%] h-px mt-2.5 shrink-0 opacity-65"
          style={{ backgroundColor: spine.accentColor }}
        />
      )}

      {/* Optional top kicker */}
      {spine.topLabel && (
        <span
          className="relative z-[1] pt-2 px-1 text-center font-sans text-[5px] font-bold tracking-[0.09em] uppercase leading-tight shrink-0"
          style={{ color: spine.titleColor }}
        >
          {spine.topLabel}
        </span>
      )}

      {/* Main spine title & author */}
      {isStacked ? (
        <span className="relative z-[1] flex-1 flex flex-col items-center justify-center gap-0.5 py-1">
          {spine.titleText.split("").map((ch, idx) => (
            <span
              key={`${ch}-${idx}`}
              className="font-serif text-[21px] font-semibold leading-[1.18]"
              style={{ color: spine.titleColor }}
            >
              {ch}
            </span>
          ))}
          <span
            className="mt-2 font-serif text-[5.5px] tracking-[0.12em] uppercase text-center leading-tight px-1"
            style={{ color: spine.authorColor }}
          >
            {spine.authorText}
          </span>
          {spine.subAuthor && (
            <span
              className="mt-0.5 font-sans text-[4px] tracking-[0.08em] uppercase text-center opacity-70 leading-tight px-1"
              style={{ color: spine.authorColor }}
            >
              {spine.subAuthor}
            </span>
          )}
        </span>
      ) : (
        <span className="relative z-[1] flex-1 flex flex-col items-center justify-between py-3 px-0.5 min-h-0">
          <span
            className={`${titleFontClass} leading-none whitespace-nowrap overflow-hidden text-ellipsis max-h-[148px]`}
            style={{
              color: spine.titleColor,
              writingMode: "vertical-rl",
              textOrientation: "mixed",
            }}
          >
            {spine.titleText}
          </span>

          {spine.detail === "swoosh" && (
            <span
              aria-hidden="true"
              className="w-4 h-[2px] rounded-full -rotate-12 shrink-0 my-1"
              style={{ backgroundColor: spine.accentColor }}
            />
          )}

          {spine.detail === "rules" && (
            <span
              aria-hidden="true"
              className="w-4 h-px opacity-55 shrink-0 my-1"
              style={{ backgroundColor: spine.accentColor }}
            />
          )}

          <span
            className="font-sans text-[7px] font-semibold tracking-[0.07em] uppercase leading-none whitespace-nowrap shrink-0"
            style={{
              color: spine.authorColor,
              writingMode: "vertical-rl",
              textOrientation: "mixed",
            }}
          >
            {spine.authorText}
          </span>
        </span>
      )}

      {/* Publisher colophon at spine foot */}
      <span
        className={`relative z-[1] w-full flex items-center justify-center shrink-0 ${
          spine.imprint === "penguin-classics" ? "pb-0" : "pb-2"
        }`}
      >
        <PublisherColophon
          imprint={spine.imprint}
          accentColor={spine.accentColor}
        />
      </span>
    </span>
  );
}
