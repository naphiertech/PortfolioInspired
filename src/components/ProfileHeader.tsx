"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";

export function ProfileHeader() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [animationFrame, setAnimationFrame] = useState(0);

  const toggleKnobRef = useRef<HTMLDivElement>(null);
  const currentFrameRef = useRef(0);

  // Sync ref with animation frame state
  useEffect(() => {
    currentFrameRef.current = animationFrame;
  }, [animationFrame]);

  // Preload animation frames for smooth caching
  useEffect(() => {
    const framesToPreload: number[] = [];
    for (let i = 4; i <= 240; i += 4) {
      framesToPreload.push(i);
    }
    if (!framesToPreload.includes(240)) {
      framesToPreload.push(240);
    }

    framesToPreload.forEach((frame) => {
      const img = new window.Image();
      img.src = `/profile/ezgif-frame-${String(frame).padStart(3, "0")}.png`;
    });
  }, []);

  // Synchronize theme with class on documentElement
  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    };

    // Run initially
    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // React to theme changes (animate knob slider & glasses sequence in true 60fps)
  useEffect(() => {
    // 1. Knob slider GSAP
    if (theme === "dark") {
      gsap.to(toggleKnobRef.current, { x: 20, duration: 0.3, ease: "power2.out" });
    } else {
      gsap.to(toggleKnobRef.current, { x: 0, duration: 0.3, ease: "power2.out" });
    }

    // 2. Play Glasses Animation (Slow 20fps interval, step size 4, 100% 404-free)
    let animationFrameId: number;
    let lastTime = performance.now();
    const fps = 20; // 20 frames updated per second (~50ms interval) -> 3.0s total duration
    const interval = 1000 / fps;

    const animate = (time: number) => {
      const current = currentFrameRef.current;

      // Stop the requestAnimationFrame loop early if the target frame limit has already been met
      if (theme === "dark" && current >= 240) return;
      if (theme === "light" && current <= 0) return;

      const delta = time - lastTime;

      if (delta >= interval) {
        lastTime = time - (delta % interval);

        setAnimationFrame((prev) => {
          // Force prev to be aligned as a multiple of 4 to prevent any 404 errors
          const basePrev = Math.round(prev / 4) * 4;
          if (theme === "dark") {
            const next = basePrev + 4;
            return next > 240 ? 240 : next;
          } else {
            const next = basePrev - 4;
            return next < 0 ? 0 : next;
          }
        });
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains("dark");
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };


  return (
    <section className="mb-8 w-full select-none">
      <div className="flex items-center gap-4 md:gap-6">

        {/* Avatar cycling box */}
        <div className="gsap-profile-photo rounded-lg w-32 h-32 md:w-40 md:h-40 object-cover flex-shrink-0 relative overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-border-default dark:border-dark-border">
          {/* Static Light Mode Profile Image */}
          <div className="absolute inset-0">
            <Image
              src="/profile/ezgif-frame-001.png"
              alt="Profile"
              fill
              priority
              sizes="(max-width: 768px) 128px, 160px"
              className="object-cover"
              style={{ objectPosition: "center 25%" }}
            />
          </div>
          {/* Glasses Animation Overlay */}
          {animationFrame > 0 && (
            <img
              src={`/profile/ezgif-frame-${String(animationFrame).padStart(3, "0")}.png`}
              alt="Glasses Animation"
              className="absolute inset-0 w-full h-full object-cover z-10"
              style={{ objectPosition: "center 25%" }}
            />
          )}
        </div>

        {/* Profile details text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-2xl font-bold truncate text-text-primary dark:text-dark-text-primary">
                Naphier Awalie
              </h1>
              {/* Verified Blue Badge Icon (h-4 w-4 maps to exact size) */}
              <svg
                viewBox="0 0 22 22"
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 flex-shrink-0"
                aria-label="Verified user"
              >
                <path
                  d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"
                  fill="#1d9bf0"
                ></path>
              </svg>
            </div>

            {/* Premium Pill Slider Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="relative inline-flex h-6 w-11 items-center transition-all duration-300 ease-in-out focus:outline-none min-h-0 min-w-0 bg-gray-300 dark:bg-zinc-700 hover:bg-gray-400 dark:hover:bg-zinc-600 flex-shrink-0 cursor-pointer"
              aria-label="Toggle theme"
            >
              <div
                className={`absolute left-0.5 top-0.5 flex h-5 w-5 items-center justify-center bg-white shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition-all duration-300 ease-in-out ${theme === "dark" ? "translate-x-5" : "translate-x-0"
                  }`}
              >
                {theme === "light" ? (
                  <svg className="h-3 w-3 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd"></path>
                  </svg>
                ) : (
                  <svg className="h-3 w-3 text-zinc-700" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                  </svg>
                )}
              </div>
            </button>
          </div>

          {/* Location row */}
          <p className="text-xs md:text-sm text-foreground/70 mt-0.5 flex items-center gap-1">
            <svg
              className="w-3 h-3 md:w-3.5 md:h-3.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">Zamboanga City, Philippines</span>
          </p>

          {/* Role and desktop badge row */}
          <div className="flex items-center justify-between mt-1.5 md:mt-2">
            <p className="text-[10px] md:text-base">
              IT Student <span className="text-gray-400">\</span> Full-Stack Developer <span className="text-gray-400">\</span> Tech Enthusiast
            </p>

            {/* Desktop badge showing "Available for Work" status */}
            <div className="hidden md:block">
              <div className="relative" style={{ zIndex: 999999 }}>
                <div
                  className="flex items-center rounded-lg border border-[#10b981]/30 bg-[#10b981]/10 px-2.5 py-1 text-xs font-semibold text-[#10b981] gap-1.5 whitespace-nowrap md:scale-90"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
                  </span>
                  <span>Available for work</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="space-y-2 mt-3 md:mt-4">
        <div className="flex gap-2">
          {/* Schedule a Call button */}
          <a
            href="mailto:naphiera@gmail.com?subject=Let's%20Schedule%20a%20Call"
            className="inline-flex h-7 md:h-8 items-center rounded-lg bg-foreground px-2.5 md:px-4 text-[8px] md:text-xs font-medium text-background transition-all duration-200 hover:bg-foreground/90 hover:-translate-y-0.5 gap-1 md:gap-1.5 whitespace-nowrap min-h-0 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <span className="text-left">Schedule a Call</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7"></path>
            </svg>
          </a>

          {/* Send Email (Desktop Only) */}
          <a
            href="mailto:naphiera@gmail.com"
            className="hidden md:inline-flex h-7 md:h-8 items-center rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.03),0_1px_1px_rgba(0,0,0,0.04)] bg-background px-2.5 md:px-4 text-[8px] md:text-xs font-medium transition-all duration-200 hover:bg-muted hover:-translate-y-0.5 hover:shadow-[0_3px_10px_rgba(0,0,0,0.06)] gap-1 md:gap-1.5 whitespace-nowrap min-h-0 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            <span className="text-left">Send Email</span>
          </a>

          {/* Resume Button */}
          <a
            href="/resume/IT_Resume_ATS.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-7 md:h-8 items-center rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.03),0_1px_1px_rgba(0,0,0,0.04)] bg-background px-2.5 md:px-4 text-[8px] md:text-xs font-medium transition-all duration-200 hover:bg-muted hover:-translate-y-0.5 hover:shadow-[0_3px_10px_rgba(0,0,0,0.06)] gap-1 md:gap-1.5 whitespace-nowrap min-h-0 cursor-pointer"
          >
            <svg className="w-4 h-4 text-text-primary dark:text-dark-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <span className="text-left">Resume</span>
          </a>

          {/* GitHub Button */}
          <a
            href="https://github.com/bagatata05/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-7 md:h-8 items-center rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.03),0_1px_1px_rgba(0,0,0,0.04)] bg-background px-2.5 md:px-4 text-[8px] md:text-xs font-medium transition-all duration-200 hover:bg-muted hover:-translate-y-0.5 hover:shadow-[0_3px_10px_rgba(0,0,0,0.06)] gap-1 md:gap-1.5 whitespace-nowrap flex-1 md:flex-1 min-h-0 cursor-pointer"
          >
            <svg className="w-4 h-4 fill-current text-text-primary dark:text-dark-text-primary" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            <span className="text-left flex-1">
              <span className="md:hidden">GitHub</span>
              <span className="hidden md:inline">View my GitHub</span>
            </span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7"></path>
            </svg>
          </a>
        </div>

        {/* Collapsed Mobile Only Status Pill */}
        <div className="block md:hidden">
          <div className="relative" style={{ zIndex: 999999 }}>
            <div
              className="flex items-center justify-center rounded-lg border border-[#10b981]/30 bg-[#10b981]/10 px-2.5 py-1 text-[10px] font-semibold text-[#10b981] gap-1.5 w-full"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
              </span>
              <span>Available for work</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default ProfileHeader;
