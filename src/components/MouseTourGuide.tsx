"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useSnap } from "@/context/SnapContext";

// Ensures the tour runs once per full page refresh, without restarting during client navigation
let tourPlayedThisSession = false;

interface TourStep {
  els?: () => HTMLElement[];
  at?:
    | "above"
    | "below"
    | "left"
    | "right"
    | ((el: HTMLElement) => "above" | "below" | "left" | "right");
  free?: boolean;
  text: string | ((el: HTMLElement) => string);
}

export function MouseTourGuide() {
  const pathname = usePathname();
  const { isSnapping, isSnapped } = useSnap();
  const rootRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  // Synchronize React snap state with window events for instant tour reaction
  useEffect(() => {
    if (isSnapping && typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("thanos-snapping-active"));
    }
  }, [isSnapping]);

  useEffect(() => {
    if (isSnapped && typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("thanos-snap-completed"));
    }
  }, [isSnapped]);

  useEffect(() => {
    // Strictly restrict the autonomous tour guide to the home page only
    if (pathname !== "/" || tourPlayedThisSession) {
      return;
    }

    const desktop = window.matchMedia(
      "(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)"
    );
    const root = rootRef.current;
    const tag = tagRef.current;
    const name = nameRef.current;
    const clip = clipRef.current;
    const inner = textRef.current;
    const measure = measureRef.current;

    if (!root || !tag || !name || !clip || !inner || !measure || !desktop.matches) {
      return;
    }

    try {
      sessionStorage.removeItem("guideTourSeen");
      sessionStorage.removeItem("guideTourPrompt");
    } catch {}

    // Caret element created once
    const caret = document.createElement("span");
    caret.className = "gc-caret";

    const graphemes =
      "Segmenter" in Intl
        ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
        : null;

    const hooks = (key: string): HTMLElement[] =>
      Array.from(document.querySelectorAll<HTMLElement>(`[data-guide="${key}"]`));

    const within = (key: string, selector: string): HTMLElement[] =>
      hooks(key).flatMap((el) => Array.from(el.querySelectorAll<HTMLElement>(selector)));

    const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);
    const rand = (min: number, max: number) => min + Math.random() * (max - min);

    // Tour Steps tailored to Naphier's portfolio
    const steps: TourStep[] = [
      {
        els: () => (hooks("name").length ? hooks("name") : hooks("avatar")),
        at: "above",
        free: true,
        text: "Glad you stopped by. Let me show you around real quick.",
      },
      {
        els: () => hooks("about"),
        at: "below",
        text: "A quick snapshot: building practical tools with clean code and solid UX.",
      },
      {
        els: () => hooks("focus"),
        at: "below",
        text: "Current focus: robust full-stack architecture and high-polish interfaces.",
      },
      {
        els: () => (within("socials", "a, button").length ? within("socials", "a, button") : hooks("socials")),
        at: "below",
        text: "Code, resume, and socials. Feel free to drop a line anytime.",
      },
      {
        els: () => (within("nav", "a").length ? within("nav", "a") : hooks("nav")),
        at: (el) => {
          const r = el.getBoundingClientRect();
          return r.top < 160 ? "below" : "above";
        },
        text: (el) => {
          const r = el.getBoundingClientRect();
          return r.top < 160
            ? "Your command center: jump to my work, tech stack, and certs."
            : "Your floating dock: dive into my background, tech stack, and credentials.";
        },
      },
      {
        els: () => {
          const section = hooks("projects")[0];
          if (!section) return [];
          const cards = Array.from(
            section.querySelectorAll<HTMLElement>(
              '.cad-project-card, a[href*="/projects/"]:not([href="/projects"])'
            )
          );
          return cards.length ? cards.slice(0, 4) : [section];
        },
        at: (el) => {
          const r = el.getBoundingClientRect();
          return r.top > window.innerHeight * 0.42 ? "above" : "below";
        },
        text: "A few flagship builds — from privacy-first tools to live platforms.",
      },
      {
        free: true,
        text: "That's the quick pass. The floor is yours — explore at your own pace! ✌️",
      },
    ];

    // Clock & Spring Physics
    const goal = { x: 0, y: 0 };
    const shown = { x: 0, y: 0, vx: 0, vy: 0 };
    const SPRING = 190;
    const DAMPING = 2 * Math.sqrt(SPRING) * 0.82;
    let clock = 0;
    let last = 0;
    let running = false;
    let away = false;
    let move: {
      from: { x: number; y: number };
      to: () => { x: number; y: number };
      t0: number;
      dur: number;
      skew: number;
      nx: number;
      ny: number;
      b1: number;
      b2: number;
      done: () => void;
    } | null = null;
    let rest: (() => { x: number; y: number }) | null = null;
    let hovered: HTMLElement | null = null;
    let typing = false;
    let tremor = 1;
    let rAFId: number | null = null;

    // Shock / easter egg reaction state
    let isShocked = false;
    let hasSnapCompleted = false;
    let wakeSleep: (() => void) | null = null;
    let snapDoneResolver: (() => void) | null = null;
    let cancelCurrentType: (() => void) | null = null;

    function isAway() {
      return (
        !desktop.matches ||
        document.body.dataset.sideDrawerOpen === "true" ||
        document.querySelector(".modal:not(.hidden)") !== null
      );
    }

    function frame(now: number) {
      if (!running) return;
      const dt = Math.min(now - last, 120);
      last = now;
      const nowAway = isAway();

      if (nowAway !== away) {
        away = nowAway;
        root?.classList.toggle("is-away", away);
      }

      if (!away) {
        clock += dt;

        if (move) {
          const p = Math.min((clock - move.t0) / move.dur, 1);
          const u = Math.pow(p, move.skew);
          const e = u * u * u * (u * (u * 6 - 15) + 10);
          const to = move.to();
          const side =
            3 * (1 - e) * (1 - e) * e * move.b1 + 3 * (1 - e) * e * e * move.b2;
          goal.x = move.from.x + (to.x - move.from.x) * e + move.nx * side;
          goal.y = move.from.y + (to.y - move.from.y) * e + move.ny * side;

          if (p === 1) {
            const { done } = move;
            rest = move.to;
            move = null;
            done();
          }
        } else if (rest) {
          const to = rest();
          goal.x = to.x;
          goal.y = to.y;
        }

        const hops = Math.ceil(dt / 12);
        const h = dt / hops / 1000;
        for (let i = 0; i < hops; i++) {
          shown.vx += (SPRING * (goal.x - shown.x) - DAMPING * shown.vx) * h;
          shown.vy += (SPRING * (goal.y - shown.y) - DAMPING * shown.vy) * h;
          shown.x += shown.vx * h;
          shown.y += shown.vy * h;
        }

        const targetTremor = isShocked ? 3.8 : (typing ? 0 : 1);
        tremor += (targetTremor - tremor) * Math.min(dt / 180, 1);
        const jitterX = isShocked
          ? Math.sin(clock / 28) * 1.8 + Math.cos(clock / 45) * 1.2
          : 0;
        const jitterY = isShocked
          ? Math.cos(clock / 31) * 1.8 + Math.sin(clock / 41) * 1.2
          : 0;

        const x =
          shown.x +
          jitterX +
          (Math.sin(clock / 830 + 1.3) * 1.5 +
            Math.sin(clock / 310 + 4.1) * 0.6 +
            Math.sin(clock / 127) * 0.22) *
            tremor;
        const y =
          shown.y +
          jitterY +
          (Math.cos(clock / 1010 + 0.4) * 1.3 +
            Math.sin(clock / 370 + 2.2) * 0.55 +
            Math.cos(clock / 141 + 5) * 0.2) *
            tremor;

        if (root) {
          root.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
        }
      }

      rAFId = requestAnimationFrame(frame);
    }

    const timeouts = new Set<ReturnType<typeof setTimeout>>();
    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        let timer: ReturnType<typeof setTimeout> | null = null;
        const cleanup = () => {
          if (timer) {
            clearTimeout(timer);
            timeouts.delete(timer);
            timer = null;
          }
        };
        const onWake = () => {
          cleanup();
          resolve();
        };
        wakeSleep = onWake;
        timer = setTimeout(() => {
          if (wakeSleep === onWake) wakeSleep = null;
          cleanup();
          resolve();
        }, ms);
        timeouts.add(timer);
      });

    function glide(to: () => { x: number; y: number }, dur: number) {
      return new Promise<void>((done) => {
        const from = { x: goal.x, y: goal.y };
        const target = to();
        const dx = target.x - from.x;
        const dy = target.y - from.y;
        const dist = Math.hypot(dx, dy) || 1;
        const b1 = Math.min(dist * rand(0.08, 0.28), 64) * (Math.random() < 0.5 ? -1 : 1);
        const b2 = Math.random() < 0.3 ? -b1 * rand(0.3, 0.8) : b1 * rand(0.4, 1.1);
        move = {
          from,
          to,
          t0: clock,
          dur,
          skew: rand(0.72, 0.94),
          nx: -dy / dist,
          ny: dx / dist,
          b1,
          b2,
          done,
        };
      });
    }

    async function moveTo(to: () => { x: number; y: number }, opts: { direct?: boolean; dur?: number } = {}) {
      const off = { x: rand(-2.5, 2.5), y: rand(-1.5, 1.5) };
      const aim = opts.direct
        ? to
        : () => {
            const t = to();
            return { x: t.x + off.x, y: t.y + off.y };
          };
      const target = aim();
      const dx = target.x - goal.x;
      const dy = target.y - goal.y;
      const dist = Math.hypot(dx, dy) || 1;
      const dur =
        (opts.dur || clamp(210 + Math.sqrt(dist) * 25, 330, 1000)) * rand(0.88, 1.15);
      const roll = Math.random();

      if (opts.direct || dist < 160 || roll > 0.65) {
        return glide(aim, dur);
      }

      const miss = clamp(dist * rand(0.025, 0.06), 5, 22) * (roll < 0.4 ? 1 : -1);
      const drift = rand(-0.5, 0.5) * miss;
      const ox = (dx / dist) * miss - (dy / dist) * drift;
      const oy = (dy / dist) * miss + (dx / dist) * drift;
      await glide(
        () => {
          const t = aim();
          return { x: t.x + ox, y: t.y + oy };
        },
        dur
      );
      if (!running || isShocked) return;
      await sleep(rand(40, 110));
      if (!running || isShocked) return;
      await glide(aim, rand(140, 230));
    }

    function anchor(el: HTMLElement, at?: "above" | "below" | "left" | "right") {
      return () => {
        const r = el.getBoundingClientRect();
        if (el.classList.contains("cad-project-card") || el.closest(".cad-project-card")) {
          return {
            x: r.left + Math.min(65, Math.max(35, r.width * 0.22)),
            y: r.top + Math.min(55, Math.max(35, r.height * 0.2)),
          };
        }
        if (at === "above") return { x: r.left + Math.min(28, r.width / 2), y: Math.max(16, r.top - 20) };
        if (at === "below") return { x: r.left + Math.min(48, Math.max(16, r.width / 3)), y: Math.min(window.innerHeight - 30, r.bottom + 8) };
        if (at === "left") return { x: Math.max(16, r.left - 20), y: r.top + r.height / 2 };
        return { x: Math.min(window.innerWidth - 30, r.right + 8), y: r.top + r.height / 2 };
      };
    }

    const intervals = new Set<ReturnType<typeof setInterval>>();

    function isFixedElement(el: HTMLElement) {
      let curr: HTMLElement | null = el;
      while (curr && curr !== document.body && curr !== document.documentElement) {
        const style = window.getComputedStyle(curr);
        if (style.position === "fixed") return true;
        curr = curr.parentElement;
      }
      return false;
    }

    function smoothScrollTo(targetY: number, maxWaitMs = 850): Promise<void> {
      return new Promise<void>((resolve) => {
        const startY = window.scrollY;
        const diff = Math.abs(targetY - startY);
        if (diff < 10) {
          resolve();
          return;
        }

        window.scrollTo({
          top: targetY,
          behavior: "smooth",
        });

        let checks = 0;
        const cleanup = () => {
          clearInterval(interval);
          clearTimeout(timer);
          intervals.delete(interval);
          timeouts.delete(timer);
        };

        const timer = setTimeout(() => {
          cleanup();
          resolve();
        }, maxWaitMs);
        timeouts.add(timer);

        const interval = setInterval(() => {
          if (!running || isShocked) {
            cleanup();
            resolve();
            return;
          }
          checks++;
          const currentY = window.scrollY;

          if (Math.abs(currentY - targetY) < 10 || checks > 35) {
            cleanup();
            resolve();
            return;
          }
        }, 30);
        intervals.add(interval);
      });
    }

    async function scrollComfortablyIntoView(el: HTMLElement) {
      if (!running || isShocked || isFixedElement(el)) return;

      const projectsSection = (el.getAttribute("data-guide") === "projects" ? el : el.closest('[data-guide="projects"]')) as HTMLElement | null;
      // If the target is part of the projects section, scroll so the top of the section is framed near top: 28px
      // allowing the whole selected projects grid to be seen cleanly in the viewport
      if (projectsSection) {
        const secRect = projectsSection.getBoundingClientRect();
        const targetScroll = Math.max(0, window.scrollY + secRect.top - 28);
        const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        const clampedY = clamp(Math.round(targetScroll), 0, maxScroll);
        if (Math.abs(clampedY - window.scrollY) > 15) {
          await smoothScrollTo(clampedY, 750);
          await sleep(100);
        }
        return;
      }

      const r = el.getBoundingClientRect();
      const safeTop = 90; // Below fixed/sticky headers
      const safeBottom = window.innerHeight - 130; // Above floating navigation dock
      const safeHeight = Math.max(100, safeBottom - safeTop);

      // If already comfortably within safe viewport boundaries, no scroll is needed
      if (r.top >= safeTop && r.bottom <= safeBottom) {
        return;
      }

      const elAbsTop = window.scrollY + r.top;
      const elHeight = r.height;

      let targetY: number;
      if (elHeight > safeHeight) {
        // Taller than safe viewport: align top nicely with safeTop
        targetY = elAbsTop - safeTop - 12;
      } else {
        // Center nicely inside safe vertical viewport zone
        const idealTopInViewport = safeTop + (safeHeight - elHeight) / 2;
        targetY = elAbsTop - idealTopInViewport;
      }

      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const clampedY = clamp(Math.round(targetY), 0, maxScroll);

      if (Math.abs(clampedY - window.scrollY) < 15) {
        return;
      }

      await smoothScrollTo(clampedY, 700);
      await sleep(100);
    }

    function openSpace(fx: number, fy: number) {
      const point = { x: window.innerWidth * fx, y: window.innerHeight * fy };
      return () => point;
    }

    function setHover(el: HTMLElement | null) {
      if (hovered && hovered !== el) {
        hovered.classList.remove("gc-hover");
        try {
          hovered.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true, cancelable: true, view: window }));
          hovered.dispatchEvent(new MouseEvent("mouseout", { bubbles: true, cancelable: true, view: window }));
        } catch {}
      }
      hovered = el || null;
      if (hovered) {
        hovered.classList.add("gc-hover");
        try {
          hovered.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true, cancelable: true, view: window }));
          hovered.dispatchEvent(new MouseEvent("mouseover", { bubbles: true, cancelable: true, view: window }));
        } catch {}
      }
    }

    function compose(text: string) {
      const parts = graphemes
        ? Array.from(graphemes.segment(text), (s) => s.segment)
        : Array.from(text);
      const chars = parts.map((part) => {
        const span = document.createElement("span");
        span.className = "gc-ch";
        span.textContent = part;
        return span;
      });
      measure?.replaceChildren(...chars);
      const boxes = chars.map((span) => ({
        right: span.offsetLeft + span.offsetWidth,
        top: span.offsetTop,
        bottom: span.offsetTop + span.offsetHeight,
      }));
      return {
        parts,
        chars,
        boxes,
        width: Math.ceil(measure?.getBoundingClientRect().width || 180),
        height: measure?.offsetHeight || 22,
      };
    }

    function place(
      point: { x: number; y: number },
      layout: { width: number; height: number },
      prefer?: "above" | "below" | "left" | "right"
    ) {
      if (!name || !root) return;
      const w = Math.max(name.offsetWidth, layout.width) + 24;
      const h = name.offsetHeight + layout.height + 12;
      // Reserve at least 85px clearance above the bottom navigation dock
      const fitsBelow = point.y + 20 + h + 10 <= window.innerHeight - 85;
      const fitsAbove = point.y - h - 10 >= 0;
      root.classList.toggle("is-up", fitsAbove && (prefer === "above" || !fitsBelow));
      root.classList.toggle("is-left", point.x + 16 + w + 10 > window.innerWidth || prefer === "left");
    }

    async function type(layout: ReturnType<typeof compose>) {
      if (!inner || !tag || !clip) return;
      inner.style.width = layout.width + "px";
      inner.replaceChildren(...layout.chars, caret);
      tag.classList.add("is-talking", "is-typing");
      typing = true;
      const pace = rand(0.85, 1.2);
      let width = 0;
      let aborted = false;
      cancelCurrentType = () => {
        aborted = true;
      };

      for (let i = 0; i < layout.chars.length; i++) {
        if (!running || aborted) break;
        const box = layout.boxes[i];
        const part = layout.parts[i];
        layout.chars[i].classList.add("is-on");
        width = Math.max(width, box.right);
        clip.style.width = Math.ceil(width) + 2 + "px";
        clip.style.height = box.bottom + "px";
        caret.style.transform = `translate(${box.right}px, ${box.top}px)`;

        let wait = rand(8, 20) * pace;
        if (/[.!?]/.test(part)) wait = rand(90, 160);
        else if (/[,:]/.test(part)) wait = rand(45, 90);
        else if (part === " " && Math.random() < 0.12) wait += rand(60, 140);
        else if (Math.random() < 0.07) wait += rand(30, 80);
        await sleep(wait);
      }

      cancelCurrentType = null;
      typing = false;
      tag.classList.remove("is-typing");
    }

    function hush() {
      if (!clip || !tag) return;
      clip.style.width = "0px";
      clip.style.height = "0px";
      tag.classList.remove("is-talking", "is-typing");
    }

    async function say(step: TourStep) {
      if (!running || isShocked) return;
      const rawEls = step.els ? step.els() : [];
      if (!rawEls.length && !step.free) return;

      // Bring target element comfortably into view if needed
      if (rawEls.length && rawEls[0]) {
        await scrollComfortablyIntoView(rawEls[0]);
      }

      if (!running || isShocked) {
        setHover(null);
        return;
      }
      const els = rawEls.filter((el) => el.offsetWidth > 0 || el.offsetHeight > 0);
      if (!els.length && !step.free) return;

      const firstEl = els[0];
      const resolvedAt =
        typeof step.at === "function"
          ? step.at(firstEl)
          : step.at || (firstEl && firstEl.getBoundingClientRect().top < 160 ? "below" : "below");
      const resolvedText = typeof step.text === "function" ? step.text(firstEl) : step.text;

      const points = els.length
        ? els.map((el) => anchor(el, typeof step.at === "function" ? step.at(el) : step.at))
        : [openSpace(rand(0.44, 0.56), rand(0.38, 0.48))];

      const layout = compose(resolvedText);
      hush();
      place(points[0](), layout, resolvedAt);

      await moveTo(points[0]);
      if (!running || isShocked) {
        setHover(null);
        return;
      }

      setHover(els[0] || null);
      await sleep(rand(80, 160));
      if (!running || isShocked) {
        setHover(null);
        return;
      }
      await type(layout);

      if (points.length > 1) {
        await sleep(rand(650, 850));
        for (let i = 1; i < points.length; i++) {
          if (!running || isShocked) break;
          const currentEl = els[i];
          const currentAt = typeof step.at === "function" ? step.at(currentEl) : (step.at || "below");

          await moveTo(points[i], { dur: rand(450, 600) });
          if (!running || isShocked) break;

          place(points[i](), layout, currentAt);
          setHover(currentEl);
          await sleep(rand(550, 750));
        }
        await sleep(rand(450, 650));
      } else {
        await sleep((600 + layout.chars.length * 15) * rand(0.9, 1.1));
      }

      setHover(null);
    }

    async function playThanosShockSequence() {
      root?.classList.add("is-here");
      setHover(null);

      // 1. Move to a safe, highly visible vantage point in the upper viewport
      const vantagePoint = {
        x: Math.min(window.innerWidth - 280, Math.max(160, window.innerWidth * 0.65)),
        y: clamp(window.innerHeight * 0.26, 120, 220),
      };

      // Swiftly glide to the vantage point
      await moveTo(() => vantagePoint, { direct: true, dur: 420 });

      // 2. Shock reaction speech
      const shockText = "Woah... some sections are disappearing?!";
      const shockLayout = compose(shockText);
      hush();
      place(vantagePoint, shockLayout, "below");
      await type(shockLayout);

      // 3. Await Thanos snap sequence completion (with 20s safety timeout)
      if (!hasSnapCompleted) {
        await new Promise<void>((resolve) => {
          let timeout: ReturnType<typeof setTimeout> | null = setTimeout(() => {
            resolve();
          }, 20000);
          snapDoneResolver = () => {
            if (timeout) {
              clearTimeout(timeout);
              timeout = null;
            }
            resolve();
          };
        });
      }

      // 4. Snap complete! Settle pause while dust settles and page sits at top
      await sleep(550);

      // Calming down tremor
      isShocked = false;

      // 5. Parting punchline
      const punchlineText = "Woah, and that would be it... imma get going!";
      const punchLayout = compose(punchlineText);
      hush();
      await sleep(180);
      place(vantagePoint, punchLayout, "below");
      await type(punchLayout);

      // 6. Hold for a moment so the user can comfortably read it
      await sleep(1800);

      // 7. Swift exit off-screen
      hush();
      await sleep(220);
      const exit = { x: window.innerWidth + 140, y: window.innerHeight * 0.28 };
      await moveTo(() => exit, { direct: true, dur: 450 });
      root?.classList.remove("is-here");
      await sleep(300);
      running = false;
    }

    async function run() {
      await sleep(600);
      if (!running || isShocked) {
        if (isShocked) await playThanosShockSequence();
        return;
      }
      root?.classList.add("is-here");

      for (const step of steps) {
        if (!running || isShocked) break;
        await say(step);
      }

      if (isShocked) {
        await playThanosShockSequence();
        return;
      }

      if (!running) return;

      hush();
      await sleep(rand(300, 500));
      if (isShocked) {
        await playThanosShockSequence();
        return;
      }

      const exit = { x: window.innerWidth + 90, y: window.innerHeight * rand(0.2, 0.4) };
      await moveTo(() => exit, { direct: true });
      root?.classList.remove("is-here");

      // Smoothly return the user back to the top of the portfolio
      if (window.scrollY > 20) {
        await smoothScrollTo(0, 800);
      }

      await sleep(300);
      running = false;
    }

    function handleThanosSnap() {
      if (!running || isShocked) return;
      isShocked = true;
      setHover(null);
      typing = false;
      if (cancelCurrentType) {
        cancelCurrentType();
        cancelCurrentType = null;
      }
      hush();
      if (move) {
        const d = move.done;
        move = null;
        d();
      }
      if (wakeSleep) {
        wakeSleep();
        wakeSleep = null;
      }
    }

    function handleThanosComplete() {
      hasSnapCompleted = true;
      if (snapDoneResolver) {
        snapDoneResolver();
        snapDoneResolver = null;
      }
    }

    window.addEventListener("thanos-snap-initiated", handleThanosSnap);
    window.addEventListener("thanos-snapping-active", handleThanosSnap);
    window.addEventListener("thanos-snap-completed", handleThanosComplete);

    function start() {
      if (running) return;
      running = true;
      move = null;
      rest = null;
      goal.x = shown.x = window.innerWidth + 40;
      goal.y = shown.y = window.innerHeight * rand(0.45, 0.65);
      shown.vx = shown.vy = 0;
      root?.classList.remove("is-up", "is-left");
      if (root) {
        root.style.transform = `translate3d(${goal.x}px, ${goal.y}px, 0)`;
      }
      rAFId = requestAnimationFrame((now) => {
        last = now;
        frame(now);
      });
      run();
    }

    // Automatically begin the tour on page load/refresh of the home page
    tourPlayedThisSession = true;
    start();

    return () => {
      window.removeEventListener("thanos-snap-initiated", handleThanosSnap);
      window.removeEventListener("thanos-snapping-active", handleThanosSnap);
      window.removeEventListener("thanos-snap-completed", handleThanosComplete);
      running = false;
      if (rAFId !== null) cancelAnimationFrame(rAFId);
      timeouts.forEach((id) => clearTimeout(id));
      timeouts.clear();
      intervals.forEach((id) => clearInterval(id));
      intervals.clear();
    };
  }, [pathname]);

  if (pathname !== "/") {
    return null;
  }

  return (
    <div id="guideCursor" ref={rootRef} aria-hidden="true">
      <svg className="gc-arrow" viewBox="0 0 24 24" fill="none">
        <path className="gc-rim" d="M5.5 5.5l3.9 11.7 2.2-5.6 5.6-2.2-11.7-3.9z" />
        <path className="gc-body" d="M5.5 5.5l3.9 11.7 2.2-5.6 5.6-2.2-11.7-3.9z" />
      </svg>

      <div className="gc-tag" ref={tagRef}>
        <span className="gc-name" ref={nameRef}>
          Naphier
        </span>
        <div className="gc-clip" ref={clipRef}>
          <div className="gc-text" ref={textRef} data-gc-text="" />
        </div>
        <div className="gc-text gc-measure" ref={measureRef} data-gc-measure="" />
      </div>
    </div>
  );
}

export default MouseTourGuide;
