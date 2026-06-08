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

    // Normalized values (-0.5 to 0.5)
    const normalizedX = mouseX / rect.width - 0.5;
    const normalizedY = mouseY / rect.height - 0.5;

    // Calculate rotation (max tilt of 20 degrees)
    setRotateX(-normalizedY * 20);
    setRotateY(normalizedX * 20);
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
      className="flex justify-center w-full select-none"
      style={{ perspective: "1000px" }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative w-full max-w-[260px] overflow-hidden rounded-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.18)] cursor-pointer group border border-white/10"
        style={{
          aspectRatio: "3 / 4",
          background:
            "linear-gradient(203.33deg, rgb(17, 17, 17) 1.16%, rgb(51, 51, 51) 14.27%, rgb(85, 85, 85) 34.09%, rgb(68, 68, 68) 53.64%, rgb(34, 34, 34) 80.17%, rgb(17, 17, 17) 100%)",
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: isHovered
            ? "transform 0.05s ease-out, shadow 0.15s ease-out"
            : "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), shadow 0.5s ease-out",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.18)",
        }}
      >
        {/* Subtle Scanlines overlay */}
        <div className="absolute inset-0 dev-card-scanlines opacity-[0.12] rounded-[12px] pointer-events-none" />

        {/* Card Header Content */}
        <div className="absolute left-[20px] top-[30px] z-10 flex flex-col text-left">
          {/* Custom inline terminal SVG icon representing '/card/terminal-icon.svg' */}
          <svg
            viewBox="0 0 48 48"
            className="h-[47px] w-[43px] text-white fill-current"
            aria-hidden="true"
          >
            <path d="M8 12c0-2.209 1.791-4 4-4h24c2.209 0 4 1.791 4 4v24c0 2.209-1.791 4-4 4H12c-2.209 0-4-1.791-4-4V12zm4 2v20c0 1.103.897 2 2 2h20c1.103 0 2-.897 2-2V14c0-1.103-.897-2-2-2H14c-1.103 0-2 .897-2 2zm6 4h2v2h-2v-2zm4 4h6v2h-6v-2zm-4 4h2v2h-2v-2zm4 4h10v2h-10v-2z" />
          </svg>

          <p className="mt-[10px] text-[15px] font-bold tracking-tight text-white">
            GDG ZAMBOANGA
          </p>
          <p className="mt-[4px] text-[9px] font-mono font-medium uppercase tracking-[0.08em] text-white/40">
            Member Card
          </p>

          <p className="mt-[60px] text-[9px] font-mono font-medium uppercase tracking-[0.08em] text-white/40">
            Community Member
          </p>
          <p className="mt-[4px] text-[13px] font-mono font-bold uppercase tracking-[0.05em] text-white">
            NAPH
          </p>
        </div>

        {/* Card Footer Content */}
        <p className="absolute bottom-[20px] left-[20px] z-10 text-[9px] font-mono font-medium uppercase tracking-[0.08em] text-white/40">
          IT Student & Dev
        </p>

        {/* Fixed, clean vector QR Code SVG using robust shape primitives */}
        <svg
          viewBox="0 0 24 24"
          className="absolute bottom-[20px] right-[20px] z-10 h-[46px] w-[46px] text-white opacity-40 transition-opacity duration-300 group-hover:opacity-75"
          aria-hidden="true"
        >
          {/* Top-Left Locator */}
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

          {/* Top-Right Locator */}
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

          {/* Bottom-Left Locator */}
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

          {/* Precise sharp pixel data points */}
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
