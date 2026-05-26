import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function useGsapAnimations(containerRef: React.RefObject<HTMLDivElement>) {
  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Profile photo scale/fade-in
      gsap.fromTo(
        ".gsap-profile-photo",
        { opacity: 0, scale: 0.92 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "expo.out" }
      );

      // 2. Name h1 (chars)
      gsap.fromTo(
        ".gsap-char",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.03 }
      );

      // 3. Role line + location
      gsap.fromTo(
        ".gsap-meta-line",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.15 }
      );

      // 4. Action buttons row
      gsap.fromTo(
        ".gsap-action-btn",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.1, delay: 0.3 }
      );

      // About paragraphs
      gsap.fromTo(
        ".gsap-about-p",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: ".gsap-about-section",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      // Tech stack tags
      gsap.fromTo(
        ".gsap-tech-tag",
        { opacity: 0, scale: 0.85 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.04,
          scrollTrigger: {
            trigger: ".gsap-tech-section",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      // Project cards
      gsap.fromTo(
        ".gsap-project-card",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: ".gsap-projects-section",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      // Certification rows
      gsap.fromTo(
        ".gsap-cert-row",
        { x: -20, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: ".gsap-certs-section",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      // Experience timeline items (handles both mobile and desktop instances if they have classes)
      gsap.fromTo(
        ".gsap-timeline-item",
        { x: 20, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.06,
          scrollTrigger: {
            trigger: ".gsap-timeline-section",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      // Gallery images
      gsap.fromTo(
        ".gsap-gallery-image",
        { scale: 0.95, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.07,
          scrollTrigger: {
            trigger: ".gsap-gallery-section",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      // Footer links
      gsap.fromTo(
        ".gsap-footer-link",
        { y: 15, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.05,
          scrollTrigger: {
            trigger: ".gsap-footer-section",
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [containerRef]);
}
export default useGsapAnimations;
