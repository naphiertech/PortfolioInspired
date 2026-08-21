"use client";

import React, { useState, useRef } from "react";

export function DevCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const normalizedX = mouseX / rect.width - 0.5;
    const normalizedY = mouseY / rect.height - 0.5;

    setRotateX(-normalizedY * 16);
    setRotateY(normalizedX * 16);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      className="flex justify-center w-full select-none my-2"
      style={{ perspective: "1000px" }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative w-full max-w-[260px] overflow-hidden rounded-[8px] cursor-pointer group border border-border-hairline bg-surface"
        style={{
          aspectRatio: "3 / 4",
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: isHovered
            ? "transform 0.05s ease-out"
            : "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          boxShadow: isHovered ? "var(--shadow-tactile)" : "none",
        }}
      >
        {/* Subtle Scanlines overlay */}
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:8px_8px]" />

        {/* Card Header Content */}
        <div className="absolute left-[20px] top-[24px] z-10 flex flex-col text-left">
          {/* Terminal Icon */}
          <svg
            viewBox="0 0 48 48"
            className="h-[36px] w-[36px] text-ink fill-current opacity-80"
            aria-hidden="true"
          >
            <path d="M8 12c0-2.209 1.791-4 4-4h24c2.209 0 4 1.791 4 4v24c0 2.209-1.791 4-4 4H12c-2.209 0-4-1.791-4-4V12zm4 2v20c0 1.103.897 2 2 2h20c1.103 0 2-.897 2-2V14c0-1.103-.897-2-2-2H14c-1.103 0-2 .897-2 2zm6 4h2v2h-2v-2zm4 4h6v2h-6v-2zm-4 4h2v2h-2v-2zm4 4h10v2h-10v-2z" />
          </svg>

          <p className="mt-[12px] text-xs font-mono font-bold tracking-tight text-ink">
            GDG ZAMBOANGA
          </p>
          <p className="mt-[2px] text-[9px] font-mono uppercase tracking-wider text-muted-foreground">
            Member Card
          </p>

          <p className="mt-[44px] text-[9px] font-mono uppercase tracking-wider text-muted-foreground">
            Community Member
          </p>
          <p className="mt-[2px] text-xs font-mono font-bold uppercase tracking-wider text-ink">
            NAPH
          </p>
        </div>

        {/* Card Footer Content */}
        <p className="absolute bottom-[20px] left-[20px] z-10 text-[9px] font-mono uppercase tracking-wider text-muted-foreground">
          IT Student & Dev
        </p>

        {/* Vector QR Code SVG */}
        <svg
          viewBox="0 0 24 24"
          className="absolute bottom-[16px] right-[16px] z-10 h-[40px] w-[40px] text-ink opacity-40 transition-opacity duration-200 group-hover:opacity-80"
          aria-hidden="true"
        >
          <rect
            x="2"
            y="2"
            width="6"
            height="6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            rx="0.5"
          />
          <rect x="4" y="4" width="2" height="2" fill="currentColor" />
          <rect
            x="16"
            y="2"
            width="6"
            height="6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            rx="0.5"
          />
          <rect x="18" y="4" width="2" height="2" fill="currentColor" />
          <rect
            x="2"
            y="16"
            width="6"
            height="6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            rx="0.5"
          />
          <rect x="4" y="18" width="2" height="2" fill="currentColor" />
          <path
            d="M10 2h2v2h-2zm4 0h1v1h-1zm0 2h1v1h-1zm-4 2h2v1h-2zm4 0h1v1h-1zm-4 2h1v1h-1zm2 0h1v2h-1zm1 1h1v1h-1zm-4 1h1v1h-1zm2 1h1v1h-1zm1 1h1v1h-1zm-4 1h1v2h-1zm2 0h1v1h-1zm3 0h1v1h-1zm-3 2h2v1h-2zm3 0h1v1h-1zm-8-4h1v1H2zm0 2h1v1H2zm14 4h2v1h-2zm0 2h1v1h-1zm2 0h1v1h-1z"
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  );
}

export default DevCard;
